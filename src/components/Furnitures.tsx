export default function Furnitures() {
    return (<>
        <div className="w-full h-full bg-transparent absolute top-0 left-0 z-50">
            <img
                src="/furnitures/wall_matt_floor_matt.webp"
                // src="/furnitures/wall_glossy_floor_glossy.webp"
                alt=""
                className="w-full h-full bg-transparent"
            />

            {/* Wall Selection Button */}
            <button className="px-5 py-1 absolute top-[25%] left-[48%] bg-white font-semibold shadow-sm shadow-gray-700 rounded-full">Wall</button>
            {/* Floor Selection Button */}
            <button className="px-5 py-1 absolute bottom-[11%] left-[25%] bg-white font-semibold shadow-sm shadow-gray-700 rounded-full">Floor</button>
        </div>
    </>)
}