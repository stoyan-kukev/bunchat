export function LogOutButton() {
	const handleClick = async () => {
		await fetch("/api/logout", {
			credentials: "include",
		});

		window.location.href = "/";
	};

	return (
		<button
			className="px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white hover:cursor-pointer rounded-full transition-colors duration-200 font-medium"
			onClick={handleClick}
		>
			Log Out
		</button>
	);
}
