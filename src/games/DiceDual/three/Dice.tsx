import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, MeshStandardMaterial } from 'three'
import * as THREE from 'three'

interface DiceProps {
  position: [number, number, number]
  result: number
  rolling: boolean
}

export function Dice({ position, result, rolling }: DiceProps) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<Mesh>(null)

  useFrame(() => {
    if (!meshRef.current) return

    if (rolling) {
      meshRef.current.rotation.x += 0.12
      meshRef.current.rotation.y += 0.08
      meshRef.current.rotation.z += 0.05
    } else {
      // Smoothly rotate to show result face
      const targetRotations: Record<number, [number, number, number]> = {
        1: [0, 0, 0],
        2: [0, Math.PI / 2, 0],
        3: [0, Math.PI, 0],
        4: [0, -Math.PI / 2, 0],
        5: [Math.PI / 2, 0, 0],
        6: [-Math.PI / 2, 0, 0],
      }

      const [targetX, targetY, targetZ] = targetRotations[result] || [0, 0, 0]
      
      meshRef.current.rotation.x += (targetX - meshRef.current.rotation.x) * 0.1
      meshRef.current.rotation.y += (targetY - meshRef.current.rotation.y) * 0.1
      meshRef.current.rotation.z += (targetZ - meshRef.current.rotation.z) * 0.1
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.3}
          roughness={0.4}
        />
        {/* All 6 faces always have dots */}
        <DiceFace faceNumber={1} position={[0, 0, 0.501]} rotation={[0, 0, 0]} />
        <DiceFace faceNumber={2} position={[0.501, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
        <DiceFace faceNumber={3} position={[0, 0, -0.501]} rotation={[0, Math.PI, 0]} />
        <DiceFace faceNumber={4} position={[-0.501, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
        <DiceFace faceNumber={5} position={[0, 0.501, 0]} rotation={[-Math.PI / 2, 0, 0]} />
        <DiceFace faceNumber={6} position={[0, -0.501, 0]} rotation={[Math.PI / 2, 0, 0]} />
      </mesh>
    </group>
  )
}

function DiceFace({ 
  faceNumber, 
  position, 
  rotation 
}: { 
  faceNumber: number
  position: [number, number, number]
  rotation: [number, number, number]
}) {
  const dotPositions = getDotPositionsForFace(faceNumber)
  
  return (
    <group position={position} rotation={rotation}>
      {dotPositions.map((dotPos, i) => (
        <mesh key={i} position={dotPos}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      ))}
    </group>
  )
}

function getDotPositionsForFace(faceNumber: number): Array<[number, number, number]> {
  const dotConfigs: Record<number, Array<[number, number, number]>> = {
    1: [[0, 0, 0]],
    2: [
      [-0.25, 0.25, 0],
      [0.25, -0.25, 0]
    ],
    3: [
      [-0.25, 0.25, 0],
      [0, 0, 0],
      [0.25, -0.25, 0]
    ],
    4: [
      [-0.25, 0.25, 0],
      [0.25, 0.25, 0],
      [-0.25, -0.25, 0],
      [0.25, -0.25, 0]
    ],
    5: [
      [-0.25, 0.25, 0],
      [0.25, 0.25, 0],
      [0, 0, 0],
      [-0.25, -0.25, 0],
      [0.25, -0.25, 0]
    ],
    6: [
      [-0.25, 0.3, 0],
      [0.25, 0.3, 0],
      [-0.25, 0, 0],
      [0.25, 0, 0],
      [-0.25, -0.3, 0],
      [0.25, -0.3, 0]
    ],
  }

  return dotConfigs[faceNumber] || []
}