import User, { IUser } from "@/models/user"
import { comparePassword } from "./saltAndHashPassword"

export const getUserFromDb = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user) return null
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) return null
    return user as IUser
}

