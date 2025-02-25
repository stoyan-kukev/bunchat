import type { Room } from "@/types";
import { createContext, useContext, useState, type ReactNode } from "react";

interface RoomContextType {
	room: Room | null;
	setRoom: (room: Room | null) => void;
	ws: WebSocket | null;
	setWs: (ws: WebSocket | null) => void;
}

const RoomContext = createContext<RoomContextType | null>(null);

export const RoomProvider = ({ children }: { children: ReactNode }) => {
	const [room, setRoom] = useState<Room | null>(null);
	const [ws, setWs] = useState<WebSocket | null>(null);

	return (
		<RoomContext.Provider value={{ room, setRoom, ws, setWs }}>
			{children}
		</RoomContext.Provider>
	);
};

export const useRoom = () => useContext(RoomContext);
