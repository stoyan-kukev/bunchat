import { useState, type FormEvent } from "react";

export function LoginForm() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<{
		username?: string | null;
		password?: string | null;
		login?: string | null;
	}>({});

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		setErrors({ username: null, password: null, login: null });

		if (username.length < 2 || username.length > 63) {
			setErrors({
				...errors,
				username: "Username must be between 2 and 63 characters long",
			});
			return;
		}

		if (password.length < 6 || password.length > 255) {
			setErrors({
				...errors,
				password: "Password must be between 6 and 255 characters long",
			});
			return;
		}

		const response = await fetch("/api/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username, password }),
			credentials: "include",
		});

		if (response.status == 400) {
			const resError = await response.json();
			setErrors({
				...errors,
				login: resError.login,
			});
			return;
		}

		window.location.href = "/";
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
			<div className="flex gap-x-4 flex-col">
				<label
					htmlFor="username"
					className="text-white font-medium mb-1"
				>
					Username
				</label>
				<input
					className="glass-lighter rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
					type="text"
					name="username"
					id="username"
					onChange={(e) => setUsername(e.target.value)}
					placeholder="Enter your username"
				/>
				{errors.username && (
					<p className="text-red-400 text-sm mt-1">
						{errors.username}
					</p>
				)}
			</div>
			<div className="flex gap-x-4 flex-col mt-2">
				<label
					htmlFor="password"
					className="text-white font-medium mb-1"
				>
					Password
				</label>
				<input
					className="glass-lighter rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
					type="password"
					name="password"
					id="password"
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Enter your password"
				/>
				{errors.password && (
					<p className="text-red-400 text-sm mt-1">
						{errors.password}
					</p>
				)}
			</div>
			{errors.login && (
				<p className="text-red-400 text-sm mt-1">{errors.login}</p>
			)}
			<button
				className="px-4 py-3 bg-gradient-accent hover:opacity-90 text-white rounded-lg mt-4 font-medium transition-all duration-200"
				type="submit"
			>
				Login
			</button>
		</form>
	);
}
