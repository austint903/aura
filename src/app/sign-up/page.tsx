import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import AuthForm from "@/components/AuthForm";
function SignUpPage() {
    return (
        <div className="mt-20 flex flex-1 flex-col items-center">
            <Card className="w-full max-w-md">
                <CardHeader className=""></CardHeader>
                <CardTitle className="text-center text-3xl"> Register</CardTitle>
                <AuthForm type="register"/>
            </Card>

        </div>
    )
}

export default SignUpPage;
