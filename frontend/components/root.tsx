import { useEffect, useState } from "react";
import { AuthForm } from "./auth/auth-form";
import { LogOutButton } from "./auth/logout-button";

export function Root() {
	const [isAuthed, setIsAuthed] = useState(false);

	useEffect(() => {
		fetch("http://localhost:1337/api/user/check", {
			credentials: "include",
		}).then((res) => setIsAuthed(res.status == 200));
	}, []);

	return <div>{isAuthed ? <LogOutButton /> : <AuthForm />}</div>;
}
