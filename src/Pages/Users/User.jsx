import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import HeaderUser from '../../Components/HeaderUser/HeaderUser'
import TopEmpCard from '../../Components/TopEmpCard/TopEmpCard'
import Navbar from '../../Components/Navbar/Navbar'
import NavbarCom from '../../Components/NavbarCom/NavbarCom'
import useMe from '../../hooks/useMe'
import { API_BASE } from '../../config'
import './User.css'

const User = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // Visitors who are not logged in still get to browse employees, so no redirect here.
  const { me } = useMe();

  const fetchEmployees = useCallback(async (search = "") => {
    try {
      const response = await axios.get(`${API_BASE}/api/employees`, {
        params: { search: search || undefined },
        withCredentials: true
      });
      setEmployees(response.data);
    } catch {
      setEmployees([]);
    }
  }, []);

  // Fetch all employee data from backend
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleSearch = async (e) => {
    e.preventDefault();
    fetchEmployees(searchTerm.trim());
  };

  return (
    <div className='User'>
      {me?.userType === 'company' ? <NavbarCom /> : <Navbar />}
      <div className="header">
        <HeaderUser fullname={me?.fullname || me?.companyName} profileImage={me?.profileImage} />
      </div>
      <div className="userArea">
        <div className="searchPart">
          <form onSubmit={handleSearch}>
            <input
              type='text'
              placeholder='Search Employees by Name'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <button type='submit'>Search</button>
          </form>
        </div>
        <div className="cardPart">
          {employees.map((employee) => (
            <TopEmpCard key={employee._id} employee={employee} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default User
