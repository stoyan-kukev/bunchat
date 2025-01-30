import homepage from "./pages/index.html";
import { file } from "bun";

const server = Bun.serve({
	static: {
		"/": homepage,
	},

	development: true,

	async fetch() {
		return new Response(file("./pages/404.html"));
	},
	port: 3000,
});

console.log(`⚛️ Frontend listening on ${server.hostname}:${server.port}`);
