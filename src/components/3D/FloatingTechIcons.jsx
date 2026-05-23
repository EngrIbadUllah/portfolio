import React, { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, RoundedBox, Text, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

const TECH_ICONS = [
  { name: 'React', color: '#61DAFB', position: [-2.8, 1.2, 0], icon: 'R' },
  { name: 'JS', color: '#F7DF1E', position: [2.8, 1.4, 0.3], icon: 'JS' },
  { name: 'CSS', color: '#264DE4', position: [-2.2, -1.6, 0.5], icon: 'CSS' },
  { name: 'HTML', color: '#E34F26', position: [2.2, -1.2, 0.5], icon: 'HTML' },
  { name: 'GitHub', color: '#ffffff', position: [0, 2.2, -0.8], icon: 'GH' },
  { name: 'C++', color: '#00599C', position: [0, -2.2, -0.3], icon: 'C++' },
  { name: 'Microsoft', color: '#00A4EF', position: [-3.2, -0.2, -0.8], icon: 'MS' },
]

// Hexagonal tech card with glass effect
const TechHexagon = ({ name, color, position, icon, index }) => {
  const meshRef = useRef()
  const groupRef = useRef()
  const innerRef = useRef()
  const { pointer } = useThree()
  
  useFrame((state) => {
    if (meshRef.current && groupRef.current) {
      // Smooth rotation
      meshRef.current.rotation.y += 0.008
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.1
      
      // Float animation
      const offset = index * 0.7
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + offset) * 0.25
      groupRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * 0.3 + offset) * 0.1
      
      // Mouse reactivity
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, pointer.y * 0.15, 0.03)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, pointer.x * 0.15, 0.03)
    }
    
    if (innerRef.current) {
      innerRef.current.rotation.z += 0.01
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.2}>
      <group ref={groupRef} position={position}>
        {/* Outer glow */}
        <mesh>
          <sphereGeometry args={[0.7, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.08} />
        </mesh>
        
        {/* Main card */}
        <RoundedBox ref={meshRef} args={[1, 1, 0.15]} radius={0.08} smoothness={4}>
          <meshPhysicalMaterial
            color="#0a0a1a"
            metalness={0.2}
            roughness={0.3}
            transparent
            opacity={0.9}
            clearcoat={1}
            clearcoatRoughness={0.1}
            envMapIntensity={0.5}
          />
        </RoundedBox>
        
        {/* Colored border effect */}
        <RoundedBox args={[1.05, 1.05, 0.12]} radius={0.08} smoothness={4}>
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.3}
            emissive={color}
            emissiveIntensity={0.2}
          />
        </RoundedBox>
        
        {/* Inner rotating ring */}
        <group ref={innerRef}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.35, 0.015, 8, 32]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
          </mesh>
        </group>
        
        {/* Icon text */}
        <Text 
          position={[0, 0.08, 0.1]} 
          fontSize={0.22} 
          color={color}
          font="/fonts/Inter-Bold.woff"
          anchorX="center" 
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {icon}
        </Text>
        
        {/* Name label */}
        <Text 
          position={[0, -0.25, 0.1]} 
          fontSize={0.1} 
          color="#ffffff"
          anchorX="center" 
          anchorY="middle"
          transparent
          opacity={0.8}
        >
          {name}
        </Text>
        
        {/* Corner accents */}
        <mesh position={[0.4, 0.4, 0.08]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
        </mesh>
        <mesh position={[-0.4, -0.4, 0.08]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
        </mesh>
      </group>
    </Float>
  )
}

// Enhanced ambient particles
const AmbientParticles = ({ count = 120 }) => {
  const pointsRef = useRef()
  
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const colorOptions = [
      new THREE.Color('#00d4ff'),
      new THREE.Color('#a855f7'),
      new THREE.Color('#6366f1'),
    ]
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6
      
      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)]
      col[i * 3] = color.r
      col[i * 3 + 1] = color.g
      col[i * 3 + 2] = color.b
    }
    return { positions: pos, colors: col }
  }, [count])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.05
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.025} vertexColors transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

// Connection lines between tech icons
const ConnectionLines = () => {
  const linesRef = useRef()
  
  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  const connections = useMemo(() => {
    const lines = []
    const points = TECH_ICONS.map(t => new THREE.Vector3(...t.position))
    
    // Create some connections
    for (let i = 0; i < points.length - 1; i++) {
      if (i % 2 === 0) {
        lines.push([points[i], points[(i + 2) % points.length]])
      }
    }
    return lines
  }, [])

  return (
    <group ref={linesRef}>
      {connections.map((line, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([...line[0].toArray(), ...line[1].toArray()])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00d4ff" transparent opacity={0.15} />
        </line>
      ))}
    </group>
  )
}

const SceneContent = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={0.6} color="#00d4ff" />
      <pointLight position={[0, 5, -5]} intensity={0.4} color="#a855f7" />
      <spotLight position={[0, 10, 0]} angle={0.5} penumbra={1} intensity={0.6} color="#ffffff" />

      <ConnectionLines />
      
      {TECH_ICONS.map((icon, index) => (
        <TechHexagon key={icon.name} {...icon} index={index} />
      ))}

      <AmbientParticles count={100} />
    </>
  )
}

const Loader = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="relative">
      <div className="w-10 h-10 border-2 border-purple-500/30 rounded-full animate-ping"></div>
      <div className="absolute inset-0 w-10 h-10 border-2 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
    </div>
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
