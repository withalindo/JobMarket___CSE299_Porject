import { useRef, useEffect, useState } from 'react'
import "./LandPage3.css"
import { API_BASE } from '../../config'
import TopJobCard from '../TopJobCard/TopJobCard'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TopEmpCard from '../TopEmpCard/TopEmpCard';
import axios from 'axios';

const LandPage3 = () => {
  gsap.registerPlugin(ScrollTrigger);
  const topJobRef = useRef();
  const cardRef1 = useRef();
  const topEmpRef = useRef();
  const cardRef2 = useRef();

  const [jobs, setJobs] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Public endpoints made for this page: top 3 paying jobs and the 3 newest employees
  // (no passwords or private ids are returned).
  useEffect(() => {
    axios.get(`${API_BASE}/api/landing/top-jobs`)
      .then(res => setJobs(res.data))
      .catch(() => setJobs([]));
    axios.get(`${API_BASE}/api/landing/top-employees`)
      .then(res => setEmployees(res.data))
      .catch(() => setEmployees([]));
  }, []);

  useGSAP(()=>{
    gsap.from(topJobRef.current,{
      x:300,
      opacity:0,
      duration:1,
      scrollTrigger:{
        trigger:".LandPage3",
        scroller:"body",
        start:"top 70%",
        end:"top 70%",
        scrub:2,
      }
    })
  })
  useGSAP(()=>{
    gsap.from(topEmpRef.current,{
      x:-300,
      opacity:0,
      duration:1,
      scrollTrigger:{
        trigger:".LandPage3",
        scroller:"body",
        start:"top 20%",
        end:"top 20%",
        scrub:2,
      }
    })
  })
  useGSAP(()=>{
    gsap.from(cardRef1.current,{
      x:-300,
      opacity:0,
      duration:1,
      stagger:0.4,
      scrollTrigger:{
        trigger:".LandPage3",
        scroller:"body",
        start:"top 45%",
        end:"top 45%",
        scrub:2,
      }
    })
  })
  useGSAP(()=>{
    gsap.from(cardRef2.current,{
      x:300,
      opacity:0,
      duration:1,
      stagger:0.4,
      scrollTrigger:{
        trigger:".LandPage3",
        scroller:"body",
        start:"top 5%",
        end:"top 5%",
        scrub:2,
      }
    })
  })

  return (
    <div className='LandPage3'>
      <div className="topJob">
        <h1 ref={topJobRef}>TOP JOBS</h1>
        <div ref={cardRef1} className="jobcards">
          {jobs.map(job => (
            <TopJobCard key={job._id} job={job} />
          ))}
        </div>
      </div>
      <div className="topEmp">
        <h1 ref={topEmpRef} className='topEmpHead'>TOP EMPLOYEES</h1>
        <div ref={cardRef2} className="empcards">
          {employees.map(emp => (
            <TopEmpCard key={emp._id} employee={emp} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default LandPage3
