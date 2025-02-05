import { createContext } from "react";
import type { User } from "../../../backend/utils/auth";

export const UserContext = createContext<{ user: User | null }>({ user: null });
