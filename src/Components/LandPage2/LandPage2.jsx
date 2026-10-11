import React from 'react'
import "./LandPage2.css"
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";


const LandPage2 = () => {
  gsap.registerPlugin(ScrollTrigger);
  useGSAP(()=>{
    gsap.from(".LandPage2 .container .first",{
      x:-300,
      opacity:0,
      duration:2,
      scrollTrigger:{
        trigger:".container",
        scroller:"body",
        start:"top 50%",
        end:"top 50%",
        scrub:2,
        
      }
    })
  })
  useGSAP(()=>{
    gsap.from(".LandPage2 .container .second",{
      x:-300,
      opacity:0,
      duration:2,
      scrollTrigger:{
        trigger:".container",
        scroller:"body",
        start:"top 40%",
        end:"top 40%",
        scrub:2,
        
      }
    })
  })
  useGSAP(()=>{
    gsap.from(".LandPage2 .container .third",{
      x:-300,
      opacity:0,
      duration:2,
      scrollTrigger:{
        trigger:".container",
        scroller:"body",
        start:"top 30%",
        end:"top 30%",
        scrub:2,
      }
    })
  })
  useGSAP(()=>{
    gsap.from(".LandPage2 .container .bigText",{
      x:300,
      opacity:0,
      duration:2,
      scrollTrigger:{
        trigger:".container",
        scroller:"body",
        start:"top 20%",
        end:"top 20%",
        scrub:2,

      }
    })
  })
  
  
  

  return (
    <div className='LandPage2'>
      <div className="container">
        <div className="first">
          <h1>CONNECTING TALENTED INDIVIDUALS WITH THE COMPANIES THAT NEED THEM</h1>
        </div>
        <div className="second">
          <h1>WHEATHER YOU ARE LOOKING FOR YOUR NEXT BIG BREAK</h1>
        </div>
        <div className="third">
          <h1>OR THE PERFECT HIRE</h1>
        </div>
        <h1 className='bigText'>YOU ARE IN THE RIGHT PLACE</h1>
      </div>
    </div>
  )
}

export default LandPage2
