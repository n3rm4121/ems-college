import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Unauthorized: React.FC = () => {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-red-500 mb-4">Access Denied</h1>
            <p className="text-lg text-gray-700 mb-6">
                You do not have permission to view this page.
            </p>
            <Button
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => router.push("/")}
            >
                Go to Homepage
            </Button>
        </div>
    );
};

export default Unauthorized;
