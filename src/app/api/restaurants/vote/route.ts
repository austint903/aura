import { createClient } from "@/auth/server";
import { NextResponse } from "next/server";
import { getCurrentUserIdServer } from "@/app/shared/supabase/shared";

//for this to work, we must have made an RLS policy that allowed authenticated users to update.
export async function POST(request: Request) {

    //retrieve the current user Id
    const userId = await getCurrentUserIdServer();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();

    try {
        const { id: restaurant_id } = await request.json();

        const { data: existingVote } = await supabase
            .from("RestaurantVotes")
            .select("*")
            .eq("restaurant_id", restaurant_id)
            .eq("user_id", userId)
            .single();

        //checks if the vote for that restaurant by that user is already done
        if (existingVote) {
            //removes the existing vote if it exists from supabase
            const { error: deleteError } = await supabase
                .from("RestaurantVotes")
                .delete()
                .match({ restaurant_id, user_id: userId });
            
            if (deleteError) {
                return NextResponse.json({ error: deleteError.message }, { status: 500 });
            }
            
            //call the function on restaurants table to decrement
            const { data, error: rpcError } = await supabase.rpc("decrement_total_points", { restaurant_id });
            
            if (rpcError) {
                return NextResponse.json({ error: rpcError.message }, { status: 500 });
            }  

            const updatedTotal = data[0]?.total_points; //value returned from the rpc is an array, take the first element, if data[0] exists then access total points, if not return undefined

            //if undefined or not a number, then throw error
            if (typeof updatedTotal !== "number") {
                return NextResponse.json({ error: "Unexpected response from RPC." }, { status: 500 });
            }
            
            //return the value total_points to frontend along with voted flag false (vote removed)
            return NextResponse.json({ total_points: updatedTotal, voted: false }, { status: 200 });
        }

        //insert the new vote with the user_id and restaraunt_id
        const { data: voteData, error: insertError } = await supabase
            .from("RestaurantVotes")
            .insert({ restaurant_id, user_id: userId })
            .single();

        if (insertError) {
            return NextResponse.json({ error: insertError.message }, { status: 500 });
        }

        //call the function on restaurants table to increment
        const { data, error: rpcError } = await supabase.rpc("increment_total_points", { restaurant_id });
        
        if (rpcError) {
            return NextResponse.json({ error: rpcError.message }, { status: 500 });
        }  

        const updatedTotal = data[0]?.total_points; //value returned from the rpc is an array, take the first element, if data[0] exists then access total points, if not return undefined
        
        //if undefined or not a number, then throw error
        if (typeof updatedTotal !== "number") {
            return NextResponse.json({ error: "Unexpected response from RPC." }, { status: 500 });
        }
        
        //return the value total_points to frontend along with voted flag true (vote added)
        return NextResponse.json({ total_points: updatedTotal, voted: true }, { status: 200 });

    } catch (err) {
        if (err instanceof Error) {
            return NextResponse.json({ error: err.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Unknown error occurred" }, { status: 400 });
    }
}
