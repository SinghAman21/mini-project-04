import { useState, useRef, useEffect } from "react";
import { FiSend, FiUser, FiCpu, FiCopy, FiCheck, FiLink, FiAlertTriangle, FiCode, FiList } from "react-icons/fi";
import { HiOutlineChatAlt, HiOutlineLightBulb } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { getStructuredChatResponse, StructuredChatResponse, ChatResponseItem } from "../utils/gemini";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useTheme } from "../providers/ThemeProvider";

// Define message types
interface Message {
	type: "user" | "ai" | "error";
	content: string;
	timestamp: Date;
	structuredResponse?: StructuredChatResponse;
}

// Message animations
const messageVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
	exit: { opacity: 0, x: -10, transition: { duration: 0.2 } },
};

// System instructions for healthcare specific responses
const SYSTEM_INSTRUCTION = `
You are a healthcare budget and finance assistant focused on Indian healthcare systems.
Provide accurate, well-structured information about healthcare finances, insurance, budgeting, and related topics.
Focus on being helpful, accurate, and clear in your responses.
Structure responses in a way that makes the information easy to digest for users.
`;

const ChatInterface = () => {
	const [input, setInput] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [activeSuggestion, setActiveSuggestion] = useState<string | null>(null);
	const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const suggestions = [
		"How should I budget for unexpected medical expenses in India?",
		"What are affordable insurance plans for a family of four in Mumbai?",
		"Compare public vs private healthcare costs in urban India",
		"What government healthcare schemes are available in rural India?",
	];

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!input.trim()) return;

		const userMessage: Message = { 
			type: "user", 
			content: input.trim(),
			timestamp: new Date()
		};
		setMessages((prev) => [...prev, userMessage]);

		setInput("");
		setIsLoading(true);

		try {
			// Get structured response from Gemini
			const structuredResponse = await getStructuredChatResponse(
				`${SYSTEM_INSTRUCTION}\n\nUser question: ${input.trim()}`
			);

			const aiMessage: Message = { 
				type: "ai", 
				content: structuredResponse.summary,
				timestamp: new Date(),
				structuredResponse
			};
			setMessages((prev) => [...prev, aiMessage]);
		} catch (error) {
			console.error("Error getting AI response:", error);

			// Add error message to chat
			const errorMessage: Message = {
				type: "error",
				content: "Sorry, I encountered an error while processing your request. Please try again.",
				timestamp: new Date()
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setIsLoading(false);
		}
	};

	// Copy message content to clipboard
	const copyToClipboard = async (message: Message, index: number) => {
		try {
			// For structured responses, create a formatted text version 
			let textToCopy = message.content;
			
			if (message.structuredResponse) {
				const sr = message.structuredResponse;
				textToCopy = `${sr.title}\n\n${sr.summary}\n\n`;
				
				sr.content.forEach(item => {
					switch (item.type) {
						case "text":
							textToCopy += `${item.content}\n\n`;
							break;
						case "list":
							if (item.title) textToCopy += `${item.title}:\n`;
							item.items?.forEach(listItem => {
								textToCopy += `• ${listItem}\n`;
							});
							textToCopy += '\n';
							break;
						case "suggestion":
							textToCopy += `Suggestion: ${item.content}\n\n`;
							break;
						case "warning":
							textToCopy += `Warning: ${item.content}\n\n`;
							break;
						case "resource":
							textToCopy += `Resource: ${item.title}\n${item.content}\n${item.url}\n\n`;
							break;
						case "code":
							textToCopy += `Code (${item.language}):\n${item.content}\n\n`;
							break;
					}
				});
			}
			
			await navigator.clipboard.writeText(textToCopy);
			setCopiedMessageId(index);
			
			setTimeout(() => {
				setCopiedMessageId(null);
			}, 2000);
		} catch (err) {
			console.error("Failed to copy text: ", err);
		}
	};
	
	const formatTimestamp = (timestamp: Date) => {
		return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};

	// Render a structured response item
	const renderResponseItem = (item: ChatResponseItem, index: number) => {
		switch (item.type) {
			case "text":
				return (
					<p key={index} className="mb-3 text-foreground">
						{item.content}
					</p>
				);
			
			case "list":
				return (
					<div key={index} className="mb-4">
						{item.title && <h4 className="text-sm font-medium mb-1.5">{item.title}</h4>}
						<ul className="space-y-1 list-disc pl-5">
							{item.items?.map((listItem, i) => (
								<li key={i} className="text-foreground">
									{listItem}
								</li>
							))}
						</ul>
					</div>
				);
			
			case "suggestion":
				return (
					<div key={index} className="flex items-start gap-2 mb-3 p-2 bg-primary/5 dark:bg-primary/10 border-l-2 border-primary rounded-sm">
						<HiOutlineLightBulb className="text-primary dark:text-secondary-400 mt-0.5 shrink-0" />
						<p className="text-foreground text-sm">{item.content}</p>
					</div>
				);
			
			case "warning":
				return (
					<div key={index} className="flex items-start gap-2 mb-3 p-2 bg-destructive/5 border-l-2 border-destructive rounded-sm">
						<FiAlertTriangle className="text-destructive mt-0.5 shrink-0" />
						<p className="text-destructive dark:text-destructive text-sm">{item.content}</p>
					</div>
				);
			
			case "resource":
				return (
					<div key={index} className="mb-3 p-2 border border-border/60 rounded-md">
						<div className="flex items-center gap-2 mb-1">
							<FiLink className="text-primary dark:text-secondary-400 shrink-0" />
							<h4 className="text-sm font-medium">{item.title}</h4>
						</div>
						<p className="text-sm text-muted-foreground mb-2">{item.content}</p>
						<a 
							href={item.url} 
							target="_blank" 
							rel="noopener noreferrer"
							className="text-xs text-primary dark:text-secondary-400 hover:underline flex items-center gap-1"
						>
							<span>Visit resource</span>
							<FiLink className="h-3 w-3" />
						</a>
					</div>
				);
			
			case "code":
				return (
					<div key={index} className="mb-3 relative">
						<div className="bg-muted/80 dark:bg-muted/50 rounded-t-md px-3 py-1.5 text-xs font-mono flex items-center justify-between border border-border/60">
							<div className="flex items-center gap-1.5">
								<FiCode className="h-3.5 w-3.5 text-muted-foreground" />
								<span>{item.language || "code"}</span>
							</div>
						</div>
						<pre className="p-3 bg-muted/30 dark:bg-muted/20 border border-t-0 border-border/60 rounded-b-md overflow-x-auto">
							<code className="text-xs sm:text-sm font-mono text-foreground whitespace-pre">
								{item.content}
							</code>
						</pre>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div className="h-full flex flex-col" aria-label="Chat interface">
			<div 
				className="flex-1 overflow-y-auto scroll-style p-4 space-y-4" 
				role="log" 
				aria-live="polite" 
				aria-label="Chat conversation"
			>
				{messages.length === 0 && (
					<div 
						className="flex flex-col items-center justify-center h-full text-center space-y-6 text-muted-foreground"
						aria-label="Welcome to chat"
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ duration: 0.5 }}
						>
							<div className="p-4 rounded-full bg-primary/5 dark:bg-secondary-400/5 mb-4 flex items-center justify-center gap-3">
								<HiOutlineChatAlt
									className="text-primary dark:text-secondary-400"
									size={38}
									aria-hidden="true"
								/>
							<h3 className="text-lg font-medium text-foreground">
								Chat with your Healthcare Assistant
							</h3>
							</div>
							<p className="max-w-md mx-auto text-sm mb-8">
								Ask questions about medical budgeting, insurance options, and
								healthcare financial planning in India.
							</p>
						</motion.div>

						<div className="grid gap-3 w-full max-w-md">
							<p className="text-sm font-medium">Try asking about:</p>
							<div className="grid grid-cols-1 gap-2 w-full ">
								{suggestions.map((suggestion, i) => (
									<motion.div
										key={i}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.2 + i * 0.1 }}
										className="w-fit"
									>
										<Button
											variant={activeSuggestion === suggestion ? "default" : "outline"}
											className="w-fit justify-start text-left h-auto py-2.5 px-4 font-normal text-foreground dark:text-foreground bg-primary"
											size={"default"}
											onClick={() => {
												setInput(suggestion);
												setActiveSuggestion(suggestion);
												inputRef.current?.focus();
											}}
										>
											{suggestion}
										</Button>
									</motion.div>
								))}
							</div>
						</div>
					</div>
				)}

				{messages.length > 0 && (
					<div className="space-y-6">
						{messages.map((message, index) => (
							<motion.div
								key={index}
								variants={messageVariants}
								initial="hidden"
								animate="visible"
								exit="exit"
								layout
								aria-label={`${message.type === "user" ? "You" : "AI"}: ${message.content}`}
							>
								<div
									className={`flex ${
										message.type === "user" ? "justify-end" : "justify-start"
									}`}
								>
									<div
										className={`flex ${
											message.type === "user" ? "flex-row-reverse" : "flex-row"
										} items-start gap-3 max-w-[85%]`}
									>
										<Avatar className="h-8 w-8 mt-1 border border-dashed border-border/40">
											<AvatarFallback
												className={`${
													message.type === "user"
														? "bg-primary/10 text-primary"
														: message.type === "error"
														? "bg-destructive/10 text-destructive"
														: "bg-secondary-400/10 dark:bg-secondary-400/20 text-secondary-700 dark:text-secondary-400"
												}`}
												aria-label={message.type === "user" ? "Your avatar" : "AI avatar"}
											>
												{message.type === "user" ? (
													<FiUser aria-hidden="true" />
												) : message.type === "error" ? (
													"!"
												) : (
													<FiCpu aria-hidden="true" />
												)}
											</AvatarFallback>
										</Avatar>

										<Card 
											className={`py-0 ${
												message.type === "user"
													? "border-primary/20 dark:border-primary/20 bg-primary/5 dark:bg-primary/10"
													: message.type === "error"
													? "border-destructive/20 bg-destructive/5"
													: "border-border/60 dark:border-border/30 bg-card"
											}`}
										>
											<CardContent className="p-3 sm:p-4">
												{message.type === "ai" && (
													<div className="flex justify-between items-center mb-2">
														<Badge 
															variant="outline"
															className="text-xs mb-1 border-secondary-400/30 bg-secondary-400/5 text-secondary-700 dark:text-secondary-300"
														>
															AI Assistant
														</Badge>
														{message.timestamp && (
															<span className="text-xs text-muted-foreground">
																{formatTimestamp(message.timestamp)}
															</span>
														)}
													</div>
												)}
												
												{message.type === "user" && message.timestamp && (
													<div className="flex justify-end mb-1">
														<span className="text-xs text-muted-foreground">
															{formatTimestamp(message.timestamp)}
														</span>
													</div>
												)}

												<div className={`${
														message.type === "user"
															? "text-primary-900 dark:text-primary-50"
															: message.type === "error"
															? "text-destructive dark:text-destructive"
															: "text-foreground"
													}`}
												>
													{message.type === "user" ? (
														<p className="text-sm">{message.content}</p>
													) : message.type === "error" ? (
														<div className="flex items-start gap-2">
															<FiAlertTriangle className="text-destructive mt-0.5 shrink-0" />
															<p className="text-sm">{message.content}</p>
														</div>
													) : message.structuredResponse ? (
														<div>
															{message.structuredResponse.title && (
																<h3 className="text-base font-medium mb-2">{message.structuredResponse.title}</h3>
															)}
															
															{message.structuredResponse.content.map(renderResponseItem)}
														</div>
													) : (
														<p className="text-sm">{message.content}</p>
													)}
												</div>
												
												{message.type === "ai" && (
													<div className="flex justify-end mt-2">
														<TooltipProvider>
															<Tooltip>
																<TooltipTrigger asChild>
																	<Button
																		variant="ghost"
																		size="sm"
																		className="h-7 w-7 p-0 rounded-full"
																		onClick={() => copyToClipboard(message, index)}
																		aria-label="Copy message to clipboard"
																	>
																		{copiedMessageId === index ? (
																			<FiCheck className="h-3.5 w-3.5 text-green-500" aria-hidden="true" />
																		) : (
																			<FiCopy className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
																		)}
																	</Button>
																</TooltipTrigger>
																<TooltipContent side="bottom" align="end">
																	{copiedMessageId === index ? "Copied!" : "Copy to clipboard"}
																</TooltipContent>
															</Tooltip>
														</TooltipProvider>
													</div>
												)}
											</CardContent>
										</Card>
									</div>
								</div>
							</motion.div>
						))}
						<div ref={messagesEndRef} />
					</div>
				)}

				{/* Loading indicator */}
				{isLoading && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="flex items-start gap-3 max-w-[85%]"
						aria-live="polite"
						aria-label="AI is thinking"
					>
						<Avatar className="h-8 w-8 mt-1 border border-border/40">
							<AvatarFallback className="bg-secondary-400/10 text-secondary-700 dark:text-secondary-400">
								<FiCpu aria-hidden="true" />
							</AvatarFallback>
						</Avatar>
						<Card className="border-border/60 dark:border-border/30 bg-card">
							<CardContent className="p-3 sm:p-4 flex items-center">
								<div className="flex space-x-1.5" aria-hidden="true">
									<motion.span
										animate={{
											opacity: [0.4, 1, 0.4],
											scale: [0.9, 1, 0.9],
											transition: { duration: 1, repeat: Infinity },
										}}
										className="w-2.5 h-2.5 bg-primary/70 dark:bg-secondary-400 rounded-full"
									/>
									<motion.span
										animate={{
											opacity: [0.4, 1, 0.4],
											scale: [0.9, 1, 0.9],
											transition: {
												duration: 1,
												delay: 0.33,
												repeat: Infinity,
											},
										}}
										className="w-2.5 h-2.5 bg-primary/70 dark:bg-secondary-400 rounded-full"
									/>
									<motion.span
										animate={{
											opacity: [0.4, 1, 0.4],
											scale: [0.9, 1, 0.9],
											transition: {
												duration: 1,
												delay: 0.66,
												repeat: Infinity,
											},
										}}
										className="w-2.5 h-2.5 bg-primary/70 dark:bg-secondary-400 rounded-full"
									/>
								</div>
								<span className="ml-2 text-sm text-muted-foreground">
									AI is thinking...
								</span>
							</CardContent>
						</Card>
					</motion.div>
				)}
			</div>

			<div className="mt-auto">
				<Separator className="mb-4 border-dashed" />
				<div className="px-4 pb-4">
					<form 
						onSubmit={handleSubmit} 
						className="flex items-center gap-2"
						aria-label="Message input form"
					>
						<div className="relative flex-1">
							<Input
								ref={inputRef}
								type="text"
								placeholder="Type your healthcare question..."
								value={input}
								onChange={(e) => setInput(e.target.value)}
								autoFocus
								className="pr-12"
								aria-label="Type your healthcare question"
							/>
							<Button
								type="submit"
								size="icon"
								disabled={!input.trim() || isLoading}
								className="absolute right-0 top-0 h-full px-3 rounded-l-none"
								aria-label="Send message"
							>
								<FiSend
									className={`h-4 w-4 ${
										!input.trim() || isLoading ? "text-muted-foreground" : ""
									}`}
									aria-hidden="true"
								/>
							</Button>
						</div>
					</form>
					<div className="mt-2 text-xs text-center text-muted-foreground">
						<p>Your interactions help us improve our healthcare budget guidance.</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatInterface;
