import { useControls } from 'leva'
import { Text, Float, Html } from '@react-three/drei'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import { useLoader} from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import NetjetsShaderMaterial from './NetjetsShaderMaterial'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils'
import TextShaderMaterial from '../TextShader'
import divStyle from './divStyle'

export default function NetjetsSlide({position, rotation, scale, groupRef}) {

    const privateJetGeometry = useLoader(GLTFLoader, 'models/BusinessJet.glb').scene.children[0].geometry
    const pjRef = useRef()

    const sphereControls = useControls('Netjets Sphere', {
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
    const divRef = useRef()

   const [entered, setEntered] = useState(false);

   let transform = entered ? 'translate(-50%, -60%)' : 'translate(-50%, -180%)'
    useEffect(() => {

        const Enter = () => {

            gsap.killTweensOf([sphereRef.current.scale, textRef.current.position, pjRef.current.rotation, pjRef.current.position]);

            gsap.to(sphereRef.current.scale, { x: 3, y: 3, z: 1, duration: 2, ease: 'elastic.inOut' })
            gsap.to(textRef.current.position, { y: -3, duration: 2, ease: 'elastic.inOut' })
            gsap.to(pjRef.current.rotation, { y: Math.PI * 1.2, duration: 2 })
            gsap.to(pjRef.current.position, { x: 6, y: 2, z: -0.5, duration: 1, ease: 'power2.in' })

        };

        const Exit = () => {
            gsap.killTweensOf([sphereRef.current.scale, textRef.current.position, pjRef.current.rotation, pjRef.current.position]);

            gsap.to(sphereRef.current.scale, { x: 1, y: 1, z: 1, duration: 2, ease: 'elastic.inOut' });
            gsap.to(textRef.current.position, { y: 0, duration: 2, ease: 'elastic.inOut' });

            gsap.to(pjRef.current.rotation, { y: Math.PI, duration: 2 });
            gsap.to(pjRef.current.position, { x: 0.7, y: 1, z: 0.5, duration: 1, delay: 1, ease: 'power2.out' });

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
                NETJETS
            </Text>
            <Html ref={divRef} position={[0, 0, 0]}>
                <div className='glass' style={divStyle(transform)}>
                    <div className='content'>
                        <h1>Netjets Tail Sorting System Fullstack Internship</h1>
                        <h2>Technologies: </h2>
                        <ul>
                            <li>React.js</li>
                            <li>OAuth 2.0</li>
                            <li>Node.js</li>
                            <li>Express.js</li>
                            <li>GraphQL</li>
                        </ul>
                        <h2>Developed a Single-Page-Web-App using React.js, now used frequently within the company.</h2>
                        <h2>Managed backend data retrieval and organization for vast datasets.</h2>
                        <h2>Collaborated in an experienced Scrum team with daily accountability.</h2>
                        <h2>Engaged in career workshops, personality assessments,
                            and received invaluable one-on-one
                            mentorship from company leaders.</h2>
                    </div>
                    <div className='git'>
                        <img src="/css/netjets.png" />
                        <h3>
                            This internship profoundly impacted my professional growth and skill development.
                            Spearheading the development of an application expanded my technical
                            expertise, while collaboration within a Scrum team enhanced my teamwork and project management
                            abilities.</h3>
                        <img src="/css/tail.gif" />
                    </div>
                </div>
            </Html>
        </group>
    </>
}