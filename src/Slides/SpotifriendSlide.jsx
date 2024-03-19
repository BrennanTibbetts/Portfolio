import { useControls } from 'leva'
import { Text, Float, Html } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import WobbleShaderMaterial from './SpotifriendShaderMaterial'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils'
import divStyle from './divStyle'

export default function SpotifriendSlide({position, rotation, scale, groupRef}) {

    const headsetGeometry = useLoader(GLTFLoader, 'models/untitled.glb').scene.children[0].geometry

    const sphereControls = useControls('Spotifriend Sphere', {
            position: {
                value: [0, 0, -1],
                step: 0.1
            },
            radius: {
                value: 1.5,
                step: 0.1
            },
            scale: {
                value: [1, 1, 1],
                step: 0.1
            },
            detail: {
                value: 40,
                min: 0,
                max: 500,
                step: 1
            },
        })  
    const textControls = useControls('Text', {
        position: {
            value: [0, 0, 1],
            step: 0.1
        },
    })
    
    const sphereRef = useRef()
    const headsetRef = useRef()
    const divRef = useRef()


    const textRef = useRef()

   const [entered, setEntered] = useState(false);

   let transform = entered ? 'translate(-50%, -50%)' : 'translate(-50%, -180%)'
    useEffect(() => {
        const Enter = () => {
            gsap.to(sphereRef.current.scale, { x: 3, y: 3, z: 1, duration: 2, ease: 'elastic.inOut' });
            gsap.to(textRef.current.position, { y: -3, duration: 2, ease: 'elastic.inOut' });
        };

        const Exit = () => {
            gsap.to(sphereRef.current.scale, { x: 1, y: 1, z: 1, duration: 2, ease: 'elastic.inOut' });
            gsap.to(textRef.current.position, { y: 0, duration: 2, ease: 'elastic.inOut' });
        };

        const toggleEntry = () => {
            if (entered) {
                Exit();
                button.classList.remove('entered');
            } else {
                Enter();
                button.classList.add('entered');
            }
            setEntered(!entered);
        };

        const button = document.querySelector('.entry');
        button.addEventListener('click', toggleEntry);

        return () => button.removeEventListener('click', toggleEntry);

    }, [entered]);
    

    useEffect(() => {
        sphereRef.current.geometry = mergeVertices(sphereRef.current.geometry)
        sphereRef.current.geometry.computeTangents()

        headsetRef.current.geometry = mergeVertices(headsetRef.current.geometry)
        headsetRef.current.geometry.computeTangents()

    }, [groupRef.current])

    return <>
        <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
            <mesh ref={sphereRef} position={sphereControls.position} scale={sphereControls.scale} >
                <icosahedronGeometry 
                    args={[sphereControls.radius, sphereControls.detail]}
                />
                <WobbleShaderMaterial/>
            </mesh>
            <Text 
                font='./drei/Gotham-Black.otf'
                ref={textRef}
                position={textControls.position}
                scale={0.4}
            >
                Spotifriend
            </Text>
            <Float
                floatIntensity={0.5}
            >
                <mesh ref={headsetRef} position={[1.2, 1, -0.4]} rotation={[Math.PI * -0.5, Math.PI * 0.0, Math.PI * 1.0]} scale={0.1}>
                    <primitive object={headsetGeometry}/>
                    <WobbleShaderMaterial/>
                </mesh>
            </Float>
            <Html ref={divRef} position={[0, 0, 0]}>
                <div style={divStyle(transform)}>
                    This is  a div
                </div>
            </Html>
        </group>
    </>
}