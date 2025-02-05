import { type Server, type ServerWebSocket } from "bun";

export interface Session {
	id: string;
	userId: string;
	expiresAt: Date;
}

export interface User {
	id: string;
	username: string;
}

export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };

export interface Message {
	id?: string;
	content: string;
	sender: User | null;
	timestamp?: number;
}

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

export const DAY_IN_MILLIS = 1000 * 60 * 60 * 24;
