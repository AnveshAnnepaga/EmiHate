import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

function EmotionOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1.5, 64, 64]}>
        <MeshDistortMaterial
          color="#3b82f6"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

function ParticleRing({ radius, count, color }: { radius: number; count: number; color: string }) {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = (Math.random() - 0.5) * 0.5;
      const z = Math.sin(angle) * radius;
      pts.push(new THREE.Vector3(x, y, z));
    }
    return pts;
  }, [radius, count]);

  const ref = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.2;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color={color} transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

function DataNodes() {
  const groupRef = useRef<THREE.Group>(null);
  
  const nodes = useMemo(() => {
    return [
      { position: [2.5, 1, 0] as [number, number, number], color: '#3b82f6', label: 'text' },
      { position: [-2.5, 0.5, 1] as [number, number, number], color: '#8b5cf6', label: 'image' },
      { position: [0, -2, 1.5] as [number, number, number], color: '#06b6d4', label: 'document' },
    ];
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <Float key={i} speed={3} rotationIntensity={0.2} floatIntensity={0.5}>
          <mesh position={node.position}>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={0.5}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export function NeuralOrb() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
        
        <EmotionOrb />
        <ParticleRing radius={2.5} count={100} color="#3b82f6" />
        <ParticleRing radius={3} count={80} color="#8b5cf6" />
        <ParticleRing radius={3.5} count={60} color="#06b6d4" />
        <DataNodes />
        
        <Stars radius={50} depth={50} count={1000} factor={2} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
}
