import { useFrame, useThree } from "@react-three/fiber";
import NetjetsSlide from "./Slides/NetjetsSlide";
import SpotifriendSlide from "./Slides/SpotifriendSlide";
import MarioSlide from "./Slides/MarioSlide";
import RhythmSlide from "./Slides/RhythmSlide";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import gsap from "gsap";
import * as THREE from 'three'

export default function SlideManager() {

    const [currentSlide, setCurrentSlide] = useState(0)

    let cooldown = false

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


            let index = (currentSlide + direction) % slides.length
            if(index == -1) index = slides.length - 1

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
            name: 'netjets',
            ref: useRef(),
            background: {
                r: 0 / 255,
                g: 60 / 255,
                b: 60 / 255 
            }
        },
        {
            name: 'spotifriend',
            ref: useRef(),
            background: {
                r: 0 / 255,
                g: 100 / 255,
                b: 10 / 255
            }
        },
        {
            name: 'mario',
            ref: useRef(),
            background: {
                r: 255 / 255,
                g: 10 / 255,
                b: 10 / 255 
            }
        },
        {
            name: 'rhythm',
            ref: useRef(),
            background: {
                r: 127 / 255,
                g: 0 / 255,
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

        camera.position.set(0, 0, 0)
        camera.lookAt(1, 0, 0)

        slides.forEach((slide, index) => {
            slide.ref.current.position.x = Math.cos(((index / slides.length) * Math.PI * 2)) * 6
            slide.ref.current.position.z = Math.sin((index / slides.length) * Math.PI * 2) * 6

            slide.ref.current.lookAt(0, 0, 0)
        })
    }, [])

    useEffect(() => {

        const rightButton = document.querySelector('.next')
        rightButton.addEventListener('click', () => slide(1))

        const leftButton = document.querySelector('.previous')
        leftButton.addEventListener('click', () => slide(-1))


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
            <NetjetsSlide groupRef={slides[0].ref}/>
            <SpotifriendSlide groupRef={slides[1].ref}/> 
            <MarioSlide groupRef={slides[2].ref} />
            <RhythmSlide groupRef={slides[3].ref}/> 
        </group>
    </>
}