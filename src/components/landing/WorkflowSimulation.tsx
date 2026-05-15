import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Line, Text } from '@react-three/drei';
import * as THREE from 'three';

const FlowPulse = ({ start, end, color, delay = 0 }: { start: [number, number, number], end: [number, number, number], color: string, delay?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = ((clock.elapsedTime + delay) % 3) / 3;
    meshRef.current.position.set(
      start[0] + (end[0] - start[0]) * t,
      start[1] + (end[1] - start[1]) * t,
      start[2] + (end[2] - start[2]) * t
    );
    meshRef.current.scale.setScalar(1 - Math.abs(t - 0.5) * 2);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
    </mesh>
  );
};

const WorkflowModel = () => {
  const homePos: [number, number, number] = [-6, 0, 0];
  const kidPos: [number, number, number] = [0, 0, 0];
  const schoolPos: [number, number, number] = [6, 2, 0];
  const clinicPos: [number, number, number] = [6, -2, 0];

  return (
    <group>
      {/* Home Hub */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={homePos}>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshStandardMaterial color="#22C55E" emissive="#064E3B" emissiveIntensity={1} />
        </mesh>
      </Float>

      {/* The Kid (Center) */}
      <Float speed={3} rotationIntensity={1} floatIntensity={2}>
        <mesh position={kidPos}>
          <sphereGeometry args={[1.5, 64, 64]} />
          <MeshDistortMaterial color="#EAB308" speed={4} distort={0.4} radius={1} />
        </mesh>
        <Text position={[0, -2.5, 0]} fontSize={0.5} color="white" font="/fonts/Inter-Bold.woff">
          YOUR CHILD
        </Text>
      </Float>

      {/* School Hub */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={schoolPos}>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial color="#F97316" emissive="#431407" />
        </mesh>
      </Float>

      {/* Clinic Hub */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={clinicPos}>
          <octahedronGeometry args={[1.2]} />
          <meshStandardMaterial color="#EF4444" emissive="#450A0A" />
        </mesh>
      </Float>

      {/* Connection Lines */}
      <Line points={[homePos, kidPos]} color="#22C55E" lineWidth={1} transparent opacity={0.3} />
      <Line points={[schoolPos, kidPos]} color="#F97316" lineWidth={1} transparent opacity={0.3} />
      <Line points={[clinicPos, kidPos]} color="#EF4444" lineWidth={1} transparent opacity={0.3} />

      {/* Pulses flowing to Kid */}
      <FlowPulse start={homePos} end={kidPos} color="#22C55E" delay={0} />
      <FlowPulse start={homePos} end={kidPos} color="#22C55E" delay={1} />
      <FlowPulse start={schoolPos} end={kidPos} color="#F97316" delay={0.5} />
      <FlowPulse start={clinicPos} end={kidPos} color="#EF4444" delay={1.5} />
      
      {/* Pulses flowing from Kid back to hubs */}
      <FlowPulse start={kidPos} end={homePos} color="#EAB308" delay={2} />
      <FlowPulse start={kidPos} end={schoolPos} color="#EAB308" delay={1} />
      <FlowPulse start={kidPos} end={clinicPos} color="#EAB308" delay={0} />
    </group>
  );
};

export const WorkflowSimulation = () => {
  return (
    <div className="fixed inset-0 z-0 bg-curamind-void">
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, -5]} intensity={1} color="#22C55E" />
        <WorkflowModel />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(8,9,8,0.8)_80%)] pointer-events-none" />
    </div>
  );
};
