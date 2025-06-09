import React from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const ProfilePage = () => {
  return (
    <div className="profile-page">
      <Navbar />
      <main className="profile-content">
        <div className="container">
          <h1>Profile</h1>
          <p>This page is under construction.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ProfilePage
