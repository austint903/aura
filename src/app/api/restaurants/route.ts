import { createClient } from "@/auth/server";
import { NextResponse } from "next/server";
import { getCurrentUserIdServer } from "@/app/shared/supabase/shared";

export async function GET(request: Request) {
    //fetch restauratnts
    const supabase = await createClient();
    const user_id = await getCurrentUserIdServer();
    //filter the cuisine by api url link
    //get new url and get everything after the ? like ?cuisine=Thai
    const url = new URL(request.url);
    //only look for the cuisine field and return that value
    const cuisine = url.searchParams.get("cuisine");
    const liked = url.searchParams.get("liked")==="true"; 
    const school=url.searchParams.get("school");
    const price=url.searchParams.get("price");

    //if url has liked 
    if (liked){
        //get all restaurant id that have the user id
        const {data:votes, error:voteErr}=await supabase.from("RestaurantVotes").select("restaurant_id").eq("user_id", user_id);
        if (voteErr) return NextResponse.json({error:voteErr.message}, {status:500});

        //get array of all restaurant ids
        const restaurantIDS=votes.map(v=>v.restaurant_id);
        if (!restaurantIDS.length)return NextResponse.json([],{status:200});

        //query restaurant tables to get all restaurants (info) in the array
        const {data:restarurants, error:restErr} =await supabase.from("Restaurants").select("*, Users(username)").in("id", restaurantIDS);

        if(restErr) return NextResponse.json({error:restErr.message}, {status:500});

        //return a map of the restaurants to the user
        return NextResponse.json(
            restarurants.map((r)=>({
                ...r,
                is_owner:r.user_id===user_id,
            }))
        )
    }

    //select all rows from the resturant, if no cuisine filter is passed 
    let query = supabase.from("Restaurants").select("*, Users(username)");
    //if cuisine is passed as a filter
    if (cuisine) {
        //append .eq() to the query
        query = query.eq("cuisine", cuisine);
    }
    if (school){
        query=query.eq("school", school);
    }
    if(price){
        query=query.eq("price", price);
    }
    const { data: restaurants, error } = await query;
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const mapped = restaurants.map((r) => ({
        ...r,
        //if created restaurabnt, then have ability to delete, each restarurant now has a boolean of is_owner,
        is_owner: r.user_id === user_id,
    }));
    return NextResponse.json(mapped, { status: 200 });
}
export async function POST(request: Request) {
    const supabase = await createClient();
    try {
        const { name, description, latitude, longitude, image_url, cuisine, school, price} = await request.json();
        const user_id = await getCurrentUserIdServer();
        //insert restaurant
        const { data, error } = await supabase
            .from('Restaurants')
            .insert({
                name, description, latitude, longitude, image_url, user_id, cuisine,school,price 
            })
            .single();

        if (error) {
            throw error;
        }
        return NextResponse.json(data, { status: 201 });
    } catch (err) {
        if (err instanceof Error) {
            return NextResponse.json({ error: err.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Unknown error occurred" }, { status: 400 });
    }
}

export async function DELETE(request: Request) {
    try {
        //get the restaurant id
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: "Restaurant not found" }, { status: 400 });
        }

        //get user id
        const user_id = await getCurrentUserIdServer();
        if (!user_id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const supabase = await createClient();

        //delete the row
        const { data, error } = await supabase.from("Restaurants").delete().eq("id", id).eq("user_id", user_id).maybeSingle();
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }


        return NextResponse.json({ message: "Restaurant deleted successfully" }, { status: 200 });

    } catch (err) {
        if (err instanceof Error) {
            return NextResponse.json({ error: err.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Unknown error occurred" }, { status: 400 });
    }
}