"use client"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import UserLevel from './profilePointUI/UserLevel';
import { User } from 'lucide-react';

interface Restaurant{
    user_id:string;
}

export default function UserPoints() {  
    //get the uuid in the url
    const {id:profileId}=useParams();
    const [points, setPoints]=useState(0);
    const [loading, setLoading]=useState(false);
    const [error, setError]=useState("");

    async function fetchRestaurantPoints(){
        try{
            setLoading(true);
            const res=await fetch("/api/restaurants");
            if (!res.ok){
                throw new Error("Response is not ok");
            }
            const data:Restaurant[]=await res.json();
            //filter to get only the ones matching the current uuid
            const count=data.filter(restaurant=>restaurant.user_id==profileId).length;
            setPoints(count);
        }catch(err){
            setError("Failed to fetch restaurant points")
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchRestaurantPoints();
    },[profileId])

    
    return (    
        <div>
            {loading?"Loading": `Points: ${points}`}
            {error.length>0 && <p className="text-red-500">{error}</p>}
            <UserLevel points={points} />
        </div>
    )
}

