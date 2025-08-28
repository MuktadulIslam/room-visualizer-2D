'use client'
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { defaultTextures } from './uitls/defaultTextures';

// Types
export type TextureType = 'wall' | 'floor' | 'both';

export interface Texture {
  id: string;
  texture_img: string;
  show_img: string;
  name: string;
  size: [number, number]; // [width, height] in inch
  is_glossy: boolean;
  type: TextureType; // Specifies if texture can be used for wall, floor, or both
  isCustom?: boolean; // Flag for custom uploaded textures
}

export type SelectionType = 'wall' | 'floor' | null;

// Color interface for wall colors
export interface WallColor {
  id: string;
  name: string;
  hex: string;
  isCustom?: boolean; // Flag for custom colors
}

// Predefined wall colors
export const wallColors: WallColor[] = [
  { id: 'offwhite', name: 'Off White', hex: '#f8f8ff' },
  { id: 'white', name: 'Pure White', hex: '#ffffff' },
  { id: 'beige', name: 'Beige', hex: '#f5f5dc' },
  { id: 'lightgray', name: 'Light Gray', hex: '#d3d3d3' },
  { id: 'warmgray', name: 'Warm Gray', hex: '#8b8680' },
  { id: 'cream', name: 'Cream', hex: '#fffdd0' },
  { id: 'lightblue', name: 'Light Blue', hex: '#add8e6' },
  { id: 'lightgreen', name: 'Light Green', hex: '#90ee90' },
  { id: 'lavender', name: 'Lavender', hex: '#e6e6fa' },
  { id: 'peach', name: 'Peach', hex: '#ffcba4' },
];

interface TextureContextType {
  // Selection state
  selectionType: SelectionType;
  setSelectionType: (type: SelectionType) => void;
  
  // Textures
  wallTexture: Texture | null;
  floorTexture: Texture | null;
  setWallTexture: (texture: Texture | null) => void;
  setFloorTexture: (texture: Texture | null) => void;
  
  // Custom textures
  customTextures: Texture[];
  addCustomTexture: (texture: Texture) => void;
  removeCustomTexture: (textureId: string) => void;
  updateTextureSize: (textureId: string, newSize: [number, number]) => void;
  resetTextureSize: (textureId: string) => void;
  resetAllTextureSizes: () => void;
  
  // Wall color support
  wallColor: WallColor | null;
  setWallColor: (color: WallColor | null) => void;
  
  // Grout support - simplified to just one color
  floorGroutColor: string;
  setFloorGroutColor: (color: string) => void;
  wallGroutColor: string;
  setWallGroutColor: (color: string) => void;
  
  // Grout visibility toggle - separate for wall and floor
  showWallGrout: boolean;
  setShowWallGrout: (show: boolean) => void;
  showFloorGrout: boolean;
  setShowFloorGrout: (show: boolean) => void;
  
  // Helper methods
  getSelectedTexture: () => Texture | null;
  getSelectedWallColor: () => WallColor | null;
  selectTexture: (texture: Texture) => void;
  selectWallColor: (color: WallColor) => void;
  selectCustomWallColor: (hex: string) => void;
  toggleSelection: (type: SelectionType) => void;
  getAvailableTextures: () => Texture[];
  canApplyTexture: (texture: Texture) => boolean;
  
  // Check if wall has color or texture
  hasWallColor: () => boolean;
  hasWallTexture: () => boolean;
}


// Create Context
const TextureContext = createContext<TextureContextType | undefined>(undefined);

// Context Provider
export const TextureProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectionType, setSelectionType] = useState<SelectionType>('floor');
  const [wallTexture, setWallTexture] = useState<Texture | null>(null);
  const [floorTexture, setFloorTexture] = useState<Texture | null>(null);
  const [wallColor, setWallColor] = useState<WallColor | null>(null);
  const [customTextures, setCustomTextures] = useState<Texture[]>([]);
  // Make defaultTextures mutable so we can update their sizes
  const [mutableDefaultTextures, setMutableDefaultTextures] = useState<Texture[]>(defaultTextures);
  
  // Single grout color property
  const [floorGroutColor, setFloorGroutColor] = useState<string>('#dbdbdb'); // Deep off-white default
  const [wallGroutColor, setWallGroutColor] = useState<string>('#dbdbdb'); // Deep off-white default
  
  // Grout visibility toggle - separate for wall and floor
  const [showWallGrout, setShowWallGrout] = useState<boolean>(true);
  const [showFloorGrout, setShowFloorGrout] = useState<boolean>(true);

  // Note: Custom textures are stored in memory during the session
  // In a real application, you would persist these to a database or localStorage
  useEffect(() => {
    // Set default off-white color for walls (no default texture)
    if (!wallColor && !wallTexture) {
      const defaultWallColor = wallColors.find(c => c.id === 'offwhite');
      if (defaultWallColor) {
        setWallColor(defaultWallColor);
      }
    }

    // Set default texture for floor
    if (!floorTexture) {
      const allTextures = [...mutableDefaultTextures, ...customTextures];
      const defaultFloorTexture = allTextures.find(t => t.type === 'floor' || t.type === 'both');
      if (defaultFloorTexture) {
        setFloorTexture(defaultFloorTexture);
      }
    }
  }, [wallColor, wallTexture, floorTexture, customTextures, mutableDefaultTextures]);

  const addCustomTexture = (texture: Texture) => {
    setCustomTextures(prev => [...prev, texture]);
  };

  const removeCustomTexture = (textureId: string) => {
    setCustomTextures(prev => prev.filter(t => t.id !== textureId));
    
    // Clear selected textures if they were the deleted custom texture
    if (wallTexture?.id === textureId) {
      setWallTexture(null);
    }
    if (floorTexture?.id === textureId) {
      setFloorTexture(null);
    }
  };

  const updateTextureSize = (textureId: string, newSize: [number, number]) => {
    // Update default textures if the texture being edited is a default one
    setMutableDefaultTextures(prev => prev.map(texture => 
      texture.id === textureId 
        ? { ...texture, size: newSize }
        : texture
    ));

    // Update custom textures
    setCustomTextures(prev => prev.map(texture => 
      texture.id === textureId 
        ? { ...texture, size: newSize }
        : texture
    ));

    // Update currently selected textures if they match
    if (wallTexture?.id === textureId) {
      setWallTexture({ ...wallTexture, size: newSize });
    }
    if (floorTexture?.id === textureId) {
      setFloorTexture({ ...floorTexture, size: newSize });
    }
  };

  const resetTextureSize = (textureId: string) => {
    // Find the original texture from defaultTextures
    const originalTexture = defaultTextures.find(t => t.id === textureId);
    if (originalTexture) {
      updateTextureSize(textureId, originalTexture.size);
    }
  };

  const resetAllTextureSizes = () => {
    // Reset all default textures to their original sizes
    setMutableDefaultTextures([...defaultTextures]);
    
    // Update currently selected textures if they are default textures
    if (wallTexture && !wallTexture.isCustom) {
      const originalTexture = defaultTextures.find(t => t.id === wallTexture.id);
      if (originalTexture) {
        setWallTexture({ ...wallTexture, size: originalTexture.size });
      }
    }
    if (floorTexture && !floorTexture.isCustom) {
      const originalTexture = defaultTextures.find(t => t.id === floorTexture.id);
      if (originalTexture) {
        setFloorTexture({ ...floorTexture, size: originalTexture.size });
      }
    }
  };

  const getSelectedTexture = (): Texture | null => {
    if (selectionType === 'wall') return wallTexture;
    if (selectionType === 'floor') return floorTexture;
    return null;
  };

  const getSelectedWallColor = (): WallColor | null => {
    return wallColor;
  };

  const selectTexture = (texture: Texture) => {
    if (!canApplyTexture(texture)) return;
    
    if (selectionType === 'wall') {
      setWallTexture(texture);
      // Clear wall color when texture is applied
      setWallColor(null);
    } else if (selectionType === 'floor') {
      setFloorTexture(texture);
    }
  };

  const selectWallColor = (color: WallColor) => {
    setWallColor(color);
    // Clear wall texture when color is applied
    setWallTexture(null);
  };

  const selectCustomWallColor = (hex: string) => {
    const customColor: WallColor = {
      id: `custom-${Date.now()}`,
      name: 'Custom Color',
      hex: hex,
      isCustom: true
    };
    setWallColor(customColor);
    // Clear wall texture when color is applied
    setWallTexture(null);
  };

  const toggleSelection = (type: SelectionType) => {
    setSelectionType(selectionType === type ? null : type);
  };

  const getAvailableTextures = (): Texture[] => {
    if (!selectionType) return [];
    const allTextures = [...mutableDefaultTextures, ...customTextures];
    return allTextures.filter(texture => 
      texture.type === selectionType || texture.type === 'both'
    );
  };

  const canApplyTexture = (texture: Texture): boolean => {
    if (!selectionType) return false;
    return texture.type === selectionType || texture.type === 'both';
  };

  const hasWallColor = (): boolean => {
    return wallColor !== null && wallTexture === null;
  };

  const hasWallTexture = (): boolean => {
    return wallTexture !== null && wallColor === null;
  };

  const value: TextureContextType = {
    selectionType,
    setSelectionType,
    wallTexture,
    floorTexture,
    setWallTexture,
    setFloorTexture,
    customTextures,
    addCustomTexture,
    removeCustomTexture,
    updateTextureSize,
    resetTextureSize,
    resetAllTextureSizes,
    wallColor,
    setWallColor,
    floorGroutColor,
    setFloorGroutColor,
    wallGroutColor,
    setWallGroutColor,
    showWallGrout,
    setShowWallGrout,
    showFloorGrout,
    setShowFloorGrout,
    getSelectedTexture,
    getSelectedWallColor,
    selectTexture,
    selectWallColor,
    selectCustomWallColor,
    toggleSelection,
    getAvailableTextures,
    canApplyTexture,
    hasWallColor,
    hasWallTexture
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