import { useControls } from 'leva'
import { Text, Html, Preload } from '@react-three/drei'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils'
import divStyle from './divStyle'
import RhythmShaderMaterial from './RhythmShaderMaterial'

export default function RhythmSlide({position, rotation, scale, groupRef}) {

    const sphereControls = useControls('Rhythm Sphere', {
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
                value: 20,
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

        // Cleanup function to remove event listener
        return () => button.removeEventListener('click', toggleEntry);

    }, [entered]);
    

    useEffect(() => {
        sphereRef.current.geometry = mergeVertices(sphereRef.current.geometry)
        sphereRef.current.geometry.computeTangents()

    }, [groupRef.current])

    return <>
        <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
            <mesh ref={sphereRef} position={sphereControls.position} scale={sphereControls.scale} >
                <icosahedronGeometry 
                    args={[sphereControls.radius, sphereControls.detail]}
                />
                <RhythmShaderMaterial/>
            </mesh>
            <Text 
                font='./drei/rhythm.otf'
                ref={textRef}
                position={textControls.position}
                scale={0.4}
                color={'#8000ff'}
            >
               Rhythm 
            </Text>
            <Html ref={divRef} position={[0, 0, 0]}>
                <div className='glass' style={divStyle(transform)}>
                    <div className="left">
                        <img src="/css/rhythm.gif"/>
                        <div>
                            <hr/>
                            <a className="github" href="https://github.com/BrennanTibbetts/RhythmGame" target="_blank">
                                <img src="/css/github.png"/>
                                Check Out the Source Code
                            </a> 
                        </div>
                    </div>
                    <div className='right'>
                        <div className='projectNum'>PROJECT 04</div>
                        <h1>Rhythm</h1>
                        <h2>A Rhythm-Based Music Game With MP3 to Track Conversion</h2>
                        <h2>FX Shaders, C#, .NET, MonoGame, XNAFramework, Photoshop</h2>
                        <h3>Features: </h3>
                        <ul>
                            <li>Bloom Shader</li>
                            <li>Audio Latency System</li>
                            <li>Pixel Art</li>
                            <li>Sprite Animation</li>
                            <li>Game State Management</li>
                            <li>Score Management</li>
                        </ul>
                        <h3>Details:</h3>
                        <ul>
                            <li>Converts MP3 files to playable tracks, by mapping sounds to different note types.</li>
                            <li>Created as a final project for a game development course at Ohio State University</li>
                        </ul>
                    </div>
                </div>
            </Html>
        </group>
    </>
}