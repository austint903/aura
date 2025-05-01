import React from 'react'
import ProfileNavigationBar from '../components/ProfileNavigationBar'
import LikedRestaurantsPage from '../components/LikedRestaurants'

function LikedRestaurants() {
  return (
    <div>
        <ProfileNavigationBar/>
        <div>
            <LikedRestaurantsPage/>
        </div>
    </div>
  )
}

export default LikedRestaurants
