from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import tempfile
from PIL import Image
import numpy as np
import cv2
import io
import base64
from typing import Optional
from room_tiler import CompleteRoomTiler

app = FastAPI(
    title="Room Renovation API",
    description="APIs for applying tiles and colors to room floors and walls",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the room tiler
room_tiler = CompleteRoomTiler()

def save_uploaded_file(upload_file: UploadFile) -> str:
    """Save uploaded file to temporary location"""
    suffix = os.path.splitext(upload_file.filename)[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(upload_file.file.read())
        return tmp.name

def image_to_response(image: Image.Image, format: str = "PNG") -> Response:
    """Convert PIL Image to FastAPI Response"""
    img_io = io.BytesIO()
    image.save(img_io, format=format, quality=95 if format == "JPEG" else None)
    img_io.seek(0)
    
    media_type = "image/png" if format == "PNG" else "image/jpeg"
    return Response(content=img_io.read(), media_type=media_type)

def hex_to_rgb(hex_color: str) -> tuple:
    """Convert hex color to RGB tuple"""
    hex_color = hex_color.lstrip('#')
    if len(hex_color) != 6:
        raise ValueError("Invalid hex color format")
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def apply_wall_color(room_image_path: str, wall_color_hex: str) -> Image.Image:
    """Apply solid color to walls"""
    room_image = Image.open(room_image_path).convert("RGB")
    
    # Get wall mask
    wall_mask = room_tiler.detect_wall_mask(room_image)
    
    if np.sum(wall_mask) == 0:
        print("No walls detected, returning original image")
        return room_image
    
    # Convert hex to RGB
    wall_color_rgb = hex_to_rgb(wall_color_hex)
    
    # Create colored wall
    room_np = np.array(room_image)
    colored_room = room_np.copy().astype(np.float32)
    
    # Apply color to wall areas with blending
    wall_mask_3ch = np.stack([wall_mask] * 3, axis=-1).astype(np.float32)
    wall_mask_smooth = cv2.GaussianBlur(wall_mask_3ch, (5, 5), 0)
    
    # Create wall color array
    wall_color_array = np.full_like(colored_room, wall_color_rgb, dtype=np.float32)
    
    # Blend with existing lighting
    room_gray = cv2.cvtColor(room_np.astype(np.float32) / 255.0, cv2.COLOR_RGB2GRAY)
    lighting = np.stack([room_gray] * 3, axis=-1)
    lighting = np.clip(lighting * 1.1 + 0.4, 0.5, 1.2)
    
    # Apply lighting to wall color
    lit_wall_color = np.clip((wall_color_array / 255.0) * lighting, 0, 1) * 255
    
    # Blend with original image
    blended = wall_mask_smooth * lit_wall_color + (1 - wall_mask_smooth) * colored_room
    
    return Image.fromarray(np.clip(blended, 0, 255).astype(np.uint8))

@app.post("/api/floor-tiling", 
          summary="Apply tiles to floor only",
          description="Takes a room image and floor tile, applies tiling to the floor area")
async def floor_tiling(
    room_image: UploadFile = File(..., description="Room image file"),
    floor_tile: UploadFile = File(..., description="Floor tile texture"),
    tiles_x: int = Form(25, description="Number of tiles horizontally"),
    tiles_y: int = Form(18, description="Number of tiles vertically"),
    grout_width: int = Form(2, description="Grout width in pixels"),
    grout_color: str = Form("#F0EBE4", description="Grout color in hex format")
):
    try:
        # Save uploaded files
        room_path = save_uploaded_file(room_image)
        floor_tile_path = save_uploaded_file(floor_tile)
        
        try:
            # Convert hex grout color to RGB
            grout_rgb = hex_to_rgb(grout_color)
            
            # Load images
            room_img = Image.open(room_path).convert("RGB")
            floor_tile_img = Image.open(floor_tile_path).convert("RGB")
            
            room_width, room_height = room_img.size
            
            # Generate floor tiles
            generated_floor = room_tiler.generate_floor_tiles(
                floor_tile_img, room_width, room_height, 
                tiles_x, tiles_y, grout_width, grout_rgb
            )
            
            # Detect floor and apply
            floor_mask = room_tiler.detect_floor_mask(room_img)
            warped_floor = room_tiler.apply_perspective_to_floor(generated_floor, floor_mask, room_img)
            final_result = room_tiler.blend_with_lighting(room_img, warped_floor, floor_mask, is_floor=True)
            
            result_image = Image.fromarray(final_result)
            return image_to_response(result_image)
            
        finally:
            # Clean up temporary files
            os.unlink(room_path)
            os.unlink(floor_tile_path)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

@app.post("/api/complete-tiling",
          summary="Apply tiles to both floor and walls", 
          description="Takes a room image, floor tile, and wall tile, applies tiling to both areas")
async def complete_tiling(
    room_image: UploadFile = File(..., description="Room image file"),
    floor_tile: UploadFile = File(..., description="Floor tile texture"),
    wall_tile: UploadFile = File(..., description="Wall tile texture"),
    floor_tiles_x: int = Form(25, description="Floor tiles horizontally"),
    floor_tiles_y: int = Form(18, description="Floor tiles vertically"),
    wall_tiles_x: int = Form(20, description="Wall tiles horizontally"), 
    wall_tiles_y: int = Form(15, description="Wall tiles vertically"),
    floor_grout_width: int = Form(2, description="Floor grout width"),
    wall_grout_width: int = Form(2, description="Wall grout width"),
    floor_grout_color: str = Form("#F0EBE4", description="Floor grout color in hex"),
    wall_grout_color: str = Form("#F5F0EB", description="Wall grout color in hex")
):
    try:
        # Save uploaded files
        room_path = save_uploaded_file(room_image)
        floor_tile_path = save_uploaded_file(floor_tile)
        wall_tile_path = save_uploaded_file(wall_tile)
        
        try:
            # Convert hex colors to RGB
            floor_grout_rgb = hex_to_rgb(floor_grout_color)
            wall_grout_rgb = hex_to_rgb(wall_grout_color)
            
            # Create temporary output path
            with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as tmp:
                output_path = tmp.name
            
            try:
                # Process complete renovation
                result_image = room_tiler.replace_room_floor_and_walls(
                    room_image_path=room_path,
                    floor_tile_path=floor_tile_path,
                    wall_tile_path=wall_tile_path,
                    output_image_path=output_path,
                    floor_tiles_x=floor_tiles_x,
                    floor_tiles_y=floor_tiles_y,
                    floor_grout_width=floor_grout_width,
                    floor_grout_color=floor_grout_rgb,
                    wall_tiles_x=wall_tiles_x,
                    wall_tiles_y=wall_tiles_y,
                    wall_grout_width=wall_grout_width,
                    wall_grout_color=wall_grout_rgb
                )
                
                return image_to_response(result_image)
                
            finally:
                # Clean up output file
                if os.path.exists(output_path):
                    os.unlink(output_path)
            
        finally:
            # Clean up temporary files
            os.unlink(room_path)
            os.unlink(floor_tile_path)
            os.unlink(wall_tile_path)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

@app.post("/api/wall-tiling",
          summary="Apply tiles to walls only",
          description="Takes a room image and wall tile, applies tiling to wall areas only")
async def wall_tiling(
    room_image: UploadFile = File(..., description="Room image file"),
    wall_tile: UploadFile = File(..., description="Wall tile texture"),
    tiles_x: int = Form(20, description="Number of tiles horizontally"),
    tiles_y: int = Form(15, description="Number of tiles vertically"),
    grout_width: int = Form(2, description="Grout width in pixels"),
    grout_color: str = Form("#F5F0EB", description="Grout color in hex format")
):
    try:
        # Save uploaded files
        room_path = save_uploaded_file(room_image)
        wall_tile_path = save_uploaded_file(wall_tile)
        
        try:
            # Convert hex grout color to RGB
            grout_rgb = hex_to_rgb(grout_color)
            
            # Load images
            room_img = Image.open(room_path).convert("RGB")
            wall_tile_img = Image.open(wall_tile_path).convert("RGB")
            
            room_width, room_height = room_img.size
            
            # Generate wall tiles
            generated_wall = room_tiler.generate_wall_tiles(
                wall_tile_img, room_width, room_height,
                tiles_x, tiles_y, grout_width, grout_rgb
            )
            
            # Detect walls and apply
            wall_mask = room_tiler.detect_wall_mask(room_img)
            wall_texture = room_tiler.apply_wall_texture(generated_wall, wall_mask)
            final_result = room_tiler.blend_with_lighting(room_img, wall_texture, wall_mask, is_floor=False)
            
            result_image = Image.fromarray(final_result)
            return image_to_response(result_image)
            
        finally:
            # Clean up temporary files
            os.unlink(room_path)
            os.unlink(wall_tile_path)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

@app.post("/api/wall-coloring",
          summary="Apply solid color to walls",
          description="Takes a room image and hex color, applies the color to wall areas")
async def wall_coloring(
    room_image: UploadFile = File(..., description="Room image file"),
    wall_color: str = Form(..., description="Wall color in hex format (e.g., #FF5733)")
):
    try:
        # Save uploaded file
        room_path = save_uploaded_file(room_image)
        
        try:
            # Apply wall color
            result_image = apply_wall_color(room_path, wall_color)
            return image_to_response(result_image)
            
        finally:
            # Clean up temporary file
            os.unlink(room_path)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

@app.post("/api/floor-tiling-wall-coloring",
          summary="Apply floor tiles and wall color",
          description="Takes a room image, floor tile, and wall color, applies both modifications")
async def floor_tiling_wall_coloring(
    room_image: UploadFile = File(..., description="Room image file"),
    floor_tile: UploadFile = File(..., description="Floor tile texture"),
    wall_color: str = Form(..., description="Wall color in hex format"),
    tiles_x: int = Form(25, description="Number of floor tiles horizontally"),
    tiles_y: int = Form(18, description="Number of floor tiles vertically"),
    grout_width: int = Form(2, description="Floor grout width in pixels"),
    grout_color: str = Form("#F0EBE4", description="Floor grout color in hex format")
):
    try:
        # Save uploaded files
        room_path = save_uploaded_file(room_image)
        floor_tile_path = save_uploaded_file(floor_tile)
        
        try:
            # Convert hex grout color to RGB
            grout_rgb = hex_to_rgb(grout_color)
            
            # Load images
            room_img = Image.open(room_path).convert("RGB")
            floor_tile_img = Image.open(floor_tile_path).convert("RGB")
            
            room_width, room_height = room_img.size
            
            # Step 1: Apply floor tiling
            generated_floor = room_tiler.generate_floor_tiles(
                floor_tile_img, room_width, room_height, 
                tiles_x, tiles_y, grout_width, grout_rgb
            )
            
            floor_mask = room_tiler.detect_floor_mask(room_img)
            warped_floor = room_tiler.apply_perspective_to_floor(generated_floor, floor_mask, room_img)
            room_with_floor = room_tiler.blend_with_lighting(room_img, warped_floor, floor_mask, is_floor=True)
            
            # Step 2: Apply wall coloring to the result
            room_with_floor_img = Image.fromarray(room_with_floor)
            
            # Save temporary image for wall coloring
            with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as tmp:
                temp_room_path = tmp.name
                room_with_floor_img.save(temp_room_path)
            
            try:
                final_result = apply_wall_color(temp_room_path, wall_color)
                return image_to_response(final_result)
            finally:
                os.unlink(temp_room_path)
            
        finally:
            # Clean up temporary files
            os.unlink(room_path)
            os.unlink(floor_tile_path)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

@app.get("/", summary="API Status", description="Check if the API is running")
async def root():
    return {
        "message": "Room Renovation API is running!",
        "version": "1.0.0",
        "endpoints": {
            "floor_tiling": "/api/floor-tiling",
            "complete_tiling": "/api/complete-tiling", 
            "wall_tiling": "/api/wall-tiling",
            "wall_coloring": "/api/wall-coloring",
            "floor_tiling_wall_coloring": "/api/floor-tiling-wall-coloring"
        }
    }

@app.get("/health", summary="Health Check", description="Health check endpoint")
async def health_check():
    return {"status": "healthy", "models_loaded": True}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)