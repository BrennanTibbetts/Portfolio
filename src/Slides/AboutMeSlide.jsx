import { useControls } from 'leva'
import { Text, Float, Html } from '@react-three/drei'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import { useLoader} from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils'
import divStyle from './divStyle'
import AboutMeShaderMaterial from './AboutMeShaderMaterial'

export default function AboutMeSlide({position, rotation, scale, groupRef}) {

    const manScene = useLoader(GLTFLoader, 'models/man.glb').scene

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
            value: [-2, 1.4, 0],
            step: 0.1
        },
    })
  
    const sphereRef = useRef()


    const textRef = useRef()
    const textIntroRef = useRef()
    const divRef = useRef()

   const [entered, setEntered] = useState(false);

   let transform = entered ? 'translate(-50%, -60%)' : 'translate(-50%, -180%)'
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

        // Cleanup function to remove event listener
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
            <mesh ref={armRef} position={armControls.position} scale={armControls.scale}>
                <primitive object={armGeometry}/>
                <AboutMeShaderMaterial />
            </mesh>
            <Text
                font='./drei/Netjets.ttf'
                color={'white'}
                ref={textIntroRef}
                position={textControls.positionIntro}
                scale={0.3}
                maxWidth={1}
            >
                Hi, I'm
            </Text>
            <Text 
                font='./drei/attt.otf'
                color={'black'}
                fontWeight={900}
                ref={textRef}
                position={textControls.position}
                scale={0.6}
                maxWidth={1}
                // curveRadius={-4}
            >
                Brennan Tibbetts
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