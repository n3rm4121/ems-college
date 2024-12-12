
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { signOut, useSession } from "next-auth/react"
import { redirect } from "next/navigation"

const UserProfile = () => {
  const { data: session } = useSession()
  return (
    session ? (
      <div className="absolute top-4 right-4 z-auto ">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-14 w-14 cursor-pointer text-black text-2xl">
              <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
              <AvatarFallback>JP</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-36 bg-white shadow-lg rounded-md">
            <DropdownMenuItem>
              <div className="font-semibold text-gray-800 px-4 py-2">John Doe</div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="#" className="block w-full text-left text-gray-700" prefetch={false}>
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Button onClick={() => signOut()} variant="outline" className="block w-full text-left text-black">
                Logout
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
  )
}

export default UserProfile;