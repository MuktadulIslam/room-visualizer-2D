export interface FloorTilingParams {
  room_image: File
  floor_tile: File
  tiles_x: number
  tiles_y: number
  grout_width: number
  grout_color: string
}

export interface WallTilingParams {
  room_image: File
  wall_tile: File
  tiles_x: number
  tiles_y: number
  grout_width: number
  grout_color: string
}

export interface CompleteTilingParams {
  room_image: File
  floor_tile: File
  wall_tile: File
  floor_tiles_x: number
  floor_tiles_y: number
  wall_tiles_x: number
  wall_tiles_y: number
  floor_grout_width: number
  wall_grout_width: number
  floor_grout_color: string
  wall_grout_color: string
}

export interface WallColoringParams {
  room_image: File
  wall_color: string
}

export interface FloorTilingWallColoringParams {
  room_image: File
  floor_tile: File
  wall_color: string
  tiles_x: number
  tiles_y: number
  grout_width: number
  grout_color: string
}

export type RenovationType = 
  | 'floor-tiling'
  | 'wall-tiling'
  | 'complete-tiling'
  | 'wall-coloring'
  | 'floor-tiling-wall-coloring'

export interface ProcessingStatus {
  isProcessing: boolean
  progress: number
  message: string
}