import React, { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const ParticleSystem = ({ count = 500 }) => {
  const pointsRef = useRef()
  const { pointer, viewport } = useThree()
  
  const { positions, originalPositions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const origPos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 2 + Math.random() * 8
      
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi) - 5
      
      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z
      
      origPos[i * 3] = x
      origPos[i * 3 + 1] = y
      origPos[i * 3 + 2] = z
      
      vel[i * 3] = 0
      vel[i * 3 + 1] = 0
      vel[i * 3 + 2] = 0
    }
    
    return { positions: pos, originalPositions: origPos, velocities: vel }
  }, [count])

  const colors = useMemo(() => {
    const cols = new Float32Array(count * 3)
    const color1 = new THREE.Color('#00d4ff')
    const color2 = new THREE.Color('#a855f7')
    const color3 = new THREE.Color('#6366f1')
    
    for (let i = 0; i < count; i++) {
      const t = Math.random()
      const color = t < 0.5 
        ? color1.clone().lerp(color2, t * 2)
        : color2.clone().lerp(color3, (t - 0.5) * 2)
      
      cols[i * 3] = color.r
      cols[i * 3 + 1] = color.g
      cols[i * 3 + 2] = color.b
    }
    
    return cols
  }, [count])

  useFrame((state) => {
    if (!pointsRef.current) return
    
    const positionAttribute = pointsRef.current.geometry.attributes.position
    const array = positionAttribute.array
    
    const mouseX = pointer.x * viewport.width * 0.5
    const mouseY = pointer.y * viewport.height * 0.5
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      const x = array[i3]
      const y = array[i3 + 1]
      const z = array[i3 + 2]
      
      const dx = mouseX - x
      const dy = mouseY - y
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      if (dist < 2) {
        const force = (2 - dist) / 2
        velocities[i3] -= dx * force * 0.01
        velocities[i3 + 1] -= dy * force * 0.01
      }
      
      velocities[i3] += (originalPositions[i3] - x) * 0.005
      velocities[i3 + 1] += (originalPositions[i3 + 1] - y) * 0.005
      velocities[i3 + 2] += (originalPositions[i3 + 2] - z) * 0.005
      
      velocities[i3] *= 0.95
      velocities[i3 + 1] *= 0.95
      velocities[i3 + 2] *= 0.95
      
      array[i3] += velocities[i3]
      array[i3 + 1] += velocities[i3 + 1]
      array[i3 + 2] += velocities[i3 + 2]
      
      array[i3 + 1] += Math.sin(state.clock.elapsedTime * 0.5 + i * 0.01) * 0.002
    }
    
    positionAttribute.needsUpdate = true
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

const LightOrbs = () => {
  const orbsRef = useRef([])
  
  const orbData = useMemo(() => [
    { position: [4, 3, -3], color: '#00d4ff', size: 0.15 },
    { position: [-5, -2, -4], color: '#a855f7', size: 0.12 },
    { position: [3, -4, -2], color: '#6366f1', size: 0.1 },
    { position: [-3, 4, -5], color: '#ec4899', size: 0.08 },
  ], [])

  useFrame((state) => {
    orbsRef.current.forEach((orb, i) => {
      if (orb) {
        const offset = i * 1.5
        orb.position.y = orbData[i].position[1] + Math.sin(state.clock.elapsedTime + offset) * 0.5
        orb.position.x = orbData[i].position[0] + Math.cos(state.clock.elapsedTime * 0.5 + offset) * 0.3
      }
    })
  })

  return (
    <>
      {orbData.map((orb, i) => (
        <mesh key={i} ref={el => orbsRef.current[i] = el} position={orb.position}>
          <sphereGeometry args={[orb.size, 16, 16]} />
          <meshBasicMaterial color={orb.color} transparent opacity={0.8} />
        </mesh>
      ))}
    </>
  )
}

const SceneContent = () => {
  return (
    <>
      <ambientLight intensity={0.1} />
      <ParticleSystem count={400} />
      <LightOrbs />
    </>
  )
}

const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <SceneContent />
        </Canvas>
      </Suspense>
    </div>
  )
}

export default ParticleBackground
