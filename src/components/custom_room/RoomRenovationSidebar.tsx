'use client';

import { useState } from 'react';
import ImageUpload from '@/components/custom_room/ImageUpload';
import TileSelectionPanel from '@/components/custom_room/TileSelectionPanel';
import { TileParameters, ColorPicker } from '@/components/custom_room/ParameterControls';
import RenovationDropdown from '@/components/custom_room/RenovationDropdown';
import { RenovationType } from '@/components/custom_room/RenovationTypes';
import { TilingParams } from '@/lib/api';

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
  onFloorTileSelect: (file: File) => void;
  onWallTileSelect: (file: File) => void;
  onProcess: () => void;
  canProcess: boolean;
  isProcessing: boolean;
  error: string;
  // Store the actual file objects for tile selections
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

          {/* Image Uploads */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900">Upload Images</h3>

            {/* Room Image - Always required */}
            <ImageUpload
              label="Room Image *"
              onImageSelect={onRoomImageSelect}
              preview={roomPreview}
              className="w-full"
            />

            {/* Floor Tile Selection - Required for floor tiling types */}
            {(renovationType === 'floor-tiling' ||
              renovationType === 'complete-tiling' ||
              renovationType === 'floor-tiling-wall-coloring') && (
                <TileSelectionPanel
                  label="Floor Tile *"
                  selectedTile={floorTile}
                  selectedTilePreview={floorTilePreview}
                  onTileSelect={onFloorTileSelect}
                  tileType="floor"
                />
              )}

            {/* Wall Tile Selection - Required for wall tiling types */}
            {(renovationType === 'wall-tiling' ||
              renovationType === 'complete-tiling') && (
                <TileSelectionPanel
                  label="Wall Tile *"
                  selectedTile={wallTile}
                  selectedTilePreview={wallTilePreview}
                  onTileSelect={onWallTileSelect}
                  tileType="wall"
                />
              )}
          </div>

          {/* Parameters */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900">Parameters</h3>

            {/* Floor Tile Parameters */}
            {(renovationType === 'floor-tiling' ||
              renovationType === 'complete-tiling' ||
              renovationType === 'floor-tiling-wall-coloring') && (
                <TileParameters
                  tilesX={floorParams.tilesX}
                  tilesY={floorParams.tilesY}
                  groutWidth={floorParams.groutWidth}
                  groutColor={floorParams.groutColor}
                  onTilesXChange={(value) => setFloorParams(prev => ({ ...prev, tilesX: value }))}
                  onTilesYChange={(value) => setFloorParams(prev => ({ ...prev, tilesY: value }))}
                  onGroutColorChange={(color) => setFloorParams(prev => ({ ...prev, groutColor: color }))}
                  prefix="Floor"
                />
              )}

            {/* Wall Tile Parameters */}
            {(renovationType === 'wall-tiling' || renovationType === 'complete-tiling') && (
                <TileParameters
                  tilesX={wallParams.tilesX}
                  tilesY={wallParams.tilesY}
                  groutWidth={wallParams.groutWidth}
                  groutColor={wallParams.groutColor}
                  onTilesXChange={(value) => setWallParams(prev => ({ ...prev, tilesX: value }))}
                  onTilesYChange={(value) => setWallParams(prev => ({ ...prev, tilesY: value }))}
                  onGroutColorChange={(color) => setWallParams(prev => ({ ...prev, groutColor: color }))}
                  prefix="Wall"
                />
            )}

            {/* Wall Color Picker */}
            {(renovationType === 'wall-coloring' ||
              renovationType === 'floor-tiling-wall-coloring') && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-4">Wall Color</h4>
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
          onClick={onProcess}
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