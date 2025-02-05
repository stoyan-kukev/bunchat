import { type Server, type ServerWebSocket } from "bun";

export const DAY_IN_MILLIS = 1000 * 60 * 60 * 24;

export type Handler = (req: Request, server: Server) => Promise<Response>;

export type Middleware = (handler: Handler, server: Server) => Handler;

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

export type Connection = ServerWebSocket<{ user: User; room: Room }>;

export type Room = {
	id: string;
	name: string;
};

export interface Message {
	id?: string;
	content: string;
	sender: User | null;
	timestamp?: number;
}
