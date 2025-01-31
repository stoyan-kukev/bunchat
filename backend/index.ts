import { cors } from "./middleware/cors";
import {
	handleAuthCheck,
	handleLogin,
	handleLogout,
	handleSignup,
} from "./routes/auth";
import { type Room } from "../types";
import { handleRoomJoin } from "./routes/room";
import type { Server } from "bun";

const rooms = new Map<string, Room>();

async function router(req: Request, server: Server): Promise<Response> {
	const url = new URL(req.url);

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

	if (url.pathname === "/api/room/join" && req.method === "POST") {
		return handleRoomJoin(req);
	}

	return new Response("Not Found", { status: 404 });
}

const server = Bun.serve({
	async fetch(request: Request, server: Server) {
		const middleware = cors(router, server);

		middleware(request, server);

		return new Response();
	},
	port: 1337,
});

console.log(`📨 Server listening on ${server.hostname}:${server.port}`);
