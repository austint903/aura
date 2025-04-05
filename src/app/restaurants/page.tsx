"use client";

//client component since we need to use useEffect and browser specific APIs

import { useState, useEffect, FormEvent } from "react";

interface Restaurant {
    id: string;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    image_url: string;
}

interface User {
    first_name: string;
    last_name: string;
}

export default function RestaurantsPage() {
    const [form, setForm] = useState({
        name: "",
        description: "",
        latitude: "",
        longitude: "",
        image_url: "",
    });
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    //fetch resturants
    async function fetchRestaurants() {
        setLoading(true);
        try {
            const res = await fetch("/api/restaurants");
            const data = await res.json();
            setRestaurants(data);
        } catch (err) {
            setError("Error fetching restaurants");
        }
        setLoading(false);
    }

    // runs on component mount
    useEffect(() => {

        fetchRestaurants();
    }, []);

    // form submission for resturants
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch("/api/restaurants", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    description: form.description,
                    // convert
                    latitude: parseFloat(form.latitude),
                    longitude: parseFloat(form.longitude),
                    image_url: form.image_url,
                }),
            });
            const result = await res.json();
            if (!res.ok) {
                setError(result.error || "Error adding restaurant");
            } else {
                // clear the restaurant form
                setForm({
                    name: "",
                    description: "",
                    latitude: "",
                    longitude: "",
                    image_url: "",
                });
                //fetch restaurants again
                fetchRestaurants();
            }
        } catch (err) {
            setError("Error adding restaurant");
        }
    }



    return (
        <div>
            <h1 className="mb-4">Add a Restaurant</h1>
            <form onSubmit={handleSubmit}>
                <input
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) =>
                        setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                />
                <br />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) =>
                        setForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                />
                <br />
                <input
                    name="latitude"
                    placeholder="Latitude"
                    value={form.latitude}
                    onChange={(e) =>
                        setForm((prev) => ({ ...prev, latitude: e.target.value }))
                    }
                />
                <br />
                <input
                    name="longitude"
                    placeholder="Longitude"
                    value={form.longitude}
                    onChange={(e) =>
                        setForm((prev) => ({ ...prev, longitude: e.target.value }))
                    }
                />
                <br />
                <input
                    name="image_url"
                    placeholder="Image URL"
                    value={form.image_url}
                    onChange={(e) =>
                        setForm((prev) => ({ ...prev, image_url: e.target.value }))
                    }

                />
                <br />
                <button className="mb-4" type="submit">Add Restaurant</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <h2>Restaurants List</h2>
            {loading ? (
                <p>Loading restaurants...</p>
            ) : (
                <ul>
                    {restaurants.map((restaurant) => (
                        <li key={restaurant.id}>
                            <h3>{restaurant.name}</h3>
                            <p>{restaurant.description}</p>
                            <p>
                                Location: {restaurant.latitude}, {restaurant.longitude}
                            </p>
                            {restaurant.image_url && (
                                <img
                                    src={restaurant.image_url}
                                    alt={restaurant.name}
                                    width={400}
                                    className="mb-4"
                                />
                            )}


                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}