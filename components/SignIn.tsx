"use client";

import { useState, ReactElement } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
<<<<<<< HEAD
import { 
  Mail as MailIcon, 
  Lock as LockIcon, 
  UserPlus as UserPlusIcon, 
  LogIn as LogInIcon, 
  CheckCircle2 as CheckCircleIcon,
  User as UserIcon 
=======
import {
  Mail as MailIcon,
  Lock as LockIcon,
  UserPlus as UserPlusIcon,
  LogIn as LogInIcon,
  CheckCircle2 as CheckCircleIcon
>>>>>>> 9c9ffaf7137b1fd6cc6415f92413f0e0d6dcd6fb
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Spinner from "@/components/Spinner";

const AuthPage = () => {
  const toast = useToast();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // Add username state
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const handleAuthentication = async (type: 'signIn' | 'signUp') => {
    setLoading(true);
    setError(null);
  
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        ...(type === 'signUp' ? { name: username } : {}), // Add name only for sign-up
        authType: type, // Ensure authType is being sent
      });
  
      if (res?.error) {
<<<<<<< HEAD
        // Display more detailed error message based on the response
        setError(
          res.error === "User with this email already exists"
            ? "An account with this email already exists"
            : res.error === "Invalid credentials"
              ? "Invalid email or password"
              : "Error creating account"
=======
        setError(type === 'signIn'
          ? "Invalid email or password"
          : "Error creating account"
>>>>>>> 9c9ffaf7137b1fd6cc6415f92413f0e0d6dcd6fb
        );
      } else {
        // After successful authentication, redirect to appropriate page
        if (type === 'signUp') {
          toast.toast({
            description: "Account created successfully!",
<<<<<<< HEAD
            variant: "default",
=======
            variant: "default"
>>>>>>> 9c9ffaf7137b1fd6cc6415f92413f0e0d6dcd6fb
          });
        }
        router.push(type === 'signIn' ? "/dashboard" : "/events");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setError(type === 'signIn'
        ? "Error signing in"
        : "Error creating account"
      );
    } finally {
      setLoading(false);
    }
  };
  


  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    // Reset username when switching modes
    setUsername("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
            {isSignUp ? (
              <>
                <UserPlusIcon size={28} className="text-green-500" />
                Create Account
              </>
            ) : (
              <>
                <LogInIcon size={28} className="text-blue-500" />
                Sign In
              </>
            )}
          </h1>
          <p className="text-gray-500 mt-2">
            {isSignUp
              ? "Join our Event Management System"
              : "Welcome back to EMS"}
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAuthentication(isSignUp ? 'signUp' : 'signIn');
          }}
          className="space-y-4"
        >
          {loading && <Spinner />}
<<<<<<< HEAD
          
          {/* Add username field only for signup */}
          {isSignUp && (
            <div className="relative">
              <Label 
                htmlFor="username" 
                className="flex items-center gap-2 text-gray-700 mb-1"
              >
                <UserIcon size={16} /> Username
              </Label>
              <Input
                type="text"
                id="username"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 py-3 border-gray-300 focus:border-blue-500 transition-all"
                required
              />
            </div>
          )}
=======
>>>>>>> 9c9ffaf7137b1fd6cc6415f92413f0e0d6dcd6fb

          <div className="relative">
            <Label
              htmlFor="email"
              className="flex items-center gap-2 text-gray-700 mb-1"
            >
              <MailIcon size={16} /> Email
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 py-3 border-gray-300 focus:border-blue-500 transition-all"
              required
            />
          </div>

          <div className="relative">
            <Label
              htmlFor="password"
              className="flex items-center gap-2 text-gray-700 mb-1"
            >
              <LockIcon size={16} /> Password
            </Label>
            <Input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 py-3 border-gray-300 focus:border-blue-500 transition-all"
              required
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          <Button
            type="submit"
            className="w-full py-3 mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <Spinner />
            ) : isSignUp ? (
              <>
                <UserPlusIcon size={20} /> Create Account
              </>
            ) : (
              <>
                <LogInIcon size={20} /> Sign In
              </>
            )}
          </Button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={toggleAuthMode}
              className="text-blue-600 hover:underline focus:outline-none"
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AuthPage;