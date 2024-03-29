/**
 * @file Experience.jsx
 * 
 *  
 */

import { Perf } from 'r3f-perf'
import { Environment } from '@react-three/drei'
import { useControls } from 'leva'
import SlideManager from './SlideManager.jsx'
import { int } from 'three/examples/jsm/nodes/shadernode/ShaderNode.js'

export default function Experience()
{

    const { performance } = useControls({
        performance: false 
    })

    const directionalLightControls = useControls('Directional Light', {
        position: {
            value: [0, 1, 0],
            step: 0.1
        },
        intensity: {
            value: 2,
            min: 0,
            max: 2, step: 0.1
        }
    })

    const ambientLightControls = useControls('Ambient Light', {
        intensity: {
            value: 0.0,
            min: 0,
            max: 1,
            step: 0.1
        }
    })

    return <>

        {performance ? <Perf position='top-left'/> : null}

        <Environment 
            preset='city'
        />
        <directionalLight
            castShadow
            position={directionalLightControls.position}
            intensity={directionalLightControls.intensity}
        />
        <ambientLight intensity={ambientLightControls.intensity} />
        <SlideManager/>
    </>
   
}