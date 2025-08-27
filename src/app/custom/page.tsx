'use client';

import { useState } from 'react';
import Image from 'next/image';
import RoomRenovationSidebar from '@/components/custom_room/RoomRenovationSidebar';
import { RenovationType } from '@/components/custom_room/RenovationTypes';
import { RoomRenovationAPI, TilingParams, CompleteTilingParams } from '@/lib/api';

export default function CustomRoomPage() {
  // State for renovation type
  const [renovationType, setRenovationType] = useState<RenovationType>('floor-tiling');

  // State for uploaded images
  const [roomImage, setRoomImage] = useState<File | null>(null);
  const [floorTile, setFloorTile] = useState<File | null>(null);
  const [wallTile, setWallTile] = useState<File | null>(null);

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

  const handleFloorTileSelect = (file: File) => {
    setFloorTile(file);
    setFloorTilePreview(URL.createObjectURL(file));
  };

  const handleWallTileSelect = (file: File) => {
    setWallTile(file);
    setWallTilePreview(URL.createObjectURL(file));
  };

  // Process renovation
  const handleProcess = async () => {
    if (!roomImage) {
      setError('Please upload a room image');
      return;
    }

    setIsProcessing(true);
    setError('');
    setResultImage('');

    try {
      let resultBlob: Blob;

      switch (renovationType) {
        case 'floor-tiling':
          if (!floorTile) {
            setError('Please select a floor tile');
            return;
          }
          resultBlob = await RoomRenovationAPI.floorTiling(roomImage, floorTile, floorParams);
          break;

        case 'complete-tiling':
          if (!floorTile || !wallTile) {
            setError('Please select both floor and wall tiles');
            return;
          }
          const completeParams: CompleteTilingParams = {
            ...floorParams,
            floorTilesX: floorParams.tilesX,
            floorTilesY: floorParams.tilesY,
            wallTilesX: wallParams.tilesX,
            wallTilesY: wallParams.tilesY,
            floorGroutWidth: floorParams.groutWidth,
            wallGroutWidth: wallParams.groutWidth,
            floorGroutColor: floorParams.groutColor,
            wallGroutColor: wallParams.groutColor
          };
          resultBlob = await RoomRenovationAPI.completeTiling(roomImage, floorTile, wallTile, completeParams);
          break;

        case 'wall-tiling':
          if (!wallTile) {
            setError('Please select a wall tile');
            return;
          }
          resultBlob = await RoomRenovationAPI.wallTiling(roomImage, wallTile, wallParams);
          break;

        case 'wall-coloring':
          resultBlob = await RoomRenovationAPI.wallColoring(roomImage, wallColor);
          break;

        case 'floor-tiling-wall-coloring':
          if (!floorTile) {
            setError('Please select a floor tile');
            return;
          }
          resultBlob = await RoomRenovationAPI.floorTilingWallColoring(roomImage, floorTile, wallColor, floorParams);
          break;

        default:
          throw new Error('Invalid renovation type');
      }

      // Convert blob to URL for display
      const resultUrl = URL.createObjectURL(resultBlob);
      setResultImage(resultUrl);

    } catch (err) {
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
          </div>
        )}
      </div>
    </div>
  );
}