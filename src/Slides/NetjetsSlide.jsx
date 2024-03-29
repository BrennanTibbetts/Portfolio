import { useControls } from 'leva'
import { Text, Float, Html } from '@react-three/drei'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import { useLoader} from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import NetjetsShaderMaterial from './NetjetsShaderMaterial'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils'
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

   let transform = entered ? 'translate(-50%, -55%)' : 'translate(-50%, -185%)'
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

        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
                if (!entered) {
                    Enter();
                    button.classList.add('entered');
                    setEntered(true);
                } 
            }
            if (e.key === 'ArrowDown') {
                if (entered) {
                    Exit();
                    button.classList.remove('entered');
                    setEntered(false);
                }
            }
        })

        window.addEventListener('click', (e) => {

            // check if mouse is near center and not entered
            const boxSize = 200
            if (e.clientX > window.innerWidth / 2 - boxSize && e.clientX < window.innerWidth / 2 + boxSize && e.clientY > window.innerHeight / 2 - boxSize && e.clientY < window.innerHeight / 2 + boxSize) {
                if (!entered) {
                    Enter();
                    button.classList.add('entered');
                    setEntered(true);
                    console.log('entered')
                }
            }
            e.stopPropagation()
        })

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
                    <div className='left'>
                        <img id="netjetsimg" src="/css/NetJets_logo.svg.png" />
                        <img src="/css/tail.gif" />
                    </div>
                    <div className='right'>
                        <div className='projectNum'>PROJECT 01</div>
                        <h1>Netjets Internship</h1>
                        <h2>Private Jet Tail Sorting Fullstack Project - 2023</h2>
                        <h2>React, Node.js, GraphQL, OAuth 2.0</h2>
                        <h3>Experience:</h3>
                        <ul>
                            <li>Developed a Web Application using React, now used frequently within NetJets.</li>
                            <li>Managed backend data retrieval and organization for vast datasets.</li>
                            <li>Collaborated in an experienced Scrum team with daily accountability.</li>
                            <li>Engaged in career workshops, personality assessments,
                                and received invaluable one-on-one
                                mentorship from company leaders.</li>
                        </ul>
                        <h3>Details:</h3>
                        <ul>
                            <li>Application provides a sorting interface to help manage hundreds of aircraft.</li>
                            <li>Created to replace an outdated version of the tool as NetJets moves to web technologies.</li>
                            <li>
                            This internship profoundly impacted my professional growth and skill development.
                            Spearheading the development of an application expanded my technical
                            expertise, while collaboration within a Scrum team enhanced my teamwork and project management
                            abilities.</li>
                        </ul>
                    </div>
                </div>
            </Html>
        </group>
    </>
}