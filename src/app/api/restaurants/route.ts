import { createClient } from "@/auth/server";
import { NextResponse } from "next/server";
import { getCurrentUserIdServer } from "@/app/shared/supabase/shared";

export async function GET() {
    //fetch restauratnts
    const supabase = await createClient();
    const { data: restaurants, error } = await supabase
        .from('Restaurants')
        .select('*, Users(username)');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(restaurants, { status: 200 });
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