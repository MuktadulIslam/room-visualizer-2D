// components/TileSelector.tsx
import { useState } from 'react';
import Image from 'next/image';

export interface TileOption {
  id: string;
  name: string;
  preview: string;
  category: 'ceramic' | 'marble' | 'wood' | 'stone' | 'modern';
  description?: string;
}

interface TileSelectorProps {
  label: string;
  selectedTileId?: string;
  onTileSelect: (tileId: string, tileUrl: string) => void;
  category?: 'floor' | 'wall';
}

// Sample tile options - In a real app, these would come from an API or database
const sampleTiles: TileOption[] = [
  // Ceramic tiles
  {
    id: 'ceramic-white',
    name: 'White Ceramic',
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iY2VyYW1pYy13aGl0ZSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIj48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IiNmOWZhZmIiLz48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTkiIGhlaWdodD0iMTkiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iI2U1ZTdlYiIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI2NlcmFtaWMtd2hpdGUpIi8+PC9zdmc+',
    category: 'ceramic',
    description: 'Clean white ceramic tiles'
  },
  {
    id: 'ceramic-gray',
    name: 'Gray Ceramic',
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iY2VyYW1pYy1ncmF5IiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2Y5ZmFmYiIvPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxOSIgaGVpZ2h0PSIxOSIgZmlsbD0iIzlmYTZiNyIgc3Ryb2tlPSIjNmI3MjgwIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9InVybCgjY2VyYW1pYy1ncmF5KSIvPjwvc3ZnPg==',
    category: 'ceramic',
    description: 'Modern gray ceramic tiles'
  },
  {
    id: 'ceramic-beige',
    name: 'Beige Ceramic',
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iY2VyYW1pYy1iZWlnZSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIj48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IiNmOWZhZmIiLz48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTkiIGhlaWdodD0iMTkiIGZpbGw9IiNmNWY0ZjAiIHN0cm9rZT0iI2QxY2ZjYSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI2NlcmFtaWMtYmVpZ2UpIi8+PC9zdmc+',
    category: 'ceramic',
    description: 'Warm beige ceramic tiles'
  },
  // Marble tiles
  {
    id: 'marble-white',
    name: 'White Marble',
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0ibWFyYmxlLXdoaXRlIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iMzAiIGhlaWdodD0iMzAiPjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0iI2Y5ZmFmYiIvPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyOSIgaGVpZ2h0PSIyOSIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjZTVlN2ViIiBzdHJva2Utd2lkdGg9IjAuNSIvPjxwYXRoIGQ9Ik0wIDEwIEM1IDE1IDEwIDUgMTUgMTAgUzI1IDIwIDMwIDEwIiBzdHJva2U9IiNkMWQ1ZGIiIHN0cm9rZS13aWR0aD0iMC41IiBmaWxsPSJub25lIiBvcGFjaXR5PSIwLjMiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI21hcmJsZS13aGl0ZSkiLz48L3N2Zz4=',
    category: 'marble',
    description: 'Luxurious white marble with veining'
  },
  {
    id: 'marble-black',
    name: 'Black Marble',
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0ibWFyYmxlLWJsYWNrIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iMzAiIGhlaWdodD0iMzAiPjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0iIzM3NDE1MSIvPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyOSIgaGVpZ2h0PSIyOSIgZmlsbD0iIzFmMjkzNyIgc3Ryb2tlPSIjMzc0MTUxIiBzdHJva2Utd2lkdGg9IjAuNSIvPjxwYXRoIGQ9Ik0wIDEwIEM1IDE1IDEwIDUgMTUgMTAgUzI1IDIwIDMwIDEwIiBzdHJva2U9IiM2Mzc0ODEiIHN0cm9rZS13aWR0aD0iMC41IiBmaWxsPSJub25lIiBvcGFjaXR5PSIwLjQiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI21hcmJsZS1ibGFjaykiLz48L3N2Zz4=',
    category: 'marble',
    description: 'Elegant black marble with gold veins'
  },
  // Wood tiles
  {
    id: 'wood-oak',
    name: 'Oak Wood',
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0id29vZC1vYWsiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSIxNSI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjE1IiBmaWxsPSIjZGRkNmZlIi8+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjU5IiBoZWlnaHQ9IjE0IiBmaWxsPSIjZGRkMWMzIiBzdHJva2U9IiNhNzk3ODUiIHN0cm9rZS13aWR0aD0iMC41Ii8+PGxpbmUgeDE9IjEwIiB5MT0iMiIgeDI9IjUwIiB5Mj0iMTIiIHN0cm9rZT0iIzkyODM3NCIgc3Ryb2tlLXdpZHRoPSIwLjMiIG9wYWNpdHk9IjAuNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9InVybCgjd29vZC1vYWspIi8+PC9zdmc+',
    category: 'wood',
    description: 'Natural oak wood grain pattern'
  },
  {
    id: 'wood-walnut',
    name: 'Walnut Wood',
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0id29vZC13YWxudXQiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSIxNSI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjE1IiBmaWxsPSIjNzQzYjM0Ii8+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjU5IiBoZWlnaHQ9IjE0IiBmaWxsPSIjOTI2MjQ5IiBzdHJva2U9IiM1YjM5MmYiIHN0cm9rZS13aWR0aD0iMC41Ii8+PGxpbmUgeDE9IjEwIiB5MT0iMiIgeDI9IjUwIiB5Mj0iMTIiIHN0cm9rZT0iIzZiNGIzYiIgc3Ryb2tlLXdpZHRoPSIwLjMiIG9wYWNpdHk9IjAuNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9InVybCgjd29vZC13YWxudXQpIi8+PC9zdmc+',
    category: 'wood',
    description: 'Rich walnut wood with dark grain'
  },
  // Stone tiles
  {
    id: 'stone-slate',
    name: 'Slate Stone',
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0ic3RvbmUtc2xhdGUiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIyNSIgaGVpZ2h0PSIyNSI+PHJlY3Qgd2lkdGg9IjI1IiBoZWlnaHQ9IjI1IiBmaWxsPSIjMzc0MTUxIi8+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjNDc1NTY5IiBzdHJva2U9IiMyZDM3NDgiIHN0cm9rZS13aWR0aD0iMC41Ii8+PGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjEiIGZpbGw9IiM2Mzc0ODEiIG9wYWNpdHk9IjAuNCIvPjxjaXJjbGUgY3g9IjE4IiBjeT0iMTgiIHI9IjEuNSIgZmlsbD0iIzUyNjI3NCIgb3BhY2l0eT0iMC4zIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNzdG9uZS1zbGF0ZSkiLz48L3N2Zz4=',
    category: 'stone',
    description: 'Natural slate stone texture'
  },
  {
    id: 'stone-travertine',
    name: 'Travertine Stone',
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0ic3RvbmUtdHJhdmVydGluZSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIj48cmVjdCB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIGZpbGw9IiNmNWY0ZjAiLz48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMjkiIGhlaWdodD0iMjkiIGZpbGw9IiNlZGU5ZTUiIHN0cm9rZT0iI2QxY2ZjYSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48ZWxsaXBzZSBjeD0iMTAiIGN5PSIxMCIgcng9IjIiIHJ5PSIxIiBmaWxsPSIjZGRkNmZlIiBvcGFjaXR5PSIwLjMiLz48ZWxsaXBzZSBjeD0iMjAiIGN5PSIyMCIgcng9IjMiIHJ5PSIxLjUiIGZpbGw9IiNkMWQ1ZGIiIG9wYWNpdHk9IjAuNCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9InVybCgjc3RvbmUtdHJhdmVydGluZSkiLz48L3N2Zz4=',
    category: 'stone',
    description: 'Classic travertine stone with natural holes'
  },
  // Modern tiles
  {
    id: 'modern-hex',
    name: 'Modern Hexagon',
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0ibW9kZXJuLWhleCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjMwIiBoZWlnaHQ9IjI2Ij48cmVjdCB3aWR0aD0iMzAiIGhlaWdodD0iMjYiIGZpbGw9IiNmMWY1ZjkiLz48cG9seWdvbiBwb2ludHM9IjE1LDIgMjQsOCAyNCwxOCAxNSwyNCA2LDE4IDYsOCIgZmlsbD0iIzNiODJmNiIgc3Ryb2tlPSIjMTY1OWRhIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9InVybCgjbW9kZXJuLWhleCkiLz48L3N2Zz4=',
    category: 'modern',
    description: 'Contemporary hexagonal pattern'
  },
  {
    id: 'modern-geometric',
    name: 'Geometric Pattern',
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0ibW9kZXJuLWdlb21ldHJpYyIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNmMWY1ZjkiLz48cG9seWdvbiBwb2ludHM9IjIwLDAgNDAsMjAgMjAsNDAgMCwyMCIgZmlsbD0iIzEwYjk4MSIgc3Ryb2tlPSIjMDU5NjY5IiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9InVybCgjbW9kZXJuLWdlb21ldHJpYykiLz48L3N2Zz4=',
    category: 'modern',
    description: 'Modern geometric diamond pattern'
  }
];

export default function TileSelector({ 
  label, 
  selectedTileId, 
  onTileSelect,
  category = 'floor' 
}: TileSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const categories = [
    { id: 'all', name: 'All Tiles' },
    { id: 'ceramic', name: 'Ceramic' },
    { id: 'marble', name: 'Marble' },
    { id: 'wood', name: 'Wood Look' },
    { id: 'stone', name: 'Natural Stone' },
    { id: 'modern', name: 'Modern' }
  ];

  const filteredTiles = selectedCategory === 'all' 
    ? sampleTiles 
    : sampleTiles.filter(tile => tile.category === selectedCategory);

  const selectedTile = sampleTiles.find(tile => tile.id === selectedTileId);

  const handleTileSelect = (tile: TileOption) => {
    onTileSelect(tile.id, tile.preview);
    setIsOpen(false);
  };

  const handleCustomUpload = () => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target?.result as string;
          // Create a custom tile option
          const customTile: TileOption = {
            id: `custom-${Date.now()}`,
            name: file.name.split('.')[0] || 'Custom Tile',
            preview: imageUrl,
            category: 'modern',
            description: 'Custom uploaded tile'
          };
          handleTileSelect(customTile);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <button
        type="button"
        className="relative w-full bg-white border border-gray-300 rounded-lg p-3 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedTile ? (
          <div className="flex items-center">
            <div className="flex-shrink-0 w-10 h-10 rounded border border-gray-200 overflow-hidden">
              <Image
                src={selectedTile.preview}
                alt={selectedTile.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-3 flex-1">
              <span className="block font-medium text-gray-900">{selectedTile.name}</span>
              <span className="block text-sm text-gray-500 truncate">
                {selectedTile.description}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
            </div>
            <div className="ml-3">
              <span className="block text-gray-500">Select a tile pattern</span>
            </div>
          </div>
        )}
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Tile Selection Modal */}
          <div className="absolute z-20 mt-1 w-80 bg-white shadow-xl rounded-lg ring-1 ring-black ring-opacity-5 max-h-96 overflow-hidden">
            {/* Category Filter */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`
                      px-3 py-1 text-xs rounded-full transition-colors
                      ${selectedCategory === cat.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Tile Grid */}
            <div className="p-4 max-h-80 overflow-y-auto">
              <div className="grid grid-cols-3 gap-3">
                {filteredTiles.map((tile) => (
                  <button
                    key={tile.id}
                    onClick={() => handleTileSelect(tile)}
                    className={`
                      relative group rounded-lg border-2 transition-all duration-200 overflow-hidden
                      ${selectedTileId === tile.id
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="aspect-square">
                      <Image
                        src={tile.preview}
                        alt={tile.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Selection indicator */}
                    {selectedTileId === tile.id && (
                      <div className="absolute top-1 right-1">
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                    
                    {/* Hover overlay with name */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-200 flex items-end">
                      <div className="w-full p-2 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-t from-black/60 to-transparent">
                        {tile.name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              {filteredTiles.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                  <p className="text-sm">No tiles found in this category</p>
                  <p className="text-xs text-gray-400 mt-1">Try selecting a different category</p>
                </div>
              )}
            </div>
            
            {/* Upload Custom Tile Option */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleCustomUpload}
                className="w-full flex items-center justify-center py-2 px-4 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Upload Custom Tile
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}