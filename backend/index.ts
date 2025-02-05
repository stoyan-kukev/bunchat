import type { Connection, Message } from "@/common/types";
import { cors } from "./middleware/cors";
import {
	handleAuthCheck,
	handleLogin,
	handleLogout,
	handleSignup,
} from "./routes/auth";
import {
	handleGetRoomMessages,
	handleGetRooms,
	handleRoomJoin,
} from "./routes/room";
import { randomUUIDv7, type Server } from "bun";
import { db } from "./db";

async function router(req: Request, server: Server): Promise<Response> {
	const { pathname } = new URL(req.url);

	if (req.headers.get("Upgrade") === "websocket") {
		return handleRoomJoin(req, server);
	}

	if (pathname === "/api/login" && req.method === "POST") {
		return handleLogin(req);
	}

	if (pathname === "/api/signup" && req.method === "POST") {
		return handleSignup(req);
	}

	if (pathname === "/api/user/check" && req.method === "GET") {
		return handleAuthCheck(req);
	}

	if (pathname === "/api/logout" && req.method === "GET") {
		return handleLogout(req);
	}

	if (pathname === "/api/rooms" && req.method === "GET") {
		return handleGetRooms(req);
	}

	if (
		pathname.match(/^\/api\/room\/[^\/]+\/messages$/) &&
		req.method === "GET"
	) {
		const id = pathname.split("/")[3];
		return handleGetRoomMessages(req, id);
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

			ws.subscribe(`${room.id}`);

			const msg: Message = {
				id: randomUUIDv7(),
				content: `${user.username} has joined the chat room`,
				timestamp: Date.now(),
				sender: null,
			};

			server.publish(`${room.id}`, JSON.stringify({ msg }));
		},

		async message(ws: Connection, message: string) {
			const { room } = ws.data;

			const { msg }: { msg: Message } = JSON.parse(message);

			if (!msg) ws.close();

			if (!msg.sender || msg.content.length < 1) return;

			if (!msg.id) {
				msg.id = randomUUIDv7();
			}

			db.exec("INSERT INTO message VALUES (?, ?, ?, ?, ?)", [
				msg.id,
				msg.content,
				msg.timestamp ?? Date.now(),
				room.id,
				msg.sender.id,
			]);

			server.publish(`${room.id}`, JSON.stringify({ msg }));
		},
		async close(ws: Connection) {
			const { room, user } = ws.data;

			const msg: Message = {
				id: randomUUIDv7(),
				content: `${user.username} has left the chat room`,
				timestamp: Date.now(),
				sender: null,
			};

			ws.unsubscribe(`${room.id}`);
			server.publish(`${room.id}`, JSON.stringify({ msg }));
		},
	},
	port: 1337,
});

console.log(`📨 Server listening on ${server.hostname}:${server.port}`);
