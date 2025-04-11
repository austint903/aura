// app/test/page.tsx
import { getCurrentUserIdServer } from "../shared/supabase/shared";

export default async function TestPage() {
  const userId = await getCurrentUserIdServer();

  return (
    <div>
      <h1>Test User ID</h1>
      <p>{userId ?? "No user found"}</p>
    </div>
  );
}
