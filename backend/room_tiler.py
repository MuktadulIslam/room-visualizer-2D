import torch
import numpy as np
import cv2
from PIL import Image
import os
import math
from torchvision import transforms
from transformers import SegformerForSemanticSegmentation, AutoImageProcessor, Mask2FormerForUniversalSegmentation
import warnings
from typing import Tuple, Optional
warnings.filterwarnings("ignore")

class CompleteRoomTiler:
    def __init__(self):
        self.device = self._get_device()
        self.processor = None
        self.model = None
        self.wall_processor = None
        self.wall_model = None
        self.wall_support = False
        self._load_models()
    
    def _get_device(self):
        if torch.cuda.is_available():
            device = torch.device("cuda")
            print(f"Using GPU: {torch.cuda.get_device_name(0)}")
        else:
            device = torch.device("cpu")
            print("Using CPU")
        return device
    
    def _load_models(self):
        # Load floor segmentation model (SegFormer)
        try:
            print("Loading SegFormer model for floor segmentation...")
            try:
                self.processor = AutoImageProcessor.from_pretrained(
                    "nvidia/segformer-b2-finetuned-ade-512-512",
                    cache_dir="./model_cache",
                    local_files_only=True
                )
                self.model = SegformerForSemanticSegmentation.from_pretrained(
                    "nvidia/segformer-b2-finetuned-ade-512-512",
                    cache_dir="./model_cache",
                    local_files_only=True
                ).to(self.device)
                print("SegFormer model loaded from cache!")
            except:
                self.processor = AutoImageProcessor.from_pretrained(
                    "nvidia/segformer-b2-finetuned-ade-512-512",
                    cache_dir="./model_cache"
                )
                self.model = SegformerForSemanticSegmentation.from_pretrained(
                    "nvidia/segformer-b2-finetuned-ade-512-512",
                    cache_dir="./model_cache"
                ).to(self.device)
                print("SegFormer model downloaded and loaded!")
            
            self.model.eval()
            
        except Exception as e:
            raise Exception(f"Failed to load floor segmentation model: {e}")
        
        # Load wall segmentation model (Mask2Former)
        try:
            print("Loading Mask2Former model for wall segmentation...")
            try:
                self.wall_processor = AutoImageProcessor.from_pretrained(
                    "facebook/mask2former-swin-large-ade-semantic",
                    cache_dir="./model_cache",
                    local_files_only=True
                )
                self.wall_model = Mask2FormerForUniversalSegmentation.from_pretrained(
                    "facebook/mask2former-swin-large-ade-semantic",
                    cache_dir="./model_cache",
                    local_files_only=True
                ).to(self.device)
                print("Mask2Former model loaded from cache!")
                self.wall_support = True
            except:
                self.wall_processor = AutoImageProcessor.from_pretrained(
                    "facebook/mask2former-swin-large-ade-semantic",
                    cache_dir="./model_cache"
                )
                self.wall_model = Mask2FormerForUniversalSegmentation.from_pretrained(
                    "facebook/mask2former-swin-large-ade-semantic",
                    cache_dir="./model_cache"
                ).to(self.device)
                print("Mask2Former model downloaded and loaded!")
                self.wall_support = True
            
            self.wall_model.eval()
            
        except Exception as e:
            print(f"Warning: Could not load wall segmentation model: {e}")
            self.wall_support = False

    def generate_floor_tiles(self, tile_image, room_width, room_height, tiles_x=25, tiles_y=18, 
                           grout_width=2, grout_color=(240, 235, 228)):
        """Generate floor tile pattern sized for room dimensions"""
        print(f"Generating floor tiles: {tiles_x}x{tiles_y}")
        
        # Calculate tile size
        available_width = room_width - (grout_width * (tiles_x + 1))
        available_height = room_height - (grout_width * (tiles_y + 1))
        
        tile_width = max(available_width // tiles_x, 10)
        tile_height = max(available_height // tiles_y, 10)
        
        # Resize tile
        optimized_tile = tile_image.resize((tile_width, tile_height), Image.Resampling.LANCZOS)
        
        # Create floor with grout
        floor_width = (tile_width * tiles_x) + (grout_width * (tiles_x + 1))
        floor_height = (tile_height * tiles_y) + (grout_width * (tiles_y + 1))
        
        floor_image = Image.new('RGB', (floor_width, floor_height), grout_color)
        
        # Place tiles
        for y in range(tiles_y):
            for x in range(tiles_x):
                paste_x = grout_width + (x * (tile_width + grout_width))
                paste_y = grout_width + (y * (tile_height + grout_width))
                floor_image.paste(optimized_tile, (paste_x, paste_y))
        
        # Resize to exact room dimensions
        if floor_width != room_width or floor_height != room_height:
            floor_image = floor_image.resize((room_width, room_height), Image.Resampling.LANCZOS)
        
        return floor_image

    def generate_wall_tiles(self, tile_image, room_width, room_height, tiles_x=20, tiles_y=15, 
                          grout_width=2, grout_color=(245, 240, 235)):
        """Generate wall tile pattern - usually smaller tiles than floor"""
        print(f"Generating wall tiles: {tiles_x}x{tiles_y}")
        
        # Calculate tile size for wall
        available_width = room_width - (grout_width * (tiles_x + 1))
        available_height = room_height - (grout_width * (tiles_y + 1))
        
        tile_width = max(available_width // tiles_x, 8)
        tile_height = max(available_height // tiles_y, 8)
        
        # Resize tile
        optimized_tile = tile_image.resize((tile_width, tile_height), Image.Resampling.LANCZOS)
        
        # Create wall with grout
        wall_width = (tile_width * tiles_x) + (grout_width * (tiles_x + 1))
        wall_height = (tile_height * tiles_y) + (grout_width * (tiles_y + 1))
        
        wall_image = Image.new('RGB', (wall_width, wall_height), grout_color)
        
        # Place tiles
        for y in range(tiles_y):
            for x in range(tiles_x):
                paste_x = grout_width + (x * (tile_width + grout_width))
                paste_y = grout_width + (y * (tile_height + grout_width))
                wall_image.paste(optimized_tile, (paste_x, paste_y))
        
        # Resize to exact room dimensions
        if wall_width != room_width or wall_height != room_height:
            wall_image = wall_image.resize((room_width, room_height), Image.Resampling.LANCZOS)
        
        return wall_image

    def detect_floor_mask(self, room_image):
        """Detect floor areas using SegFormer"""
        print("Detecting floor areas...")
        
        room_np = np.array(room_image)
        
        # Run floor segmentation
        inputs = self.processor(images=room_image, return_tensors="pt").to(self.device)
        with torch.no_grad():
            outputs = self.model(**inputs)
        
        segmentation = outputs.logits.argmax(dim=1).squeeze().cpu().numpy()
        segmentation_resized = cv2.resize(
            segmentation.astype(np.uint8), 
            (room_np.shape[1], room_np.shape[0]), 
            interpolation=cv2.INTER_NEAREST
        )
        
        # Create floor mask (ADE20K class index 3 = floor)
        floor_mask = (segmentation_resized == 3).astype(np.uint8)
        
        # Clean up mask
        kernel = np.ones((5,5), np.uint8)
        floor_mask = cv2.morphologyEx(floor_mask, cv2.MORPH_CLOSE, kernel)
        floor_mask = cv2.morphologyEx(floor_mask, cv2.MORPH_OPEN, kernel)
        
        print(f"Floor mask created: {np.sum(floor_mask)} floor pixels")
        return floor_mask

    def detect_wall_mask(self, room_image):
        """Detect wall areas using Mask2Former"""
        if not self.wall_support:
            print("Wall detection not available")
            return np.zeros((room_image.height, room_image.width), dtype=np.uint8)
        
        print("Detecting wall areas...")
        
        # Convert to RGB
        image_rgb = room_image.convert("RGB")
        
        # Perform wall segmentation
        inputs = self.wall_processor(images=image_rgb, return_tensors="pt")
        inputs = {k: v.to(self.device) for k, v in inputs.items()}
        
        with torch.no_grad():
            outputs = self.wall_model(**inputs)
        
        # Get segmentation map
        segmentation = self.wall_processor.post_process_semantic_segmentation(
            outputs, target_sizes=[image_rgb.size[::-1]]
        )[0].cpu().numpy()
        
        # Find walls (class 0 in ADE20K)
        wall_mask = (segmentation == 0).astype(np.uint8)
        
        if np.sum(wall_mask) > 0:
            # Find largest connected wall component
            num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(wall_mask, connectivity=8)
            
            if num_labels > 1:
                # Get all significant walls (not just the largest)
                min_area = image_rgb.width * image_rgb.height * 0.02  # At least 2% of image
                wall_mask = np.zeros_like(wall_mask)
                
                for i in range(1, num_labels):
                    if stats[i, cv2.CC_STAT_AREA] > min_area:
                        wall_mask[labels == i] = 1
                
                # Refine mask
                kernel = np.ones((5, 5), np.uint8)
                wall_mask = cv2.morphologyEx(wall_mask, cv2.MORPH_CLOSE, kernel)
                wall_mask = cv2.morphologyEx(wall_mask, cv2.MORPH_OPEN, kernel)
                
                # Smooth edges
                wall_mask = cv2.GaussianBlur(wall_mask.astype(np.float32), (3, 3), 0)
                wall_mask = (wall_mask > 0.5).astype(np.uint8)
        
        print(f"Wall mask created: {np.sum(wall_mask)} wall pixels")
        return wall_mask

    def apply_perspective_to_floor(self, floor_image, mask, room_image):
        """Apply perspective transformation to floor"""
        print("Applying floor perspective...")
        
        room_np = np.array(room_image)
        floor_np = np.array(floor_image)
        
        # Find floor contours
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if not contours:
            return cv2.resize(floor_np, (room_np.shape[1], room_np.shape[0]))
        
        # Get the largest contour
        contour = max(contours, key=cv2.contourArea)
        x, y, w, h = cv2.boundingRect(contour)
        
        # Define perspective transformation
        src_pts = np.array([
            [0, floor_np.shape[0]],
            [floor_np.shape[1], floor_np.shape[0]],
            [floor_np.shape[1], 0],
            [0, 0]
        ], dtype=np.float32)
        
        offset_x = w * 0.2
        offset_y = h * 0.05
        
        dst_pts = np.array([
            [x - offset_x, y + h + offset_y],
            [x + w + offset_x, y + h + offset_y],
            [x + w, y - offset_y],
            [x, y - offset_y]
        ], dtype=np.float32)
        
        H = cv2.getPerspectiveTransform(src_pts, dst_pts)
        warped_floor = cv2.warpPerspective(floor_np, H, (room_np.shape[1], room_np.shape[0]))
        
        return warped_floor

    def apply_wall_texture(self, wall_image, mask):
        """Apply wall texture to wall areas - no perspective needed for walls"""
        print("Applying wall texture...")
        
        wall_np = np.array(wall_image)
        
        # For walls, we typically don't need perspective transformation
        # Walls are usually vertical surfaces that can use the texture directly
        return wall_np

    def blend_with_lighting(self, room_image, textured_surface, mask, is_floor=True):
        """Blend textured surface with room lighting"""
        blend_type = "floor" if is_floor else "wall"
        print(f"Blending {blend_type} with room lighting...")
        
        room_np = np.array(room_image)
        room_float = room_np.astype(np.float32) / 255.0
        surface_float = textured_surface.astype(np.float32) / 255.0
        
        # Extract lighting from room
        room_gray = cv2.cvtColor(room_float, cv2.COLOR_RGB2GRAY)
        room_gray_smooth = cv2.GaussianBlur(room_gray, (15, 15), 0)
        
        # Different lighting adjustments for floor vs wall
        if is_floor:
            lighting = np.stack([room_gray_smooth] * 3, axis=-1)
            lighting = np.clip(lighting * 1.2 + 0.3, 0.4, 1.3)
        else:  # wall
            lighting = np.stack([room_gray_smooth] * 3, axis=-1) 
            lighting = np.clip(lighting * 1.1 + 0.4, 0.5, 1.2)  # Slightly different for walls
        
        # Apply lighting
        lit_surface = np.clip(surface_float * lighting, 0, 1)
        
        # Create smooth mask
        mask_3ch = np.stack([mask] * 3, axis=-1).astype(np.float32)
        mask_smooth = cv2.GaussianBlur(mask_3ch, (5, 5), 0)
        
        # Blend
        blended = mask_smooth * lit_surface + (1 - mask_smooth) * room_float
        return (np.clip(blended, 0, 1) * 255).astype(np.uint8)

    def replace_room_floor_and_walls(self, room_image_path, floor_tile_path, wall_tile_path, 
                                   output_image_path,
                                   # Floor tile settings
                                   floor_tiles_x=25, floor_tiles_y=18, floor_grout_width=2,
                                   floor_grout_color=(240, 235, 228),
                                   # Wall tile settings  
                                   wall_tiles_x=20, wall_tiles_y=15, wall_grout_width=2,
                                   wall_grout_color=(245, 240, 235)):
        """
        Main function to replace both floor and walls with tiles
        
        Args:
            room_image_path (str): Path to room image
            floor_tile_path (str): Path to floor tile image
            wall_tile_path (str): Path to wall tile image
            output_image_path (str): Path to save result
            floor_tiles_x, floor_tiles_y: Floor tile grid size
            floor_grout_width, floor_grout_color: Floor grout settings
            wall_tiles_x, wall_tiles_y: Wall tile grid size  
            wall_grout_width, wall_grout_color: Wall grout settings
        
        Returns:
            PIL.Image: Final processed image
        """
        
        # Validate files
        for path in [room_image_path, floor_tile_path, wall_tile_path]:
            if not os.path.exists(path):
                raise FileNotFoundError(f"File not found: {path}")
        
        print(f"=== Processing Complete Room Renovation ===")
        print(f"Room: {room_image_path}")
        print(f"Floor tile: {floor_tile_path}")
        print(f"Wall tile: {wall_tile_path}")
        
        # Load images
        room_image = Image.open(room_image_path).convert("RGB")
        floor_tile = Image.open(floor_tile_path).convert("RGB")
        wall_tile = Image.open(wall_tile_path).convert("RGB")
        
        room_width, room_height = room_image.size
        print(f"Room dimensions: {room_width}x{room_height}")
        
        # Step 1: Generate floor tiles
        print(f"\n--- Step 1: Generating Floor Tiles ---")
        generated_floor = self.generate_floor_tiles(
            floor_tile, room_width, room_height, 
            floor_tiles_x, floor_tiles_y, floor_grout_width, floor_grout_color
        )
        
        # Step 2: Generate wall tiles  
        print(f"\n--- Step 2: Generating Wall Tiles ---")
        generated_wall = self.generate_wall_tiles(
            wall_tile, room_width, room_height,
            wall_tiles_x, wall_tiles_y, wall_grout_width, wall_grout_color
        )
        
        # Step 3: Detect floor and wall masks
        print(f"\n--- Step 3: Detecting Floor and Wall Areas ---")
        floor_mask = self.detect_floor_mask(room_image)
        wall_mask = self.detect_wall_mask(room_image)
        
        # Step 4: Apply floor with perspective
        print(f"\n--- Step 4: Applying Floor Perspective ---")
        warped_floor = self.apply_perspective_to_floor(generated_floor, floor_mask, room_image)
        
        # Step 5: Apply wall texture (no perspective needed)
        print(f"\n--- Step 5: Preparing Wall Texture ---")
        wall_texture = self.apply_wall_texture(generated_wall, wall_mask)
        
        # Step 6: Blend floor with lighting
        print(f"\n--- Step 6: Blending Floor ---")
        room_with_floor = self.blend_with_lighting(room_image, warped_floor, floor_mask, is_floor=True)
        
        # Step 7: Blend walls with lighting on the result from step 6
        print(f"\n--- Step 7: Blending Walls ---")
        room_with_floor_image = Image.fromarray(room_with_floor)
        final_result = self.blend_with_lighting(room_with_floor_image, wall_texture, wall_mask, is_floor=False)
        
        # Step 8: Save result
        print(f"\n--- Step 8: Saving Final Result ---")
        result_image = Image.fromarray(final_result)
        
        os.makedirs(os.path.dirname(output_image_path) if os.path.dirname(output_image_path) else '.', exist_ok=True)
        
        if output_image_path.lower().endswith(('.jpg', '.jpeg')):
            result_image.save(output_image_path, format='JPEG', quality=95, optimize=True)
        else:
            result_image.save(output_image_path, format='PNG', optimize=True)
        
        file_size_mb = os.path.getsize(output_image_path) / (1024 * 1024)
        print(f"✅ Complete renovation saved to: {output_image_path}")
        print(f"File size: {file_size_mb:.2f} MB")
        
        return result_image