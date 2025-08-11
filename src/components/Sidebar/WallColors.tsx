import { useTexture, wallColors } from '@/context/TextureContext';
import { useState } from 'react';


export default function WallColors() {
    
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [customColor, setCustomColor] = useState('#ffffff');
    
    const { selectionType, getSelectedWallColor, selectWallColor, selectCustomWallColor, hasWallColor } = useTexture();
    
    const selectedWallColor = getSelectedWallColor();

    const handleCustomColorChange = (newColor: string) => {
        setCustomColor(newColor);
        selectCustomWallColor(newColor);
    };

    return (<>
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
    </>)
}