import React from 'react'
import './navbar.css'
import assets from '../../assets/assets.js'
const Navbar = () => {
  return (
    <div className="navbar">
      <img  className="logo" src={assets.logo} alt="" />
      <img className='profie' src={assets.profile_image} alt="" />
    </div>
  )
}

import './navbar.css'
export default Navbar
