// lib/api.ts
const API_BASE_URL = 'https://roomvisualizer.streamstech.com/api/';
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface TilingParams {
  tilesX: number;
  tilesY: number;
  groutWidth: number;
  groutColor: string;
}

export interface CompleteTilingParams extends TilingParams {
  floorTilesX: number;
  floorTilesY: number;
  wallTilesX: number;
  wallTilesY: number;
  floorGroutWidth: number;
  wallGroutWidth: number;
  floorGroutColor: string;
  wallGroutColor: string;
}

export interface RoomDimensions {
  length: number; // in feet - room length
  width: number;  // in feet - room width
  height?: number; // in feet - wall height (only needed for wall tiling)
}

export interface TileDimensions {
  length: number; // in inches
  width: number;  // in inches
}

export class RoomRenovationAPI {
  /**
   * Apply floor tiling to a room image
   */
  static async floorTiling(
    roomImage: File,
    floorTile: File,
    params: TilingParams
  ): Promise<Blob> {
    const formData = new FormData();
    formData.append('room_image', roomImage);
    formData.append('floor_tile', floorTile);
    formData.append('tiles_x', params.tilesX.toString());
    formData.append('tiles_y', params.tilesY.toString());
    formData.append('grout_width', params.groutWidth.toString());
    formData.append('grout_color', params.groutColor);

    console.log('Sending floor tiling request:', {
      roomImageSize: roomImage.size,
      floorTileSize: floorTile.size,
      params
    });

    const response = await fetch(`${API_BASE_URL}/api/floor-tiling`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Floor tiling failed' }));
      throw new Error(error.detail || 'Floor tiling failed');
    }

    return response.blob();
  }

  /**
   * Apply tiling to both floors and walls
   */
  static async completeTiling(
    roomImage: File,
    floorTile: File,
    wallTile: File,
    params: CompleteTilingParams
  ): Promise<Blob> {
    const formData = new FormData();
    formData.append('room_image', roomImage);
    formData.append('floor_tile', floorTile);
    formData.append('wall_tile', wallTile);
    formData.append('floor_tiles_x', params.floorTilesX.toString());
    formData.append('floor_tiles_y', params.floorTilesY.toString());
    formData.append('wall_tiles_x', params.wallTilesX.toString());
    formData.append('wall_tiles_y', params.wallTilesY.toString());
    formData.append('floor_grout_width', params.floorGroutWidth.toString());
    formData.append('wall_grout_width', params.wallGroutWidth.toString());
    formData.append('floor_grout_color', params.floorGroutColor);
    formData.append('wall_grout_color', params.wallGroutColor);

    console.log('Sending complete tiling request:', {
      roomImageSize: roomImage.size,
      floorTileSize: floorTile.size,
      wallTileSize: wallTile.size,
      params
    });

    const response = await fetch(`${API_BASE_URL}/api/complete-tiling`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Complete tiling failed' }));
      throw new Error(error.detail || 'Complete tiling failed');
    }

    return response.blob();
  }

  /**
   * Apply wall tiling only
   */
  static async wallTiling(
    roomImage: File,
    wallTile: File,
    params: TilingParams
  ): Promise<Blob> {
    const formData = new FormData();
    formData.append('room_image', roomImage);
    formData.append('wall_tile', wallTile);
    formData.append('tiles_x', params.tilesX.toString());
    formData.append('tiles_y', params.tilesY.toString());
    formData.append('grout_width', params.groutWidth.toString());
    formData.append('grout_color', params.groutColor);

    console.log('Sending wall tiling request:', {
      roomImageSize: roomImage.size,
      wallTileSize: wallTile.size,
      params
    });

    const response = await fetch(`${API_BASE_URL}/api/wall-tiling`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Wall tiling failed' }));
      throw new Error(error.detail || 'Wall tiling failed');
    }

    return response.blob();
  }

  /**
   * Apply solid color to walls
   */
  static async wallColoring(
    roomImage: File,
    wallColor: string
  ): Promise<Blob> {
    const formData = new FormData();
    formData.append('room_image', roomImage);
    formData.append('wall_color', wallColor);

    console.log('Sending wall coloring request:', {
      roomImageSize: roomImage.size,
      wallColor
    });

    const response = await fetch(`${API_BASE_URL}/api/wall-coloring`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Wall coloring failed' }));
      throw new Error(error.detail || 'Wall coloring failed');
    }

    return response.blob();
  }

  /**
   * Apply floor tiling with wall coloring
   */
  static async floorTilingWallColoring(
    roomImage: File,
    floorTile: File,
    wallColor: string,
    params: TilingParams
  ): Promise<Blob> {
    const formData = new FormData();
    formData.append('room_image', roomImage);
    formData.append('floor_tile', floorTile);
    formData.append('wall_color', wallColor);
    formData.append('tiles_x', params.tilesX.toString());
    formData.append('tiles_y', params.tilesY.toString());
    formData.append('grout_width', params.groutWidth.toString());
    formData.append('grout_color', params.groutColor);

    console.log('Sending floor tiling + wall coloring request:', {
      roomImageSize: roomImage.size,
      floorTileSize: floorTile.size,
      wallColor,
      params
    });

    const response = await fetch(`${API_BASE_URL}/api/floor-tiling-wall-coloring`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Floor tiling with wall coloring failed' }));
      throw new Error(error.detail || 'Floor tiling with wall coloring failed');
    }

    return response.blob();
  }
}

/**
 * Utility functions for dimension calculations
 */
export class DimensionUtils {
  /**
   * Calculate tile repetition based on room and tile dimensions
   */
  static calculateTileRepetition(
    roomDimensions: RoomDimensions,
    tileDimensions: TileDimensions,
    isWall: boolean = false
  ): { tilesX: number; tilesY: number; coverage: number; area: number } {
    let lengthInches: number;
    let widthInches: number;
    
    if (isWall) {
      // For walls: use room length as wall length, wall height as wall width
      lengthInches = roomDimensions.length * 12;
      widthInches = (roomDimensions.height || 9) * 12;
    } else {
      // For floor: use room length and width
      lengthInches = roomDimensions.length * 12;
      widthInches = roomDimensions.width * 12;
    }
    
    // Calculate how many tiles fit
    const tilesX = Math.ceil(lengthInches / tileDimensions.length);
    const tilesY = Math.ceil(widthInches / tileDimensions.width);
    
    // Calculate coverage efficiency
    const actualCoveredLength = tilesX * tileDimensions.length;
    const actualCoveredWidth = tilesY * tileDimensions.width;
    const actualArea = actualCoveredLength * actualCoveredWidth;
    const targetArea = lengthInches * widthInches;
    const coverage = (targetArea / actualArea) * 100;
    
    return { 
      tilesX, 
      tilesY, 
      coverage, 
      area: targetArea / 144 // Convert to square feet
    };
  }

  /**
   * Calculate total tiles needed including waste factor
   */
  static calculateTileQuantity(
    roomDimensions: RoomDimensions,
    tileDimensions: TileDimensions,
    isWall: boolean = false,
    wasteFactor: number = 0.1 // 10% waste by default
  ): {
    tilesNeeded: number;
    tilesWithWaste: number;
    tileArea: number;
    targetArea: number;
  } {
    const { tilesX, tilesY, area } = this.calculateTileRepetition(roomDimensions, tileDimensions, isWall);
    const tilesNeeded = tilesX * tilesY;
    const tilesWithWaste = Math.ceil(tilesNeeded * (1 + wasteFactor));
    
    // Calculate areas in square feet
    const tileAreaInches = tileDimensions.length * tileDimensions.width;
    const tileArea = (tileAreaInches / 144) * tilesNeeded; // Convert to sq ft
    
    return {
      tilesNeeded,
      tilesWithWaste,
      tileArea,
      targetArea: area
    };
  }

  /**
   * Validate room dimensions based on renovation type
   */
  static validateRoomDimensions(dimensions: RoomDimensions, renovationType: string): string[] {
    const errors: string[] = [];
    
    // Length is always required (except for wall-coloring)
    if (renovationType !== 'wall-coloring') {
      if (dimensions.length <= 0 || dimensions.length > 100) {
        errors.push('Room/wall length must be between 1 and 100 feet');
      }
    }
    
    // Width is required for floor tiling
    if (renovationType.includes('floor') || renovationType === 'complete-tiling') {
      if (dimensions.width <= 0 || dimensions.width > 100) {
        errors.push('Room width must be between 1 and 100 feet');
      }
    }
    
    // Height is required for wall tiling
    if (renovationType.includes('wall') && renovationType !== 'wall-coloring') {
      if (!dimensions.height || dimensions.height <= 0 || dimensions.height > 20) {
        errors.push('Wall height must be between 1 and 20 feet');
      }
    }
    
    return errors;
  }

  /**
   * Validate tile dimensions
   */
  static validateTileDimensions(dimensions: TileDimensions): string[] {
    const errors: string[] = [];
    
    if (dimensions.length <= 0 || dimensions.length > 48) {
      errors.push('Tile length must be between 1 and 48 inches');
    }
    
    if (dimensions.width <= 0 || dimensions.width > 48) {
      errors.push('Tile width must be between 1 and 48 inches');
    }
    
    return errors;
  }

  /**
   * Get recommended tile sizes for a given room
   */
  static getRecommendedTileSizes(roomDimensions: RoomDimensions): TileDimensions[] {
    const roomArea = roomDimensions.length * roomDimensions.width;
    
    if (roomArea < 50) {
      // Small room - smaller tiles
      return [
        { length: 6, width: 6 },
        { length: 8, width: 8 },
        { length: 12, width: 12 },
      ];
    } else if (roomArea < 150) {
      // Medium room - medium tiles
      return [
        { length: 12, width: 12 },
        { length: 16, width: 16 },
        { length: 18, width: 18 },
      ];
    } else {
      // Large room - larger tiles
      return [
        { length: 18, width: 18 },
        { length: 24, width: 24 },
        { length: 36, width: 36 },
      ];
    }
  }
}