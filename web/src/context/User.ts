import { createContext } from "react";
import { TAuth0User } from "../types/TAuth0User";

const UserContext = createContext<[TAuth0User | null, boolean]>([null, false]);

export const UserProvider = UserContext.Provider;
export default UserContext;
