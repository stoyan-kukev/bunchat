import "./style.css";
import { createRoot } from "react-dom/client";
import { App } from "./app.tsx";
import { AuthProvider } from "../context/auth-context.tsx";
import { RoomProvider } from "../context/room-context.tsx";

document.addEventListener("DOMContentLoaded", () => {
	const root = createRoot(document.getElementById("root")!);
	root.render(
		<AuthProvider>
			<RoomProvider>
				<App />
			</RoomProvider>
		</AuthProvider>
	);
});
