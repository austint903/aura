import { createClient } from "@/auth/server";
import { NextResponse } from "next/server";
import { getCurrentUserIdServer } from "@/app/shared/supabase/shared";

export async function GET() {
    //fetch restauratnts
    const supabase = await createClient();
    const user_id = await getCurrentUserIdServer();
    const { data: restaurants, error } = await supabase
        .from('Restaurants')
        .select('*, Users(username)');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const mapped = restaurants.map((r) => ({
        ...r,
        is_owner: r.user_id === user_id,
      }));
    return NextResponse.json(mapped, { status: 200 });
}
export async function POST(request: Request) {
    const supabase = await createClient();
    try {
        const { name, description, latitude, longitude, image_url } = await request.json();
        const user_id=await getCurrentUserIdServer();
        //insert restaurant
        const { data, error } = await supabase
            .from('Restaurants')
            .insert({
                name, description, latitude, longitude, image_url, user_id
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

export async function DELETE(request:Request){
    try{
        //get the restaurant id
        const {id}=await request.json();

        if (!id) {
            return NextResponse.json({ error: "Restaurant not found" }, { status: 400 });
        }
        
        //get user id
        const user_id=await getCurrentUserIdServer();
        if (!user_id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const supabase=await createClient();

        //delete the row
        const {data,error}=await supabase.from("Restaurants").delete().eq("id",id).eq("user_id",user_id).maybeSingle(); 
        if(error){
            return NextResponse.json({error:error.message}, {status:400})
        }
      
      
        return NextResponse.json({ message: "Restaurant deleted successfully" }, { status: 200 });
        
    }catch (err) {
        if (err instanceof Error) {
            return NextResponse.json({ error: err.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Unknown error occurred" }, { status: 400 });
    }
}