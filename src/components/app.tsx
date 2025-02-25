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
		<div className="min-h-screen flex items-center justify-center bg-gradient-dark text-white">
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500 rounded-full opacity-20 blur-3xl"></div>
				<div className="absolute top-1/3 -left-20 w-72 h-72 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>
				<div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
			</div>
			<div className="w-full max-w-4xl relative z-10">
				{user ? <Home /> : <AuthForm />}
			</div>
		</div>
	);
}
