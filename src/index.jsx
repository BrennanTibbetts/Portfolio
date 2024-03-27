import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'
import Links from './Links.jsx'
import Interaction from './Interaction.jsx'
import CameraShift from './CameraShift.jsx'
import { Leva } from 'leva'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <>
        <Canvas
            shadows
            camera={ {
                fov: 45,
                near: 0.1,
                far: 8,
            } }
        >
            <Experience />
            <CameraShift/>
        </Canvas>
        <Links />
        <Interaction/>
    </>
)
