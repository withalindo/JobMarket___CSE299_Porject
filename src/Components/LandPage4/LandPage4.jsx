import React, { useRef } from 'react'
import "./LandPage4.css"
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";


const LandPage4 = () => {

    gsap.registerPlugin(ScrollTrigger);  
    const ref1 = useRef();
    useGSAP(()=>{
        gsap.to(ref1.current,{
            transform:"translateX(-70%)",
            scrollTrigger:{
                trigger:".LandPage4",
                scroller:"body",
                markers:false,
                start:"top 0%",
                end:"top -150%",
                scrub:2,
                pin:true
    }
        })
    })
    return (
        <div className='LandPage4'>
        <div className="textPart">
            <h2>One Plateform</h2>
            <h1>Endless Opportunity</h1>
        </div>
        <div className="scrollPart">
            <h1 ref={ref1}>SHOPUP.BKASH.OLLYO.BRAINSTATION23</h1>
        </div>
        </div>
    )
    }

export default LandPage4
