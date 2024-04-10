import { useControls } from 'leva'
import { Text, useGLTF, Html, MeshWobbleMaterial, PointMaterial } from '@react-three/drei'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils'
import divStyle from './divStyle'
import { MeshTransmissionMaterial, MeshDistortMaterial } from '@react-three/drei'


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

   let transform = entered ? 'translate(-50%, -55%)' : 'translate(-50%, -185%)'
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
        <group ref={groupRef} position={position} rotation={rotation} scale={scale} visible={false}>
            <Text 
                font='./drei/SuperMario256.ttf'
                ref={textRef}
                position={textControls.position}
                scale={0.4}
                letterSpacing={0.3}
            >
                MARIO
            </Text>
            <mesh ref={sphereRef} position={sphereControls.position} scale={sphereControls.scale}>
                <primitive object={mushroomGeometry} />
                <meshPhysicalMaterial 
                    color='red'
                    roughness={0.24}
                    metalness={0.15}
                    ior={1.07}
                />
            </mesh>
            <Html ref={divRef} position={[0, 0, 0]}>
                <div className="glass" style={divStyle(transform)}>
                    <div className="left">
                        <img src="/css/mario.gif"/>
                        <div>
                            <hr/>
                            <a className="github" href="https://github.com/BrennanTibbetts/MarioRemake" target="_blank">
                                <img src="/css/github.png"/>
                                Check Out the Source Code
                            </a> 
                        </div>
                    </div>
                    <div className='right'>
                        <div className='projectNum'>PROJECT 03</div>
                        <h1>Mario Remake</h1>
                        <h2>Recreated the first level of the original Super Mario Bros. (1985)</h2>
                        <h2>C#, .NET, MonoGame, XNAFramework, Photoshop</h2>
                        <h3>Features: </h3>
                        <ul>
                            <li>Collision Detection Algorithms</li>
                            <li>Game Physics</li>
                            <li>Pixel Art</li>
                            <li>Sprite Animation</li>
                            <li>Sound Effects</li>
                            <li>Game State Management</li>
                        </ul>
                        <h3>Details:</h3>
                        <ul>
                            <li>Collaborated in a team of 4 over a 10-week period.</li>
                            <li>Simulated industry workflow with Agile Methodologies.</li>
                            <li>Studied and Implemented Design Patterns of OOP.</li>
                            <li>Made entirely from scratch, including the physics, collision, state handling, parallax, animations,
                                and more.</li>
                        </ul>
                    </div>
               </div>
            </Html>
        </group>
    </>
}

useGLTF.preload('models/mario.glb')