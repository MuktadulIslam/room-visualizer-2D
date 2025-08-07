import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Plane } from '@react-three/drei';
import { TextureLoader, RepeatWrapping } from 'three';
import { useTexture } from '@/context/TextureContext';
import Loading from './Loading';

const repetitionThreshold = 1 / 3;

// Wall Component
const Wall = ({ height, width, position }: { height: number; width: number; position: [number, number, number] }) => {
    const { wallTexture } = useTexture();

    // Load texture if available
    const texture = useLoader(TextureLoader, wallTexture?.texture_img || '/textures/floor/tiles1_glossy.webp');

    // Configure texture mapping
    if (texture && wallTexture) {
        // Calculate repeat based on wall dimensions and texture size
        const repeatX = (width * 100) / wallTexture.size[0] * repetitionThreshold; // Convert to cm and calculate repeats
        const repeatY = (height * 100) / wallTexture.size[1] * repetitionThreshold;
        console.log(repeatX, repeatY)

        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(repeatX, repeatY);
    }

    return (
        <Suspense fallback={<Loading />}>
            <Plane
                args={[width, height]}
                position={position}
            >
                <meshStandardMaterial
                    map={texture}
                />
            </Plane>
        </Suspense>
    );
};

// Floor Component
const Floor = ({ length, width }: { length: number; width: number }) => {
    const { floorTexture } = useTexture();

    // Load texture if available, default to first texture
    const texture = useLoader(TextureLoader, floorTexture?.texture_img || '/textures/floor/tiles1_glossy.webp');

    // Configure texture mapping
    if (texture && floorTexture) {
        // Calculate repeat based on floor dimensions and texture size
        const repeatX = (length * 100) / floorTexture.size[0] * repetitionThreshold; // Convert to cm and calculate repeats
        const repeatY = (width * 100) / floorTexture.size[1] * repetitionThreshold;

        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(repeatX, repeatY);
    } else if (texture) {
        // Default texture configuration (assuming first texture size)
        const repeatX = (length * 100) / 30; // Default 30cm tiles
        const repeatY = (width * 100) / 30;

        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(repeatX, repeatY);
    }

    return (
        <Suspense fallback={<Loading />}>
            <Plane
                args={[length, width]}
                rotation={[-Math.PI / 2.3, 0, 0]}
                position={[0, 0, 0]}
            >
                <meshStandardMaterial
                    map={texture}
                />
            </Plane>
        </Suspense>
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
            <ambientLight intensity={2.5} />
            <directionalLight position={[10, 10, 5]} intensity={0.5} />

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
            <Scene />
        </Canvas>
    );
}