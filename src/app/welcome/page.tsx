"use client";

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

//add later -- > if user is logged in, when they access welcome, chnage the login to logout. 
function WelcomePage() {
    const router=useRouter();

    const handleWelcomeLogin =()=>{
        router.push("/login");
    }

    const handleWelcomeRegister = () => {
        router.push("/sign-up");
    }

    return (
        <div>
            Welcome.
            <p>
                For college students, by college students. 
            </p>
            <div>
                <Button variant={"white"} onClick={handleWelcomeLogin}> Login</Button>
                <Button variant={"white"} onClick={handleWelcomeRegister}> Register</Button>
            </div>
        </div>
    )
}

export default WelcomePage
