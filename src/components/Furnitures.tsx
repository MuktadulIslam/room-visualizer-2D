import { useTexture } from '@/context/TextureContext';
import Image from 'next/image';

export default function Furnitures() {
  const { selectionType, setSelectionType, wallTexture, floorTexture, roomImage } = useTexture();

  // Determine which image to show based on room upload and texture types
  const getMaskImage = () => {
    if (roomImage?.processedImage && !roomImage.isProcessing && !roomImage.error) {
      // Use the processed room image if available
      return roomImage.processedImage;
    }

    // Fallback to default furniture images based on texture properties
    const isWallGlossy = wallTexture?.is_glossy || false;
    const isFloorGlossy = floorTexture?.is_glossy || false;

    if (isWallGlossy || isFloorGlossy) {
      return "/furnitures/wall_glossy_floor_glossy.webp";
    } else {
      return "/furnitures/wall_matt_floor_matt.webp";
    }
  };

  const maskImageSrc = getMaskImage();

  console.log('Furnitures - wallTexture:', wallTexture);
  console.log('Furnitures - roomImage:', roomImage);

  return (
    <div className="w-full h-full bg-transparent absolute top-0 left-0 z-40">
      <Image
        width={3000}
        height={2500}
        src={maskImageSrc}
        alt="Room"
        className="w-full h-full bg-transparent"
        priority
      />

      {/* Wall Selection Button */}
      <button
        onClick={() => setSelectionType('wall')}
        className={`px-5 py-1 absolute top-[25%] left-[48%] z-50 font-semibold shadow-sm shadow-gray-700 rounded-full transition-all duration-200 flex items-center gap-2 ${selectionType === 'wall'
            ? 'bg-blue-500 text-white'
            : 'bg-white text-black hover:bg-gray-100'
          }`}
      >
        {selectionType === 'wall' && (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
        Wall
      </button>

      {/* Floor Selection Button */}
      <button
        onClick={() => setSelectionType('floor')}
        className={`px-5 py-1 absolute bottom-[11%] left-[25%] z-50 font-semibold shadow-sm shadow-gray-700 rounded-full transition-all duration-200 flex items-center gap-2 ${selectionType === 'floor'
            ? 'bg-blue-500 text-white'
            : 'bg-white text-black hover:bg-gray-100'
          }`}
      >
        {selectionType === 'floor' && (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
        Floor
      </button>

      {/* Room Processing Status Overlay */}
      {roomImage?.isProcessing && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3 shadow-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="text-gray-700 font-medium">Processing your room...</span>
          </div>
        </div>
      )}

      {/* Room Processing Error Overlay */}
      {roomImage?.error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-60">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg max-w-md">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Room processing failed: {roomImage.error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Success notification when room is processed */}
      {roomImage?.processedImage && !roomImage.isProcessing && !roomImage.error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-60">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Your room layout is now active!</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}