import { useTexture } from '@/context/TextureContext';

export default function Sidebar() {
    const { selectionType, setSelectionType, getSelectedTexture, selectTexture, getAvailableTextures } = useTexture();

    const selectedTexture = getSelectedTexture();
    const availableTextures = getAvailableTextures();

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
                {availableTextures.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                        <p>No textures available for {selectionType}</p>
                    </div>
                )}
            </div>
        </div>
    );
}