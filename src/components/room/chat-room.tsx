import { useEffect, useRef, useState } from "react";
import type { Message } from "@/types";
import { useAuth } from "@/context/auth-context";
import { useRoom } from "@/context/room-context";

export function ChatRoom() {
	const { room, ws, setRoom, setWs } = useRoom()!;
	const { user } = useAuth()!;

	if (!room || !ws || !user) return null;

	const [input, setInput] = useState("");
	const [msgs, setMsgs] = useState<Message[]>([]);
	const chatEndRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		fetch(`/api/room/${room.id}/messages`, {
			credentials: "include",
		}).then((res) => res.json().then((data) => setMsgs(data.messages)));
	}, []);

	const sendMessage = () => {
		if (!input.trim()) return;

		const msg: Message = {
			content: input,
			sender: user,
			timestamp: Date.now(),
		};

		ws.send(JSON.stringify({ msg }));
		setInput("");
	};

	useEffect(() => {
		if (!ws) return;

		const handleMessage = (event: MessageEvent) => {
			try {
				const data: { msg: Message } = JSON.parse(event.data);
				setMsgs((prev) => [...prev, data.msg]);
			} catch (error) {
				console.error("Error parsing message:", error);
			}
		};

		ws.addEventListener("message", handleMessage);

		return () => {
			ws.removeEventListener("message", handleMessage);
		};
	}, [ws]);

	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [msgs]);

	return (
		<div className="flex flex-col h-[500px] w-full max-w-3xl glass-darker rounded-xl shadow-lg overflow-hidden">
			<header className="p-4 border-b border-gray-700/30 flex justify-between items-center">
				<h1 className="text-lg font-semibold text-white flex items-center">
					<span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
					{room.name}
				</h1>
			</header>

			<div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
				{msgs.map((msg, index) => {
					const isCurrentUser = msg.sender?.id === user.id;
					const isSystemMessage = msg.sender === null;

					return (
						<div
							key={index}
							className={`flex ${
								isCurrentUser ? "justify-end" : "justify-start"
							}`}
						>
							<div
								className={`p-3 rounded-xl max-w-xs animate-fade-in ${
									isSystemMessage
										? "glass-lighter text-gray-300 italic text-center w-full"
										: isCurrentUser
										? "bg-gradient-accent text-white"
										: "glass-lighter text-white"
								}`}
							>
								{!isSystemMessage && (
									<p className="text-sm font-semibold">
										{msg.sender?.username}
									</p>
								)}
								<p className="break-all max-w-xs">
									{msg.content}
								</p>
							</div>
						</div>
					);
				})}
				<div ref={chatEndRef} />
			</div>

			<footer className="p-4 border-t border-gray-700/30 flex items-center">
				<button
					className="bg-red-500/80 hover:bg-red-500 text-white px-4 py-2 mr-3 rounded-full transition-colors duration-200"
					onClick={() => {
						ws.close();
						setWs(null);
						setRoom(null);
					}}
				>
					Leave Chat
				</button>
				<div className="flex-1 glass-lighter rounded-full flex overflow-hidden">
					<input
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						className="flex-1 p-3 bg-transparent text-white focus:outline-none"
						placeholder="Type a message..."
						onKeyDown={(e) => e.key === "Enter" && sendMessage()}
					/>
					<button
						onClick={sendMessage}
						className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white transition-colors duration-200"
					>
						Send
					</button>
				</div>
			</footer>
		</div>
	);
}
