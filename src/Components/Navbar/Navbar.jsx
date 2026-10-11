import React from 'react'
import "./navbar.css"
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='navbar'>
        <div className="companyName">
            <h1 className='job'>JOB <span className='market'>MARKET</span></h1>
        </div>
        <div className="lists">
            <ul>
                <li><Link to="/HomeUser" style={{textDecoration:'none',color:'white'}}>Home</Link></li>
                <li><Link to="/Jobs" style={{textDecoration:'none',color:'white'}}>Jobs</Link></li>
                <li><Link to="/Users" style={{textDecoration:'none',color:'white'}}>Users</Link></li>
                <li><Link to="/Profile" style={{textDecoration:'none',color:'white'}}>Profile</Link></li>
            </ul>
        </div>
    </div>
  )
}

export default Navbar
