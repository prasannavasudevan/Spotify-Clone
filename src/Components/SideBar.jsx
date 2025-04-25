import React from 'react'
import {Link} from 'react-router-dom'

function SideBar() {
  return (
    <div className='side'>
      <div className='logo'>
      <Link to="/" className='brand'><img src="/assets/logo.png" alt="logo"  width={"40px"} height={"40px"} /></Link>
        <Link to="/" className='brand'><h2>Spotify</h2></Link>
      </div>
      <div className='side-content'>
        <Link className='list' to="/">For you</Link>
        <Link className='list' to="/top-tracks">Top Track</Link>
        <Link className='list'to="/favorites">Favorite</Link>
        <Link className='list'to="/recent">Recently Played</Link>
      </div>
    </div>
  )
}

export default SideBar