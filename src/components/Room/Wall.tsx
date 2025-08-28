import { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, RepeatWrapping } from 'three';

import { useTexture } from "@/context/TextureContext";
import { createTextureWithGrout, repetitionThreshold } from "./utils";

interface WallProps {
    height: number;
    width: number;
    position: [number, number, number];
}

export default function Wall({ height, width, position }: WallProps) {
    const { wallTexture, wallColor, wallGroutColor, showWallGrout } = useTexture();

    console.log('Wall - wallTexture:', wallTexture);

    // Always call useLoader hook at the top level with a fallback texture
    const baseTexture = useLoader(TextureLoader, wallTexture?.texture_img || '/textures/floor/tiles1_glossy.webp');

    const finalTexture = useMemo(() => {
        if (!wallTexture?.texture_img) {
            return null;
        }

        let texture;

        if (showWallGrout) {
            // Create texture with grout lines and aspect ratio cropping
            texture = createTextureWithGrout(
                baseTexture, 
                wallGroutColor, 
                true,
                wallTexture.size[0], // tile width in inch
                wallTexture.size[1]  // tile height in inch
            );
        } else {
            // Use texture without grout but still apply cropping if needed
            texture = createTextureWithGrout(
                baseTexture, 
                wallGroutColor, 
                false,
                wallTexture.size[0], // tile width in inch
                wallTexture.size[1]  // tile height in inch
            );
        }

        // Configure texture mapping
        if (wallTexture.size) {
            const repeatX = (width * 100) / wallTexture.size[0] * repetitionThreshold;
            const repeatY = (height * 100) / wallTexture.size[1] * repetitionThreshold;
            
            console.log('Wall texture details:', {
                wallDimensions: { height, width },
                tileSize: wallTexture.size,
                finalRepeats: { x: repeatX, y: repeatY },
                groutVisible: showWallGrout,
                tileCropped: baseTexture.image ? 
                    Math.abs((baseTexture.image.width / baseTexture.image.height) - (wallTexture.size[0] / wallTexture.size[1])) > 0.05 
                    : false
            });

            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;
            texture.repeat.set(repeatX, repeatY);
        }

        return texture;
    }, [baseTexture, wallTexture, wallGroutColor, showWallGrout, width, height]);

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