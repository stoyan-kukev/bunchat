import { useEffect, useState } from "react";
import { LogOutButton } from "./auth/logout-button";
import { useAuth } from "./auth/auth-context";
import type { Room } from "../../types";
import { RoomCard } from "./room/room-card";
import { useRoom } from "./room/room-context";
import { ChatRoom } from "./room/chat-room";

export function Home() {
	const { user, setUser } = useAuth()!;
	if (!user) {
		window.location.href = "http://localhost:3000/";
		return;
	}

	const [rooms, setRooms] = useState<Room[] | null>(null);
	useEffect(() => {
		fetch("http://localhost:1337/api/rooms", {
			credentials: "include",
		})
			.then((res) => res.json())
			.then((data) => setRooms(data.rooms));
	}, []);

	const { room, ws, setWs } = useRoom()!;
	useEffect(() => {
		if (room && !ws) {
			const socket = new WebSocket(`ws://localhost:1337/room/${room.id}`);
			socket.onclose = () => setWs(null);
			setWs(socket);
		}
		return () => {
			if (ws) {
				ws.close();
				setWs(null);
			}
		};
	}, [room]);

	return (
		<div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-6 px-4">
			<header className="w-full max-w-3xl bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700 rounded-t-lg">
				<h1 className="text-xl font-bold">BunChat</h1>
				<div className="flex items-center space-x-4">
					<p className="text-gray-400">
						Logged in as {user.username}
					</p>
					<LogOutButton />
				</div>
			</header>

			<div className="w-full max-w-3xl flex-1 bg-gray-800 rounded-b-lg p-4 shadow-lg border border-gray-700">
				{room && ws ? (
					<ChatRoom />
				) : rooms && rooms.length > 0 ? (
					<div className="space-y-3">
						<h2 className="text-lg font-semibold text-gray-300">
							Available Rooms
						</h2>
						{rooms.map((room) => (
							<RoomCard key={room.id} {...room} />
						))}
					</div>
				) : (
					<p className="text-gray-400 text-center">
						No rooms available
					</p>
				)}
			</div>
		</div>
	);
}
