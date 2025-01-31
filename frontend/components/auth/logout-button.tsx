import { useContext } from "react";
import { UserContext } from "./auth-context";

export function LogOutButton() {
	const handleClick = async () => {
		const res = await fetch("http://localhost:1337/api/logout", {
			credentials: "include",
		});

		if (res.status == 200) window.location.href = "http://localhost:3000/";
	};

	const { user } = useContext(UserContext);
	const { username, id } = user!;

	return (
		<div>
			Hello {username} with id {id}
			<br />
			<button onClick={handleClick}>Log Out</button>
		</div>
	);
}
