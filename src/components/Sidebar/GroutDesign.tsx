'use client'

import { useTexture } from '@/context/TextureContext';
import { useState } from 'react';

export default function GroutDesign() {
    const [showGroutColorPicker, setShowGroutColorPicker] = useState(false);
    const {
        selectionType,
        wallTexture,
        floorGroutColor,
        setFloorGroutColor,
        wallGroutColor,
        setWallGroutColor,
        showWallGrout,
        setShowWallGrout,
        showFloorGrout,
        setShowFloorGrout,
    } = useTexture();


    return (<>
        {(wallTexture || selectionType == 'floor') &&
            (<div className="space-y-2 mb-4 p-3 bg-white border border-gray-300 rounded-lg">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                        </svg>
                        Tile Outline Color
                    </h3>

                    {/* Grout Toggle Button */}
                    <button
                        onClick={() => selectionType === 'wall' ? setShowWallGrout(!showWallGrout) : setShowFloorGrout(!showFloorGrout)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${(selectionType === 'wall' ? showWallGrout : showFloorGrout)
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-gray-100 text-gray-600 border border-gray-300'
                            }`}
                        title={`${(selectionType === 'wall' ? showWallGrout : showFloorGrout) ? 'Hide' : 'Show'} grout lines for ${selectionType}`}
                    >
                        <div className={`w-3 h-3 rounded-full transition-all duration-200 ${(selectionType === 'wall' ? showWallGrout : showFloorGrout) ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        {(selectionType === 'wall' ? showWallGrout : showFloorGrout) ? 'ON' : 'OFF'}
                    </button>
                </div>

                {/* Only show grout color picker when grout is visible */}
                {(selectionType === 'wall' ? showWallGrout : showFloorGrout) && (
                    <>
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
                    </>
                )}

                {/* Message when grout is hidden */}
                {!(selectionType === 'wall' ? showWallGrout : showFloorGrout) && (
                    <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                        Grout lines are currently hidden for {selectionType}
                    </div>
                )}
            </div>
            )
        }
    </>)
}