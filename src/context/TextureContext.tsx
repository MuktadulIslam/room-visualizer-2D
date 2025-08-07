'use client'
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Types
export type TextureType = 'wall' | 'floor' | 'both';

export interface Texture {
  id: string;
  texture_img: string;
  show_img: string;
  name: string;
  size: [number, number]; // [width, height] in cm
  is_glossy: boolean;
  type: TextureType; // Specifies if texture can be used for wall, floor, or both
}

export type SelectionType = 'wall' | 'floor' | null;

interface TextureContextType {
  // Selection state
  selectionType: SelectionType;
  setSelectionType: (type: SelectionType) => void;
  
  // Textures
  wallTexture: Texture | null;
  floorTexture: Texture | null;
  setWallTexture: (texture: Texture | null) => void;
  setFloorTexture: (texture: Texture | null) => void;
  
  // Helper methods
  getSelectedTexture: () => Texture | null;
  selectTexture: (texture: Texture) => void;
  toggleSelection: (type: SelectionType) => void;
  getAvailableTextures: () => Texture[]; // Get textures available for current selection
  canApplyTexture: (texture: Texture) => boolean; // Check if texture can be applied to current selection
}

// Sample texture data
export const textures: Texture[] = [
  {
    id: '1',
    texture_img: '/textures/floor/tiles1_glossy.webp',
    show_img: '/textures/floor/tiles1_glossy.webp',
    name: 'Tiles-1',
    size: [30, 30],
    is_glossy: true,
    type: 'floor' // Wood can be used for both walls and floors
  },
  {
    id: '2',
    texture_img: '/textures/floor/tiles2_glossy.webp',
    show_img: '/textures/floor/tiles2_glossy.webp',
    name: 'Tiles-2',
    size: [30, 30],
    is_glossy: true,
    type: 'both' // Marble can be used for both walls and floors
  },
  {
    id: '3',
    texture_img: '/textures/floor/tiles3_glossy.webp',
    show_img: '/textures/floor/tiles3_glossy.webp',
    name: 'Tiles-3',
    size: [30, 30],
    is_glossy: true,
    type: 'both' // Brick is typically used for walls only
  },
  {
    id: '4',
    texture_img: '/textures/floor/tiles4_matt.webp',
    show_img: '/textures/floor/tiles4_matt.webp',
    name: 'Tiles-4',
    size: [30, 30],
    is_glossy: false,
    type: 'both' // Tiles can be used for both walls and floors
  },
  {
    id: '5',
    texture_img: '/textures/floor/tiles5_matt.webp',
    show_img: '/textures/floor/tiles5_matt.webp',
    name: 'Tiles-5',
    size: [30, 30],
    is_glossy: false,
    type: 'both' // Concrete is typically used for floors only
  },
  {
    id: '6',
    texture_img: '/textures/floor/tiles6_matt.webp',
    show_img: '/textures/floor/tiles6_matt.webp',
    name: 'Tiles-6',
    size: [30, 30],
    is_glossy: false,
    type: 'both' // Granite can be used for both walls and floors
  },
  {
    id: '7',
    texture_img: '/textures/floor/tiles7_matt.webp',
    show_img: '/textures/floor/tiles7_matt.webp',
    name: 'Tiles-7',
    size: [30, 30], // Standard wallpaper roll width
    is_glossy: false,
    type: 'both' // Wallpaper is only for walls
  },
  {
    id: '8',
    texture_img: '/textures/floor/tiles8_glossy.webp',
    show_img: '/textures/floor/tiles8_glossy.webp',
    name: 'Tiles-8',
    size: [60, 120],
    is_glossy: true,
    type: 'floor' // Carpet is only for floors
  },
  {
    id: '9',
    texture_img: '/textures/floor/tiles9_glossy.webp',
    show_img: '/textures/floor/tiles9_glossy.webp',
    name: 'Hardwood Flooring',
    size: [60, 120], // Standard hardwood plank size
    is_glossy: true,
    type: 'floor' // Hardwood flooring is primarily for floors
  },
];

// Create Context
const TextureContext = createContext<TextureContextType | undefined>(undefined);

// Context Provider
export const TextureProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectionType, setSelectionType] = useState<SelectionType>('floor'); // Default to floor
  const [wallTexture, setWallTexture] = useState<Texture | null>(null);
  const [floorTexture, setFloorTexture] = useState<Texture | null>(null);

  // Set default textures on mount
  useEffect(() => {
    if (!floorTexture) {
      // Set first texture as default floor texture
      const defaultFloorTexture = textures.find(t => t.type === 'floor' || t.type === 'both');
      if (defaultFloorTexture) {
        setFloorTexture(defaultFloorTexture);
      }
    }
  }, [floorTexture]);

  const getSelectedTexture = (): Texture | null => {
    if (selectionType === 'wall') return wallTexture;
    if (selectionType === 'floor') return floorTexture;
    return null;
  };

  const selectTexture = (texture: Texture) => {
    if (!canApplyTexture(texture)) return;
    
    if (selectionType === 'wall') {
      setWallTexture(texture);
    } else if (selectionType === 'floor') {
      setFloorTexture(texture);
    }
  };

  const toggleSelection = (type: SelectionType) => {
    setSelectionType(selectionType === type ? null : type);
  };

  const getAvailableTextures = (): Texture[] => {
    if (!selectionType) return [];
    return textures.filter(texture => 
      texture.type === selectionType || texture.type === 'both'
    );
  };

  const canApplyTexture = (texture: Texture): boolean => {
    if (!selectionType) return false;
    return texture.type === selectionType || texture.type === 'both';
  };

  const value: TextureContextType = {
    selectionType,
    setSelectionType,
    wallTexture,
    floorTexture,
    setWallTexture,
    setFloorTexture,
    getSelectedTexture,
    selectTexture,
    toggleSelection,
    getAvailableTextures,
    canApplyTexture
  };

  return (
    <TextureContext.Provider value={value}>
      {children}
    </TextureContext.Provider>
  );
};

// Custom hook to use the context
export const useTexture = (): TextureContextType => {
  const context = useContext(TextureContext);
  if (context === undefined) {
    throw new Error('useTexture must be used within a TextureProvider');
  }
  return context;
};