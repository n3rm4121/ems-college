import { SignIn } from "@/components/SignIn";
import { Button } from "@/components/ui/button";
import dbConnect from "@/lib/db";
export default function Home() {

  return (
    <div>
      <Button>Click me</Button>
      <SignIn />
    </div>
  )
}
