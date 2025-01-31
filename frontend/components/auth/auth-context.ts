import { createContext } from "react";
import type { User } from "../../../types";

export const UserContext = createContext<{ user: User | null }>({ user: null });
