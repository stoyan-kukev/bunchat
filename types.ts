import { type ServerWebSocket } from "bun";

export interface Message {
	type: string;
	content: string;
	sender?: string;
	timestamp?: number;
}

export const DAY_IN_MILLIS = 1000 * 60 * 60 * 24;

export type Handler = (req: Request) => Promise<Response> | Response;

export type Middleware = (handler: Handler) => Handler;

export type UserData = {
	username?: string | undefined;
	roomId?: string | undefined;
};

export type Connection = ServerWebSocket<UserData>;

export type Room = {
	id: string;
	clients: Set<Connection>;
};
