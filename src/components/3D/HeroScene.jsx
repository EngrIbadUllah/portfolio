import React, { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sphere, Torus, Icosahedron, Octahedron } from '@react-three/drei'
import * as THREE from 'three'

// Animated floating geometric shapes
const FloatingGeometry = ({ position, geometry, color, speed = 1, distort = 0.3 }) => {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.2
      meshRef.current.rotation.y += 0.005 * speed
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * speed * 0.2) * 0.1
    }
  })

  const GeometryComponent = {
    sphere: Sphere,
    torus: Torus,
    icosahedron: Icosahedron,
    octahedron: Octahedron
  }[geometry] || Sphere

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <GeometryComponent ref={meshRef} args={geometry === 'torus' ? [1, 0.4, 32, 32] : [1, 4]} position={position} scale={0.8}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.7}
        />
      </GeometryComponent>
    </Float>
  )
}

// Mouse-reactive central orb
const CentralOrb = () => {
  const meshRef = useRef()
  const { pointer } = useThree()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        pointer.y * 0.5,
        0.05
      )
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        pointer.x * 0.5,
        0.05
      )
      
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
      meshRef.current.scale.setScalar(scale)
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <Icosahedron ref={meshRef} args={[1.5, 4]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#00d4ff"
          attach="material"
          distort={0.4}
          speed={3}
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.85}
          emissive="#00d4ff"
          emissiveIntensity={0.2}
        />
      </Icosahedron>
    </Float>
  )
}

// Orbiting rings
const OrbitingRing = ({ radius, speed, color, thickness = 0.02 }) => {
  const ringRef = useRef()
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = state.clock.elapsedTime * speed * 0.5
      ringRef.current.rotation.y = state.clock.elapsedTime * speed
    }
  })

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[radius, thickness, 16, 100]} />
      <meshStandardMaterial 
        color={color} 
        transparent 
        opacity={0.4} 
        metalness={0.8} 
        roughness={0.2}
        emissive={color}
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}

// Particle field around the scene
const ParticleField = ({ count = 200 }) => {
  const points = useRef()
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 3 + Math.random() * 4
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
    }
    return positions
  }, [count])

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.05
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#a855f7"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

// Main scene content
const SceneContent = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00d4ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.5} color="#00d4ff" />

      <CentralOrb />

      <OrbitingRing radius={2.2} speed={0.5} color="#00d4ff" thickness={0.015} />
      <OrbitingRing radius={2.8} speed={-0.3} color="#a855f7" thickness={0.01} />
      <OrbitingRing radius={3.4} speed={0.2} color="#6366f1" thickness={0.008} />

      <FloatingGeometry position={[-3, 1.5, -2]} geometry="octahedron" color="#a855f7" speed={0.8} distort={0.2} />
      <FloatingGeometry position={[3, -1, -1]} geometry="icosahedron" color="#00d4ff" speed={1.2} distort={0.25} />
      <FloatingGeometry position={[-2, -2, 1]} geometry="torus" color="#6366f1" speed={0.6} distort={0.15} />
      <FloatingGeometry position={[2.5, 2, 0]} geometry="sphere" color="#ec4899" speed={1} distort={0.3} />

      <ParticleField count={150} />
    </>
  )
}

const Loader = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
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
