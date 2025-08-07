import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Plane } from '@react-three/drei';

// Wall Component
const Wall = ({ height, width, position }: { height: number; width: number; position: [number, number, number] }) => {
    return (
        <Plane
            args={[width, height]}
            position={position}
        >
            <meshStandardMaterial color="#d0ff00" />
        </Plane>
    );
};

// Floor Component
const Floor = ({ length, width }: { length: number; width: number }) => {
    return (
        <Plane
            args={[length, width]}
            rotation={[-Math.PI / 2.3, 0, 0]}
            position={[0, 0, 0]}
        >
            <meshStandardMaterial color="#8B4513" />
        </Plane>
    );
};

const CameraController = () => {
  const controlsRef = useRef<any>(null);
  
  useFrame((state) => {
    if (controlsRef.current) {
    console.log(state.camera)
    }
  });

  return <OrbitControls ref={controlsRef} enablePan={true} enableDamping={false} dampingFactor={0} />;
};


// Main Scene Component
const Scene = () => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <Floor length={14} width={6} />
            <Wall
                height={8}
                width={14}
                position={[0.35, 4.5, -3]}
            />
        </>
    );
};


export default function Room() {
    return (
        <Canvas
            camera={{
                position: [-0.12239314916888053, 2.0429538317082687, 4.976077776675754],
                rotation: [-0.0067726905102693845, 0.020309902788936303, 0.0001375453316877022],
                fov: 75,
                near: 0.1,
                far: 1000,
            }}
            className="w-full h-full"
        >
            {/* <CameraController/> */}
            <Scene />
        </Canvas>
    );
}