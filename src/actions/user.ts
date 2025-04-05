"use server"

import { createClient } from "@/auth/server";
import { handleError } from "@/lib/utils";

export const loginAction = async (email: string, password: string) => {
    try {
        //destructures auth
        const { auth } = await createClient();

        const { error } = await auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;

        return { errorMessage: null };
    } catch (error) {
        return handleError(error);
    }
};

export const logoutAction = async () => {
    try {
        const { auth } = await createClient();
        const { error } = await auth.signOut();
        if (error) throw error;

        return { errorMessage: null }
    } catch (error) {
        return handleError(error);
    }
};
export const signUpAction = async (
    email: string,
    password: string,
    first_name: string,
    last_name: string
) => {
    try {
        if (!email.toLowerCase().endsWith('.edu')) {
            return { errorMessage: "Please use a .edu email address" };
        }
        const supabase = await createClient();
        const { auth } = supabase;

        //checks for duplicate users
        const { data: existingUsers, error: selectError } = await supabase
            .from("Users")
            .select("id")
            .eq("email", email);

        if (selectError) throw selectError;

        if (existingUsers && existingUsers.length > 0) {
            return { errorMessage: "User already exists, please login instead." };
        }

        const { data, error } = await auth.signUp({
            email,
            password,
        });
        if (error) throw error;

        const userId = data.user?.id;
        if (!userId) throw new Error("There was an error signing up");

        // insert new user
        const { error: dbError } = await supabase
            .from("Users")
            .insert({ email, first_name, last_name });
        if (dbError) throw dbError;

        return { errorMessage: null };
    } catch (error) {
        return handleError(error);
    }
};