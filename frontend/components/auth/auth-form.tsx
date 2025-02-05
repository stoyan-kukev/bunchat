import { useState } from "react";
import { SignUpForm } from "./signup-form";
import { LoginForm } from "./login-form";
import { clsx } from "clsx";

export function AuthForm() {
	const [signSelected, setSignSelected] = useState(true);

	return (
		<div className="flex justify-center items-center min-h-screen">
			<div className="flex flex-col min-w-[25%] gap-y-8">
				<div className="grid grid-cols-2 text-center">
					<button
						onClick={() => setSignSelected(false)}
						className={clsx([
							signSelected ? "bg-gray-700" : "bg-gray-800",
							"px-4 py-2 rounded-l-xl cursor-pointer",
						])}
					>
						Login
					</button>
					<button
						className={clsx([
							signSelected ? "bg-gray-800" : "bg-gray-700",
							"px-4 py-2 rounded-r-xl cursor-pointer",
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
