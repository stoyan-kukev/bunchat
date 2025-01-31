import type { Server } from "bun";
import { getTokenFromCookie } from "./auth";
import { validateSessionToken, type User } from "../utils/auth";
import { db } from "../db";

export async function handleRoomJoin(
	req: Request,
	server: Server
): Promise<Response | undefined> {
	const sessionToken = getTokenFromCookie(req);
	if (!sessionToken) {
		return new Response("ayo chill tf out");
	}

	const { user } = validateSessionToken(sessionToken);
	if (!user) {
		return new Response("ayo chill tf out");
	}

	const { roomId } = await req.json();
	const row = db
		.query(`SELECT * FROM room WHERE id = $id;`)
		.all({ $id: roomId });

	if (!row) {
		return new Response("ayo chill tf out");
	}

	const success = server.upgrade<User & { roomId: string }>(req, {
		data: { ...user, roomId },
	});
	if (success) {
		return undefined;
	}

	return new Response("ayo chill tf out");
}
