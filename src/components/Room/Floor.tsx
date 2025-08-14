import { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { Plane } from '@react-three/drei';
import { TextureLoader, RepeatWrapping } from 'three';

import { useTexture } from "@/context/TextureContext";
import { createTextureWithGrout, repetitionThreshold } from "./utils";

interface FloorProps{
     length: number;
     width: number; 
}

export default function Floor ({ length, width }: FloorProps) {
    const { floorTexture, floorGroutColor, showFloorGrout } = useTexture();

    // Always call useLoader hook with a fallback texture
    const baseTexture = useLoader(TextureLoader, floorTexture?.texture_img || '/textures/floor/tiles1_glossy.webp');

    const finalTexture = useMemo(() => {
        if (!floorTexture) return baseTexture;

        let texture;
        
        if (showFloorGrout) {
            // Create texture with grout lines
            texture = createTextureWithGrout(baseTexture, floorGroutColor, true);
        } else {
            // Use original texture directly without any processing
            texture = baseTexture.clone();
        }

        // Configure texture mapping - FIXED CALCULATION
        if (floorTexture.size) {
            // Convert floor dimensions from Three.js units to centimeters
            // Assuming 1 Three.js unit = 100cm for proper scaling
            const floorLengthCm = length * 100;
            const floorWidthCm = width * 100;
            
            // Calculate how many tiles fit along each axis
            const tilesAlongLength = floorLengthCm / floorTexture.size[0];
            const tilesAlongWidth = floorWidthCm / floorTexture.size[1];
            
            // Apply repetition threshold
            const repeatX = tilesAlongLength * repetitionThreshold*1.2;
            const repeatY = tilesAlongWidth * repetitionThreshold*1.5;

            console.log('Floor texture details:', {
                floorDimensions: { length, width },
                floorDimensionsCm: { length: floorLengthCm, width: floorWidthCm },
                tileSize: floorTexture.size,
                tilesCount: { x: tilesAlongLength, y: tilesAlongWidth },
                finalRepeats: { x: repeatX, y: repeatY },
                groutVisible: showFloorGrout
            });

            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;
            texture.repeat.set(repeatX, repeatY);
        }

        return texture;
    }, [baseTexture, floorTexture, floorGroutColor, showFloorGrout, length, width]);

    return (
        <Plane
            args={[length, width]}
            rotation={[-Math.PI / 2.3, 0, 0]} // FIXED: Use exact -90 degrees
            position={[0, 0, 0]}
        >
            <meshStandardMaterial map={finalTexture} />
        </Plane>
    );
};