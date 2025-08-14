import { useTexture, Texture } from '@/context/TextureContext';
import { useState } from 'react';
import CustomTextureUpload from '../CustomTextureUpload';
import RoomUpload from '../RoomUpload';
import DecorationPanelSelection from './DecorationPanelSelection';
import GroutDesign from './GroutDesign';
import WallColors from './WallColors';
import TextureMapping from './TextureMapping';

export default function Sidebar() {
    const { selectTexture, addCustomTexture } = useTexture();

    const [showCustomTextureUpload, setShowCustomTextureUpload] = useState(false);

    const handleCustomTextureUpload = (texture: Texture) => {
        addCustomTexture(texture);
        selectTexture(texture);
    };

    return (
        <div className="w-full h-full bg-gray-100">
            <DecorationPanelSelection />

            <div className="space-y-3 overflow-y-auto p-2 h-full w-full pb-20">
                {/* Room Upload Section */}
                <RoomUpload />

                <GroutDesign />
                <WallColors />

                {/* Custom Texture Upload Button */}
                <div className="mb-4">
                    <button
                        onClick={() => setShowCustomTextureUpload(true)}
                        className="w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Upload Custom Texture
                    </button>
                </div>

                <TextureMapping />
            </div>

            {/* Custom Texture Upload Modal */}
            {showCustomTextureUpload && (
                <CustomTextureUpload
                    onClose={() => setShowCustomTextureUpload(false)}
                    onUpload={handleCustomTextureUpload}
                />
            )}
        </div>
    );
}