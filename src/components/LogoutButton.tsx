"use client";
import { toast } from "sonner";
import { Button } from "./ui/button"
import { useRouter } from "next/navigation";
import { logoutAction } from "@/actions/user";
function LogoutButton() {
    const router=useRouter();
    const handleLogout=async ()=>{
        console.log("Logging out");
        const {errorMessage} = await logoutAction();

        if (!errorMessage){
            toast("Successfully logged out");
            router.replace("/login");
        }
        else{
            toast("Error logging out");
        }
    };
  return (
    <Button variant="white" onClick={handleLogout}> Logout</Button>
  )
}

export default LogoutButton
