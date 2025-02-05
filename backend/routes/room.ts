import type { Server } from "bun";
import { getTokenFromCookie } from "./auth";
import { validateSessionToken } from "../utils/auth";
import { db } from "../db";
import { jsonResponse } from "../utils/response";

export async function handleGetRooms(
	req: Request
): Promise<Response | undefined> {
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
): Promise<Response | undefined> {
	const { pathname } = new URL(req.url);

	if (!pathname.startsWith("/room/"))
		return new Response(null, { status: 400 });

	const parts = pathname.split("/");
	const roomId = parts[2];
	if (!roomId) return new Response(null, { status: 400 });

	const row = db
		.query("SELECT * FROM room WHERE id = $id")
		.get({ $id: roomId });

	if (!row) return new Response(null, { status: 400 });

	const sessionToken = getTokenFromCookie(req);
	if (!sessionToken) return new Response(null, { status: 400 });

	const { user } = validateSessionToken(sessionToken);
	if (!user) return new Response(null, { status: 400 });

	const wsConnection = server.upgrade(req, {
		data: { room: row, user },
	});
	if (!wsConnection) {
		return new Response("Failed to upgrade request", { status: 400 });
	}
}
