import { useTexture, wallColors } from '@/context/TextureContext';
import { useState } from 'react';

export default function Sidebar() {
    const {
        selectionType,
        setSelectionType,
        getSelectedTexture,
        getSelectedWallColor,
        selectTexture,
        wallTexture,
        selectWallColor,
        selectCustomWallColor,
        getAvailableTextures,
        hasWallColor,
        floorGroutColor,
        setFloorGroutColor,
        wallGroutColor,
        setWallGroutColor
    } = useTexture();

    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showGroutColorPicker, setShowGroutColorPicker] = useState(false);
    const [customColor, setCustomColor] = useState('#ffffff');

    const selectedTexture = getSelectedTexture();
    const selectedWallColor = getSelectedWallColor();
    const availableTextures = getAvailableTextures();

    const handleCustomColorChange = (newColor: string) => {
        setCustomColor(newColor);
        selectCustomWallColor(newColor);
    };

    return (
        <div className="w-full h-full bg-gray-100">
            {/* Selection Buttons */}
            <div className="flex gap-2 mb-3 p-2">
                <button
                    onClick={() => setSelectionType('wall')}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${selectionType === 'wall'
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                >
                    Wall
                </button>
                <button
                    onClick={() => setSelectionType('floor')}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${selectionType === 'floor'
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                >
                    Floor
                </button>
            </div>

            <div className="space-y-3 overflow-y-auto p-2 h-full w-full pb-20">
                {/* Grout Color Picker - Always visible */}
                {(wallTexture || selectionType == 'floor') &&
                    (<div className="space-y-2 mb-4 p-3 bg-white border border-gray-300 rounded-lg">
                        <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                            </svg>
                            Tile Outline Color
                        </h3>

                        {!showGroutColorPicker ? (
                            <button
                                onClick={() => setShowGroutColorPicker(true)}
                                className="w-full py-2 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center gap-3"
                            >
                                <div
                                    className="w-6 h-6 rounded border border-gray-400"
                                    style={{ backgroundColor: selectionType == 'wall' ? wallGroutColor : floorGroutColor }}
                                ></div>
                                <span>Change Grout Color</span>
                            </button>
                        ) : (
                            <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <input
                                        type="color"
                                        value={selectionType == 'wall' ? wallGroutColor : floorGroutColor}
                                        onChange={(e) => selectionType == 'wall' ? setWallGroutColor(e.target.value) : setFloorGroutColor(e.target.value)}
                                        className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={selectionType == 'wall' ? wallGroutColor : floorGroutColor}
                                        onChange={(e) => selectionType == 'wall' ? setWallGroutColor(e.target.value) : setFloorGroutColor(e.target.value)}
                                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                                        placeholder="#f5f5f0"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setShowGroutColorPicker(false)}
                                        className="py-1 px-3 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    )
                }

                {/* Wall Color Selection (only show when wall is selected) */}
                {selectionType === 'wall' && (
                    <div className="space-y-2 mb-6">
                        <h3 className="font-semibold text-gray-800 text-sm mb-3">Wall Colors</h3>
                        <div className="grid grid-cols-5 gap-2">
                            {wallColors.map((color) => (
                                <div
                                    key={color.id}
                                    onClick={() => selectWallColor(color)}
                                    className={`relative aspect-square rounded-lg cursor-pointer border-2 transition-all duration-200 hover:scale-105 ${selectedWallColor?.id === color.id
                                            ? 'border-blue-500 shadow-md'
                                            : 'border-gray-300 hover:border-blue-300'
                                        }`}
                                    style={{ backgroundColor: color.hex }}
                                    title={color.name}
                                >
                                    {/* Selection indicator */}
                                    {selectedWallColor?.id === color.id && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Custom Color Picker Button */}
                        <div className="mt-3">
                            {!showColorPicker ? (
                                <button
                                    onClick={() => setShowColorPicker(true)}
                                    className="w-full py-2 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2M9 3h10a2 2 0 012 2v12a4 4 0 01-2 2H9" />
                                    </svg>
                                    Custom Color
                                </button>
                            ) : (
                                <div className="bg-white border border-gray-300 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <input
                                            type="color"
                                            value={customColor}
                                            onChange={(e) => handleCustomColorChange(e.target.value)}
                                            className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={customColor}
                                            onChange={(e) => handleCustomColorChange(e.target.value)}
                                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                                            placeholder="#ffffff"
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => setShowColorPicker(false)}
                                            className="py-1 px-3 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition-colors"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Selected color info */}
                        {selectedWallColor && hasWallColor() && (
                            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-center text-blue-600 text-sm">
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    {selectedWallColor.name} applied to wall
                                    {selectedWallColor.isCustom && (
                                        <span className="ml-1 text-xs">({selectedWallColor.hex})</span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Separator */}
                        <div className="border-t border-gray-300 my-4"></div>
                        <h3 className="font-semibold text-gray-800 text-sm mb-3">Wall Textures</h3>
                    </div>
                )}

                {/* Texture Selection */}
                {availableTextures.map((texture) => (
                    <div
                        key={texture.id}
                        onClick={() => selectTexture(texture)}
                        className={`border rounded-lg p-2 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-blue-300 ${selectedTexture?.id === texture.id
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-300 bg-white'
                            }`}
                    >
                        <div className="w-full h-auto flex gap-2">
                            {/* Texture Preview Image */}
                            <div className="h-28 aspect-square bg-gray-200 overflow-hidden">
                                <img
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
                            <div className="space-y-1">
                                <h3 className="font-semibold text-gray-800 text-base">{texture.name}</h3>
                                <p className='text-sm '>Size: {texture.size[0]}×{texture.size[1]}cm</p>
                                <div className={`px-3 h-5 font-semibold rounded-full text-xs border text-black inline-block items-center ${texture.is_glossy
                                    ? 'bg-yellow-100 border-yellow-800'
                                    : 'bg-gray-200 border-gray-700'
                                    }`}>
                                    {texture.is_glossy ? 'Glossy' : 'Matt'}
                                </div>

                                {/* Selection Indicator */}
                                {selectedTexture?.id === texture.id && (
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

                {/* No textures available message */}
                {availableTextures.length === 0 && selectionType === 'floor' && (
                    <div className="text-center text-gray-500 py-8">
                        <p>No textures available for {selectionType}</p>
                    </div>
                )}
            </div>
        </div>
    );
}