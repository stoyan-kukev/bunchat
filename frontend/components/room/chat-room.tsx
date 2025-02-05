import { useEffect, useRef, useState } from "react";
import type { Message } from "@/common/types";
import { useAuth } from "@/frontend/context/auth-context";
import { useRoom } from "@/frontend/context/room-context";

export function ChatRoom() {
	const { room, ws, setRoom, setWs } = useRoom()!;
	const { user } = useAuth()!;

	if (!room || !ws || !user) return null;

	const [input, setInput] = useState("");
	const [msgs, setMsgs] = useState<Message[]>([]);
	const chatEndRef = useRef<HTMLDivElement | null>(null);

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
		<div className="flex flex-col h-[500px] w-full max-w-3xl bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
			<header className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900 rounded-t-lg">
				<h1 className="text-lg font-semibold text-white">
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
								className={`p-3 rounded-lg max-w-xs ${
									isSystemMessage
										? "bg-gray-600 text-gray-300 italic text-center w-full"
										: isCurrentUser
										? "bg-green-500 text-white"
										: "bg-gray-700 text-gray-200"
								}`}
							>
								{!isSystemMessage && (
									<p className="text-sm font-semibold">
										{msg.sender?.username}
									</p>
								)}
								<p>{msg.content}</p>
							</div>
						</div>
					);
				})}
				<div ref={chatEndRef} />
			</div>

			<footer className="p-4 border-t border-gray-700 bg-gray-900 rounded-b-lg flex items-center">
				<button
					className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 mr-3 rounded-lg transition"
					onClick={() => {
						ws.close();
						setWs(null);
						setRoom(null);
					}}
				>
					Leave Chat
				</button>
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					className="flex-1 p-2 rounded-lg bg-gray-700 text-white focus:outline-none"
					placeholder="Type a message..."
					onKeyDown={(e) => e.key === "Enter" && sendMessage()}
				/>
				<button
					onClick={sendMessage}
					className="ml-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
				>
					Send
				</button>
			</footer>
		</div>
	);
}
