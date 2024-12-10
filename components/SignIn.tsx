"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Spinner from "@/components/Spinner";

const SignInPage = () => {
  const toast = useToast();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [accountCreated, setAccountCreated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);  // Show loading spinner during submission

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password");
        setLoading(false);
      } else {
        router.push("/dashboard");  // Redirect to dashboard or homepage after successful sign-in
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError("Error signing in.");
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
      });

      if (!res?.error) {
        setLoading(false);
        setAccountCreated(true);
        toast.toast({ description: "Account created successfully!" });
      } else {
        setLoading(false);
        setError("Error creating account.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setLoading(false);
      setError("Error creating account.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-lg">
      {loading && <Spinner />}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-lg font-semibold">Email</Label>
          <Input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <Label htmlFor="password" className="text-lg font-semibold">Password</Label>
          <Input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="space-x-4">
          <Button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
          <Button
            type="button"
            className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
            onClick={handleSignUp}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>
        </div>
      </form>

      {accountCreated && <p className="text-green-500 mt-4 text-center">Account created successfully! Please sign in.</p>}
    </div>
  );
};

export default SignInPage;
