import type { Middleware } from "../../types";

const ALLOWED_ORIGINS = new Set([
	"http://localhost:1337",
	"http://localhost:3000",
]);

export const cors: Middleware = (handler) => async (req) => {
	const origin = req.headers.get("Origin");
	const corsHeaders = new Headers({
		"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type, Authorization",
		"Access-Control-Max-Age": "86400",
	});

	if (origin && ALLOWED_ORIGINS.has(origin)) {
		corsHeaders.set("Access-Control-Allow-Origin", origin);
		corsHeaders.set("Access-Control-Allow-Credentials", "true");
		corsHeaders.set("Vary", "Origin");
	}

	if (req.method === "OPTIONS") {
		return new Response(null, { status: 204, headers: corsHeaders });
	}

	const response = await handler(req);

	// Add CORS headers to the response
	corsHeaders.forEach((value, key) => {
		response.headers.set(key, value);
	});

	return response;
};
