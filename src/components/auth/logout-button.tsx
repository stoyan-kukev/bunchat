export function LogOutButton() {
	const handleClick = async () => {
		await fetch("/api/logout", {
			credentials: "include",
		});

		window.location.href = "/";
	};

	return (
		<button
			className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white hover:cursor-pointer rounded-xl"
			onClick={handleClick}
		>
			Log Out
		</button>
	);
}
