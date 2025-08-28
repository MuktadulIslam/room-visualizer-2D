'use client';

import { useState } from 'react';
import Image from 'next/image';
import RoomRenovationSidebar from '@/components/custom_room/RoomRenovationSidebar';
import { RenovationType } from '@/components/custom_room/RenovationTypes';
import { RoomRenovationAPI } from '@/lib/api';
import { cropImageToTileRatio, needsCropping, TileDimensions } from '@/lib/imageCropping';

interface RoomDimensions {
  length: number; // in feet - room length
  width: number;  // in feet - room width  
  height?: number; // in feet - wall height (only needed for wall tiling)
}

interface TilingParams {
  tilesX: number;
  tilesY: number;
  groutWidth: number;
  groutColor: string;
}

interface CompleteTilingParams extends TilingParams {
  floorTilesX: number;
  floorTilesY: number;
  wallTilesX: number;
  wallTilesY: number;
  floorGroutWidth: number;
  wallGroutWidth: number;
  floorGroutColor: string;
  wallGroutColor: string;
}

export default function CustomRoomPage() {
  // State for renovation type
  const [renovationType, setRenovationType] = useState<RenovationType>('floor-tiling');

  // State for uploaded images
  const [roomImage, setRoomImage] = useState<File | null>(null);
  const [floorTile, setFloorTile] = useState<File | null>(null);
  const [wallTile, setWallTile] = useState<File | null>(null);
  
  // State for cropped tiles (these will be sent to backend)
  const [croppedFloorTile, setCroppedFloorTile] = useState<File | null>(null);
  const [croppedWallTile, setCroppedWallTile] = useState<File | null>(null);

  // State for preview URLs
  const [roomPreview, setRoomPreview] = useState<string>('');
  const [floorTilePreview, setFloorTilePreview] = useState<string>('');
  const [wallTilePreview, setWallTilePreview] = useState<string>('');

  // State for result
  const [resultImage, setResultImage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  // State for wall color (for coloring options)
  const [wallColor, setWallColor] = useState('#3498db');

  // State for tile parameters
  const [floorParams, setFloorParams] = useState<TilingParams>({
    tilesX: 25,
    tilesY: 18,
    groutWidth: 1,
    groutColor: '#F0EBE4'
  });

  const [wallParams, setWallParams] = useState<TilingParams>({
    tilesX: 20,
    tilesY: 15,
    groutWidth: 1,
    groutColor: '#F5F0EB'
  });

  // Handle image selection
  const handleRoomImageSelect = (file: File) => {
    setRoomImage(file);
    setRoomPreview(URL.createObjectURL(file));
  };

  const handleFloorTileSelect = async (file: File, dimensions?: TileDimensions) => {
    setFloorTile(file);
    setFloorTilePreview(URL.createObjectURL(file));

    // Crop the image if dimensions are provided
    if (dimensions) {
      try {
        const shouldCrop = await needsCropping(file, dimensions);
        
        if (shouldCrop) {
          console.log('Cropping floor tile to match aspect ratio...');
          const cropResult = await cropImageToTileRatio(file, dimensions, `floor_tile_${dimensions.length}x${dimensions.width}.jpg`);
          setCroppedFloorTile(cropResult.croppedFile);
          
          // Update preview with cropped image
          const croppedPreview = URL.createObjectURL(cropResult.croppedFile);
          setFloorTilePreview(croppedPreview);
          
          console.log('Floor tile cropped:', {
            original: cropResult.originalDimensions,
            cropped: cropResult.croppedDimensions,
            targetAspectRatio: cropResult.aspectRatio
          });
        } else {
          console.log('Floor tile aspect ratio is already correct, no cropping needed');
          setCroppedFloorTile(file);
        }
      } catch (error) {
        console.error('Error processing floor tile:', error);
        setError('Failed to process floor tile image');
        setCroppedFloorTile(file); // Use original if cropping fails
      }
    } else {
      setCroppedFloorTile(file);
    }
  };

  const handleWallTileSelect = async (file: File, dimensions?: TileDimensions) => {
    setWallTile(file);
    setWallTilePreview(URL.createObjectURL(file));

    // Crop the image if dimensions are provided
    if (dimensions) {
      try {
        const shouldCrop = await needsCropping(file, dimensions);
        
        if (shouldCrop) {
          console.log('Cropping wall tile to match aspect ratio...');
          const cropResult = await cropImageToTileRatio(file, dimensions, `wall_tile_${dimensions.length}x${dimensions.width}.jpg`);
          setCroppedWallTile(cropResult.croppedFile);
          
          // Update preview with cropped image
          const croppedPreview = URL.createObjectURL(cropResult.croppedFile);
          setWallTilePreview(croppedPreview);
          
          console.log('Wall tile cropped:', {
            original: cropResult.originalDimensions,
            cropped: cropResult.croppedDimensions,
            targetAspectRatio: cropResult.aspectRatio
          });
        } else {
          console.log('Wall tile aspect ratio is already correct, no cropping needed');
          setCroppedWallTile(file);
        }
      } catch (error) {
        console.error('Error processing wall tile:', error);
        setError('Failed to process wall tile image');
        setCroppedWallTile(file); // Use original if cropping fails
      }
    } else {
      setCroppedWallTile(file);
    }
  };

  // Calculate repetition based on room and tile dimensions
  const calculateRepetition = (roomDim: RoomDimensions, tileDim: TileDimensions, isWall: boolean = false) => {
    if (isWall) {
      // For walls: use room length as wall length, wall height as wall width
      const wallLengthInches = roomDim.length * 12;
      const wallHeightInches = (roomDim.height || 9) * 12;
      
      // Calculate how many tiles fit on the wall
      const tilesX = Math.ceil(wallLengthInches / tileDim.length);
      const tilesY = Math.ceil(wallHeightInches / tileDim.width);
      
      return { tilesX, tilesY };
    } else {
      // For floor: use room length and width
      const roomLengthInches = roomDim.length * 12;
      const roomWidthInches = roomDim.width * 12;
      
      // Calculate how many tiles fit
      const tilesX = Math.ceil(roomLengthInches / tileDim.length);
      const tilesY = Math.ceil(roomWidthInches / tileDim.width);
      
      return { tilesX, tilesY };
    }
  };

  // Process renovation
  const handleProcess = async (
    roomDimensions: RoomDimensions, 
    floorTileDimensions?: TileDimensions, 
    wallTileDimensions?: TileDimensions
  ) => {
    if (!roomImage) {
      setError('Please upload a room image');
      return;
    }

    setIsProcessing(true);
    setError('');
    setResultImage('');

    try {
      let resultBlob: Blob;

      // Calculate actual tile repetitions based on dimensions
      const floorRepetition = floorTileDimensions ? calculateRepetition(roomDimensions, floorTileDimensions, false) : null;
      const wallRepetition = wallTileDimensions ? calculateRepetition(roomDimensions, wallTileDimensions, true) : null;

      switch (renovationType) {
        case 'floor-tiling':
          if (!croppedFloorTile || !floorRepetition) {
            setError('Please select a floor tile and specify dimensions');
            return;
          }
          const floorTilingParams = {
            ...floorParams,
            tilesX: floorRepetition.tilesX,
            tilesY: floorRepetition.tilesY
          };
          resultBlob = await RoomRenovationAPI.floorTiling(roomImage, croppedFloorTile, floorTilingParams);
          break;

        case 'complete-tiling':
          if (!croppedFloorTile || !croppedWallTile || !floorRepetition || !wallRepetition) {
            setError('Please select both floor and wall tiles with dimensions');
            return;
          }
          const completeParams: CompleteTilingParams = {
            ...floorParams,
            floorTilesX: floorRepetition.tilesX,
            floorTilesY: floorRepetition.tilesY,
            wallTilesX: wallRepetition.tilesX,
            wallTilesY: wallRepetition.tilesY,
            floorGroutWidth: floorParams.groutWidth,
            wallGroutWidth: wallParams.groutWidth,
            floorGroutColor: floorParams.groutColor,
            wallGroutColor: wallParams.groutColor
          };
          resultBlob = await RoomRenovationAPI.completeTiling(roomImage, croppedFloorTile, croppedWallTile, completeParams);
          break;

        case 'wall-tiling':
          if (!croppedWallTile || !wallRepetition) {
            setError('Please select a wall tile and specify dimensions');
            return;
          }
          const wallTilingParams = {
            ...wallParams,
            tilesX: wallRepetition.tilesX,
            tilesY: wallRepetition.tilesY
          };
          resultBlob = await RoomRenovationAPI.wallTiling(roomImage, croppedWallTile, wallTilingParams);
          break;

        case 'wall-coloring':
          // Wall coloring doesn't need dimensions - just room image and color
          resultBlob = await RoomRenovationAPI.wallColoring(roomImage, wallColor);
          console.log('Wall coloring completed - no dimensions needed');
          break;

        case 'floor-tiling-wall-coloring':
          if (!croppedFloorTile || !floorRepetition) {
            setError('Please select a floor tile and specify dimensions');
            return;
          }
          const floorWallParams = {
            ...floorParams,
            tilesX: floorRepetition.tilesX,
            tilesY: floorRepetition.tilesY
          };
          resultBlob = await RoomRenovationAPI.floorTilingWallColoring(roomImage, croppedFloorTile, wallColor, floorWallParams);
          break;

        default:
          throw new Error('Invalid renovation type');
      }

      // Convert blob to URL for display
      const resultUrl = URL.createObjectURL(resultBlob);
      setResultImage(resultUrl);

      console.log('Renovation completed successfully', {
        renovationType,
        roomDimensions,
        floorTileDimensions,
        wallTileDimensions,
        floorRepetition,
        wallRepetition
      });

    } catch (err) {
      console.error('Renovation error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during processing');
    } finally {
      setIsProcessing(false);
    }
  };

  // Check if process button should be enabled
  const canProcess = () => {
    if (!roomImage) return false;

    switch (renovationType) {
      case 'floor-tiling':
        return !!floorTile;
      case 'complete-tiling':
        return !!floorTile && !!wallTile;
      case 'wall-tiling':
        return !!wallTile;
      case 'wall-coloring':
        return true;
      case 'floor-tiling-wall-coloring':
        return !!floorTile;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Component */}
      <RoomRenovationSidebar
        renovationType={renovationType}
        setRenovationType={setRenovationType}
        roomPreview={roomPreview}
        floorTilePreview={floorTilePreview}
        wallTilePreview={wallTilePreview}
        wallColor={wallColor}
        setWallColor={setWallColor}
        floorParams={floorParams}
        setFloorParams={setFloorParams}
        wallParams={wallParams}
        setWallParams={setWallParams}
        onRoomImageSelect={handleRoomImageSelect}
        onFloorTileSelect={handleFloorTileSelect}
        onWallTileSelect={handleWallTileSelect}
        onProcess={handleProcess}
        canProcess={canProcess()}
        isProcessing={isProcessing}
        error={error}
        floorTile={floorTile}
        wallTile={wallTile}
      />

      {/* Room Display Area */}
      <div className="flex-1 p-3 flex items-center justify-center bg-gray-50">
        {isProcessing ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">Processing your renovation...</p>
            <p className="text-gray-500 text-sm mt-2">This may take 30-60 seconds</p>
            <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">
                ⚙️ Calculating tile layout<br/>
                🖼️ Processing images<br/>
                🎨 Applying renovation
              </p>
            </div>
          </div>
        ) : resultImage ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-full h-full relative">
              <Image
                src={resultImage}
                alt="Renovated room"
                width={1200}
                height={800}
                className="w-full h-full object-contain shadow-lg"
              />

              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = resultImage;
                  link.download = 'renovated-room.jpg';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="absolute top-2 right-2 w-24 h-6 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center justify-center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download</span>
              </button>
              
              {/* Show renovation info overlay */}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white p-3 rounded-lg text-sm">
                <p className="font-semibold">Renovation Applied</p>
                <p>Type: {renovationType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                {floorTile && <p>🟫 Floor tiles processed and applied</p>}
                {wallTile && <p>🟦 Wall tiles processed and applied</p>}
              </div>
            </div>
          </div>
        ) : roomPreview ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-full h-full relative">
              <Image
                src={roomPreview}
                alt="Original room"
                width={1200}
                height={800}
                className="w-full h-full object-contain shadow-lg"
              />
              <div className="absolute top-2 right-2 bg-gray-600 text-white px-3 py-1 rounded-lg text-xs font-medium">
                Original
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <svg
              className="mx-auto h-24 w-24 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No room image uploaded</h3>
            <p className="text-gray-600">Upload a room image from the sidebar to begin renovation</p>
            <div className="mt-4 p-4 bg-white rounded-lg shadow-sm max-w-md mx-auto">
              <h4 className="font-semibold text-gray-800 mb-2">How it works:</h4>
              <ol className="text-sm text-gray-600 text-left space-y-1">
                <li>1. Upload your room image</li>
                <li>2. Enter room dimensions (feet)</li>
                <li>3. Select tile pattern & enter tile size (inches)</li>
                <li>4. AI will automatically calculate tile layout</li>
                <li>5. Images are auto-cropped to match tile proportions</li>
                <li>6. Get your renovated room preview!</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}