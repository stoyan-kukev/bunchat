import { randomUUIDv7 } from "bun";
import { db } from "@/db";
import { jsonResponse } from "@/utils/response";
import {
	createSession,
	deleteSessionTokenCookie,
	getTokenFromCookie,
	setSessionTokenCookie,
} from "@/utils/auth";
import { DAY_IN_MILLIS } from "@/types";

export async function handleLogin(req: Request): Promise<Response> {
	const { username, password } = await req.json();

	if (typeof username !== "string" || typeof password !== "string") {
		return jsonResponse({ error: "Invalid data for route" }, 406);
	}

	if (username.length < 2 || username.length > 63) {
		return jsonResponse({ error: "Username is invalid" }, 406);
	}

	if (password.length < 6 || password.length > 255) {
		return jsonResponse({ error: "Password is invalid" }, 406);
	}

	const row = db
		.query(
			"SELECT user.id, user.username, user.password_hash FROM user WHERE username = $username"
		)
		.get({ $username: username }) as {
		id: string;
		username: string;
		password_hash: string;
	};

	if (!row) {
		return jsonResponse({ login: "Invalid username or password" }, 400);
	}

	const response = jsonResponse({ success: true });

	const token = randomUUIDv7();
	createSession(token, row.id);
	setSessionTokenCookie(
		response,
		token,
		new Date(Date.now() + DAY_IN_MILLIS * 7)
	);

	return response;
}

export async function handleSignup(req: Request): Promise<Response> {
	const { username, password } = await req.json();

	if (typeof username !== "string" || typeof password !== "string") {
		return jsonResponse({ error: "Invalid data for route" }, 406);
	}

	if (username.length < 2 || username.length > 63) {
		return jsonResponse({ error: "Username is invalid" }, 406);
	}

	if (password.length < 6 || password.length > 255) {
		return jsonResponse({ error: "Password is invalid" }, 406);
	}

	const userExists = db
		.query(
			"SELECT user.id, user.username, user.password_hash FROM user WHERE user.username = $username"
		)
		.get({ $username: username });

	if (userExists) {
		return jsonResponse({ signup: "Username is already taken" }, 400);
	}

	const userId = randomUUIDv7();

	db.exec("INSERT INTO user VALUES (?, ?, ?)", [
		userId,
		username,
		await Bun.password.hash(password),
	]);

	const response = jsonResponse({ success: true });

	const token = randomUUIDv7();
	createSession(token, userId);
	setSessionTokenCookie(
		response,
		token,
		new Date(Date.now() + DAY_IN_MILLIS * 7)
	);

	return response;
}

export async function handleAuthCheck(req: Request) {
	const sessionToken = getTokenFromCookie(req);

	if (!sessionToken) {
		return new Response(null, {
			status: 401,
		});
	}

	const row = db
		.query(
			`SELECT user.id, user.username
			FROM user
			INNER JOIN session ON session.user_id = user.id
			WHERE session.id = $id`
		)
		.get({ $id: sessionToken }) as { id: string; username: string };

	if (!row) {
		return new Response(null, {
			status: 401,
		});
	}

	const { id, username } = row;

	return jsonResponse({ id, username });
}

export async function handleLogout(req: Request) {
	const sessionToken = getTokenFromCookie(req);

	if (!sessionToken) {
		return new Response(null, { status: 400 });
	}

	const res = new Response(null, { status: 200 });

	deleteSessionTokenCookie(res);

	return res;
}
