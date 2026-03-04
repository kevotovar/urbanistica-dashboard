import type { SupabaseClient } from "@supabase/supabase-js";
import { openrouter } from "#/lib/openrouter";

const PRICING: Record<string, { input: number; output: number }> = {
	"anthropic/claude-3-haiku": { input: 0.00025, output: 0.00125 },
	"anthropic/claude-3-sonnet": { input: 0.003, output: 0.015 },
	"openai/gpt-4o-mini": { input: 0.00015, output: 0.0006 },
	default: { input: 0.002, output: 0.002 },
};

export class AIService {
	constructor(private supabase: SupabaseClient) {}

	async logUsage(input: {
		user_id?: string;
		model: string;
		prompt_tokens: number;
		completion_tokens: number;
		purpose: string;
	}) {
		const rates = PRICING[input.model] || PRICING["default"];
		const cost =
			(input.prompt_tokens / 1000) * rates.input +
			(input.completion_tokens / 1000) * rates.output;

		const { error } = await this.supabase.from("ai_usage").insert({
			auth_user_id: input.user_id,
			model: input.model,
			prompt_tokens: input.prompt_tokens,
			completion_tokens: input.completion_tokens,
			total_tokens: input.prompt_tokens + input.completion_tokens,
			cost: cost.toFixed(6),
			purpose: input.purpose,
		});

		if (error) console.error("Error logging AI usage:", error);
	}

	async summarize(
		documentId: number,
		model = "anthropic/claude-3-haiku",
		userId?: string,
	) {
		// 1. Get document details
		const { data: doc, error: docError } = await this.supabase
			.from("documents")
			.select("*")
			.eq("id", documentId)
			.single();

		if (docError || !doc) throw new Error("Document not found");

		// 2. Check cache
		const { data: existing } = await this.supabase
			.from("ai_summaries")
			.select("*")
			.eq("document_id", documentId)
			.order("created_at", { ascending: false })
			.limit(1)
			.maybeSingle();

		if (existing) return existing;

		// 3. Download and process
		const { data: fileData, error: dlError } = await this.supabase.storage
			.from("project-documents")
			.download(doc.storage_path);

		if (dlError || !fileData) throw new Error("Failed to download document");

		const content = await fileData.text();
		const response = await openrouter.chat.completions.create({
			model,
			messages: [
				{
					role: "system",
					content:
						"You are an expert architect and urban planner. Summarize the following document into key points and actionable insights.",
				},
				{ role: "user", content },
			],
		});

		const summaryText = response.choices[0]?.message?.content || "";

		if (response.usage) {
			await this.logUsage({
				user_id: userId,
				model,
				prompt_tokens: response.usage.prompt_tokens,
				completion_tokens: response.usage.completion_tokens,
				purpose: "summary",
			});
		}

		// 4. Cache
		const { data: newSummary, error: saveError } = await this.supabase
			.from("ai_summaries")
			.insert({
				document_id: documentId,
				summary: summaryText,
				model,
			})
			.select()
			.single();

		if (saveError) throw saveError;
		return newSummary;
	}

	async createChatSession(
		documentId: number,
		userId?: string,
		title = "New Chat",
	) {
		const { data, error } = await this.supabase
			.from("chat_sessions")
			.insert({
				document_id: documentId,
				auth_user_id: userId,
				title,
			})
			.select()
			.single();

		if (error) throw error;
		return data;
	}

	async sendMessage(input: {
		sessionId: number;
		message: string;
		model?: string;
		userId?: string;
	}) {
		const model = input.model || "anthropic/claude-3-haiku";

		// 1. Get session and history
		const { data: session, error: sessError } = await this.supabase
			.from("chat_sessions")
			.select("*, document:documents(*), messages:chat_messages(*)")
			.eq("id", input.sessionId)
			.single();

		if (sessError || !session || !session.document)
			throw new Error("Session not found");

		// 2. Get context
		const { data: fileData } = await this.supabase.storage
			.from("project-documents")
			.download(session.document.storage_path);

		const context = fileData ? await fileData.text() : "";

		// 3. Log user message
		await this.supabase.from("chat_messages").insert({
			session_id: input.sessionId,
			role: "user",
			content: input.message,
		});

		// 4. AI Call
		const history = (session.messages || []).map((m: any) => ({
			role: m.role,
			content: m.content,
		}));
		history.push({ role: "user", content: input.message });

		const response = await openrouter.chat.completions.create({
			model,
			messages: [
				{
					role: "system",
					content: `You are an expert assistant for an urban planning firm. Use the following document context to answer the user's questions:\n\n${context}`,
				},
				...history,
			],
		});

		const aiReply = response.choices[0]?.message?.content || "";

		if (response.usage) {
			await this.logUsage({
				user_id: input.userId,
				model,
				prompt_tokens: response.usage.prompt_tokens,
				completion_tokens: response.usage.completion_tokens,
				purpose: "chat",
			});
		}

		// 5. Log assistant reply
		const { data: newMsg, error: saveError } = await this.supabase
			.from("chat_messages")
			.insert({
				session_id: input.sessionId,
				role: "assistant",
				content: aiReply,
			})
			.select()
			.single();

		if (saveError) throw saveError;
		return newMsg;
	}
}
