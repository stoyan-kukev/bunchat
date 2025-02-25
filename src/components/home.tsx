import { useEffect, useState } from "react";
import type { Room } from "@/types";
import { useRoom } from "../context/room-context";
import { useAuth } from "../context/auth-context";
import { LogOutButton } from "./auth/logout-button";
import { ChatRoom } from "./room/chat-room";
import { RoomCard } from "./room/room-card";
import { BunLogo } from "./bun-logo";
import { CreateRoomModal } from "./room/create-room-modal";

export function Home() {
	const { user } = useAuth()!;
	if (!user) {
		window.location.href = "http://localhost:3000/";
		return;
	}

	const fetchRooms = () =>
		fetch("/api/rooms", {
			credentials: "include",
		})
			.then((res) => res.json())
			.then((data) => setRooms(data.rooms));

	const [rooms, setRooms] = useState<Room[]>([]);
	useEffect(() => {
		fetchRooms();
	}, []);

	const { room, ws, setWs } = useRoom()!;
	useEffect(() => {
		if (room && !ws) {
			const socket = new WebSocket(
				`ws://${window.location.host}/room/${room.id}`
			);
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

	const [open, setOpen] = useState(false);

	return (
		<div className="min-h-screen flex flex-col items-center py-6 px-4">
			<header className="w-full max-w-3xl glass rounded-xl p-4 flex justify-between items-center mb-8 animate-fade-in">
				<h1 className="text-xl font-semibold flex gap-x-2 items-center">
					<BunLogo className="size-10 text-indigo-400" />
					<span className="text-white font-bold">BunChat</span>
				</h1>
				<div className="flex items-center space-x-4">
					<p className="text-gray-300">
						Logged in as
						<span className="ml-2 px-3 py-1 rounded-full glass-lighter text-white font-medium">
							{user.username}
						</span>
					</p>
					<LogOutButton />
				</div>
			</header>

			<div className="w-full max-w-3xl glass rounded-xl p-5 shadow-lg animate-fade-in">
				{room && ws ? (
					<ChatRoom />
				) : rooms && rooms.length > 0 ? (
					<div className="space-y-4 flex flex-col justify-center">
						<div className="flex space-x-4 items-center justify-between">
							<h2 className="text-base font-medium text-white">
								Available Rooms
							</h2>

							<button
								onClick={() => setOpen(true)}
								className="bg-gradient-accent hover:opacity-90 text-white px-4 py-2 rounded-full transition-all duration-200 cursor-pointer font-medium"
							>
								Create new room
							</button>
						</div>
						<div className="flex flex-col space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
							{rooms.map((room) => (
								<RoomCard key={room.id} {...room} />
							))}
						</div>
					</div>
				) : (
					<div className="flex space-x-4 items-center justify-between">
						<p className="text-gray-400 text-center">
							No rooms available
						</p>
						<button
							onClick={() => setOpen(true)}
							className="bg-gradient-accent hover:opacity-90 text-white px-4 py-2 rounded-full transition-all duration-200 cursor-pointer font-medium"
						>
							Create new room
						</button>
					</div>
				)}
			</div>
			<CreateRoomModal
				open={open}
				setOpen={setOpen}
				onSuccess={fetchRooms}
			/>
		</div>
	);
}
