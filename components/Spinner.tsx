'use client'
export default function Spinner() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="spinner border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
    );
}