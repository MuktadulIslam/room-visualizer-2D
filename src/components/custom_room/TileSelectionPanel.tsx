// components/custom_room/TileSelectionPanel.tsx
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { defaultTextures } from '@/context/uitls/defaultTextures';
import { Texture, TextureType } from '@/context/TextureContext';

interface TileSelectionPanelProps {
  label: string;
  selectedTile: File | null;
  selectedTilePreview: string;
  onTileSelect: (file: File) => void;
  tileType: 'floor' | 'wall';
}

export default function TileSelectionPanel({
  label,
  selectedTile,
  selectedTilePreview,
  onTileSelect,
  tileType
}: TileSelectionPanelProps) {
  const [selectedPresetTile, setSelectedPresetTile] = useState<Texture | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter textures based on type
  const availableTextures = defaultTextures.filter(texture =>
    texture.type === tileType || texture.type === 'both'
  );

  const handlePresetTileSelect = async (texture: Texture) => {
    try {
      // Convert the texture image to a File object
      const response = await fetch(texture.texture_img);
      const blob = await response.blob();
      const file = new File([blob], `${texture.name}.webp`, { type: 'image/webp' });

      setSelectedPresetTile(texture);
      onTileSelect(file);
    } catch (error) {
      console.error('Error loading preset tile:', error);
      alert('Failed to load the selected tile. Please try again.');
    }
  };

  const handleCustomFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      setSelectedPresetTile(null); // Clear preset selection when custom file is selected
      onTileSelect(file);
    } else {
      alert('Please select a valid image file');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleCustomFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleCustomFileSelect(files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const clearSelection = () => {
    setSelectedPresetTile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-base font-medium text-gray-700 mb-2">
        {label} Tile<span className='text-red-500 text-base'>*</span>
      </label>

      {/* Current Selection Display */}
      {selectedTilePreview && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 rounded border border-blue-300 overflow-hidden">
                <Image
                  src={selectedTilePreview}
                  alt="Selected tile"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-3">
                <span className="block font-medium text-blue-900">
                  {selectedPresetTile ? selectedPresetTile.name : selectedTile?.name || 'Custom Tile'}
                </span>
                <span className="block text-sm text-blue-700">
                  {selectedPresetTile
                    ? `${selectedPresetTile.size[0]}×${selectedPresetTile.size[1]}cm - ${selectedPresetTile.is_glossy ? 'Glossy' : 'Matt'}`
                    : 'Custom uploaded tile'
                  }
                </span>
              </div>
            </div>
            <button
              onClick={clearSelection}
              className="text-blue-600 hover:text-blue-800 p-1"
              title="Clear selection"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Tile Selection Grid */}
      <div className="space-y-4">
        {/* Preset Tiles Section */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3"> {label} Preset Tiles</h4>
          <div className="grid grid-cols-3 gap-2 pr-0.5 max-h-56 overflow-y-auto">
            {availableTextures.map((texture) => (
              <button
                key={texture.id}
                onClick={() => handlePresetTileSelect(texture)}
                className={`
                  relative group rounded-lg border-2 transition-all duration-200 overflow-hidden
                  ${selectedPresetTile?.id === texture.id
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="aspect-square peer">
                  <Image
                    src={texture.show_img}
                    alt={texture.name}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Hover overlay with details */}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-200 flex flex-col items-center justify-center">
                  <div className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center px-1">
                    <p className="font-semibold">{texture.name}</p>
                    <p className="text-xs opacity-90">{texture.size[0]}×{texture.size[1]}cm</p>
                    <p className="text-xs opacity-90">{texture.is_glossy ? 'Glossy' : 'Matt'}</p>
                  </div>
                </div>

                {/* Selection indicator */}
                {selectedPresetTile?.id === texture.id && (
                  <div className="absolute top-1 right-1">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}

              </button>
            ))}
          </div>

          {availableTextures.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              <p className="text-sm">No preset tiles available</p>
              <p className="text-xs text-gray-400 mt-1">Upload a custom tile below</p>
            </div>
          )}
        </div>

        {/* Custom Upload Section */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Or Upload Custom {label} Tile</h4>
          <div
            className={`
              relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
              transition-colors duration-200
              ${dragOver
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
              }
              ${!selectedTilePreview ? 'bg-white' : 'bg-gray-50'}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleUploadClick}
          >
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-sm text-gray-600">
              <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
            </div>
            <div className="text-xs text-gray-500 mt-1">
              PNG, JPG, JPEG up to 10MB
            </div>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileInput}
            />
          </div>
        </div>
      </div>
    </div>
  );
}