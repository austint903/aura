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
    try{
        const {auth} =await createClient();
        const {error} = await auth.signOut();
        if (error) throw error;

        return {errorMessage:null}
    }catch(error){
        return handleError(error);
    }
};

export const signUpAction = async (email:string, password:string)=>{
    try{
        const supabase = await createClient();
        const {auth} = supabase;
        const {data, error} = await auth.signUp({
            email, 
            password,
        });
        if (error) throw error; 

        const userId = data.user?.id;
        if (!userId) throw new Error("There was an error signing up");


        //users to access site are anon, so just updated policy to allow both authenticated 
        // and anon to insert a new row into supabase.
        const { error: dbError } = await supabase
        .from("Users")
        .insert({ email });
        if (dbError) throw dbError;
    
        return {errorMessage:null};
    }catch(error){
        return handleError(error);
    }
};

