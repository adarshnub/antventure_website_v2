"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Group, InstancedMesh } from "three";
import { Object3D } from "three";

const targets = [
  [-2.8, 1.45, 0], [-2.8, 0.45, 0], [-2.8, -0.55, 0], [-2.8, -1.55, 0],
  [0, 0, 0], [2.8, 1.2, 0], [2.8, 0.2, 0], [2.8, -0.8, 0],
] as [number, number, number][];

function Particles() {
  const ref = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const points = useMemo(() => Array.from({ length: 90 }, (_, i) => ({
    angle: (i / 90) * Math.PI * 2,
    radius: 2.2 + (i % 7) * 0.14,
    speed: 0.08 + (i % 5) * 0.008,
    z: ((i % 11) - 5) * 0.08,
  })), []);

  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;
    const time = clock.getElapsedTime();
    points.forEach((point, index) => {
      const a = point.angle + time * point.speed;
      dummy.position.set(Math.cos(a) * point.radius, Math.sin(a) * point.radius * 0.64, point.z);
      const scale = 0.45 + ((index % 4) * 0.1);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, points.length]}>
      <sphereGeometry args={[0.035, 7, 7]} />
      <meshBasicMaterial color="#f4a261" transparent opacity={0.5} />
    </instancedMesh>
  );
}

function Diagram() {
  const group = useRef<Group>(null);
  useFrame(({ clock, pointer }, delta) => {
    const diagram = group.current;
    if (!diagram) return;
    diagram.rotation.y += (pointer.x * 0.28 - diagram.rotation.y) * Math.min(1, delta * 3);
    diagram.rotation.x += (-pointer.y * 0.16 - diagram.rotation.x) * Math.min(1, delta * 3);
    diagram.position.y = Math.sin(clock.getElapsedTime() * 0.55) * 0.06;
  });
  return (
    <group ref={group}>
      {targets.map((position, index) => (
        <mesh position={position} key={index}>
          <sphereGeometry args={[index === 4 ? 0.2 : 0.11, 16, 16]} />
          <meshBasicMaterial color={index === 4 ? "#ff6b5f" : index < 4 ? "#31d3b0" : "#5b8cff"} />
        </mesh>
      ))}
      {targets.slice(0, 4).map((point, index) => <Line key={`in-${index}`} points={[point, targets[4]]} color="#31d3b0" lineWidth={0.7} transparent opacity={0.55} />)}
      {targets.slice(5).map((point, index) => <Line key={`out-${index}`} points={[targets[4], point]} color="#5b8cff" lineWidth={0.8} transparent opacity={0.62} />)}
      <Particles />
    </group>
  );
}

export default function WorkflowScene() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 7], fov: 48, near: 0.1, far: 20 }} frameloop="always" gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}>
      <Diagram />
    </Canvas>
  );
}
