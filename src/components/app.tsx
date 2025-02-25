import { useEffect } from "react";
import { AuthForm } from "./auth/auth-form";
import { Home } from "./home";
import { useAuth } from "../context/auth-context";

export function App() {
	const { setUser, user } = useAuth()!;

	useEffect(() => {
		fetch("/api/user/check", {
			credentials: "include",
		}).then(async (res) => {
			if (res.status == 200) {
				const { id, username } = await res.json();
				setUser({ id, username });
			}
		});
	}, []);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
			<div className="w-full max-w-4xl">
				{user ? <Home /> : <AuthForm />}
			</div>
		</div>
	);
}
