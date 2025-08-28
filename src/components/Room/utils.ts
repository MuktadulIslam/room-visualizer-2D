import { RepeatWrapping, CanvasTexture } from 'three';

export const repetitionThreshold = 1 / 8;

/**
 * Crops an image to match the target aspect ratio from the center
 * @param image - The source image
 * @param targetWidth - Target width in inch
 * @param targetHeight - Target height in inch
 * @returns Canvas with cropped image
 */
const cropImageToAspectRatio = (
    image: HTMLImageElement | HTMLCanvasElement,
    targetWidth: number,
    targetHeight: number
): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
        throw new Error('Unable to get canvas context');
    }

    // Calculate target aspect ratio
    const targetAspectRatio = targetWidth / targetHeight;
    
    // Get source dimensions
    const sourceWidth = image.width || (image as HTMLImageElement).naturalWidth;
    const sourceHeight = image.height || (image as HTMLImageElement).naturalHeight;
    const sourceAspectRatio = sourceWidth / sourceHeight;

    let cropX = 0;
    let cropY = 0;
    let cropWidth = sourceWidth;
    let cropHeight = sourceHeight;

    // Determine how to crop to match target aspect ratio
    if (sourceAspectRatio > targetAspectRatio) {
        // Source is wider than target - crop width
        cropWidth = sourceHeight * targetAspectRatio;
        cropX = (sourceWidth - cropWidth) / 2;
    } else if (sourceAspectRatio < targetAspectRatio) {
        // Source is taller than target - crop height
        cropHeight = sourceWidth / targetAspectRatio;
        cropY = (sourceHeight - cropHeight) / 2;
    }
    // If aspect ratios match, no cropping needed

    // Set canvas size to maintain good quality
    const outputSize = Math.min(512, Math.max(cropWidth, cropHeight));
    canvas.width = outputSize;
    canvas.height = outputSize;

    // Draw the cropped image
    ctx.drawImage(
        image,
        cropX, cropY, cropWidth, cropHeight,  // Source rectangle
        0, 0, outputSize, outputSize          // Destination rectangle
    );

    return canvas;
};

/**
 * Creates a texture with optional grout lines and aspect ratio cropping
 * @param baseTexture - The original texture
 * @param groutColor - Color for grout lines
 * @param showGrout - Whether to show grout
 * @param tileWidth - Width of tile in inch
 * @param tileHeight - Height of tile in inch
 * @returns Processed canvas texture
 */
export const createTextureWithGrout = (
    baseTexture: { image: CanvasImageSource }, 
    groutColor: string,
    showGrout: boolean,
    tileWidth: number = 30,
    tileHeight: number = 30
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

    // First, crop the image to match the tile aspect ratio if needed
    let processedImage: HTMLCanvasElement | CanvasImageSource = baseTexture.image;
    
    if (baseTexture.image instanceof HTMLImageElement || baseTexture.image instanceof HTMLCanvasElement) {
        // Only crop if the aspect ratios don't match
        const sourceAspectRatio = baseTexture.image.width / baseTexture.image.height;
        const targetAspectRatio = tileWidth / tileHeight;
        
        // Allow for small floating point differences
        const aspectRatioTolerance = 0.05;
        if (Math.abs(sourceAspectRatio - targetAspectRatio) > aspectRatioTolerance) {
            processedImage = cropImageToAspectRatio(
                baseTexture.image as HTMLImageElement | HTMLCanvasElement,
                tileWidth,
                tileHeight
            );
        }
    }
    
    // If grout is disabled, just draw the processed texture
    if (!showGrout) {
        ctx.drawImage(processedImage, 0, 0, resolution, resolution);
    } else {
        // Calculate grout width (2mm equivalent at this resolution)
        const groutWidth = 4; // pixels at this resolution
        
        // Fill with grout color
        ctx.fillStyle = groutColor;
        ctx.fillRect(0, 0, resolution, resolution);
        
        // Create tile area (subtract grout from edges)
        const tileX = groutWidth / 2;
        const tileY = groutWidth / 2;
        const tileDisplayWidth = resolution - groutWidth;
        const tileDisplayHeight = resolution - groutWidth;
        
        // Draw the processed image in the tile area
        ctx.drawImage(processedImage, tileX, tileY, tileDisplayWidth, tileDisplayHeight);
    }
    
    // Create and return the new texture
    const finalTexture = new CanvasTexture(canvas);
    finalTexture.wrapS = RepeatWrapping;
    finalTexture.wrapT = RepeatWrapping;
    
    return finalTexture;
};

/**
 * Creates a preview of how the tile will look when cropped
 * @param imageUrl - URL of the original image
 * @param tileWidth - Width in inch
 * @param tileHeight - Height in inch
 * @returns Promise<string> - Data URL of the cropped preview
 */
export const createCroppedPreview = (
    imageUrl: string,
    tileWidth: number,
    tileHeight: number
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
            try {
                const croppedCanvas = cropImageToAspectRatio(img, tileWidth, tileHeight);
                resolve(croppedCanvas.toDataURL());
            } catch (error) {
                reject(error);
            }
        };
        
        img.onerror = () => {
            reject(new Error('Failed to load image'));
        };
        
        img.src = imageUrl;
    });
};