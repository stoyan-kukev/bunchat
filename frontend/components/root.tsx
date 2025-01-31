import { useEffect, useState } from "react";
import { AuthForm } from "./auth/auth-form";
import { LogOutButton } from "./auth/logout-button";
import { UserContext } from "./auth/auth-context";
import type { User } from "../../types";

export function Root() {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		fetch("http://localhost:1337/api/user/check", {
			credentials: "include",
		}).then(async (res) => {
			if (res.status == 200) {
				const { id, username } = await res.json();
				setUser({ id, username });
			}
		});
	}, []);

	return (
		<UserContext.Provider value={{ user }}>
			<div>{user ? <LogOutButton /> : <AuthForm />}</div>
		</UserContext.Provider>
	);
}
