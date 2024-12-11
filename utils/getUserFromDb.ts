import User, { IUser } from "@/models/user"
import { comparePassword } from "./saltAndHashPassword"
import dbConnect from "@/lib/db"

export const getUserFromDb = async (email: string, password: string) => {
    await dbConnect();
    console.log('inside getUserFromDb')
    const user = await User.findOne({ email });
    console.log("user: ", user)
    if (!user) return null
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) return null
    return user as IUser
}

