import { useTexture, Texture } from '@/context/TextureContext';
import { useState } from 'react';
import CustomTextureUpload from '../CustomTextureUpload';
import DecorationPanelSelection from './DecorationPanelSelection';
import GroutDesign from './GroutDesign';
import WallColors from './WallColors';
import TextureMapping from './TextureMapping';
import Link from 'next/link';

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
                <Link href={"/custom"} className="w-full h-16 border-2 border-gray-600 border-dashed rounded-lg flex justify-center items-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                    </svg>

                    <span className="text-lg font-semibold">Design Your Room</span>
                </Link>

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