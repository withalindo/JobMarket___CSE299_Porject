import { useEffect, useState } from 'react'
import axios from 'axios'
import NavbarCom from '../../Components/NavbarCom/NavbarCom'
import './HomeCom.css'
import JobPost from '../../Components/JobPost/JobPost'
import TopEmpCard from '../../Components/TopEmpCard/TopEmpCard'
import TopJobCard from '../../Components/TopJobCard/TopJobCard'
import useMe from '../../hooks/useMe'
import { API_BASE } from '../../config'

const HomeCom = () => {
  // Only logged-in companies belong here.
  const { me } = useMe({ redirectTo: '/loginCom', userType: 'company' });
  const [jobs, setJobs] = useState([]);
  const [employees, setEmployees] = useState([]);
  // Bumped after a job is posted so the "Top Job" list refreshes.
  const [jobsVersion, setJobsVersion] = useState(0);

  useEffect(() => {
    if (!me) return;
    axios.get(`${API_BASE}/api/all-jobs`, { withCredentials: true })
      .then(res => setJobs(res.data.slice(0, 2)))
      .catch(() => setJobs([]));
  }, [me, jobsVersion]);

  useEffect(() => {
    if (!me) return;
    axios.get(`${API_BASE}/api/employees`, { withCredentials: true })
      .then(res => setEmployees(res.data.slice(0, 2)))
      .catch(() => setEmployees([]));
  }, [me]);

  if (!me) return null; // still checking the login (or redirecting)

  return (
    <div className='HomeCom'>
      <div className="header">
        <NavbarCom />
      </div>
      <div className="jobPostField">
        <JobPost onPosted={() => setJobsVersion(v => v + 1)} />
        <div className="topJobField">
            <div className="headingPart1">
                <h1>Top Job</h1>
            </div>
            <div className="cards">
                {jobs.map(job => (
                  <TopJobCard key={job._id} job={job} />
                ))}
            </div>
        </div>
        <div className="topUserField">
            <div className="headingPart2">
                <h1>Top Users</h1>
            </div>
            <div className="cards">
                {employees.map(employee => (
                  <TopEmpCard key={employee._id} employee={employee} />
                ))}
            </div>
        </div>
      </div>
    </div>
  )
}

export default HomeCom
