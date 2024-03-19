import CustomShaderMaterial from 'three-custom-shader-material'
import CustomShaderMaterialImpl from 'three-custom-shader-material/vanilla'
import { useControls } from 'leva'
import { useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import wobbleVertexShader from '../shaders/wobble/vertex.glsl'
import wobbleFragmentShader from '../shaders/wobble/fragment.glsl'
import { useFrame } from '@react-three/fiber'

export default function MarioShaderMaterial() {

    const wobbleControls = useControls('Wobble Mario', {
        positionFrequency: {
            value: 0.4,
            min: 0,
            max: 1,
            step: 0.01,
        },
        timeFrequency: {
            value: 0.05,
            min: 0,
            max: 1,
            step: 0.01,
        },
        strength: {
            value: 0.08,
            min: 0,
            max: 2,
            step: 0.01,
        },
        warpPositionFrequency: {
            value: 1.1,
            min: 0,
            max: 2,
            step: 0.01,
        },
        warpTimeFrequency: {
            value: 0.24,
            min: 0,
            max: 1,
            step: 0.01,
        },
        warpStrength: {
            value: 2.00,
            min: 0,
            max: 2,
            step: 0.01,
        },
        insideColor: {
            value: '#000000',
        },
        outsideColor: {
            value: '#ff0000',
        },
    })


  const materialControls = useControls('Material Mario', {
    metalness: {
      value: 0.3,
      min: 0,
      max: 1,
      step: 0.01,
    },
    roughness: {
      value: 0.84,
      min: 0,
      max: 1,
      step: 0.01,
    },
    transmission: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.01,
    },
    ior: {
      value: 1.75,
      min: 0,
      max: 3,
      step: 0.01,
    },
    thickness: {
      value: 2.75,
      min: 0,
      max: 3,
      step: 0.01,
    },
    transparent: {
      value: true,
    },
    wireframe: {
      value: false,
    },
  })
    const uniforms = {
        uTime: new THREE.Uniform(0),

        uPositionFrequency: new THREE.Uniform(wobbleControls.positionFrequency),
        uTimeFrequency: new THREE.Uniform(wobbleControls.timeFrequency),
        uStrength: new THREE.Uniform(wobbleControls.strength),

        uWarpPositionFrequency: new THREE.Uniform(wobbleControls.warpPositionFrequency),
        uWarpTimeFrequency: new THREE.Uniform(wobbleControls.warpTimeFrequency),
        uWarpStrength: new THREE.Uniform(wobbleControls.warpStrength),

        uColorA: { value: new THREE.Color(wobbleControls.insideColor) },
        uColorB: { value: new THREE.Color(wobbleControls.outsideColor) },
    }

    useFrame((state, delta) => {
        uniforms.uTime.value = state.clock.getElapsedTime()
    })

    const materialRef = useMemo(
        () =>
        new CustomShaderMaterialImpl({
            baseMaterial: THREE.MeshPhysicalMaterial,
    
            silent: true,
            
        }),
    [materialControls, wobbleControls, uniforms]
  )
  return (
    <>
      {materialRef && (
        <CustomShaderMaterial
          baseMaterial={materialRef}
          vertexShader={wobbleVertexShader}
          fragmentShader={wobbleFragmentShader}
          uniforms={uniforms}
          silent

          wireframe={materialControls.wireframe}

          metalness={materialControls.metalness}
          roughness={materialControls.roughness}
          transmission={materialControls.transmission}
          ior={materialControls.ior}
          thickness={materialControls.thickness}
          transparent={materialControls.transparent}
        />
      )}
    </>
  )
}