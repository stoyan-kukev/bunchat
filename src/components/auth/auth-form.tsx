import { useState } from "react";
import { SignUpForm } from "./signup-form";
import { LoginForm } from "./login-form";
import { clsx } from "clsx";
import { BunLogo } from "../bun-logo";

export function AuthForm() {
	const [signSelected, setSignSelected] = useState(true);

	return (
		<div className="flex justify-center items-center min-h-screen">
			<div className="glass rounded-xl p-8 min-w-[350px] animate-fade-in">
				<div className="flex justify-center mb-6">
					<BunLogo className="size-16 text-indigo-400" />
				</div>
				<h2 className="text-2xl font-bold text-center mb-6 text-white">
					Welcome to BunChat
				</h2>

				<div className="grid grid-cols-2 text-center mb-8">
					<button
						onClick={() => setSignSelected(false)}
						className={clsx([
							"px-4 py-2 rounded-l-full cursor-pointer transition-colors duration-200",
							signSelected
								? "glass-lighter text-gray-300"
								: "bg-gradient-accent text-white font-medium",
						])}
					>
						Login
					</button>
					<button
						className={clsx([
							"px-4 py-2 rounded-r-full cursor-pointer transition-colors duration-200",
							signSelected
								? "bg-gradient-accent text-white font-medium"
								: "glass-lighter text-gray-300",
						])}
						onClick={() => setSignSelected(true)}
					>
						Sign Up
					</button>
				</div>
				<div>{signSelected ? <SignUpForm /> : <LoginForm />}</div>
			</div>
		</div>
	);
}
