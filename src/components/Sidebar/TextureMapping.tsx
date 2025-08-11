import { useTexture } from '@/context/TextureContext';
import Image from 'next/image';

export default function TextureMapping() {
    const { selectionType, getSelectedTexture, selectTexture, getAvailableTextures, removeCustomTexture } = useTexture();

    const selectedTexture = getSelectedTexture();
    const availableTextures = getAvailableTextures();

    const handleDeleteCustomTexture = (textureId: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent texture selection when clicking delete
        if (confirm('Are you sure you want to delete this custom texture?')) {
            removeCustomTexture(textureId);
        }
    };

    return (<>
        {availableTextures.map((texture) => (
            <div
                key={texture.id}
                onClick={() => selectTexture(texture)}
                className={`border rounded-lg p-2 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-blue-300 relative ${selectedTexture?.id === texture.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-300 bg-white'
                    }`}
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

        {availableTextures.length === 0 && (
            <div className="text-center text-gray-500 py-8">
                <p>No textures available for {selectionType}</p>
                <p className="text-sm mt-2">Upload a custom texture to get started!</p>
            </div>
        )}
    </>)
}