import { Bot, Loader2, Send, User } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { trpc } from "#/lib/trpc";
import { cn } from "#/lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface ChatInterfaceProps {
	documentId: number;
}

export function ChatInterface({ documentId }: ChatInterfaceProps) {
	const [sessionId, setSessionId] = useState<number | null>(null);
	const [input, setInput] = useState("");
	const [messages, setMessages] = useState<{ role: string; content: string }[]>(
		[],
	);
	const scrollRef = useRef<HTMLDivElement>(null);

	const createSession = trpc.ai.createChatSession.useMutation({
		onSuccess: (session) => {
			setSessionId(session.id);
		},
	});

	const sendMessage = trpc.ai.sendMessage.useMutation({
		onSuccess: (newMsg) => {
			setMessages((prev) => [
				...prev,
				{ role: newMsg.role, content: newMsg.content },
			]);
		},
	});

	useEffect(() => {
		if (!sessionId && documentId !== 0) {
			createSession.mutate({ documentId });
		}
	}, [documentId, sessionId, createSession.mutate]);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, []);

	const handleSend = (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim() || !sessionId || sendMessage.isPending) return;

		const userMsg = input.trim();
		setInput("");
		setMessages((prev) => [...prev, { role: "user", content: userMsg }]);

		sendMessage.mutate({
			sessionId,
			message: userMsg,
		});
	};

	return (
		<div className="flex flex-col h-[600px] border rounded-xl overflow-hidden bg-background shadow-sm">
			<div className="p-4 border-b bg-muted/30 flex items-center justify-between">
				<h3 className="font-semibold text-sm">AI Assistant</h3>
				{sessionId && (
					<span className="text-[10px] text-muted-foreground">
						Session #{sessionId}
					</span>
				)}
			</div>

			<div
				ref={scrollRef}
				className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
			>
				{messages.length === 0 && !sendMessage.isPending && (
					<div className="text-center text-muted-foreground py-12">
						<Bot className="h-8 w-8 mx-auto mb-2 opacity-20" />
						<p className="text-sm">Ask anything about this document.</p>
					</div>
				)}

				{messages.map((msg, i) => (
					<div
						key={`${i}-${msg.role}`}
						className={cn(
							"flex gap-3 max-w-[85%]",
							msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto",
						)}
					>
						<div
							className={cn(
								"h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-sm border",
								msg.role === "user"
									? "bg-primary text-primary-foreground"
									: "bg-muted text-muted-foreground",
							)}
						>
							{msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
						</div>
						<div
							className={cn(
								"p-3 rounded-2xl text-sm leading-relaxed",
								msg.role === "user"
									? "bg-primary text-primary-foreground rounded-tr-none"
									: "bg-muted rounded-tl-none",
							)}
						>
							{msg.content}
						</div>
					</div>
				))}

				{sendMessage.isPending && (
					<div className="flex gap-3 mr-auto max-w-[85%] animate-pulse">
						<div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0 border">
							<Bot size={14} />
						</div>
						<div className="p-3 rounded-2xl bg-muted rounded-tl-none flex items-center gap-2">
							<Loader2 className="h-3 w-3 animate-spin" />
							<span className="text-xs">Thinking...</span>
						</div>
					</div>
				)}
			</div>

			<form onSubmit={handleSend} className="p-4 border-t bg-muted/10">
				<div className="flex gap-2">
					<Input
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Type your message..."
						disabled={!sessionId || sendMessage.isPending}
						className="flex-1 bg-background"
					/>
					<Button
						type="submit"
						size="icon"
						disabled={!input.trim() || sendMessage.isPending}
					>
						<Send className="h-4 w-4" />
					</Button>
				</div>
			</form>
		</div>
	);
}
