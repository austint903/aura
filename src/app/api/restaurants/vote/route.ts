import { createClient } from "@/auth/server";
import { NextResponse } from "next/server";

//for this to work, we must have made an RLS policy that allowed authneticated users to update.
export async function POST(request: Request) {
  const supabase = await createClient();
  try {
    //retrieve restaurant uuid from api request from clinet
    const { id } = await request.json(); 
    //calls supabase function
    const { data, error } = await supabase.rpc("increment_total_points", { restaurant_id: id });
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    //if nothing was retruned from supabase
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return NextResponse.json({ error: "no data was returned" }, { status: 500 });
    }
    
    //gets the total points
    const updatedRecord = data[0];
    updatedRecord.total_points = Number(updatedRecord.total_points);
    return NextResponse.json(updatedRecord, { status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "unknown error" }, { status: 400 });
  }
}

