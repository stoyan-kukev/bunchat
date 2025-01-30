export function LogOutButton() {
	const handleClick = async () => {
		const res = await fetch("http://localhost:1337/api/logout", {
			credentials: "include",
		});

		if (res.status == 200) window.location.href = "http://localhost:3000/";
	};

	return <button onClick={handleClick}>Log Out</button>;
}
