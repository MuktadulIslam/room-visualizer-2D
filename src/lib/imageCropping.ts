// lib/imageCropping.ts

export interface TileDimensions {
  length: number; // in inches
  width: number;  // in inches
}

export interface CropResult {
  croppedFile: File;
  originalDimensions: { width: number; height: number };
  croppedDimensions: { width: number; height: number };
  aspectRatio: number;
}

/**
 * Crops an image to match the target aspect ratio based on tile dimensions
 * @param file - The original image file
 * @param tileDimensions - The desired tile dimensions in inches
 * @param fileName - Optional custom filename for the cropped image
 * @returns Promise<CropResult> - The cropped image file and metadata
 */
export async function cropImageToTileRatio(
  file: File,
  tileDimensions: TileDimensions,
  fileName?: string
): Promise<CropResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    img.onload = () => {
      try {
        const originalWidth = img.naturalWidth;
        const originalHeight = img.naturalHeight;
        const originalAspectRatio = originalWidth / originalHeight;
        
        // Calculate target aspect ratio from tile dimensions
        const targetAspectRatio = tileDimensions.length / tileDimensions.width;
        
        let cropX = 0;
        let cropY = 0;
        let cropWidth = originalWidth;
        let cropHeight = originalHeight;

        // Determine cropping dimensions to match target aspect ratio
        if (originalAspectRatio > targetAspectRatio) {
          // Original image is wider than target - crop from sides
          cropWidth = originalHeight * targetAspectRatio;
          cropX = (originalWidth - cropWidth) / 2;
        } else if (originalAspectRatio < targetAspectRatio) {
          // Original image is taller than target - crop from top/bottom
          cropHeight = originalWidth / targetAspectRatio;
          cropY = (originalHeight - cropHeight) / 2;
        }

        // Set canvas size to maintain good quality (max 1024px for the larger dimension)
        const maxDimension = 1024;
        let canvasWidth, canvasHeight;
        
        if (targetAspectRatio >= 1) {
          // Landscape or square
          canvasWidth = maxDimension;
          canvasHeight = maxDimension / targetAspectRatio;
        } else {
          // Portrait
          canvasHeight = maxDimension;
          canvasWidth = maxDimension * targetAspectRatio;
        }

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Draw the cropped image onto the canvas
        ctx.drawImage(
          img,
          cropX, cropY, cropWidth, cropHeight,  // Source rectangle (cropped area)
          0, 0, canvasWidth, canvasHeight       // Destination rectangle (full canvas)
        );

        // Convert canvas to blob then to File
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to create cropped image blob'));
            return;
          }

          const croppedFileName = fileName || 
            `cropped_${tileDimensions.length}x${tileDimensions.width}_${file.name}`;
          
          const croppedFile = new File([blob], croppedFileName, { 
            type: file.type || 'image/jpeg',
            lastModified: Date.now()
          });

          resolve({
            croppedFile,
            originalDimensions: { width: originalWidth, height: originalHeight },
            croppedDimensions: { width: Math.round(canvasWidth), height: Math.round(canvasHeight) },
            aspectRatio: targetAspectRatio
          });
        }, file.type || 'image/jpeg', 0.9); // High quality JPEG

      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Create object URL and load image
    const objectURL = URL.createObjectURL(file);
    img.src = objectURL;
    
    // Clean up object URL when done
    img.onload = () => {
      URL.revokeObjectURL(objectURL);
      img.onload(); // Call original onload
    };
  });
}

/**
 * Checks if an image needs cropping based on aspect ratio tolerance
 * @param file - The image file to check
 * @param tileDimensions - The target tile dimensions
 * @param tolerance - Aspect ratio tolerance (default: 0.05 = 5%)
 * @returns Promise<boolean> - True if cropping is needed
 */
export async function needsCropping(
  file: File,
  tileDimensions: TileDimensions,
  tolerance: number = 0.05
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const imageAspectRatio = img.naturalWidth / img.naturalHeight;
      const targetAspectRatio = tileDimensions.length / tileDimensions.width;
      const difference = Math.abs(imageAspectRatio - targetAspectRatio);
      
      resolve(difference > tolerance);
      URL.revokeObjectURL(img.src);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for aspect ratio check'));
      URL.revokeObjectURL(img.src);
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * Gets the aspect ratio of an image file
 * @param file - The image file
 * @returns Promise<number> - The aspect ratio (width/height)
 */
export async function getImageAspectRatio(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      resolve(aspectRatio);
      URL.revokeObjectURL(img.src);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
      URL.revokeObjectURL(img.src);
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * Creates a preview of the cropped image for display purposes
 * @param file - The original image file
 * @param tileDimensions - The tile dimensions for cropping
 * @returns Promise<string> - Data URL of the cropped preview
 */
export async function createCroppedPreview(
  file: File,
  tileDimensions: TileDimensions
): Promise<string> {
  const cropResult = await cropImageToTileRatio(file, tileDimensions);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result as string);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to create preview'));
    };
    
    reader.readAsDataURL(cropResult.croppedFile);
  });
}

/**
 * Utility to format aspect ratio for display
 * @param aspectRatio - The aspect ratio number
 * @returns string - Formatted aspect ratio (e.g., "4:3", "16:9")
 */
export function formatAspectRatio(aspectRatio: number): string {
  // Find closest common ratios
  const commonRatios = [
    { ratio: 1, label: '1:1' },
    { ratio: 4/3, label: '4:3' },
    { ratio: 3/2, label: '3:2' },
    { ratio: 16/9, label: '16:9' },
    { ratio: 2, label: '2:1' },
    { ratio: 3, label: '3:1' }
  ];
  
  const closest = commonRatios.reduce((prev, current) =>
    Math.abs(current.ratio - aspectRatio) < Math.abs(prev.ratio - aspectRatio) ? current : prev
  );
  
  // If very close to a common ratio, use it
  if (Math.abs(closest.ratio - aspectRatio) < 0.1) {
    return closest.label;
  }
  
  // Otherwise, create a custom ratio
  const width = Math.round(aspectRatio * 10);
  const height = 10;
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(width, height);
  
  return `${width / divisor}:${height / divisor}`;
}