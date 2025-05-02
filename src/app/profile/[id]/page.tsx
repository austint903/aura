import ProfileNavigationBar from "./components/ProfileNavigationBar"
import UserRestaurants from "./components/UserRestaurantList"
import UserPoints from "./components/UserPoints"
function Profile() {
  return (
    <div>
        <ProfileNavigationBar/>
        <h4 className="mb-8"> YOUR PROFILE </h4>
        <UserPoints/>
  </div>
  )
}

export default Profile
