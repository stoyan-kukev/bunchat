import homepage from "./src/pages/index.html";
import notFound from "./src/pages/404.html";
import { randomUUIDv7, type Server } from "bun";
import { db } from "./src/db";
import { cors } from "./src/middleware/cors";
import {
	handleAuthCheck,
	handleLogin,
	handleLogout,
	handleSignup,
} from "./src/routes/auth";
import {
	handleCreateRoom,
	handleGetRoomMessages,
	handleGetRooms,
	handleRoomJoin,
} from "./src/routes/room";
import type { Connection, Message } from "./src/types";

async function router(req: Request, server: Server): Promise<Response> {
	if (req.headers.get("Upgrade") === "websocket") {
		return handleRoomJoin(req, server);
	}

	return new Response("Not Found", { status: 404 });
}

const server = Bun.serve({
	fetch(request: Request, server: Server) {
		const middleware = cors(router, server);
		return middleware(request, server);
	},

	routes: {
		"/": homepage,
		"/*": notFound,

		"/api/login": {
			POST: handleLogin,
		},
		"/api/signup": {
			POST: handleSignup,
		},
		"/api/user/check": {
			GET: handleAuthCheck,
		},
		"/api/logout": {
			GET: handleLogout,
		},
		"/api/rooms": {
			GET: handleGetRooms,
		},
		"/api/rooms/create": {
			POST: handleCreateRoom,
		},
		"/api/room/:id/messages": {
			GET: (req) => {
				const id = req.params.id;
				return handleGetRoomMessages(req, id);
			},
		},
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

			db.run("INSERT INTO message VALUES (?, ?, ?, ?, ?)", [
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

	development: true,
	port: 3000,
});

console.log(`🚀 Server listening on ${server.hostname}:${server.port}`);
