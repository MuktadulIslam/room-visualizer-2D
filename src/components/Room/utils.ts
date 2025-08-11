import { RepeatWrapping, CanvasTexture } from 'three';

export const repetitionThreshold = 2 / 5;

// Function to create texture with grout lines
export const createTextureWithGrout = (
    baseTexture: { image: CanvasImageSource }, 
    groutColor: string,
    showGrout: boolean
): CanvasTexture => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size (higher resolution for better quality)
    const resolution = 512;
    canvas.width = resolution;
    canvas.height = resolution;
    
    if (!ctx) {
        // Return a basic texture if canvas context fails
        const fallbackCanvas = document.createElement('canvas');
        fallbackCanvas.width = resolution;
        fallbackCanvas.height = resolution;
        return new CanvasTexture(fallbackCanvas);
    }
    
    // If grout is disabled, just draw the base texture without grout lines
    if (!showGrout) {
        if (baseTexture && baseTexture.image instanceof HTMLImageElement) {
            ctx.drawImage(baseTexture.image, 0, 0, resolution, resolution);
        } else {
            // Fallback: draw a simple texture pattern
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, resolution, resolution);
            
            // Add some texture variation
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(resolution * 0.1, resolution * 0.1, 
                        resolution * 0.8, resolution * 0.8);
        }
    } else {
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
        if (baseTexture && baseTexture.image instanceof HTMLImageElement) {
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
    }
    
    // Create and return the new texture
    const finalTexture = new CanvasTexture(canvas);
    finalTexture.wrapS = RepeatWrapping;
    finalTexture.wrapT = RepeatWrapping;
    
    return finalTexture;
};