import type { Server } from "bun";
import { getTokenFromCookie, validateSessionToken } from "../utils/auth";
import { db } from "../db";
import { jsonResponse } from "../utils/response";
import type { Message } from "@/common/types";

export async function handleGetRooms(req: Request): Promise<Response> {
	const sessionToken = getTokenFromCookie(req);
	if (!sessionToken) return new Response(null, { status: 400 });

	const { user } = validateSessionToken(sessionToken);
	if (!user) return new Response(null, { status: 400 });

	const rooms = db.query("SELECT * FROM room").all();

	return jsonResponse({ rooms });
}

export async function handleRoomJoin(
	req: Request,
	server: Server
): Promise<Response> {
	const { pathname } = new URL(req.url);

	if (!pathname.startsWith("/room/"))
		return new Response(null, { status: 400 });

	const roomId = pathname.split("/")[2];
	if (!roomId) return new Response(null, { status: 400 });

	const room = db
		.query("SELECT * FROM room WHERE id = $id")
		.get({ $id: roomId });

	if (!room) return new Response(null, { status: 400 });

	const sessionToken = getTokenFromCookie(req);
	if (!sessionToken) return new Response(null, { status: 400 });

	const { user } = validateSessionToken(sessionToken);
	if (!user) return new Response(null, { status: 400 });

	server.upgrade(req, { data: { room, user } });

	return new Response("Failed to upgrade request", { status: 400 });
}

export async function handleGetRoomMessages(
	req: Request,
	roomId: string
): Promise<Response> {
	const sessionToken = getTokenFromCookie(req);
	if (!sessionToken) return new Response(null, { status: 401 });

	const { user } = validateSessionToken(sessionToken);
	if (!user) return new Response(null, { status: 401 });

	const rows: any[] = db
		.query(
			`SELECT message.id AS id,
			message.content AS content,
			user.id AS userId,
			user.username AS username,
			message.timestamp AS timestamp
			FROM message
			INNER JOIN user ON user.id = message.user_id
			WHERE message.room_id = $roomId;
			`
		)
		.all({ $roomId: roomId });

	if (!rows) return new Response(null, { status: 404 });

	const messages = rows.map((row) => ({
		id: row.id,
		content: row.content,
		sender: { id: row.userId, username: row.username },
		timestamp: row.timestamp,
	}));

	return jsonResponse({ messages });
}
