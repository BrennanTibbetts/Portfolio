import { useFrame, useThree } from "@react-three/fiber";
import NetjetsSlide from "./Slides/NetjetsSlide";
import SpotifriendSlide from "./Slides/SpotifriendSlide";
import MarioSlide from "./Slides/MarioSlide";
import React, { useRef } from "react";
import { useEffect } from "react";
import gsap from "gsap";
import * as THREE from 'three'

export default function SlideManager() {


    let cooldown = false
    const slide = (direction) => {

        if(circleRef.current) {

            if(cooldown) return

            cooldown = true
            // Animate and rotate the circle of slides to the next position
            gsap.to(circleRef.current.rotation, {
                y: circleRef.current.rotation.y + (Math.PI * 0.5 * direction),
                duration: 1
            }).then(() => {
                cooldown = false
            })

            const index = Math.abs(currentSlide + direction) % slides.length

            gsap.to(backgroundRef.current, {
                r: slides[index].background.r,
                g: slides[index].background.g,
                b: slides[index].background.b,
                duration: 1
            })

            currentSlide = index
        }
    }

    let currentSlide = 0;
    const slides = [
        {
            name: 'Netjets',
            ref: useRef(),
            background: {
                r: 13 / 255,
                g: 33 / 255,
                b: 38 / 255 
            }
        },
        {
            name: 'Spotifriend',
            ref: useRef(),
            background: {
                r: 0 / 255,
                g: 100 / 255,
                b: 10 / 255
            }
        },
        {
            name: 'Mario',
            ref: useRef(),
            background: {
                r: 255 / 255,
                g: 32 / 255,
                b: 22 / 255 
            }
        },
        {
            name: 'Spotifriend',
            ref: useRef(),
            background: {
                r: 0 / 255,
                g: 100 / 255,
                b: 10 / 255
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
            slide.ref.current.position.x = Math.cos(((index / slides.length) * Math.PI * 2)) * 5
            slide.ref.current.position.z = Math.sin((index / slides.length) * Math.PI * 2) * 5

            //Rotate to face center'
            slide.ref.current.lookAt(0, 0, 0)
        })
    }, [])

    const rightButton = document.querySelector('.next')
    rightButton.addEventListener('click', () => slide(1))

    const leftButton = document.querySelector('.previous')
    leftButton.addEventListener('click', () => slide(-1))

    return <>
        <color ref={backgroundRef} attach="background" args={[bg.r, bg.g, bg.b]}/>
        <group ref={circleRef}>
            <NetjetsSlide groupRef={slides[0].ref} />
            <SpotifriendSlide groupRef={slides[1].ref}/> 
            <MarioSlide groupRef={slides[2].ref} />
            <SpotifriendSlide groupRef={slides[3].ref}/> 
        </group>
    </>
}