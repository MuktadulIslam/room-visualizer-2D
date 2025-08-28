'use client';

import { useState } from 'react';
import ImageUpload from '@/components/custom_room/ImageUpload';
import TileSelectionPanel from '@/components/custom_room/TileSelectionPanel';
import { ColorPicker } from '@/components/custom_room/ParameterControls';
import RenovationDropdown from '@/components/custom_room/RenovationDropdown';
import { RenovationType } from '@/components/custom_room/RenovationTypes';

interface RoomDimensions {
  length: number; // in feet - room length
  width: number;  // in feet - room width
  height?: number; // in feet - wall height (only needed for wall tiling)
}

interface TileDimensions {
  length: number; // in inches
  width: number;  // in inches
}

interface TilingParams {
  tilesX: number;
  tilesY: number;
  groutWidth: number;
  groutColor: string;
}

interface RoomRenovationSidebarProps {
  renovationType: RenovationType;
  setRenovationType: (type: RenovationType) => void;
  roomPreview: string;
  floorTilePreview: string;
  wallTilePreview: string;
  wallColor: string;
  setWallColor: (color: string) => void;
  floorParams: TilingParams;
  setFloorParams: (params: TilingParams | ((prev: TilingParams) => TilingParams)) => void;
  wallParams: TilingParams;
  setWallParams: (params: TilingParams | ((prev: TilingParams) => TilingParams)) => void;
  onRoomImageSelect: (file: File) => void;
  onFloorTileSelect: (file: File, dimensions?: TileDimensions) => void;
  onWallTileSelect: (file: File, dimensions?: TileDimensions) => void;
  onProcess: (roomDimensions: RoomDimensions, floorTileDimensions?: TileDimensions, wallTileDimensions?: TileDimensions) => void;
  canProcess: boolean;
  isProcessing: boolean;
  error: string;
  floorTile: File | null;
  wallTile: File | null;
}

export default function RoomRenovationSidebar({
  renovationType,
  setRenovationType,
  roomPreview,
  floorTilePreview,
  wallTilePreview,
  wallColor,
  setWallColor,
  floorParams,
  setFloorParams,
  wallParams,
  setWallParams,
  onRoomImageSelect,
  onFloorTileSelect,
  onWallTileSelect,
  onProcess,
  canProcess,
  isProcessing,
  error,
  floorTile,
  wallTile
}: RoomRenovationSidebarProps) {
  // Room dimensions state
  const [roomDimensions, setRoomDimensions] = useState<RoomDimensions>({
    length: 12, // default 12 feet
    width: 10,  // default 10 feet
    height: 9   // default 9 feet wall height
  });

  // Tile dimensions state
  const [floorTileDimensions, setFloorTileDimensions] = useState<TileDimensions>({
    length: 12, // default 12 inches
    width: 12   // default 12 inches
  });

  const [wallTileDimensions, setWallTileDimensions] = useState<TileDimensions>({
    length: 12, // default 12 inches
    width: 12   // default 12 inches
  });

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

  // Update tile parameters when dimensions change
  const updateFloorTileParams = (tileDim: TileDimensions) => {
    const { tilesX, tilesY } = calculateRepetition(roomDimensions, tileDim, false);
    setFloorParams(prev => ({ ...prev, tilesX, tilesY }));
  };

  const updateWallTileParams = (tileDim: TileDimensions) => {
    const { tilesX, tilesY } = calculateRepetition(roomDimensions, tileDim, true);
    setWallParams(prev => ({ ...prev, tilesX, tilesY }));
  };

  const handleRoomDimensionChange = (field: keyof RoomDimensions, value: number) => {
    const newDimensions = { ...roomDimensions, [field]: value };
    setRoomDimensions(newDimensions);
    
    // Recalculate tile repetitions based on renovation type
    if (floorTile && (renovationType === 'floor-tiling' || renovationType === 'complete-tiling' || renovationType === 'floor-tiling-wall-coloring')) {
      updateFloorTileParams(floorTileDimensions);
    }
    if (wallTile && (renovationType === 'wall-tiling' || renovationType === 'complete-tiling')) {
      updateWallTileParams(wallTileDimensions);
    }
  };

  const handleFloorTileDimensionChange = (field: keyof TileDimensions, value: number) => {
    const newDimensions = { ...floorTileDimensions, [field]: value };
    setFloorTileDimensions(newDimensions);
    updateFloorTileParams(newDimensions);
  };

  const handleWallTileDimensionChange = (field: keyof TileDimensions, value: number) => {
    const newDimensions = { ...wallTileDimensions, [field]: value };
    setWallTileDimensions(newDimensions);
    updateWallTileParams(newDimensions);
  };

  const handleFloorTileSelect = (file: File) => {
    onFloorTileSelect(file, floorTileDimensions);
    updateFloorTileParams(floorTileDimensions);
  };

  const handleWallTileSelect = (file: File) => {
    onWallTileSelect(file, wallTileDimensions);
    updateWallTileParams(wallTileDimensions);
  };

  const handleProcess = () => {
    onProcess(
      roomDimensions,
      (renovationType === 'floor-tiling' || renovationType === 'complete-tiling' || renovationType === 'floor-tiling-wall-coloring') 
        ? floorTileDimensions : undefined,
      (renovationType === 'wall-tiling' || renovationType === 'complete-tiling') 
        ? wallTileDimensions : undefined
    );
  };

  return (
    <div className="w-96 bg-white shadow-lg flex flex-col h-screen">
      {/* Header - Fixed */}
      <div className="border-b p-4 border-gray-200 flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Room Renovation AI</h1>
        <p className="text-sm text-gray-600 mt-1">Transform your rooms with AI</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          <RenovationDropdown
            selectedType={renovationType}
            onTypeChange={setRenovationType}
          />

          {/* Room Dimensions - Only show when needed */}
          {renovationType !== 'wall-coloring' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-900">
                {renovationType === 'wall-tiling' ? 'Wall Dimensions' : 'Room Dimensions'}
              </h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {renovationType === 'wall-tiling' ? 'Wall Length (feet)' : 'Room Length (feet)'}
                    </label>
                    <input
                      type="number"
                      value={roomDimensions.length}
                      onChange={(e) => handleRoomDimensionChange('length', Number(e.target.value))}
                      min="1"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {renovationType === 'wall-tiling' ? 'Wall Height (feet)' : 'Room Width (feet)'}
                    </label>
                    <input
                      type="number"
                      value={renovationType === 'wall-tiling' ? (roomDimensions.height || 9) : roomDimensions.width}
                      onChange={(e) => handleRoomDimensionChange(
                        renovationType === 'wall-tiling' ? 'height' : 'width', 
                        Number(e.target.value)
                      )}
                      min="1"
                      max={renovationType === 'wall-tiling' ? "20" : "100"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                {/* Show different area calculations based on type */}
                <div className="mt-3 text-sm text-gray-600">
                  {renovationType === 'wall-tiling' ? (
                    <>
                      Wall area: {roomDimensions.length * (roomDimensions.height || 9)} sq ft
                      <div className="text-xs text-gray-500 mt-1">
                        Length: {roomDimensions.length}ft × Height: {roomDimensions.height || 9}ft
                      </div>
                    </>
                  ) : renovationType === 'complete-tiling' ? (
                    <>
                      Floor area: {roomDimensions.length * roomDimensions.width} sq ft
                      {(roomDimensions.height || 9) !== 9 && (
                        <div>Wall area: {roomDimensions.length * (roomDimensions.height || 9)} sq ft</div>
                      )}
                    </>
                  ) : (
                    <>Floor area: {roomDimensions.length * roomDimensions.width} sq ft</>
                  )}
                </div>
                
                {/* Add wall height for complete tiling */}
                {renovationType === 'complete-tiling' && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Wall Height (feet) - for wall tiles
                    </label>
                    <input
                      type="number"
                      value={roomDimensions.height || 9}
                      onChange={(e) => handleRoomDimensionChange('height', Number(e.target.value))}
                      min="6"
                      max="20"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Image Uploads */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900">Upload Images</h3>

            {/* Room Image - Always required */}
            <ImageUpload
              label="Room Image"
              header={true}
              onImageSelect={onRoomImageSelect}
              preview={roomPreview}
              className="w-full"
              required={true}
            />

            {/* Floor Tile Selection - Required for floor tiling types */}
            {(renovationType === 'floor-tiling' ||
              renovationType === 'complete-tiling' ||
              renovationType === 'floor-tiling-wall-coloring') && (
                <div className="space-y-4">
                  <TileSelectionPanel
                    label="Floor"
                    selectedTile={floorTile}
                    selectedTilePreview={floorTilePreview}
                    onTileSelect={handleFloorTileSelect}
                    tileType="floor"
                  />
                  
                  {/* Floor Tile Dimensions */}
                  {floorTile && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-gray-800 mb-3">Floor Tile Dimensions</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Length (inches)
                          </label>
                          <input
                            type="number"
                            value={floorTileDimensions.length}
                            onChange={(e) => handleFloorTileDimensionChange('length', Number(e.target.value))}
                            min="1"
                            max="48"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Width (inches)
                          </label>
                          <input
                            type="number"
                            value={floorTileDimensions.width}
                            onChange={(e) => handleFloorTileDimensionChange('width', Number(e.target.value))}
                            min="1"
                            max="48"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-gray-600">
                        Calculated tiles: {floorParams.tilesX} × {floorParams.tilesY} = {floorParams.tilesX * floorParams.tilesY} tiles
                        <div className="text-xs text-gray-500 mt-1">
                          Floor layout: {floorParams.tilesX} tiles along {roomDimensions.length}ft length, {floorParams.tilesY} tiles along {roomDimensions.width}ft width
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

            {/* Wall Tile Selection - Required for wall tiling types */}
            {(renovationType === 'wall-tiling' ||
              renovationType === 'complete-tiling') && (
                <div className="space-y-4">
                  <TileSelectionPanel
                    label="Wall"
                    selectedTile={wallTile}
                    selectedTilePreview={wallTilePreview}
                    onTileSelect={handleWallTileSelect}
                    tileType="wall"
                  />
                  
                  {/* Wall Tile Dimensions */}
                  {wallTile && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-gray-800 mb-3">Wall Tile Dimensions</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Length (inches)
                          </label>
                          <input
                            type="number"
                            value={wallTileDimensions.length}
                            onChange={(e) => handleWallTileDimensionChange('length', Number(e.target.value))}
                            min="1"
                            max="48"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Width (inches)
                          </label>
                          <input
                            type="number"
                            value={wallTileDimensions.width}
                            onChange={(e) => handleWallTileDimensionChange('width', Number(e.target.value))}
                            min="1"
                            max="48"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-gray-600">
                        Calculated tiles: {wallParams.tilesX} × {wallParams.tilesY} = {wallParams.tilesX * wallParams.tilesY} tiles
                        <div className="text-xs text-gray-500 mt-1">
                          Wall layout: {wallParams.tilesX} tiles along {roomDimensions.length}ft length, {wallParams.tilesY} tiles up {roomDimensions.height || 9}ft height
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
          </div>

          {/* Grout Color Parameters */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900">Grout Settings</h3>

            {/* Floor Grout Color */}
            {(renovationType === 'floor-tiling' ||
              renovationType === 'complete-tiling' ||
              renovationType === 'floor-tiling-wall-coloring') && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">Floor Grout</h4>
                  <ColorPicker
                    label="Grout Color"
                    value={floorParams.groutColor}
                    onChange={(color) => setFloorParams(prev => ({ ...prev, groutColor: color }))}
                    description="Color of the grout lines between floor tiles"
                  />
                </div>
              )}

            {/* Wall Grout Color */}
            {(renovationType === 'wall-tiling' || renovationType === 'complete-tiling') && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">Wall Grout</h4>
                  <ColorPicker
                    label="Grout Color"
                    value={wallParams.groutColor}
                    onChange={(color) => setWallParams(prev => ({ ...prev, groutColor: color }))}
                    description="Color of the grout lines between wall tiles"
                  />
                </div>
            )}

            {/* Wall Color Picker */}
            {(renovationType === 'wall-coloring' ||
              renovationType === 'floor-tiling-wall-coloring') && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">Wall Color</h4>
                  <ColorPicker
                    label="Wall Color"
                    value={wallColor}
                    onChange={setWallColor}
                    description="Choose the color to apply to wall areas"
                  />
                </div>
              )}
          </div>

          {/* Add some bottom padding to ensure content doesn't get cut off */}
          <div className="pb-4"></div>
        </div>
      </div>

      {/* Process Button - Fixed at bottom */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0 bg-white">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleProcess}
          disabled={!canProcess || isProcessing}
          className={`
            w-full py-3 px-4 rounded-lg font-medium transition-all duration-200
            ${canProcess && !isProcessing
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Processing...</span>
            </div>
          ) : (
            'Start Renovation'
          )}
        </button>
      </div>
    </div>
  );
}