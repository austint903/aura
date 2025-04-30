"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

interface Restaurant {
    id: string;
    name: string;
    description?: string | null;
    image_url: string;
    cuisine?: string | null;
    user_id: string;
}



export default function LikedRestaurants() {
    const { id: profileId } = useParams();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    return (
        <div>
            Liked Restaurants
        </div>
    )
}
