import dbConnect from "@/lib/db";
import User,{IUser} from "@/models/user";

interface UserInput {
  name: Object;
  email: string;
  password: string;
  role?: "teacher" | "student";
}

export const createUserInDb = async (userInput: UserInput) :Promise<IUser>=> {
  await dbConnect();
  const {name, email, password, role = "student" } = userInput;

  // Check for duplicate account
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Create and save the new user
  try {
    const newUser = new User({
      name,
      email,
      password, // Ensure password is hashed before saving
      role,
    });
    await newUser.save();
    return newUser;
  } catch (error) {
    if ((error as any).code === 11000) {
      throw new Error("User with this email already exists");
    }
    throw error;
  }
};