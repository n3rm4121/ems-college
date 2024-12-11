import dbConnect from "@/lib/db";
import User from "@/models/user"; // Adjust the path based on your project structure

interface UserInput {
  email: string;
  password: string;
  role?: "teacher" | "student"; // Optional to allow flexibility
}

export const createUserInDb = async (userInput: UserInput) => {
  await dbConnect();
  console.log("inside createUserInDb");
  const { email, password, role = "student" } = userInput; // Default role is "student"

  console.log(userInput);

  // Create and save the new user
  const newUser = new User({
    email,
    password, // Password should be hashed before passing here
    role,
  });

  await newUser.save();
  console.log("New User:", newUser);

  return newUser;
};
