import { cors } from "./middleware/cors";
import {
	getTokenFromCookie,
	handleAuthCheck,
	handleLogin,
	handleLogout,
	handleSignup,
} from "./routes/auth";
import { type Connection, type Room } from "../types";
import { handleGetRooms, handleRoomJoin } from "./routes/room";
import type { Server } from "bun";
import { validateSessionToken } from "./utils/auth";
import { db } from "./db";

const rooms = new Map<string, Room>();

async function router(
	req: Request,
	server: Server
): Promise<Response | undefined> {
	const url = new URL(req.url);

	if (req.headers.get("Upgrade") === "websocket") {
		return handleRoomJoin(req, server);
	}

	if (url.pathname === "/api/login" && req.method === "POST") {
		return handleLogin(req);
	}

	if (url.pathname === "/api/signup" && req.method === "POST") {
		return handleSignup(req);
	}

	if (url.pathname === "/api/user/check" && req.method === "GET") {
		return handleAuthCheck(req);
	}

	if (url.pathname === "/api/logout" && req.method === "GET") {
		return handleLogout(req);
	}

	if (url.pathname === "/api/rooms" && req.method === "GET") {
		return handleGetRooms(req);
	}

	return new Response("Not Found", { status: 404 });
}

const server = Bun.serve({
	async fetch(request: Request, server: Server) {
		const middleware = cors(router, server);

		return middleware(request, server);
	},
	websocket: {
		async open(ws: Connection) {
			const { room, user } = ws.data;
			console.log(
				`User ${user.username} (${user.id}) joined room ${room.name}`
			);
		},

		async message(ws: Connection, message) {},
		async close(ws: Connection) {},
	},
	port: 1337,
});

console.log(`📨 Server listening on ${server.hostname}:${server.port}`);
