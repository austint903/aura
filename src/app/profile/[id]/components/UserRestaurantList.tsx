"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Restaurant {
    id: string;
    name: string;
    description?: string | null;
    image_url:string;
    cuisine?: string | null;
    user_id: string;
}

export default function UserRestaurants() {
    const {id:profileId}=useParams();
    const [restaurants, setRestaurants]=useState<Restaurant[]>([]);
    const [loading, setLoading]=useState(false);
    const [error, setError]=useState("");

    async function fetchRestaurants(){
        try{
            setLoading(true);
            const res=await fetch("/api/restaurants");
            if (!res.ok){
                throw new Error("Response is not ok");
            }
            //fetches all restaurants
            const data: Restaurant[] = await res.json();
            //filter out restaruants with current profileId
            setRestaurants(data.filter((r)=>r.user_id===profileId));
            setError("");
        }catch(err){
            setError("failed to load restaurants");
        }finally{
            setLoading(false);
        }
    }

    //mount when profileId chnages
    useEffect(()=>{
        //only fetch if profileId!=null
        if(profileId){
            fetchRestaurants();
        }
    },[profileId])

    if (loading) {
        return <p>Loading restaurants...</p>
    }
    if (error){
        return <p>Error displaying restaurants</p>
    }

    return(
        <section>
            <h2>your restaurants</h2>
            {restaurants.length > 0 ? (
                <ul>
                    {restaurants.map((r)=>(
                        <li key={r.id}>
                            <h3>{r.name}</h3>
                            <p>{r.description}</p>
                            <p>{r.cuisine}</p>
                            {r.image_url && (
                                <img
                                    src={r.image_url}
                                    alt={r.name}
                                    width={400}
                                />
                            )}
                        </li>
                    ))}
                </ul>
            ):<p>"you haven't added any restaurants yet</p>}
        </section>

    )
}
