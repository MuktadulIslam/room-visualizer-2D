'use client'
import Furnitures from '@/components/Furnitures';
import Room from '@/components/room/Room';
import Sidebar from '@/components/Sidebar';
import { TextureProvider } from '@/context/TextureContext';

export default function Home() {
  return (
    <TextureProvider>
      <div className="w-full h-full flex gap-1">
        <div className="w-80 h-full">
          <Sidebar />
        </div>
        <div className="flex-1 h-full relative">
          <Furnitures />
          <Room />
        </div>
      </div>
    </TextureProvider>
  );
}