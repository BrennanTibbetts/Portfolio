import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'
import Links from './Links.jsx'
import Interaction from './Interaction.jsx'
import CameraShift from './CameraShift.jsx'
import { Suspense } from 'react'
import { Loader } from '@react-three/drei'

const root = ReactDOM.createRoot(document.querySelector('#root'))


root.render(
    <>
        <Canvas
            shadows
            camera={ {
                fov: 45,
                near: 0.1,
                far: 12,
            } }
        >
            <Suspense fallback={null}>
                <Experience/>
            </Suspense>
            <CameraShift/>
        </Canvas>
        <Loader/>
        <Links />
        <Interaction/>
    </>
)
