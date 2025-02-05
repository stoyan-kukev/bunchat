import { useEffect, useState } from "react";
import type { Room } from "@/common/types";
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
		fetch("http://localhost:1337/api/rooms", {
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

	const [open, setOpen] = useState(false);

	return (
		<div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center py-6 px-4">
			<header className="w-full max-w-3xl bg-gray-900 p-4 flex justify-between items-center border-b border-gray-800 shadow-sm mb-8">
				<h1 className="text-xl font-semibold flex gap-x-2 items-center">
					<BunLogo className="size-10 text-indigo-400" />
					<span className="text-gray-200">BunChat</span>
				</h1>
				<div className="flex items-center space-x-4">
					<p className="text-gray-400">
						Logged in as
						<span className="ml-2 px-2 py-1 rounded-md bg-gray-800 border border-gray-700 text-gray-300">
							{user.username}
						</span>
					</p>
					<LogOutButton />
				</div>
			</header>

			<div className="w-full max-w-3xl bg-gray-900 rounded-lg p-4 shadow-lg border border-gray-800">
				{room && ws ? (
					<ChatRoom />
				) : rooms && rooms.length > 0 ? (
					<div className="space-y-4 flex flex-col justify-center">
						<div className="flex space-x-4 items-center justify-between">
							<h2 className="text-base font-medium text-gray-300">
								Available Rooms
							</h2>

							<button
								onClick={() => setOpen(true)}
								className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 px-4 py-2 rounded-md border border-indigo-500/30 transition-colors duration-200 cursor-pointer"
							>
								Create new room
							</button>
						</div>
						<div className="flex flex-col space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
							{rooms.map((room) => (
								<RoomCard key={room.id} {...room} />
							))}
						</div>
					</div>
				) : (
					<div className="flex space-x-4 items-center justify-between">
						<p className="text-gray-500 text-center">
							No rooms available
						</p>
						<button
							onClick={() => setOpen(true)}
							className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 px-4 py-2 rounded-md border border-indigo-500/30 transition-colors duration-200 cursor-pointer"
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
