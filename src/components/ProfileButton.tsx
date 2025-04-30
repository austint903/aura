"use client"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"

interface Props{userId:string}

export default function ProfileButton({userId}:Props){
    const router=useRouter();
    return (
        <div>
            <Button onClick={() =>router.push(`/profile/${userId}`)} variant="white">
                Profile
            </Button>
        </div>
    ); 
}