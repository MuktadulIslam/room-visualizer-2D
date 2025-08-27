import { useTexture } from '@/context/TextureContext';
import Image from 'next/image';

export default function Furnitures() {
  const { selectionType, setSelectionType, wallTexture, floorTexture } = useTexture();

  console.log(wallTexture)

  return (
    <div className="w-full h-full bg-transparent absolute top-0 left-0 z-40">
      <Image
        width={3000}
        height={2500}
        src={floorTexture?.is_glossy || wallTexture?.is_glossy ? "/furnitures/wall_glossy_floor_glossy.webp" : "/furnitures/wall_matt_floor_matt.webp"}
        alt="Room"
        className="w-full h-full bg-transparent"
      />

      {/* Wall Selection Button */}
      <button
        onClick={() => setSelectionType('wall')}
        className={`px-5 py-1 absolute top-[25%] left-[48%] z-50 font-semibold shadow-sm shadow-gray-700 rounded-full transition-all duration-200 flex items-center gap-2 ${selectionType === 'wall'
          ? 'bg-blue-500 text-white'
          : 'bg-white text-black hover:bg-gray-100'
          }`}
      >
        {selectionType === 'wall' && (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
        Wall
      </button>

      {/* Floor Selection Button */}
      <button
        onClick={() => setSelectionType('floor')}
        className={`px-5 py-1 absolute bottom-[11%] left-[25%] z-50 font-semibold shadow-sm shadow-gray-700 rounded-full transition-all duration-200 flex items-center gap-2 ${selectionType === 'floor'
          ? 'bg-blue-500 text-white'
          : 'bg-white text-black hover:bg-gray-100'
          }`}
      >
        {selectionType === 'floor' && (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
        Floor
      </button>
    </div>
  );
}