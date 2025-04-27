"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface DeleteRestaurantButtonProps {
  restaurantId: string;
  onDelete: () => void;
}

export default function DeleteRestaurantButton({ restaurantId, onDelete }: DeleteRestaurantButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/restaurants", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: restaurantId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error deleting restaurant");
      } else {
        onDelete();
      }
    } catch {
      setError("Error deleting restaurant");
    } finally {
        toast("Restaurant deleted successfully");
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '8px' }}>
      <Button
        onClick={handleDelete}
        variant="white"
        disabled={loading}
        
        title="Delete this restaurant"
      >
        {loading ? "Deleting..." : "Delete"}
      </Button>
      {error && <p style={{ color: "red", marginTop: '4px' }}>{error}</p>}
    </div>
  );
}
