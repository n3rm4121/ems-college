import dbConnect from "@/lib/db";
import User from "@/models/user"; // Adjust path based on your project structure

interface UserInput {
  email: string;
  password: string;
}

export const createUserInDb = async (userInput: UserInput) => {
  await dbConnect();
  console.log("inside createUserInDb");
  const { email, password } = userInput;
  console.log(userInput)

  // Create and save the new user
  const newUser = new User({
    email,
    password,  // Password is already hashed before passing here
    role: "user", // Set default role as 'user' or adjust based on your needs
  });

  await newUser.save();
  console.log(newUser)

  return newUser;
};
