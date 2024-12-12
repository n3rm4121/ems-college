"user-client"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { signOut, useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Calendar, LogOut, User } from "lucide-react"

const UserProfile = () => {
  const { data: session } = useSession();

  return (
    session ? (
      <div className="absolute top-4 right-4 z-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center justify-center h-full w-full 
                         bg-indigo-100 rounded-full 
                         transition-all duration-300 
                         hover:bg-indigo-200 
                         focus:outline-none 
                         focus:ring-2 
                         focus:ring-indigo-400 
                         focus:ring-opacity-50 
                         active:scale-95"
            >
              <User 
                className="h-12 w-12 text-indigo-900 
                           transition-colors duration-300 
                           group-hover:text-indigo-700" 
              />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent 
            className="w-64 bg-white shadow-xl rounded-lg 
                       border border-gray-100 
                       animate-in slide-in-from-top-2 
                       ease-out duration-300"
          >
            {/* User Profile Section */}
            <DropdownMenuItem>
              <div className="cursor-default hover:bg-transparent">
                <div className="flex items-center space-x-3 p-2">
                  <div>
                    <div className="font-bold text-gray-800">
                      {session?.user?.name || 'User'}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {session?.user?.email || 'email@example.com'}
                    </div>
                  </div>
                </div>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* My Events Link */}
            <DropdownMenuItem asChild>
              <Link 
                href="/my-events" 
                prefetch={false}
                className="group flex items-center space-x-3 
                           px-3 py-2 
                           hover:bg-indigo-50 
                           transition-colors duration-200 
                           rounded-md"
              >
                <Calendar className="h-5 w-5 text-gray-500 group-hover:text-indigo-600" />
                <span className="text-gray-700 group-hover:text-indigo-800">
                  My Events
                </span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Logout Button */}
            <DropdownMenuItem asChild>
              <Button 
                onClick={() => signOut()}
                variant="ghost"
                className="w-full flex items-center space-x-3 
                           text-left text-red-600 
                           hover:bg-red-50 
                           hover:text-red-700 
                           transition-colors duration-200 
                           rounded-md"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ) : (
      <Button onClick={() => redirect('/auth/signin')} variant="outline" className="text-black">
        Login
      </Button>
    )
  );
};

export default UserProfile;
