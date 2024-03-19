import CustomShaderMaterial from 'three-custom-shader-material'
import CustomShaderMaterialImpl from 'three-custom-shader-material/vanilla'
import { useControls } from 'leva'
import { useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import wobbleVertexShader from '../shaders/wobble/vertex.glsl'
import wobbleFragmentShader from '../shaders/wobble/rhythmFragment.glsl'
import { useFrame } from '@react-three/fiber'

export default function WobbleShaderMaterial() {
  const wobbleControls = useControls('Wobble Rhytm', {
    positionFrequency: {
      value: 1.0,
      min: 0,
      max: 1,
      step: 0.01,
    },
    timeFrequency: {
      value: 0.9,
      min: 0,
      max: 1,
      step: 0.01,
    },
    strength: {
      value: 0.8,
      min: 0,
      max: 2,
      step: 0.01,
    },
    warpPositionFrequency: {
      value: 1.0,
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
      value: 0,
      min: 0,
      max: 2,
      step: 0.01,
    },
    insideColor: {
      value: '#000000',
    },
    outsideColor: {
      value: '#000000',
    },
  })

  const materialControls = useControls('Material Rhythm', {
    metalness: {
      value: 0.3,
      min: 0,
      max: 1,
      step: 0.01,
    },
    roughness: {
      value: 0.1,
      min: 0,
      max: 1,
      step: 0.01,
    },
    transmission: {
      value: 0.2,
      min: 0,
      max: 1,
      step: 0.01,
    },
    ior: {
      value: 0.94,
      min: 0,
      max: 3,
      step: 0.01,
    },
    thickness: {
      value: 0,
      min: 0,
      max: 3,
      step: 0.01,
    },
    transparent: {
      value: false,
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
        // baseMaterial: THREE.MeshToonMaterial,
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

          metalness={materialControls.metalness}
          roughness={materialControls.roughness}
          transmission={materialControls.transmission}
          ior={materialControls.ior}
          thickness={materialControls.thickness}
          transparent={materialControls.transparent}
          wireframe={materialControls.wireframe}
        />
      )}
    </>
  )
}