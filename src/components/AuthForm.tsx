"use client"
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CardContent, CardFooter } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { loginAction, signUpAction } from "@/actions/user";
import React from "react";

type Props = {
    type: "login" | "register";
};

function AuthForm({ type }: Props) {
    const isLoginForm = type === "login";
    const router = useRouter();
    const [isPending, startTransition] = useTransition();


    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;

            //get first name and last name
            let first_name = "";
            let last_name = "";
            if (!isLoginForm) {
                first_name = formData.get("first_name") as string;
                last_name = formData.get("last_name") as string;
            }

            let errorMessage;
            let title;
            let description;
            if (isLoginForm) {
                errorMessage = (await loginAction(email, password)).errorMessage;
                title = "Logged in";
                description = "You are logged in";
            } else {
                errorMessage = (await signUpAction(email, password, first_name, last_name)).errorMessage;
                title = "signed up";
                description = "Please check email for confirmation link";
            }

            if (!errorMessage) {
                toast(description);
                if (!isLoginForm) {
                    router.replace("/login");
                } else {
                    router.replace("/");
                }
            } else {
                toast(errorMessage);
            }
        });
    };

    return (
        <form action={handleSubmit}>
            <CardContent className="grid w-full items-center gap-4">
                
                {!isLoginForm && (
                    <>
                        {/* if login form */}
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="first_name">First Name</Label>
                            <Input
                                id="first_name"
                                name="first_name"
                                placeholder="Enter your first name"
                                required
                                disabled={isPending}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="last_name">Last Name</Label>
                            <Input
                                id="last_name"
                                name="last_name"
                                placeholder="Enter your last name"
                                required
                                disabled={isPending}
                            />
                        </div>
                    </>
                )}
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" placeholder="Enter your email" type="email" required disabled={isPending} />
                </div>
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" placeholder="Enter your password" type="password" required disabled={isPending} />
                </div>
            </CardContent>

            <CardFooter className="mt-4 flex flex-col gap-6">
                <Button variant="white" className="w-full border border-gray-700">
                    {isPending ? (<Loader2 className="animate-spin" />) : isLoginForm ? ("Login") : ("Sign-Up")}
                </Button>
                <p className="text-xs">
                    {isLoginForm ? "Don't have an account yet?" : "Already have an account?"}{" "}
                    <Link
                        href={isLoginForm ? "/sign-up" : "/login"}
                        className={`text-blue-500 underline ${isPending ? "pointer-events-none opacity-50" : ""}`}
                    >
                        {isLoginForm ? "Sign-up" : "Login"}
                    </Link>
                </p>
            </CardFooter>
        </form>
    )
}

export default AuthForm;
