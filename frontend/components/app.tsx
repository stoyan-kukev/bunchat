import { useEffect, useState } from "react";
import { AuthForm } from "./auth/auth-form";
import { UserContext } from "./auth/auth-context";
import type { User } from "../../backend/utils/auth";
import { Home } from "./home";
import { RoomProvider } from "./room/room-context";

export function App() {
	const [user, setUser] = useState<User | null>(null);

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
		<UserContext.Provider value={{ user }}>
			<RoomProvider>
				<div className="min-w-screen min-h-screen">
					<div className="max-w-4xl mx-auto">
						{user ? <Home /> : <AuthForm />}
					</div>
				</div>
			</RoomProvider>
		</UserContext.Provider>
	);
}
