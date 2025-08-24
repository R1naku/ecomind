import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'

function Earth({ points, prediction }) {
    const ref = useRef()
    useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.03 })
    const geom = new THREE.SphereGeometry(1, 64, 64)
    const mat = new THREE.MeshStandardMaterial({
        color: '#123654', metalness: 0.1, roughness: 0.9
    })

    const pGeom = new THREE.BufferGeometry()
    const latest = points.slice(-200)
    const positions = new Float32Array(latest.length * 3)
    latest.forEach((p, i) => {
        const lat = p.lat * Math.PI/180
        const lon = p.lon * Math.PI/180
        const r = 1.02 + (p.co2 || 0) * 0.0005
        const x = r * Math.cos(lat) * Math.cos(lon)
        const y = r * Math.sin(lat)
        const z = r * Math.cos(lat) * Math.sin(lon)
        positions.set([x,y,z], i*3)
    })
    pGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    return (
        <group ref={ref}>
            <mesh geometry={geom} material={mat} />
            <points geometry={pGeom}>
                <pointsMaterial size={0.01} sizeAttenuation />
            </points>
            {prediction && (
                <mesh position={[0, -1.6, 0]}>
                    <torusGeometry args={[0.3 + prediction.delta * 0.05, 0.01, 8, 48]} />
                    <meshBasicMaterial color={prediction.delta > 0 ? 'red' : 'lime'} />
                </mesh>
            )}
        </group>
    )
}

export default function Globe({ points, prediction }) {
    return (
        <Canvas className="webgl" camera={{ position: [0, 1.8, 3] }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[3,3,3]} intensity={1.2} />
            <Stars radius={20} depth={50} count={2000} factor={2} />
            <Earth points={points} prediction={prediction} />
            <OrbitControls enableDamping />
        </Canvas>
    )
}
