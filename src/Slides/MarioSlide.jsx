import { useControls } from 'leva'
import { Text, Float } from '@react-three/drei'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import { extend, useFrame, useLoader} from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import NetjetsShaderMaterial from './NetjetsShaderMaterial'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils'
import TextShaderMaterial from '../TextShader'

export default function MarioSlide({position, rotation, scale, groupRef}) {

    const privateJetGeometry = useLoader(GLTFLoader, 'models/BusinessJet.glb').scene.children[0].geometry
    const pjRef = useRef()

    const sphereControls = useControls('Sphere', {
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
                value: 100,
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
    const planeControls = useControls('Plane', {
        position: {
            value: [0.7, 1, 0.5],
            step: 0.1
        },
        scale: {
            value: 0.1,
            step: 0.1
        },
        rotation: {
            value: [Math.PI * -0.3, Math.PI, Math.PI *  -0.1],
            step: 0.1
        },
        metalness: {
            value: 0.5,
            min: 0,
            max: 1,
            step: 0.1
        },
        roughness: {
            value: 0.5,
            min: 0,
            max: 1,
            step: 0.1
        },
        transmission: {
            value: 0.5,
            min: 0,
            max: 1,
            step: 0.1
        },
        ior: {
            value: 1.6,
            min: 0,
            max: 10,
            step: 0.1
        },
        thickness: {
            value: 1.5,
            min: 0,
            max: 10,
            step: 0.1
        }
    }) 
    const sphereRef = useRef()


    const textRef = useRef()

   const [entered, setEntered] = useState(false);

    useEffect(() => {
        const Enter = () => {
            gsap.to(sphereRef.current.scale, { x: 3, y: 3, z: 1, duration: 2, ease: 'elastic.inOut' })
            gsap.to(textRef.current.position, { y: -3, duration: 2, ease: 'elastic.inOut' })
            gsap.to(pjRef.current.rotation, { y: Math.PI * 1.2, duration: 2 })
            gsap.to(pjRef.current.position, { x: 6, y: 2, z: -0.5, duration: 1, ease: 'power2.in' })
        };

        const Exit = () => {
            gsap.to(sphereRef.current.scale, { x: 1, y: 1, z: 1, duration: 2, ease: 'elastic.inOut' });
            gsap.to(textRef.current.position, { y: 0, duration: 2, ease: 'elastic.inOut' });
            gsap.to(pjRef.current.rotation, { y: Math.PI, duration: 2 });
            gsap.to(pjRef.current.position, { x: 0.7, y: 1, z: 0.5, duration: 1, delay: 1, ease: 'power4.out' });
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

    useFrame((state) => {
        // textRef.current.material.uniforms.uTime.value = state.clock.elapsedTime
    })


    return <>
        <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
            <Float
                floatIntensity={0.5}
            >
                <mesh ref={pjRef} position={planeControls.position} scale={planeControls.scale} rotation={planeControls.rotation}>
                    <primitive object={privateJetGeometry} />
                    <meshToonMaterial color="ivory" />
                </mesh>
            </Float>
            <mesh ref={sphereRef} position={sphereControls.position} scale={sphereControls.scale}>
                <icosahedronGeometry 
                    args={[sphereControls.radius, sphereControls.detail]}
                />
                <NetjetsShaderMaterial/>
            </mesh>
            <Text 
                font='./drei/Netjets.ttf'
                ref={textRef}
                position={textControls.position}
                scale={0.4}
                letterSpacing={0.3}
                // curveRadius={2}
            >
                MARIO
            </Text>
        </group>
    </>
}