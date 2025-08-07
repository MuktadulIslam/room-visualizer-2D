'use client'
import Furnitures from '@/components/Furnitures';
import Room from '@/components/room/Room'
export default function Home() {
  return (
    <>
      <div className="w-full h-full flex gap-1">
        <div className="w-80 h-full bg-red-400"></div>
        <div className="flex-1 h-full relative ">
          <Furnitures/>
          <Room />
        </div>
      </div>
    </>
  );
}
