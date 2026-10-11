import { useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import "./LandPage1.css";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";

const LandPage1 = () => {
  gsap.registerPlugin(ScrollTrigger);
 
  //--------DemoNav Animation--------------
  var time1 = gsap.timeline();
  const navRef1 = useRef();
  const navRef2 = useRef();
  useGSAP(()=>{
    time1.from(navRef1.current,{
      opacity:0,
      y:-20,
      duration:1,
    })
  })
  useGSAP(()=>{
    time1.from(navRef2.current,{
      opacity:0,
      y:-20,
      duration:0.2,
      stagger:0.2,
    })
  })
//--------DemoNav Animation--------------

//--------First h1 Animation--------------
  const textRef1 = useRef();
  const textRef2 = useRef();

  useGSAP(()=>{
    gsap.from(textRef1.current,{
      x:-500,
      opacity:0,
      duration:0.5,
    })
  })
  useGSAP(()=>{
    gsap.from(textRef2.current,{
      x:500,
      opacity:0,
      duration:1,
    })
  })
  useGSAP(()=>{
    gsap.from(textRef2.current,{
      x:25,
      duration:2,
      scrollTrigger:{
        scroller:"body",
        trigger:".mainArea",
        start:"top -20%",
        end:"top -20%",
        scrub:2
      }
    })
  })

//--------First h1 Animation--------------

//--------last h2 Animation--------------
  const scrlText1 = useRef();
  useGSAP(()=>{
    time1.from(scrlText1.current,{
      opacity:0,
      duration:1,
    })
  })
  //--------last h2 Animation--------------

const navigate = useNavigate();
const handleSignup = () => {
    navigate("/signupEmp");
};


  return (
    <div className='LandPage1'>
      <div className="demoNav">
        <div ref={navRef1} className="name">
            <h1 className='job'>JOB <span className='market'>MARKET</span></h1>
        </div>
        <div ref={navRef2} className="signup">
            <button onClick={handleSignup}>Signup</button>
        </div>
      </div>
      <div className="mainArea">
        <div className="part1">
            <h1 ref={textRef1}>FIND JOBS</h1>
            <h1 ref={textRef2}>POST JOBS</h1>
        </div>
        <div className="part2">
            <h2 ref={scrlText1}>All in one place</h2>
        </div>
      </div>
    </div>
  )
}

export default LandPage1
