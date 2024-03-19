import { useControls } from 'leva'
import { Text, Float, useGLTF, Html } from '@react-three/drei'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils'
import MarioShaderMaterial from './MarioShaderMaterial'
import divStyle from './divStyle'


export default function MarioSlide({position, rotation, scale, groupRef}) {

    const mushroomGeometry = useGLTF('models/mario.glb').scene.children[0].geometry

    const sphereControls = useControls('Mario Sphere', {
            position: {
                value: [0, 0, -1],
                step: 0.1
            },
            radius: {
                value: 1.5,
                step: 0.1
            },
            scale: {
                value: [2, 2, 2],
                step: 0.1
            },
            detail: {
                value: 50,
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
    const textRef = useRef()

    const divRef = useRef()


    const [entered, setEntered] = useState(false);

   let transform = entered ? 'translate(-50%, -50%)' : 'translate(-50%, -180%)'
    useEffect(() => {
        const Enter = () => {
            gsap.to(sphereRef.current.scale, { x: 5, y: 5, z: 1, duration: 2, ease: 'elastic.inOut' });
            gsap.to(textRef.current.position, { y: -3, duration: 2, ease: 'elastic.inOut' });
        };

        const Exit = () => {
            gsap.to(sphereRef.current.scale, { x: 2, y: 2, z: 1, duration: 2, ease: 'elastic.inOut' });
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

        // Cleanup function to remove event listener
        return () => button.removeEventListener('click', toggleEntry);

    }, [entered]);

    useEffect(() => {
        sphereRef.current.geometry = mergeVertices(sphereRef.current.geometry)
        sphereRef.current.geometry.computeTangents()

    }, [])

    return <>
        <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
            <Text 
                font='./drei/SuperMario256.ttf'
                ref={textRef}
                position={textControls.position}
                scale={0.4}
                letterSpacing={0.3}
                // curveRadius={2}
            >
                MARIO
            </Text>
            <mesh ref={sphereRef} position={sphereControls.position} scale={sphereControls.scale}>
                <primitive object={mushroomGeometry} />
                <MarioShaderMaterial/>
            </mesh>
            <Html ref={divRef} position={[0, 0, 0]}>
                <div style={divStyle(transform)}>
                    This is  a div
                </div>
            </Html>
        </group>
    </>
}