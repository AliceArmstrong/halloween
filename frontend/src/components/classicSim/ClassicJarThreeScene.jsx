import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { CLASSIC_SIM_CONFIG } from "./simulationConfig";
import {
  createParticleDescriptors,
  getVoteCount,
  scaleParticleCounts,
} from "./particleUtils";

function JarVisual({ x }) {
  const jar = CLASSIC_SIM_CONFIG.jars;

  return (
    <group position={[x, jar.floorY + jar.height / 2, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[jar.width, jar.height, 0.08]} />
        <meshPhysicalMaterial
          color="#ddeaf9"
          transparent
          opacity={0.18}
          roughness={0.08}
          metalness={0.06}
          transmission={0.86}
        />
      </mesh>

      <mesh position={[-jar.width / 2, 0, 0]}>
        <boxGeometry args={[jar.wallThickness, jar.height, jar.depth]} />
        <meshStandardMaterial color="#d6e4f8" transparent opacity={0.35} />
      </mesh>

      <mesh position={[jar.width / 2, 0, 0]}>
        <boxGeometry args={[jar.wallThickness, jar.height, jar.depth]} />
        <meshStandardMaterial color="#d6e4f8" transparent opacity={0.35} />
      </mesh>

      <mesh position={[0, -jar.height / 2, 0]}>
        <boxGeometry args={[jar.width, jar.floorThickness, jar.depth]} />
        <meshStandardMaterial color="#d6e4f8" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function JarColliders({ x }) {
  const jar = CLASSIC_SIM_CONFIG.jars;
  const centerY = jar.floorY + jar.height / 2;

  return (
    <>
      <CuboidCollider
        args={[jar.wallThickness / 2, jar.height / 2, jar.depth / 2]}
        position={[x - jar.width / 2, centerY, 0]}
      />
      <CuboidCollider
        args={[jar.wallThickness / 2, jar.height / 2, jar.depth / 2]}
        position={[x + jar.width / 2, centerY, 0]}
      />
      <CuboidCollider
        args={[jar.width / 2, jar.floorThickness / 2, jar.depth / 2]}
        position={[x, jar.floorY, 0]}
      />
    </>
  );
}

function WaterParticle({ descriptor }) {
  return (
    <RigidBody
      colliders="ball"
      restitution={0.28}
      friction={0.18}
      linearDamping={0.19}
      angularDamping={0.22}
      position={descriptor.position}
    >
      <mesh castShadow>
        <sphereGeometry args={[descriptor.radius, 16, 16]} />
        <meshPhysicalMaterial
          color="#4f9fff"
          emissive="#1d4a85"
          emissiveIntensity={0.13}
          roughness={0.05}
          transmission={0.94}
          transparent
          opacity={0.7}
          ior={1.33}
        />
      </mesh>
    </RigidBody>
  );
}

function SandParticle({ descriptor }) {
  const tint = 0.84 + Math.random() * 0.22;
  const color = `rgb(${Math.round(180 * tint)}, ${Math.round(122 * tint)}, ${Math.round(
    68 * tint
  )})`;

  return (
    <RigidBody
      colliders="ball"
      restitution={0.04}
      friction={1.1}
      linearDamping={0.52}
      angularDamping={0.64}
      position={descriptor.position}
    >
      <mesh castShadow>
        <sphereGeometry args={[descriptor.radius * 0.9, 10, 10]} />
        <meshStandardMaterial color={color} roughness={0.95} metalness={0.02} />
      </mesh>
    </RigidBody>
  );
}

function SimulationWorld({ options, votes }) {
  const leftOption = options[0];
  const rightOption = options[1];

  const particleDescriptors = useMemo(() => {
    if (!leftOption || !rightOption) {
      return [];
    }

    const leftVotes = getVoteCount(votes, leftOption.key);
    const rightVotes = getVoteCount(votes, rightOption.key);
    const counts = scaleParticleCounts(leftVotes, rightVotes);

    const leftParticles = createParticleDescriptors({
      count: counts.leftParticles,
      type: "water",
      jarX: CLASSIC_SIM_CONFIG.jars.leftX,
    });

    const rightParticles = createParticleDescriptors({
      count: counts.rightParticles,
      type: "sand",
      jarX: CLASSIC_SIM_CONFIG.jars.rightX,
    });

    return [...leftParticles, ...rightParticles];
  }, [leftOption, rightOption, votes]);

  return (
    <>
      <color attach="background" args={["#0f1828"]} />

      {/* Lighting stack: strong key from above + soft fill for readable particles. */}
      <ambientLight intensity={0.42} />
      <directionalLight
        castShadow
        position={[3.5, 11, 7]}
        intensity={1.08}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-6, 5, 4]} intensity={0.42} color="#8ab5e8" />

      {/* This board catches shadows and gives depth cues under the jars. */}
      <mesh receiveShadow position={[0, -0.12, 0]}>
        <boxGeometry args={[15.5, 0.24, 4.6]} />
        <meshStandardMaterial color="#1a2438" roughness={0.9} metalness={0.1} />
      </mesh>

      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[14.8, 0.05, 3.8]} />
        <meshStandardMaterial color="#2b3a55" transparent opacity={0.45} />
      </mesh>

      <JarVisual x={CLASSIC_SIM_CONFIG.jars.leftX} />
      <JarVisual x={CLASSIC_SIM_CONFIG.jars.rightX} />

      <Physics gravity={[0, -19, 0]}>
        {/* World bounds stop particles from leaking outside camera frame. */}
        <CuboidCollider args={[8.2, 0.15, 3]} position={[0, -0.15, 0]} />
        <CuboidCollider args={[0.15, 8, 3]} position={[-8.2, 4, 0]} />
        <CuboidCollider args={[0.15, 8, 3]} position={[8.2, 4, 0]} />

        {/* Jars are colliders + separate transparent visual meshes for realism. */}
        <JarColliders x={CLASSIC_SIM_CONFIG.jars.leftX} />
        <JarColliders x={CLASSIC_SIM_CONFIG.jars.rightX} />

        {particleDescriptors.map((descriptor) =>
          descriptor.type === "water" ? (
            <WaterParticle key={descriptor.key} descriptor={descriptor} />
          ) : (
            <SandParticle key={descriptor.key} descriptor={descriptor} />
          )
        )}
      </Physics>

      {/* Locked controls let users inspect depth without disorienting the scene. */}
      <OrbitControls
        enablePan={false}
        minDistance={11.5}
        maxDistance={21}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI / 2.3}
      />
    </>
  );
}

export default function ClassicJarThreeScene({ options, votes }) {
  const camera = CLASSIC_SIM_CONFIG.viewport;

  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      camera={{
        fov: camera.fov,
        near: camera.near,
        far: camera.far,
        position: camera.cameraPosition,
      }}
    >
      <SimulationWorld options={options} votes={votes} />
    </Canvas>
  );
}
