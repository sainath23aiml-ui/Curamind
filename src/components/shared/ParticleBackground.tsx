/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Particles = ({ count = 2000 }) => {
  const mesh = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const colorPurple = new THREE.Color('#7C6FFF');
    const colorTeal = new THREE.Color('#00E5A0');
    const colorCoral = new THREE.Color('#FF5E7A');

    for (let i = 0; i < count; i++) {
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = THREE.MathUtils.randFloat(0, Math.PI);
      const r = 20 + THREE.MathUtils.randFloat(0, 5);

      temp[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      temp[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      temp[i * 3 + 2] = r * Math.cos(phi);

      const rand = Math.random();
      let color = colorPurple;
      if (rand > 0.6 && rand <= 0.9) color = colorTeal;
      if (rand > 0.9) color = colorCoral;

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { positions: temp, colors };
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.rotation.x = time * 0.05;
      mesh.current.rotation.y = time * 0.075;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

export const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
      <Canvas camera={{ position: [0, 0, 40], fov: 60 }}>
        <Particles />
      </Canvas>
    </div>
  );
};
