import { createClient } from "@/auth/server";
import { NextResponse } from "next/server";

export async function GET() {
    //fetch restauratnts
    const supabase = await createClient();
    const { data: restaurants, error } = await supabase
        .from('Restaurants')
        .select('*');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(restaurants, { status: 200 });
}
export async function POST(request: Request) {
    const supabase = await createClient();
    try {
        const { name, description, latitude, longitude, image_url } = await request.json();

        //insert restaurant
        const { data, error } = await supabase
            .from('Restaurants')
            .insert({
                name, description, latitude, longitude, image_url
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