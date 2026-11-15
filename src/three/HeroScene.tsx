import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { useEffect } from 'react'
import * as THREE from 'three'

type RibbonProps = {
  color: string
  width: number
  length: number
  segments: number
  phase: number
  amp: number
  twist: number
  speed: number
  y: number
  z: number
  sheen?: string
  roughness?: number
  metalness?: number
  delay?: number
}

/** A flowing satin ribbon — geometry re-computed on the CPU every frame (cheap: ~segments×6 verts). */
function Ribbon({ color, width, length, segments, phase, amp, twist, speed, y, z, sheen = '#ffffff', roughness = 0.42, metalness = 0, delay = 0 }: RibbonProps) {
  const mesh = useRef<THREE.Mesh>(null!)
  const across = 6
  const geo = useMemo(() => new THREE.PlaneGeometry(1, 1, segments, across - 1), [segments])
  const pointer = useThree((s) => s.pointer)
  const start = useRef<number | null>(null)
  const tmpN = useMemo(() => new THREE.Vector3(), [])
  const tmpB = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (start.current === null) start.current = t
    const intro = THREE.MathUtils.smoothstep(t - start.current - delay, 0, 2.4) // 0→1 sweep-in
    const pos = geo.attributes.position as THREE.BufferAttribute
    const cols = segments + 1
    const px = pointer.x * length * 0.5
    const py = pointer.y * 1.2
    for (let i = 0; i < cols; i++) {
      const u = i / segments
      const x = (u - 0.5) * length * (0.35 + 0.65 * intro)
      const w = t * speed + u * 6.0 + phase
      // proximity to pointer → swell
      const d = Math.exp(-((x - px) ** 2) / 6)
      const cy = y + Math.sin(w) * amp + Math.sin(w * 0.47 + 1.3) * amp * 0.6 + d * (py - y) * 0.25
      const cz = z + Math.cos(w * 0.8) * amp * 0.9
      const ang = u * twist + t * speed * 0.6 + phase + d * 0.6
      // ribbon cross-section direction (rotating around the travel axis)
      tmpB.set(0, Math.cos(ang), Math.sin(ang))
      const taper = Math.sin(Math.PI * Math.min(1, Math.max(0, u))) ** 0.5
      for (let j = 0; j < across; j++) {
        const v = j / (across - 1) - 0.5
        tmpN.copy(tmpB).multiplyScalar(v * width * taper * (0.2 + 0.8 * intro))
        pos.setXYZ(j * cols + i, x, cy + tmpN.y, cz + tmpN.z)
      }
    }
    pos.needsUpdate = true
    geo.computeVertexNormals()
  })

  return (
    <mesh ref={mesh} geometry={geo} frustumCulled={false}>
      <meshPhysicalMaterial
        color={color}
        side={THREE.DoubleSide}
        roughness={roughness}
        metalness={metalness}
        sheen={1}
        sheenRoughness={0.35}
        sheenColor={sheen}
        clearcoat={0.35}
        clearcoatRoughness={0.4}
      />
    </mesh>
  )
}

function Rig({ children }: { children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null!)
  useFrame(({ pointer }, dt) => {
    g.current.rotation.y = THREE.MathUtils.damp(g.current.rotation.y, pointer.x * 0.18, 2.5, dt)
    g.current.rotation.x = THREE.MathUtils.damp(g.current.rotation.x, -pointer.y * 0.12, 2.5, dt)
  })
  return <group ref={g}>{children}</group>
}

function Pearls({ count }: { count: number }) {
  const ref = useRef<THREE.InstancedMesh>(null!)
  const data = useMemo(
    () => Array.from({ length: count }, () => ({ x: Math.random() * 7 - 1, y: (Math.random() - 0.5) * 6, z: (Math.random() - 0.5) * 4 - 1, s: 0.03 + Math.random() * 0.07, sp: 0.2 + Math.random() * 0.5, p: Math.random() * 6 })),
    [count],
  )
  const m = useMemo(() => new THREE.Object3D(), [])
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    data.forEach((d, i) => {
      m.position.set(d.x + Math.sin(t * d.sp + d.p) * 0.3, d.y + Math.cos(t * d.sp * 0.8 + d.p) * 0.4, d.z)
      m.scale.setScalar(d.s)
      m.updateMatrix()
      ref.current.setMatrixAt(i, m.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
  })
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshPhysicalMaterial color="#f6efe4" roughness={0.15} clearcoat={1} sheen={1} sheenColor="#ffd9c9" />
    </instancedMesh>
  )
}

/** Soft studio reflections without loading HDR files (three's procedural RoomEnvironment). */
function StudioEnv() {
  const { gl, scene } = useThree()
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = env
    scene.environmentIntensity = 0.55
    return () => { env.dispose(); pmrem.dispose(); scene.environment = null }
  }, [gl, scene])
  return null
}

export default function HeroScene({ lite = false, still = false }: { lite?: boolean; still?: boolean }) {
  const seg = lite ? 120 : 260
  return (
    <Canvas
      dpr={lite ? [1, 1.4] : [1, 1.8]}
      camera={{ position: [0, 0, 9], fov: 38 }}
      gl={{ antialias: !lite, alpha: true, powerPreference: 'high-performance' }}
      frameloop={still ? 'demand' : 'always'}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 6]} intensity={1.6} color="#fff6ea" />
      <directionalLight position={[-6, -2, 3]} intensity={0.6} color="#ffd1c4" />
      <group position={lite ? [0.4, -1.9, 0] : [2.6, -0.15, 0]} rotation={[0, 0, lite ? 0.12 : 0.18]}>
      <Rig>
        <Ribbon color="#ec1d25" sheen="#ff8a7a" width={1.15} length={16} segments={seg} phase={0} amp={0.9} twist={4.2} speed={0.45} y={0.3} z={0} roughness={0.38} />
        <Ribbon color="#f4ece0" sheen="#ffffff" width={1.6} length={17} segments={seg} phase={2.2} amp={1.1} twist={3.1} speed={0.38} y={-0.6} z={-1.2} delay={0.25} roughness={0.5} />
        {!lite && <Ribbon color="#1c1a18" sheen="#c9a26b" width={0.35} length={15} segments={seg} phase={4.1} amp={0.7} twist={6} speed={0.52} y={0.9} z={0.8} delay={0.5} roughness={0.3} metalness={0.2} />}
        <Pearls count={lite ? 6 : 12} />
      </Rig>
      </group>
      <StudioEnv />
    </Canvas>
  )
}
