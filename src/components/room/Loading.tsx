import { Html } from "@react-three/drei";

export default function Loading() {
    return (<>
        <Html
            center
            position={[0, 0, 0.01]}
            style={{ zIndex: 1 }}
        >
            <div className="bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-blue-500">
                <div className="flex items-center space-x-2 text-white">
                    <div className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                    <span className="text-xs">Loading...</span>
                </div>
            </div>
        </Html>
    </>)
}