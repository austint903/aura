"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

interface Restaurant{
    id:string;
    name:string;
    description:string;
    image_url:string;
    cuisine:string;
    is_owner:boolean;
}
export default function LikedRestaurants() {
    //extract uuid from link
    const {id:profileId}=useParams();
    const[restaurants,setRestaurants]=useState<Restaurant[]>([]);
    const [loading, setLoading]=useState(false);
    const [error, setError]=useState("");

    async function fetchLiked(){
        try{
            setLoading(true)
            const res=await fetch("/api/restaurants?liked=true");
            if(!res.ok){
                throw new Error("Response is not ok");
            }
            const data:Restaurant[] = await res.json();
            setRestaurants(data);
        }catch(err){
            setError("Failed to load liked restaurants");
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(profileId){
            fetchLiked();
        }
    },[profileId])

    if (loading){
        return <p>Loading Liked Restaurants...</p>
    }
    if(error){
        return <p>{error}</p>
    }
  return (
    <div>
        <section>
            <h1>Liked Restaurants</h1>
            {restaurants.length>0 ? (
                <ul>
                    {restaurants.map((r)=>(
                        <li
                            key={r.id}
                        >
                            <img 
                            src={r.image_url}
                            alt={r.name}
                            width={400}
                            />
                            <div className="p-4">
                                <h1>{r.name}</h1>
                                <p>{r.description}</p>
                                <p>{r.cuisine}</p>
                                {r.is_owner&&(
                                    <p>Your restaurant</p>
                                )}
                                
                            </div>
                        </li>
                    ))}
                </ul>
            ): (
                <p>No liked restaurants yet!</p>
            )}
           
        </section>
    </div>
  )
}

