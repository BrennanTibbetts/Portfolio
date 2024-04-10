import { useControls } from 'leva'
import { Text, Float, Html, Loader, useGLTF } from '@react-three/drei'
import gsap from 'gsap'
import { Suspense, useEffect, useRef, useState } from 'react'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils'
import divStyle from './divStyle'
import AboutMeShaderMaterial from './AboutMeShaderMaterial'

export default function AboutMeSlide({position, rotation, scale, groupRef}) {

    // const manScene = useLoader(GLTFLoader, 'models/man.glb').scene
    const manScene = useGLTF('models/man.glb').scene

    const manGeometry = manScene.children[0].geometry
    const armGeometry = manScene.children[1].geometry

    const manRef = useRef()
    const armRef = useRef()

    const sphereControls = useControls('AboutMe Sphere', {
            position: {
                value: [0, 0.7, -2],
                step: 0.1
            },
            scale: {
                value: [12, 12, 12],
                step: 0.1
            },
        })  

    const armControls = useControls('AboutMe Arm', { 
        position: {
            value: [-3.5, -3, -1.5],
            step: 0.1
        },
        rotation: {
            value: [0, 0, 0],
            step: 0.1
        },
        scale: {
            value: [12, 12, 12],
            step: 0.1
        },
    })

    const textControls = useControls('Text AboutMe', {
        position: {
            value: [0, 0.5, 1],
            step: 0.1
        },
        positionIntro: {
            value: [0, 1.0, 1],
            step: 0.1
        },
    })
  
    const sphereRef = useRef()


    const textRef = useRef()
    const textIntroRef = useRef()
    const divRef = useRef()

   const [entered, setEntered] = useState(false);

   let handVisible = window.innerWidth > 800 ? true : false 

   let transform = entered ? 'translate(-50%, -55%)' : 'translate(-50%, -185%)'
    useEffect(() => {

        const Enter = () => {

            gsap.killTweensOf([sphereRef.current.scale, textRef.current.position]);

            gsap.to(sphereRef.current.scale, { x: 24, y: 24, z: 12, duration: 2, ease: 'elastic.inOut' })
            gsap.to(textRef.current.position, { y: -3, duration: 2, ease: 'elastic.inOut' })
            gsap.to(textIntroRef.current.material, { opacity: 0, duration: 1, ease: 'power2.inOut'})

            gsap.to(armRef.current.position, { x: -3.5, y: -5, z: -1.5, duration: 1, ease: 'power2.inOut' })
        };

        const Exit = () => {
            gsap.killTweensOf([sphereRef.current.scale, textRef.current.position]);

            gsap.to(sphereRef.current.scale, { x: 12, y: 12, z: 12, duration: 2, ease: 'elastic.inOut' });
            gsap.to(textRef.current.position, { y: 0.5, duration: 2, ease: 'elastic.inOut' });
            gsap.to(textIntroRef.current.material, { opacity: 1, duration: 1, delay: 1, ease: 'power2.inOut' });

            gsap.to(armRef.current.position, { x: -3.5, y: -3, z: -1.5, duration: 1, delay: 1, ease: 'power1.inOut' });
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

        armRef.current.geometry = mergeVertices(armRef.current.geometry)
        armRef.current.geometry.computeTangents()
    }, [])

    return <>
        <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
            <mesh ref={sphereRef} position={sphereControls.position} scale={sphereControls.scale}>
                <primitive object={manGeometry}/>
                <AboutMeShaderMaterial />
            </mesh>
            <mesh ref={armRef} position={armControls.position} scale={armControls.scale} visible={handVisible}>
                <primitive object={armGeometry}/>
                <AboutMeShaderMaterial />
            </mesh>
            <Text
                font='./drei/Montserrat-Light.ttf'
                color={'black'}
                ref={textIntroRef}
                position={textControls.positionIntro}
                scale={0.15}
                maxWidth={10}
            >
                HI, I'M
            </Text>
            <Text 
                font='./drei/Montserrat-Bold.ttf'
                color={'black'}
                ref={textRef}
                fontWeight={100}
                fontStyle='Bold'
                letterSpacing={0.1}
                lineHeight={1.0}
                position={textControls.position}
                scale={0.3}
                maxWidth={1}
            >
                BRENNAN TIBBETTS
            </Text>
            <Html ref={divRef} position={[0, 0, 0]}>
                <div className='glass' style={divStyle(transform)}>
                    <div className='aboutme'>
                        <h1>Welcome!</h1>
                        <hr/>
                        <div>
                            <h2>I'm Brennan, a Fullstack Developer and 3D designer.</h2>
                            <h2>I love creating interactive digital experiences for  people to enjoy.</h2>
                            <h2>Check out some of my projects using the arrows below!</h2>
                            <h3>For collaboration inquiries, please contact me through email or Upwork.</h3>
                        </div>
                        <hr/>
                        <a className="github" href="https://github.com/BrennanTibbetts/Portfolio" target="_blank">
                            <img src="/css/github.png"/>
                            Learn About This Portfolio
                        </a> 
                    </div>
                </div>
            </Html>
        </group>
    </>
}

useGLTF.preload('/models/man.glb')