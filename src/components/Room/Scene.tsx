import { Suspense } from "react";
import Floor from "./Floor";
import Wall from "./Wall";
import { useTexture } from "@/context/TextureContext";

export default function Scene() {
    const { isFloorRemoved, isWallRemoved } = useTexture();
    return (
        <>
            <ambientLight intensity={2} />
            {!isWallRemoved &&
                <Suspense>
                    <Floor length={isFloorRemoved ? 30 : 14} width={isFloorRemoved ? 10 : 6} />
                </Suspense>
            }
            {!isFloorRemoved &&
                <Suspense>
                    <Wall
                        height={isWallRemoved ? 15 : 8}
                        width={isWallRemoved ? 35 : 14}
                        position={[0.35, 4.5, -3]}
                    />
                </Suspense>
            }
        </>
    );
};