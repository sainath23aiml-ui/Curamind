import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Points, PointMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';

const NeuralNodes = () => {
  const points = useMemo(() => {
    const p = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      p[i * 3] = (Math.random() - 0.5) * 20;
      p[i * 3 + 1] = (Math.random() - 0.5) * 20;
      p[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return p;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += 0.0005;
    pointsRef.current.rotation.x += 0.0002;
    
    // Slight pulse based on time
    const s = 1 + Math.sin(state.clock.elapsedTime) * 0.02;
    pointsRef.current.scale.set(s, s, s);
  });

  return (
    <group>
      <Points ref={pointsRef} positions={points} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#818CF8"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.6}
        />
      </Points>
      
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[4, 2, -5]}>
          <sphereGeometry args={[2, 64, 64]} />
          <MeshDistortMaterial
            color="#4F46E5"
            speed={2}
            distort={0.3}
            radius={1}
            emissive="#1E1B4B"
            emissiveIntensity={1}
          />
        </mesh>
      </Float>

      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[-5, -3, -2]}>
          <sphereGeometry args={[1.5, 64, 64]} />
          <MeshDistortMaterial
            color="#0D9488"
            speed={4}
            distort={0.5}
            radius={1}
            emissive="#042F2E"
            emissiveIntensity={1}
          />
        </mesh>
      </Float>
    </group>
  );
};

export const NeuralBackground = () => {
  return (
    <div className="fixed inset-0 z-0 bg-curamind-void">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <fog attach="fog" args={['#0A0A0B', 10, 25]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#818CF8" />
        <pointLight position={[-10, -10, -5]} intensity={1} color="#0D9488" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <NeuralNodes />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-curamind-void/20 via-curamind-void/40 to-curamind-void pointer-events-none" />
    </div>
  );
};
