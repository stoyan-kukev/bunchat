import { LogOutButton } from "./auth/logout-button";

export function Home() {
	return (
		<div className="p-4 flex flex-col gap-y-4 bg-gray-200">
			<header className="flex justify-around items-center">
				<h1 className="font-bold text-3xl">Welcome to BunChat</h1>
				<LogOutButton />
			</header>
		</div>
	);
}
