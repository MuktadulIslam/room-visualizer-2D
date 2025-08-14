import { Suspense } from "react";
import Floor from "./Floor";
import Wall from "./Wall";

export default function Scene() {
    return (
        <>
            <ambientLight intensity={2} />
            <Suspense>
                <Floor length={25} width={6} />
            </Suspense>
            <Suspense>
                <Wall
                    height={8}
                    width={14}
                    position={[0.35, 4.5, -3]}
                />
            </Suspense>
        </>
    );
};