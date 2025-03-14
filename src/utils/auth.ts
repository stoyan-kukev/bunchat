import { db } from "@/db";
import {
	DAY_IN_MILLIS,
	type Session,
	type SessionValidationResult,
	type User,
} from "@/types";

export function createSession(token: string, userId: string): Session {
	const session: Session = {
		id: token,
		userId,
		expiresAt: new Date(Date.now() + DAY_IN_MILLIS * 30),
	};

	db.exec("INSERT INTO session (id, user_id, expires_at) VALUES (?, ?, ?)", [
		session.id,
		session.userId,
		Math.floor(session.expiresAt.getTime() / 1000),
	]);

	return session;
}

export function validateSessionToken(token: string): SessionValidationResult {
	const row = db
		.query(
			`SELECT session.id, session.user_id, session.expires_at, user.id, user.username
            FROM session
            INNER JOIN user ON user.id = session.user_id
            WHERE session.id = $id`
		)
		.get({ $id: token }) as any;

	if (row == null) {
		return { session: null, user: null };
	}

	const session: Session = {
		id: row.id,
		userId: row.user_id,
		expiresAt: new Date(row.expires_at * 1000),
	};

	const user: User = {
		id: row.user_id,
		username: row.username,
	};

	if (Date.now() >= session.expiresAt.getTime()) {
		db.exec("DELETE FROM session WHERE id = ?", [session.id]);
		return { session: null, user: null };
	}

	if (Date.now() >= session.expiresAt.getTime() - DAY_IN_MILLIS * 15) {
		session.expiresAt = new Date(Date.now() + DAY_IN_MILLIS * 30);

		db.exec("UPDATE session SET expires_at = ? WHERE id = ?", [
			Math.floor(session.expiresAt.getTime() / 1000),
			session.id,
		]);
	}

	return { session, user };
}

export function invalidateSession(sessionId: string): void {
	db.exec("DELETE FROM session WHERE id = ?", [sessionId]);
}

export function setSessionTokenCookie(
	response: Response,
	token: string,
	expiresAt: Date
): void {
	let cookie = `session=${token}; HttpOnly; SameSite=Lax; Expires=${expiresAt.toUTCString()}; Path=/;`;

	if (process.env.NODE_ENV === "production") cookie += " Secure;";

	response.headers.set("Set-Cookie", cookie);
}

export function deleteSessionTokenCookie(response: Response): void {
	let cookie = "session=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/";

	if (process.env.NODE_ENV === "production") cookie += " Secure;";

	response.headers.set("Set-Cookie", cookie);
}

export function getTokenFromCookie(req: Request): string | undefined {
	const cookies = req.headers.get("Cookie");
	const sessionToken = cookies
		?.split(";")
		.find((cookie) => cookie.trim().startsWith("session="))
		?.split("session=")[1];

	return sessionToken;
}
