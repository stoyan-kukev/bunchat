import { type Server, type ServerWebSocket } from "bun";
import type { User } from "./backend/utils/auth";

export interface Message {
	id?: string;
	content: string;
	sender: User | null;
	timestamp?: number;
}

export const DAY_IN_MILLIS = 1000 * 60 * 60 * 24;

export type Handler = (
	req: Request,
	server: Server
) => Promise<Response | undefined> | Response;

export type Middleware = (handler: Handler, server: Server) => Handler;

export type Connection = ServerWebSocket<{ user: User; room: Room }>;

export type Room = {
	id: string;
	name: string;
};
