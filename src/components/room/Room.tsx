import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Plane } from '@react-three/drei';
import { TextureLoader, RepeatWrapping } from 'three';
import { useTexture } from '@/context/TextureContext';

const repetitionThreshold = 1 / 3;

// Wall Component
const Wall = ({ height, width, position }: { height: number; width: number; position: [number, number, number] }) => {
    const { wallTexture, wallColor } = useTexture();

    console.log('Wall - wallTexture:', wallTexture);
    if (!wallTexture?.texture_img) {
        return (
            <mesh position={position}>
                <planeGeometry args={[width, height]} />
                <meshBasicMaterial color={wallColor?.hex || '#cccccc'} />
            </mesh>
        );
    }

    const texture = useLoader(TextureLoader, wallTexture.texture_img);

    // Configure texture mapping
    if (texture && wallTexture.size) {
        const repeatX = (width * 100) / wallTexture.size[0] * repetitionThreshold;
        const repeatY = (height * 100) / wallTexture.size[1] * repetitionThreshold;
        console.log('Wall texture repeats:', repeatX, repeatY);

        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(repeatX, repeatY);
    }
    console.log("texture: ", texture);

    return (
        <mesh position={position}>
            <planeGeometry args={[width, height]} />
            <meshStandardMaterial map={texture} />
        </mesh>
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
        const repeatX = (length * 100) / floorTexture.size[0] * repetitionThreshold;
        const repeatY = (width * 100) / floorTexture.size[1] * repetitionThreshold;

        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(repeatX, repeatY);
    }

    return (
        <Plane
            args={[length, width]}
            rotation={[-Math.PI / 2.3, 0, 0]}
            position={[0, 0, 0]}
        >
            <meshStandardMaterial map={texture} />
        </Plane>
    );
};

const CameraController = () => {
    const controlsRef = useRef<any>(null);

    useFrame((state) => {
        if (controlsRef.current) {
            console.log(state.camera);
        }
    });

    return <OrbitControls ref={controlsRef} enablePan={true} enableDamping={false} dampingFactor={0} />;
};

// Main Scene Component
const Scene = () => {
    return (
        <>
            <ambientLight intensity={2} />
            <Suspense>
                <Floor length={14} width={6} />
            </Suspense>
            <Suspense>
                <Wall
                    height={8}
                    width={14}
                    position={[0.35, 4.5, -3]}
                />
            </Suspense>
            {/* <CameraController /> */}
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
            <Suspense>
                <Scene />
            </Suspense>
        </Canvas>
    );
}