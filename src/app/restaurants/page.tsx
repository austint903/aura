"use client";
//client component since we need to use useEffect and browser specific APIs

import { useState, useEffect, FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

import DeleteRestaurantButton from "@/components/DeleteRestaurantButton";

interface Restaurant {
    id: string;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    image_url: string;
    total_points: number;
    cuisine: string;
    school:string;
    voted?: boolean; //flag to see if a restaurant is voted for or not
    username?: string; //username of the user who added the restaurant
    is_owner: boolean;
}
export default function RestaurantsPage() {
    //add more if needed
    const cuisineOptions = [
        "Chinese",
        "Thai",
        "Japanese",
        "Indian",
        "American",
        "Soul Food",
        "Korean",
        "Mexican",
    ];

    const schoolOptions=[
        "NYU",
        "Columbia",
    ];

    const [form, setForm] = useState({
        name: "",
        description: "",
        latitude: "",
        longitude: "",
        image_url: "",
        cuisine: "",
        school:"",
    });
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    //tracks the filter if selected.
    const [filterCuisine, setFilterCuisine] = useState<string>("");

    const [filterSchool, setFilterSchool]=useState<string>("");

    const filters={
        cuisine:filterCuisine||undefined,
        school:filterSchool||undefined,
    }
    //general function to build filter parameters for api url
    function generalFetchUrl(){
        const params=new URLSearchParams();
        for ( const [key,value] of Object.entries(filters)){
            if (value!=null&&value!=""){
                //append to params, (key=value)
                params.append(key,value)
            }
        }
        const final=params.toString();
        //use /api/restaurants? so everything after ? are parameters
        return final ? `/api/restaurants?${final}`:"/api/restaurants";
    }
    

    // fetch restaurants
    async function fetchRestaurants() {
        setLoading(true);
        try {
            const res = await fetch(generalFetchUrl());
            const data = await res.json();
            // Map over data to extract the nested username from the Users object.
            // Adjust the property name if your relationship alias is different.
            setRestaurants(
                data.map((r: any) => ({
                    ...r,
                    voted: false,
                    username: r.Users?.username, //try to get username
                }))
            );
        } catch (err) {
            setError("Error fetching restaurants");
        }
        setLoading(false);
    }

    //refresh on mount and remounts everytime the filterCuisine updates
    //filterCuisine in dependency array
    useEffect(() => {
        fetchRestaurants();
    }, [filterCuisine, filterSchool]);

    //form submission for restaurants
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setLoading(true);

        //ensure users enter all fields
        const { name, description, latitude, longitude, image_url, cuisine, school } = form;
        if (
            !name.trim() ||
            !description.trim() ||
            !latitude.trim() ||
            !longitude.trim() ||
            !image_url.trim() ||
            !cuisine.trim()||
            !school.trim()
        ) {
            setError("Please enter all fields");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/restaurants", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    description: form.description,
                    //convert string coordinates to number
                    latitude: parseFloat(form.latitude),
                    longitude: parseFloat(form.longitude),
                    image_url: form.image_url,
                    cuisine: form.cuisine,
                    school: form.school,
                }),
            });
            const result = await res.json();
            if (!res.ok) {
                setError(result.error || "Error adding restaurant");
                toast("Error adding restaurant");
                setLoading(false);
            } else {
                //clear the restaurant form
                setForm({
                    name: "",
                    description: "",
                    latitude: "",
                    longitude: "",
                    image_url: "",
                    cuisine: "",
                    school:"",
                });
                //fetch restaurants again
                toast("Restaurant added successfully");
                setLoading(false);
                fetchRestaurants();
            }
        } catch (err) {
            setError("Error adding restaurant");
            toast("Error adding restaurant ");
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    //returns the voted flag
    async function handleVote(restaurantId: string) {
        setError("");
        try {
            const res = await fetch("/api/restaurants/vote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: restaurantId }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Error toggling vote");
            } else {
                //update with vote count
                setRestaurants((prev) =>
                    prev.map((r) =>
                        r.id === restaurantId
                            ? { ...r, total_points: data.total_points, voted: data.voted }
                            : r
                    )
                );
            }
        } catch (err) {
            setError("Error toggling vote");
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
                        setForm((prev) => ({
                            ...prev,
                            description: e.target.value,
                        }))
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

                <label htmlFor="cuisine">Cuisine</label>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        {/*either show cuisine selected or select cuisine */}
                        <Button>
                            {form.cuisine || "Select cuisine"}
                        </Button>
                    </DropdownMenuTrigger>
                    {/*map over all array elements */}
                    <DropdownMenuContent className="z-50">
                        {cuisineOptions.map((c) => (
                            //onselect, only update cuisine to what item we have right in the array
                            <DropdownMenuItem
                                key={c}
                                onSelect={() =>
                                    setForm((prev) => ({ ...prev, cuisine: c }))
                                }
                            >
                                {c}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <br/>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button>
                            {form.school||"Select school"}
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                        {schoolOptions.map((s)=>(
                            <DropdownMenuItem
                                key={s}
                                onSelect={()=>
                                    setForm((prev)=>({...prev,school:s}))
                                }
                            >
                                {s}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>


                <br />
                <Button className="mb-4 mt-4" type="submit" variant="white">
                    {loading ? "Adding Restaurant ... " : "Add Restaurant"}
                </Button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <h3 className="mt-8 mb-4 text-2xl">Filter by cuisine</h3>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button> {filterCuisine || "All Cuisines"}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="z-50">
                    <DropdownMenuItem key="all" onSelect={() => setFilterCuisine("")}>All</DropdownMenuItem>
                    {cuisineOptions.map((c) => (
                        <DropdownMenuItem
                            key={c}
                            onSelect={() => setFilterCuisine(c)}>
                            {c}</DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <br/>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button>{filterSchool||"All Schools"}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="z-50">
                    <DropdownMenuItem key="all" onSelect={()=>setFilterSchool("")}>All</DropdownMenuItem>
                    {schoolOptions.map((s)=>(
                        <DropdownMenuItem
                            key={s}
                            onSelect={()=>setFilterSchool(s)}
                        >
                            {s}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>


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
                            <p>Cuisine: {restaurant.cuisine}</p>
                            <p>School: {restaurant.school}</p>
                            {restaurant.image_url && (
                                <img
                                    src={restaurant.image_url}
                                    alt={restaurant.name}
                                    width={400}
                                    className="mb-4"
                                />
                            )}
                            {restaurant.username && (
                                <p>
                                    <em>Added by: {restaurant.username}</em>
                                </p>
                            )}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <button
                                    onClick={() => handleVote(restaurant.id)}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        fontSize: "1.5rem",
                                    }}
                                    title={
                                        restaurant.voted
                                            ? "Remove your vote"
                                            : "Vote for this restaurant"
                                    }
                                >
                                    🚩
                                </button>
                                <span>{restaurant.total_points || 0}</span>
                            </div>
                            <div>
                                {/* only display button if posted by current user */}
                                {restaurant.is_owner && (
                                    <DeleteRestaurantButton
                                        restaurantId={restaurant.id}
                                        onDelete={fetchRestaurants}
                                    />
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
