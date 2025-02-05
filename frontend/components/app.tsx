import { useEffect } from "react";
import { AuthForm } from "./auth/auth-form";
import { Home } from "./home";
import { RoomProvider } from "./room/room-context";
import { AuthProvider, useAuth } from "./auth/auth-context";

export function App() {
	const { user, setUser } = useAuth()!;

	useEffect(() => {
		fetch("http://localhost:1337/api/user/check", {
			credentials: "include",
		}).then(async (res) => {
			if (res.status == 200) {
				const { id, username } = await res.json();
				setUser({ id, username });
			}
		});
	}, []);

	return (
		<AuthProvider>
			<RoomProvider>
				<div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
					<div className="w-full max-w-4xl">
						{user ? <Home /> : <AuthForm />}
					</div>
				</div>
			</RoomProvider>
		</AuthProvider>
	);
}
