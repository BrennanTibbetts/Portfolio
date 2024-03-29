import { useFrame, useThree } from "@react-three/fiber";
import NetjetsSlide from "./Slides/NetjetsSlide";
import SpotifriendSlide from "./Slides/SpotifriendSlide";
import MarioSlide from "./Slides/MarioSlide";
import RhythmSlide from "./Slides/RhythmSlide";
import AboutMeSlide from "./Slides/AboutMeSlide";
import React, { Suspense, useRef } from "react";
import { useEffect, useState } from "react";
import gsap from "gsap";
import { Preload } from "@react-three/drei";

export default function SlideManager() {

    const [currentSlide, setCurrentSlide] = useState(0)

    let cooldown = false


    let index = currentSlide
    const slide = (direction) => {

        if(circleRef.current) {

            if(cooldown) return

            cooldown = true
            // Animate and rotate the circle of slides to the next position
            gsap.to(circleRef.current.rotation, {
                y: circleRef.current.rotation.y + (Math.PI * (2 / slides.length) * direction),
                duration: 1,
                ease: 'power2.inOut'
            }).then(() => {
                cooldown = false
            })


            index = (currentSlide + direction) % slides.length
            if(index == -1) index = slides.length - 1

            slides[index].ref.current.visible = true 

            gsap.to(backgroundRef.current, {
                r: slides[index].background.r,
                g: slides[index].background.g,
                b: slides[index].background.b,
                duration: 1,
                ease: 'power2.inOut',
            }).then(() => {
                setCurrentSlide(index)
            })

        }
    }


    const slides = [
        {
            name: 'aboutme',
            ref: useRef(),
            background: {
                r: 0 / 255,
                g: 0 / 255,
                b: 0 / 255
            }
        },
        {
            name: 'netjets',
            ref: useRef(),
            background: {
                r: 20 / 255,
                g: 80 / 255,
                b: 80 / 255 
            }
        },
        {
            name: 'spotifriend',
            ref: useRef(),
            background: {
                r: 20 / 255,
                g: 120 / 255,
                b: 30 / 255
            }
        },
        {
            name: 'mario',
            ref: useRef(),
            background: {
                r: 255 / 255,
                g: 30 / 255,
                b: 30 / 255 
            }
        },
        {
            name: 'rhythm',
            ref: useRef(),
            background: {
                r: 157 / 255,
                g: 30 / 255,
                b: 255 / 255
            }
        },

    ]
    const circleRef = useRef()  
    const backgroundRef = useRef()
    const bg = slides[currentSlide].background

    const camera = useThree().camera

    //START IN CIRCLE
    useEffect(() => {

        const offset = 2 - window.innerWidth / window.innerHeight

        let radius = 6 + offset 


        camera.position.set(0, 0, 0)
        camera.lookAt(1, 0, 0)

        slides.forEach((slide, index) => {

            slide.ref.current.position.x = Math.cos(((index / slides.length) * Math.PI * 2)) * radius 
            slide.ref.current.position.z = Math.sin((index / slides.length) * Math.PI * 2) * radius

            slide.ref.current.lookAt(0, 0, 0)

            slide.ref.current.visible = false
        })

        slides[currentSlide].ref.current.visible = true

    }, [window.innerWidth])

    useEffect(() => {

        const rightButton = document.querySelector('.next')
        rightButton.addEventListener('click', () => slide(1))

        const leftButton = document.querySelector('.previous')
        leftButton.addEventListener('click', () => slide(-1))

        window.addEventListener('keydown', (e) => {
            if(e.key == 'ArrowRight') slide(1)
            if(e.key == 'ArrowLeft') slide(-1)
        })

        return () => {
            rightButton.removeEventListener('click', () => slide(1))
            leftButton.removeEventListener('click', () => slide(-1))
        }

    }, [currentSlide])

    useEffect(() => {


    }, [])

    return <>
        <color ref={backgroundRef} attach="background" args={[bg.r, bg.g, bg.b]}/>
        <group ref={circleRef}>
            <AboutMeSlide groupRef={slides[0].ref}/>
            <NetjetsSlide groupRef={slides[1].ref}/>
            <SpotifriendSlide groupRef={slides[2].ref}/> 
            <MarioSlide groupRef={slides[3].ref} />
            <RhythmSlide groupRef={slides[4].ref}/> 
            <Preload all/>
        </group>
    </>
}