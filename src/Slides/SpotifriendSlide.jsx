import { useControls } from 'leva'
import { Text, Float, Html } from '@react-three/drei'
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

   let transform = entered ? 'translate(-50%, -55%)' : 'translate(-50%, -185%)'
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
                <div className='glass' style={divStyle(transform)}>
                    <div className='left'>
                        <div className='frameReplacement'>
                            <iframe src='https://spotifriend.vercel.app/' ></iframe>
                        </div>
                        <p>
                            Spotifriend is a playlist curator that uses Spotify's API
                             and ElasticSearch to create playlists based on your favorite
                              artists and genres. It features a unique UI and the ability to
                              add generated playlists to your Spotify account.
                        </p>
                        <div>
                            <a className="github" href="https://spotifriend.vercel.app/" target="_blank">
                                <img src="/css/spotify.svg"/>
                                Check Out the Website 
                            </a> 
                            <hr/>
                            <a className="github" href="https://github.com/BrennanTibbetts" target="_blank">
                                <img src="/css/github.png"/>
                                Check Out the Source Code
                            </a> 
                        </div>
                    </div>
                    <div className='right'>
                        <div className='projectNum'>PROJECT 02</div>
                        <h1>Spotifriend</h1>
                        <h2>Playlist Curator - 2024</h2>
                        <h2>React, Node.js, React-Three-Fiber, SQL, ElasticSearch</h2>
                        <h3>Features: </h3>
                        <ul>
                            <li>ElasticSearch Playlist Generation</li>
                            <li>Spotify Account Integration and Playlist Addition</li>
                            <li>Over 35k Artists to Choose From</li>
                            <li>Playlists are Represented By a Uniquely Generated Sphere</li>
                            <li>Generated Playlist Data Translated to Parameters for the 3D Object</li>
                        </ul>
                        <h3>Details:</h3>
                        <ul>
                            <li>Created as a Capstone Project at Ohio State University</li>
                            <li>Collaborated in a Team of 6 Talented Students</li>
                        </ul>
                    </div>
                </div>
            </Html>
        </group>
    </>
}