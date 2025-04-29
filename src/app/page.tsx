import LogoutButton from "@/components/LogoutButton"
import { getCurrentUserIdServer } from "./shared/supabase/shared"
import ProfileButton from "@/components/ProfileButton";

export default async function HomePage() {
	const userId = await getCurrentUserIdServer();
	return (
		<div className="text-3xl p-4 space-y-6">
			<p>Home Page</p>
			<div>
				<LogoutButton />
			</div>

			<div>
				{userId && <ProfileButton userId={userId} />}
			</div>
		</div>
	)
}