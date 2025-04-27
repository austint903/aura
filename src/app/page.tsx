"use client"

import { useRouter } from "next/navigation"
import LogoutButton from "@/components/LogoutButton"
import { Button } from "@/components/ui/button"

function HomePage() {
	const router = useRouter()

	const handleRestaurantListRoute = () =>{
		router.push("/restaurants");
	}

	return (
		<div className="text-3xl p-4 space-y-6">
			<p>Hello</p>

			<div>
				<LogoutButton />
			</div>	

			<div>
				<Button variant={"white"} onClick={handleRestaurantListRoute}>restaurants </Button>
			</div>

			
		</div>
	)
}

export default HomePage
