import { cors } from "./middleware/cors";
import {
	handleAuthCheck,
	handleLogin,
	handleLogout,
	handleSignup,
} from "./routes/auth";
import { type Room } from "../types";

const rooms = new Map<string, Room>();

async function router(req: Request): Promise<Response> {
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

	return new Response("Not Found", { status: 404 });
}

const server = Bun.serve({
	fetch: cors(router),
	port: 1337,
});

console.log(`📨 Server listening on ${server.hostname}:${server.port}`);
