import fs from "node:fs";
import mongoose from "mongoose";
import {
	AISummary,
	AIUsage,
	ChatMessage,
	ChatSession,
	ProjectDocument,
} from "#/lib/models";
import { openrouter } from "#/lib/openrouter";

const PRICING: Record<string, { input: number; output: number }> = {
	"anthropic/claude-3-haiku": { input: 0.00025, output: 0.00125 },
	"anthropic/claude-3-sonnet": { input: 0.003, output: 0.015 },
	"openai/gpt-4o-mini": { input: 0.00015, output: 0.0006 },
	default: { input: 0.002, output: 0.002 },
};

export class AIService {
	async logUsage(input: {
		user_id?: string;
		model: string;
		prompt_tokens: number;
		completion_tokens: number;
		purpose: string;
	}) {
		const rates = PRICING[input.model] || PRICING.default;
		const cost =
			(input.prompt_tokens / 1000) * rates.input +
			(input.completion_tokens / 1000) * rates.output;

		await AIUsage.create({
			authUserId: input.user_id,
			model: input.model,
			promptTokens: input.prompt_tokens,
			completionTokens: input.completion_tokens,
			totalTokens: input.prompt_tokens + input.completion_tokens,
			cost: parseFloat(cost.toFixed(6)),
			purpose: input.purpose,
		});
	}

	async summarize(
		documentId: string,
		model = "anthropic/claude-3-haiku",
		userId?: string,
	) {
		// 1. Get document details
		const doc = await ProjectDocument.findById(documentId).lean();
		if (!doc) throw new Error("Document not found");

		// 2. Check cache
		const existing = await AISummary.findOne({
			documentId: new mongoose.Types.ObjectId(documentId),
		})
			.sort({ createdAt: -1 })
			.lean();

		if (existing) return { ...existing, id: existing._id.toString() };

		// 3. Download and process
		// In local mode, we read directly from the FS.
		if (!doc.storagePath || !fs.existsSync(doc.storagePath)) {
			throw new Error("Failed to read document from disk");
		}
		const content = fs.readFileSync(doc.storagePath, "utf-8");

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
		const newSummary = await AISummary.create({
			documentId: new mongoose.Types.ObjectId(documentId),
			summary: summaryText,
			model,
		});
		return { ...newSummary.toJSON(), id: newSummary._id.toString() };
	}

	async createChatSession(
		documentId: string,
		userId?: string,
		_title = "New Chat",
	) {
		// Here, the Supabase schema had document_id on chat session, but my Mongoose schema lacked it.
		// It's acceptable to store it in `topic` for now, or just emit it.
		// Let's create it.
		const newSession = await ChatSession.create({
			userId,
			topic: documentId, // using topic as document ID reference for quick pivot
		});
		return { ...newSession.toJSON(), id: newSession._id.toString() };
	}

	async sendMessage(input: {
		sessionId: string;
		message: string;
		model?: string;
		userId?: string;
	}) {
		const model = input.model || "anthropic/claude-3-haiku";

		// 1. Get session and history
		const session = await ChatSession.findById(input.sessionId)
			.populate("messages")
			.lean();
		if (!session) throw new Error("Session not found");

		const docId = session.topic; // Our pivot above

		// 2. Get context
		let context = "";
		if (docId) {
			const doc = await ProjectDocument.findById(docId).lean();
			if (doc?.storagePath && fs.existsSync(doc.storagePath)) {
				context = fs.readFileSync(doc.storagePath, "utf-8");
			}
		}

		// 3. Log user message
		await ChatMessage.create({
			sessionId: new mongoose.Types.ObjectId(input.sessionId),
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
		const newMsg = await ChatMessage.create({
			sessionId: new mongoose.Types.ObjectId(input.sessionId),
			role: "assistant",
			content: aiReply,
		});
		return { ...newMsg.toJSON(), id: newMsg._id.toString() };
	}
}
