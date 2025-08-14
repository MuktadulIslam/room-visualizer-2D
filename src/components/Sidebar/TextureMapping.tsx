import { useTexture, Texture } from '@/context/TextureContext';
import Image from 'next/image';
import { useState } from 'react';

export default function TextureMapping() {
    const { selectionType, getSelectedTexture, selectTexture, getAvailableTextures, removeCustomTexture, updateTextureSize, resetTextureSize, resetAllTextureSizes } = useTexture();
    const [editingTexture, setEditingTexture] = useState<string | null>(null);
    const [editWidth, setEditWidth] = useState<number | string>('');
    const [editHeight, setEditHeight] = useState<number | string>('');

    const selectedTexture = getSelectedTexture();
    const availableTextures = getAvailableTextures();

    const handleDeleteCustomTexture = (textureId: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent texture selection when clicking delete
        if (confirm('Are you sure you want to delete this custom texture?')) {
            removeCustomTexture(textureId);
        }
    };

    const handleDoubleClick = (texture: Texture, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setEditingTexture(texture.id);
        setEditWidth(texture.size[0]);
        setEditHeight(texture.size[1]);
    };

    const handleSizeUpdate = (textureId: string) => {
        const width = typeof editWidth === 'string' ? parseInt(editWidth) : editWidth;
        const height = typeof editHeight === 'string' ? parseInt(editHeight) : editHeight;

        if (width > 0 && height > 0 && width <= 500 && height <= 500) {
            updateTextureSize(textureId, [width, height]);
            setEditingTexture(null);
            setEditWidth('');
            setEditHeight('');
        } else {
            alert('Please enter valid dimensions between 1 and 500 cm');
        }
    };

    const handleCancelEdit = () => {
        setEditingTexture(null);
        setEditWidth('');
        setEditHeight('');
    };

    const handleResetSize = (textureId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Reset this texture size to original dimensions?')) {
            resetTextureSize(textureId);
        }
        setEditingTexture(null);
        setEditWidth('');
        setEditHeight('');
    };

    const handleResetAllSizes = () => {
        if (confirm('Reset all default texture sizes to their original dimensions?')) {
            resetAllTextureSizes();
        }
    };

    return (<>
        {/* Reset All Sizes Button */}
        <div className="mb-4">
            <button
                onClick={handleResetAllSizes}
                className="w-full py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset All Texture Sizes
            </button>
        </div>

        {availableTextures.map((texture) => (
            <div
                key={texture.id}
                onClick={() => editingTexture !== texture.id && selectTexture(texture)}
                onDoubleClick={(e) => handleDoubleClick(texture, e)}
                className={`border rounded-lg p-2 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-blue-300 relative ${selectedTexture?.id === texture.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-300 bg-white'
                    } ${editingTexture === texture.id ? 'ring-2 ring-orange-400' : ''}`}
            >
                {/* Delete button for custom textures */}
                {texture.isCustom && (
                    <button
                        onClick={(e) => handleDeleteCustomTexture(texture.id, e)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                        title="Delete custom texture"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}

                <div className="w-full h-auto flex gap-2">
                    {/* Texture Preview Image */}
                    <div className="h-28 aspect-square bg-gray-200 overflow-hidden">
                        <Image
                            width={100}
                            height={100}
                            src={texture.show_img}
                            alt={texture.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                // Fallback to a solid color if image fails to load
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).parentElement!.style.backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
                            }}
                        />
                    </div>

                    {/* Texture Info */}
                    <div className="space-y-1 flex-1">
                        <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-gray-800 text-base pr-8">{texture.name}</h3>
                            {texture.isCustom && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Custom</span>
                            )}
                        </div>

                        {/* Editable Size Section */}
                        {editingTexture === texture.id ? (
                            <div className="space-y-2">
                                <div className="text-xs text-orange-600 font-medium">Editing Size:</div>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="number"
                                        value={editWidth}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value === '') {
                                                setEditWidth('');
                                            } else {
                                                const numValue = parseInt(value);
                                                if (!isNaN(numValue) && numValue >= 1 && numValue <= 500) {
                                                    setEditWidth(numValue);
                                                }
                                            }
                                        }}
                                        onBlur={(e) => {
                                            if (e.target.value === '' || parseInt(e.target.value) < 1) {
                                                setEditWidth(texture.size[0]);
                                            }
                                        }}
                                        className="w-16 px-2 py-1 text-xs border border-gray-300 rounded"
                                        placeholder="W"
                                        min="1"
                                        max="500"
                                    />
                                    <span className="text-xs text-gray-500">×</span>
                                    <input
                                        type="number"
                                        value={editHeight}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value === '') {
                                                setEditHeight('');
                                            } else {
                                                const numValue = parseInt(value);
                                                if (!isNaN(numValue) && numValue >= 1 && numValue <= 500) {
                                                    setEditHeight(numValue);
                                                }
                                            }
                                        }}
                                        onBlur={(e) => {
                                            if (e.target.value === '' || parseInt(e.target.value) < 1) {
                                                setEditHeight(texture.size[1]);
                                            }
                                        }}
                                        className="w-16 px-2 py-1 text-xs border border-gray-300 rounded"
                                        placeholder="H"
                                        min="1"
                                        max="500"
                                    />
                                    <span className="text-xs text-gray-500">cm</span>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={(e) => handleResetSize(texture.id, e)}
                                        className="px-2 py-1 bg-blue-400 text-white text-xs rounded hover:bg-blue-500 transition-colors"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="px-2 py-1 bg-gray-400 text-white text-xs rounded hover:bg-gray-500 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleSizeUpdate(texture.id)}
                                        className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p className='text-sm'>
                                    Size: {texture.size[0]}×{texture.size[1]}cm
                                    <span className="text-xs text-gray-500 ml-1">(Double-click to edit)</span>
                                </p>
                            </div>
                        )}

                        <div className={`px-3 h-5 font-semibold rounded-full text-xs border text-black inline-block items-center ${texture.is_glossy
                            ? 'bg-yellow-100 border-yellow-800'
                            : 'bg-gray-200 border-gray-700'
                            }`}>
                            {texture.is_glossy ? 'Glossy' : 'Matt'}
                        </div>

                        {/* Selection Indicator */}
                        {selectedTexture?.id === texture.id && editingTexture !== texture.id && (
                            <div className="mt-2 flex items-center text-blue-600 text-xs">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Applied to {selectionType}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        ))}

        {availableTextures.length === 0 && (
            <div className="text-center text-gray-500 py-8">
                <p>No textures available for {selectionType}</p>
                <p className="text-sm mt-2">Upload a custom texture to get started!</p>
            </div>
        )}
    </>)
}