import { useState, type FormEvent } from "react";

export function SignUpForm() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<{
		username?: string | null;
		password?: string | null;
		signup?: string | null;
	}>({});

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		setErrors({ username: null, password: null });

		if (username.length < 2 || username.length > 63) {
			setErrors({
				...errors,
				username: "Username must be between 2 and 63 charachters long",
			});
			return;
		}

		if (password.length < 6 || password.length > 255) {
			setErrors({
				...errors,
				password: "Password must be between 6 and 255 charachters long",
			});
			return;
		}

		const response = await fetch("http://localhost:1337/api/signup", {
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
				signup: resError.signup,
			});
			return;
		}

		window.location.href = "http://localhost:3000/";
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
			<div className="flex gap-x-4 flex-col">
				<label htmlFor="username" className="text-lg">
					Username
				</label>
				<input
					className="border rounded-lg px-2 py-1"
					type="text"
					name="username"
					id="username"
					onChange={(e) => setUsername(e.target.value)}
				/>
				{errors.username && (
					<p className="text-red-500">{errors.username}</p>
				)}
			</div>
			<div className="flex gap-x-4 flex-col">
				<label htmlFor="password" className="text-lg">
					Password
				</label>
				<input
					className="border rounded-lg px-2 py-1"
					type="text"
					name="password"
					id="password"
					onChange={(e) => setPassword(e.target.value)}
				/>
				{errors.password && (
					<p className="text-red-500">{errors.password}</p>
				)}
			</div>
			{errors.signup && <p className="text-red-500">{errors.signup}</p>}
			<button
				className="px-4 py-2 bg-green-400 hover:bg-green-500 text-white rounded-lg"
				type="submit"
			>
				Submit
			</button>
		</form>
	);
}
