// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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

export class RoomRenovationAPI {
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

    const response = await fetch(`${API_BASE_URL}/api/floor-tiling`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Floor tiling failed');
    }

    return response.blob();
  }

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

    const response = await fetch(`${API_BASE_URL}/api/complete-tiling`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Complete tiling failed');
    }

    return response.blob();
  }

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

    const response = await fetch(`${API_BASE_URL}/api/wall-tiling`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Wall tiling failed');
    }

    return response.blob();
  }

  static async wallColoring(
    roomImage: File,
    wallColor: string
  ): Promise<Blob> {
    const formData = new FormData();
    formData.append('room_image', roomImage);
    formData.append('wall_color', wallColor);

    const response = await fetch(`${API_BASE_URL}/api/wall-coloring`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Wall coloring failed');
    }

    return response.blob();
  }

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

    const response = await fetch(`${API_BASE_URL}/api/floor-tiling-wall-coloring`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Floor tiling with wall coloring failed');
    }

    return response.blob();
  }
}