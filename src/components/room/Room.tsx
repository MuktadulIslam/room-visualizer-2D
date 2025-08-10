import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Plane } from '@react-three/drei';
import { TextureLoader, RepeatWrapping, CanvasTexture, Vector2 } from 'three';
import { useTexture } from '@/context/TextureContext';

const repetitionThreshold = 1 / 3;

// Function to create texture with grout lines
const createTextureWithGrout = (
    baseTexture: any, 
    groutColor: string, 
    tileSize: [number, number]
) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size (higher resolution for better quality)
    const resolution = 512;
    canvas.width = resolution;
    canvas.height = resolution;
    
    if (!ctx) return baseTexture;
    
    // Calculate grout width (2mm equivalent)
    const groutWidth = 4; // pixels at this resolution
    
    // Fill with grout color
    ctx.fillStyle = groutColor;
    ctx.fillRect(0, 0, resolution, resolution);
    
    // Create tile area (subtract grout from edges)
    const tileX = groutWidth / 2;
    const tileY = groutWidth / 2;
    const tileWidth = resolution - groutWidth;
    const tileHeight = resolution - groutWidth;
    
    // Draw base texture image if available
    if (baseTexture && baseTexture.image) {
        ctx.drawImage(baseTexture.image, tileX, tileY, tileWidth, tileHeight);
    } else {
        // Fallback: draw a simple tile pattern
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(tileX, tileY, tileWidth, tileHeight);
        
        // Add some texture variation
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(tileX + tileWidth * 0.1, tileY + tileHeight * 0.1, 
                    tileWidth * 0.8, tileHeight * 0.8);
    }
    
    // Create and return the new texture
    const finalTexture = new CanvasTexture(canvas);
    finalTexture.wrapS = RepeatWrapping;
    finalTexture.wrapT = RepeatWrapping;
    
    return finalTexture;
};

// Wall Component
const Wall = ({ height, width, position }: { height: number; width: number; position: [number, number, number] }) => {
    const { wallTexture, wallColor, groutColor } = useTexture();

    console.log('Wall - wallTexture:', wallTexture);
    
    // Always call useLoader hook at the top level with a fallback texture
    const baseTexture = useLoader(TextureLoader, wallTexture?.texture_img || '/textures/floor/tiles1_glossy.webp');

    const finalTexture = useMemo(() => {
        if (!wallTexture?.texture_img) {
            return null;
        }

        // Create texture with grout lines
        let texture = createTextureWithGrout(baseTexture, groutColor, wallTexture.size);

        // Configure texture mapping
        if (texture && wallTexture.size) {
            const repeatX = (width * 100) / wallTexture.size[0] * repetitionThreshold;
            const repeatY = (height * 100) / wallTexture.size[1] * repetitionThreshold;
            console.log('Wall texture repeats:', repeatX, repeatY);

            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;
            texture.repeat.set(repeatX, repeatY);
        }

        return texture;
    }, [baseTexture, wallTexture, groutColor, width, height]);

    if (!wallTexture?.texture_img) {
        return (
            <mesh position={position}>
                <planeGeometry args={[width, height]} />
                <meshBasicMaterial color={wallColor?.hex || '#cccccc'} />
            </mesh>
        );
    }

    return (
        <mesh position={position}>
            <planeGeometry args={[width, height]} />
            <meshStandardMaterial map={finalTexture} />
        </mesh>
    );
};

// Floor Component
const Floor = ({ length, width }: { length: number; width: number }) => {
    const { floorTexture, groutColor } = useTexture();

    // Always call useLoader hook with a fallback texture
    const baseTexture = useLoader(TextureLoader, floorTexture?.texture_img || '/textures/floor/tiles1_glossy.webp');

    const finalTexture = useMemo(() => {
        if (!floorTexture) return baseTexture;

        // Create texture with grout lines
        let texture = createTextureWithGrout(baseTexture, groutColor, floorTexture.size);

        // Configure texture mapping
        if (texture && floorTexture.size) {
            // Calculate repeat based on floor dimensions and texture size
            const repeatX = (length * 100) / floorTexture.size[0] * repetitionThreshold;
            const repeatY = (width * 100) / floorTexture.size[1] * repetitionThreshold;

            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;
            texture.repeat.set(repeatX, repeatY);
        }

        return texture;
    }, [baseTexture, floorTexture, groutColor, length, width]);

    return (
        <Plane
            args={[length, width]}
            rotation={[-Math.PI / 2.3, 0, 0]}
            position={[0, 0, 0]}
        >
            <meshStandardMaterial map={finalTexture} />
        </Plane>
    );
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