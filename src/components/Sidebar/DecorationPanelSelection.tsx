import { useTexture } from '@/context/TextureContext';

export default function DecorationPanelSelection() {
    const { selectionType, setSelectionType } = useTexture();

    return (
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

    )
}