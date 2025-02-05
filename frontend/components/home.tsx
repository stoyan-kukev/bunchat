import { useContext, useEffect, useState } from "react";
import { LogOutButton } from "./auth/logout-button";
import { UserContext } from "./auth/auth-context";
import type { Room } from "../../types";
import { RoomCard } from "./room/room-card";
import { useRoom } from "./room/room-context";

export function Home() {
	const { user } = useContext(UserContext);
	if (!user) {
		window.location.href = "http://localhost:3000/";
		return;
	}

	const [rooms, setRooms] = useState<Room[] | null>();
	useEffect(() => {
		fetch("http://localhost:1337/api/rooms", {
			credentials: "include",
		}).then((res) => res.json().then((data) => setRooms(data.rooms)));
	}, []);

	const { room, ws, setWs } = useRoom()!;
	useEffect(() => {
		if (room && !ws) {
			const socket = new WebSocket(`ws://localhost:1337/room/${room.id}`);

			socket.onclose = () => setWs(null);

			setWs(ws);
		}

		return () => {
			if (ws) {
				ws.close();
				setWs(null);
			}
		};
	}, [room]);

	return (
		<div className="p-4 flex flex-col gap-y-4 bg-gray-200">
			<header className="flex justify-around items-center border-b-2 border-b-gray-400 pb-4">
				<h1 className="font-bold text-3xl">
					Welcome {user.username} to BunChat
				</h1>
				<LogOutButton />
			</header>
			{room ? (
				<div>Welcome to room {room.name}</div>
			) : (
				<div>
					{rooms ? (
						rooms.map((room) => (
							<RoomCard key={room.id} {...room} />
						))
					) : (
						<p>There are no rooms yet</p>
					)}
				</div>
			)}
		</div>
	);
}
