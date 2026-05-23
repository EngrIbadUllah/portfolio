import React, { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, RoundedBox, Text } from '@react-three/drei'
import * as THREE from 'three'

const TECH_ICONS = [
  { name: 'React', color: '#61DAFB', position: [-2.5, 1.5, 0] },
  { name: 'JS', color: '#F7DF1E', position: [2.5, 1, 0] },
  { name: 'CSS', color: '#264DE4', position: [-2, -1.5, 0.5] },
  { name: 'HTML', color: '#E34F26', position: [2, -1, 0.5] },
  { name: 'Git', color: '#F05032', position: [0, 2, -1] },
  { name: 'C++', color: '#00599C', position: [0, -2, -0.5] },
  { name: 'Node', color: '#339933', position: [-3, 0, -1] },
  { name: 'Vite', color: '#646CFF', position: [3, 0, -0.5] },
]

const TechCube = ({ name, color, position, index }) => {
  const meshRef = useRef()
  const groupRef = useRef()
  const { pointer } = useThree()
  
  useFrame((state) => {
    if (meshRef.current && groupRef.current) {
      meshRef.current.rotation.x += 0.005
      meshRef.current.rotation.y += 0.008
      
      const offset = index * 0.5
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + offset) * 0.3
      
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, pointer.y * 0.1, 0.02)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, pointer.x * 0.1, 0.02)
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef} position={position}>
        <RoundedBox ref={meshRef} args={[0.8, 0.8, 0.8]} radius={0.1} smoothness={4}>
          <meshStandardMaterial
            color={color}
            metalness={0.7}
            roughness={0.2}
            transparent
            opacity={0.85}
            emissive={color}
            emissiveIntensity={0.15}
          />
        </RoundedBox>
        <Text position={[0, 0, 0.5]} fontSize={0.2} color="white" anchorX="center" anchorY="middle">
          {name}
        </Text>
      </group>
    </Float>
  )
}

const AmbientParticles = ({ count = 100 }) => {
  const pointsRef = useRef()
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    return pos
  }, [count])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#a855f7" transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

const SceneContent = () => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#00d4ff" />
      <spotLight position={[0, 10, 0]} angle={0.5} penumbra={1} intensity={0.5} color="#a855f7" />

      {TECH_ICONS.map((icon, index) => (
        <TechCube key={icon.name} {...icon} index={index} />
      ))}

      <AmbientParticles count={80} />
    </>
  )
}

const Loader = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
  </div>
)

const FloatingTechIcons = ({ className = '' }) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Suspense fallback={<Loader />}>
        <Canvas
          camera={{ position: [0, 0, 7], fov: 50 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <SceneContent />
        </Canvas>
      </Suspense>
    </div>
  )
}

export default FloatingTechIcons
