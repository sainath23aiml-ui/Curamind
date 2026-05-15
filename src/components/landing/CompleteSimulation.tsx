import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float, MeshDistortMaterial, Text, PerspectiveCamera, 
  MeshTransmissionMaterial, Float as FloatDrei, 
  Html, Environment, ContactShadows, PresentationControls 
} from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import * as THREE from 'three';

const LuxuryMaterial = ({ color }: { color: string }) => (
  <MeshTransmissionMaterial
    backside
    backsideThickness={5}
    thickness={2}
    samples={10}
    transmission={1}
    clearcoat={1}
    clearcoatRoughness={0}
    chromaticAberration={0.5}
    anisotropy={0.3}
    roughness={0}
    distortion={0.5}
    distortionScale={0.5}
    temporalDistortion={0.1}
    color={color}
    background={new THREE.Color('#080908')}
  />
);

const HumanoidModel = ({ position, color, label }: { position: [number, number, number], color: string, label: string }) => {
  return (
    <group position={position}>
      <FloatDrei speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[0, 0, 0]}>
          <capsuleGeometry args={[0.5, 1.2, 8, 24]} />
          <LuxuryMaterial color={color} />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <LuxuryMaterial color={color} />
        </mesh>
        <Html position={[0, 2.5, 0]} center>
          <div className="bg-black/60 backdrop-blur-xl px-6 py-2 rounded-2xl border border-white/10 text-[10px] font-black text-white whitespace-nowrap uppercase tracking-[0.3em] shadow-2xl">
            {label}
          </div>
        </Html>
      </FloatDrei>
    </group>
  );
};

const DataPulse = ({ from, to, color, active }: { from: [number, number, number], to: [number, number, number], color: string, active: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!meshRef.current || !active) return;
    const t = (clock.elapsedTime % 2) / 2;
    meshRef.current.position.set(
      from[0] + (to[0] - from[0]) * t,
      from[1] + (to[1] - from[1]) * t,
      from[2] + (to[2] - from[2]) * t
    );
    meshRef.current.scale.setScalar(Math.sin(t * Math.PI) * 0.8);
  });

  if (!active) return null;

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={4} 
        toneMapped={false}
      />
    </mesh>
  );
};

const DetailedSimulation = () => {
  const [step, setStep] = useState(0);
  
  const childPos: [number, number, number] = [0, 0, 0];
  const parentPos: [number, number, number] = [-6, 4, 0];
  const teacherPos: [number, number, number] = [6, 4, 0];
  const doctorPos: [number, number, number] = [0, -6, 0];

  useFrame(({ clock }) => {
    const s = Math.floor((clock.elapsedTime % 16) / 4);
    if (s !== step) setStep(s);
  });

  return (
    <group>
      {/* 1. The Child (Advanced Brain Reconstruction) */}
      <group position={childPos}>
        <FloatDrei speed={5} rotationIntensity={step === 0 ? 3 : 1} floatIntensity={step === 0 ? 3 : 1}>
          <mesh>
             <icosahedronGeometry args={[2, 10]} />
             <MeshDistortMaterial
                color={step === 0 ? "#EF4444" : "#EAB308"}
                speed={step === 0 ? 8 : 2}
                distort={step === 0 ? 0.8 : 0.2}
                radius={1}
                emissive={step === 0 ? "#450A0A" : "#422006"}
                emissiveIntensity={2}
             />
          </mesh>
          <mesh visible={step !== 0}>
             <torusGeometry args={[2.5, 0.02, 16, 100]} />
             <meshStandardMaterial color="#22C55E" emissive="#22C55E" emissiveIntensity={5} />
          </mesh>
        </FloatDrei>
      </group>

      {/* Actors */}
      <HumanoidModel position={parentPos} color="#10B981" label="Parental Guard" />
      <HumanoidModel position={teacherPos} color="#F59E0B" label="Learning Guide" />
      <HumanoidModel position={doctorPos} color="#F43F5E" label="Clinical Lead" />

      {/* Workflow Data Streams */}
      <DataPulse from={childPos} to={parentPos} color="#EF4444" active={step === 0 || step === 1} />
      <DataPulse from={parentPos} to={teacherPos} color="#10B981" active={step === 2} />
      <DataPulse from={parentPos} to={doctorPos} color="#10B981" active={step === 2} />
      <DataPulse from={teacherPos} to={childPos} color="#F59E0B" active={step === 3} />
      <DataPulse from={doctorPos} to={childPos} color="#F43F5E" active={step === 3} />

      <Html position={[0, -10, 0]} center>
         <AnimatePresence mode="wait">
            <motion.div
               key={step}
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 1.1 }}
               className="w-[600px] text-center space-y-4 pointer-events-none"
            >
               <h3 className="text-5xl font-black uppercase tracking-tighter text-white">
                  {step === 0 && "System Overload"}
                  {step === 1 && "Pulse Detected"}
                  {step === 2 && "Circle Sync"}
                  {step === 3 && "Restored Order"}
               </h3>
               <p className="text-xl font-medium text-curamind-muted max-w-lg mx-auto leading-relaxed">
                  {step === 0 && "The sensory environment becomes overwhelming. The child faces immediate distress."}
                  {step === 1 && "Safety alerts reach parents instantly. The data is logged and categorized."}
                  {step === 2 && "With one click, the school and clinic are synchronized. No information is lost."}
                  {step === 3 && "Guided by shared data, every caregiver acts in unison to restore peace."}
               </p>
            </motion.div>
         </AnimatePresence>
      </Html>
    </group>
  );
};

export const CompleteSimulation = () => {
  return (
    <div className="w-full aspect-[21/9] bg-[#050505] rounded-[80px] border border-white/5 overflow-hidden relative shadow-[0_0_100px_rgba(0,0,0,0.8)]">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 20], fov: 40 }}>
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 15, 35]} />
        <ambientLight intensity={0.2} />
        <spotLight position={[20, 20, 20]} angle={0.15} penumbra={1} intensity={1} color="#22C55E" />
        <spotLight position={[-20, -20, -20]} angle={0.15} penumbra={1} intensity={1} color="#EF4444" />
        <PresentationControls global rotation={[0, 0, 0]} polar={[-0.1, 0.1]} azimuth={[-0.1, 0.1]} config={{ mass: 2, tension: 500 }}>
          <DetailedSimulation />
        </PresentationControls>
        <ContactShadows position={[0, -10, 0]} opacity={0.4} scale={40} blur={2} far={15} />
        <Environment preset="night" />
      </Canvas>
      <div className="absolute top-12 left-12 flex flex-col gap-4">
         <div className="px-6 py-3 glass rounded-2xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-curamind-green animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Full Simulation Active</span>
         </div>
         <div className="px-6 py-3 glass rounded-2xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-curamind-red" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Sync Latency: 0.2ms</span>
         </div>
      </div>
    </div>
  );
};

export const HeroBackground = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 20], fov: 45 }}>
        <color attach="background" args={['#080908']} />
        <FloatDrei speed={2} rotationIntensity={1} floatIntensity={1}>
           <mesh position={[0, 0, -10]}>
              <icosahedronGeometry args={[8, 15]} />
              <MeshDistortMaterial
                 color="#141414"
                 speed={1}
                 distort={0.4}
                 radius={1}
                 roughness={0.1}
                 metalness={1}
              />
           </mesh>
        </FloatDrei>
        <group>
           {[...Array(100)].map((_, i) => (
              <FloatDrei
                key={i}
                position={[
                  (Math.random() - 0.5) * 40,
                  (Math.random() - 0.5) * 40,
                  (Math.random() - 0.5) * 20
                ]}
                speed={Math.random() * 2 + 1}
              >
                <mesh>
                   <sphereGeometry args={[0.05, 16, 16]} />
                   <meshStandardMaterial 
                     color={['#10B981', '#F43F5E', '#F59E0B'][Math.floor(Math.random() * 3)]} 
                     emissive={['#10B981', '#F43F5E', '#F59E0B'][Math.floor(Math.random() * 3)]} 
                     emissiveIntensity={2} 
                   />
                </mesh>
              </FloatDrei>
           ))}
        </group>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#10B981" />
        <Environment preset="city" />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-curamind-void/40 to-curamind-void" />
    </div>
  );
};
