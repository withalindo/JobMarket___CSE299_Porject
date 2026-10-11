import { useEffect, useState } from 'react'
import './Jobs.css'
import axios from 'axios'
import HeaderUser from '../../Components/HeaderUser/HeaderUser'
import TopJobCard from '../../Components/TopJobCard/TopJobCard'
import Navbar from '../../Components/Navbar/Navbar'
import NavbarCom from '../../Components/NavbarCom/NavbarCom'
import useMe from '../../hooks/useMe'
import { API_BASE } from '../../config'

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  // Visitors who are not logged in still get to browse jobs, so no redirect here.
  const { me } = useMe();

  // Fetch jobs whenever search or category changes
  useEffect(() => {
    // Cancel the previous request so a slow, older response can't overwrite a newer one.
    const controller = new AbortController();
    axios.get(`${API_BASE}/api/jobs`, {
      params: { search: search || undefined, category: category !== "All" ? category : undefined },
      signal: controller.signal,
    })
      .then(res => setJobs(res.data))
      .catch(err => {
        if (!axios.isCancel(err)) console.error(err);
      });
    return () => controller.abort();
  }, [search, category]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  return (
    <div className='jobs'>
      {me?.userType === 'company' ? <NavbarCom /> : <Navbar />}
      <div className="header">
        <HeaderUser
          fullname={me?.fullname || me?.companyName}
          profileImage={me?.profileImage}
          category={category}
        />
      </div>
      <div className="JobsArea">
        <div className="searchPart">
          <form onSubmit={handleSearch}>
            <input
              type='text'
              placeholder='Search Jobs'
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type='submit'>Search</button>
          </form>
          <div className="dropdownBoxPart">
            <label htmlFor="options">Catagory  </label>
            <select id="options" name="options" value={category} onChange={handleCategoryChange}>
              <option value="All">All</option>
              <option value="Engineer">Engineer</option>
              <option value="Analytics">Analytics</option>
              <option value="Marketing">Marketing</option>
              <option value="Design">Design</option>
            </select>
          </div>
        </div>
        <div className="cardPart">
          {jobs.length > 0 ? (
            jobs.map(job => (
              <TopJobCard key={job._id} job={job} />
            ))
          ) : (
            <div className="noJobs">No jobs found for this category.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Jobs
