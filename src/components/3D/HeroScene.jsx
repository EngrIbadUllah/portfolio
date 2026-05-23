import React, { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sphere, Torus, Icosahedron } from '@react-three/drei'
import * as THREE from 'three'

// AI Neural Network Node
const NeuralNode = ({ position, color, scale = 1, pulseSpeed = 1 }) => {
  const meshRef = useRef()
  const glowRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.15 + 1
      meshRef.current.scale.setScalar(scale * pulse)
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(scale * 1.5 + Math.sin(state.clock.elapsedTime * pulseSpeed * 0.5) * 0.2)
    }
  })

  return (
    <group position={position}>
      {/* Glow sphere */}
      <Sphere ref={glowRef} args={[0.15, 16, 16]}>
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </Sphere>
      {/* Core node */}
      <Sphere ref={meshRef} args={[0.1, 32, 32]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </Sphere>
    </group>
  )
}

// AI Neural Connection Line
const NeuralConnection = ({ start, end, color, delay = 0 }) => {
  const lineRef = useRef()
  const particleRef = useRef()
  
  const points = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(
        (start[0] + end[0]) / 2 + (Math.random() - 0.5) * 0.5,
        (start[1] + end[1]) / 2 + (Math.random() - 0.5) * 0.5,
        (start[2] + end[2]) / 2 + 0.3
      ),
      new THREE.Vector3(...end)
    )
    return curve.getPoints(20)
  }, [start, end])

  useFrame((state) => {
    if (particleRef.current) {
      const t = ((state.clock.elapsedTime + delay) % 2) / 2
      const index = Math.floor(t * (points.length - 1))
      if (points[index]) {
        particleRef.current.position.copy(points[index])
      }
    }
  })

  return (
    <group>
      <line ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length}
            array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.3} />
      </line>
      {/* Data particle moving along the line */}
      <Sphere ref={particleRef} args={[0.03, 8, 8]}>
        <meshBasicMaterial color={color} />
      </Sphere>
    </group>
  )
}

// Central AI Brain Core
const AIBrainCore = () => {
  const coreRef = useRef()
  const innerRef = useRef()
  const { pointer } = useThree()
  
  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.x = THREE.MathUtils.lerp(
        coreRef.current.rotation.x,
        pointer.y * 0.3,
        0.05
      )
      coreRef.current.rotation.y = THREE.MathUtils.lerp(
        coreRef.current.rotation.y,
        pointer.x * 0.3 + state.clock.elapsedTime * 0.2,
        0.05
      )
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -state.clock.elapsedTime * 0.5
      innerRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={coreRef}>
        {/* Outer shell */}
        <Icosahedron args={[1.2, 1]}>
          <meshStandardMaterial
            color="#00d4ff"
            wireframe
            transparent
            opacity={0.4}
            emissive="#00d4ff"
            emissiveIntensity={0.2}
          />
        </Icosahedron>
        
        {/* Inner core */}
        <group ref={innerRef}>
          <Sphere args={[0.8, 64, 64]}>
            <MeshDistortMaterial
              color="#a855f7"
              attach="material"
              distort={0.25}
              speed={3}
              roughness={0.1}
              metalness={0.9}
              transparent
              opacity={0.9}
              emissive="#a855f7"
              emissiveIntensity={0.3}
            />
          </Sphere>
        </group>

        {/* Energy rings */}
        <Torus args={[1.5, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.5} transparent opacity={0.6} />
        </Torus>
        <Torus args={[1.7, 0.015, 16, 100]} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.5} transparent opacity={0.5} />
        </Torus>
        <Torus args={[1.9, 0.01, 16, 100]} rotation={[Math.PI / 4, -Math.PI / 3, 0]}>
          <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.5} transparent opacity={0.4} />
        </Torus>
      </group>
    </Float>
  )
}

// Data Flow Particles
const DataParticles = ({ count = 150 }) => {
  const pointsRef = useRef()
  
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const colorOptions = [
      new THREE.Color('#00d4ff'),
      new THREE.Color('#a855f7'),
      new THREE.Color('#6366f1'),
      new THREE.Color('#ec4899')
    ]
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 2.5 + Math.random() * 3
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
      
      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)]
      col[i * 3] = color.r
      col[i * 3 + 1] = color.g
      col[i * 3 + 2] = color.b
    }
    return { positions: pos, colors: col }
  }, [count])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.08
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.7} sizeAttenuation />
    </points>
  )
}

// Floating Binary Code Effect
const BinaryRing = ({ radius, speed = 1, yPos = 0 }) => {
  const ringRef = useRef()
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = state.clock.elapsedTime * speed
    }
  })

  const segments = 12
  const segmentPositions = useMemo(() => {
    return Array.from({ length: segments }, (_, i) => {
      const angle = (i / segments) * Math.PI * 2
      return [Math.cos(angle) * radius, yPos, Math.sin(angle) * radius]
    })
  }, [radius, yPos])

  return (
    <group ref={ringRef}>
      {segmentPositions.map((pos, i) => (
        <Sphere key={i} args={[0.03, 8, 8]} position={pos}>
          <meshBasicMaterial color={i % 2 === 0 ? '#00d4ff' : '#a855f7'} />
        </Sphere>
      ))}
    </group>
  )
}

// Neural Network Layer
const NeuralNetworkLayer = () => {
  const nodePositions = useMemo(() => [
    [-2, 1.5, -1],
    [-2.5, 0, -0.5],
    [-2, -1.5, -1],
    [2, 1.5, -1],
    [2.5, 0, -0.5],
    [2, -1.5, -1],
    [0, 2.2, -1.5],
    [0, -2.2, -1.5],
  ], [])

  const connections = useMemo(() => [
    { start: nodePositions[0], end: nodePositions[3], delay: 0 },
    { start: nodePositions[1], end: nodePositions[4], delay: 0.5 },
    { start: nodePositions[2], end: nodePositions[5], delay: 1 },
    { start: nodePositions[0], end: nodePositions[6], delay: 1.5 },
    { start: nodePositions[3], end: nodePositions[6], delay: 0.3 },
    { start: nodePositions[1], end: nodePositions[7], delay: 0.8 },
    { start: nodePositions[4], end: nodePositions[7], delay: 1.2 },
  ], [nodePositions])

  return (
    <group>
      {/* Neural Nodes */}
      {nodePositions.map((pos, i) => (
        <NeuralNode
          key={i}
          position={pos}
          color={i < 3 ? '#00d4ff' : i < 6 ? '#a855f7' : '#ec4899'}
          scale={0.8 + Math.random() * 0.4}
          pulseSpeed={1 + Math.random() * 0.5}
        />
      ))}
      
      {/* Neural Connections */}
      {connections.map((conn, i) => (
        <NeuralConnection
          key={i}
          start={conn.start}
          end={conn.end}
          color="#00d4ff"
          delay={conn.delay}
        />
      ))}
    </group>
  )
}

// Main scene content
const SceneContent = () => {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#00d4ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.6} color="#a855f7" />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.8} color="#00d4ff" castShadow />
      <spotLight position={[0, -10, 5]} angle={0.5} penumbra={1} intensity={0.4} color="#a855f7" />

      <AIBrainCore />
      <NeuralNetworkLayer />
      <DataParticles count={120} />
      
      {/* Binary rings */}
      <BinaryRing radius={3} speed={0.3} yPos={0.5} />
      <BinaryRing radius={3.5} speed={-0.2} yPos={-0.5} />
    </>
  )
}

const Loader = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="relative">
      <div className="w-12 h-12 border-2 border-cyan-500/30 rounded-full animate-ping"></div>
      <div className="absolute inset-0 w-12 h-12 border-2 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
    </div>
  </div>
)

const HeroScene = ({ className = '' }) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Suspense fallback={<Loader />}>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 60 }}
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

export default HeroScene
