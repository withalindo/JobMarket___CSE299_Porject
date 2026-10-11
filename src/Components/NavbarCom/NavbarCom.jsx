import React from 'react'
import './NavbarCom.css'
import { Link } from 'react-router-dom'

const NavbarCom = () => {
  return (
    <div className='navbar'>
        <div className="companyName">
            <h1 className='job'>JOB <span className='market'>MARKET</span></h1>
        </div>
        <div className="lists">
            <ul>
                <li><Link to="/HomeCom" style={{textDecoration:'none',color:'white'}}>Company Home</Link></li>
                <li><Link to="/Jobs" style={{textDecoration:'none',color:'white'}}>Jobs</Link></li>
                <li><Link to="/Users" style={{textDecoration:'none',color:'white'}}>Users</Link></li>
                <li><Link to="/Profile" style={{textDecoration:'none',color:'white'}}>Profile</Link></li>
            </ul>
        </div>
    </div>
  )
}

export default NavbarCom
