import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Scene from "./Scene";

export default function Room() {
    return (
        <Canvas
            camera={{
                position: [-0.12239314916888053, 2.0429538317082687, 4.976077776675754],
                rotation: [-0.0067726905102693845, 0.020309902788936303, 0.0001375453316877022],
                fov: 75,
                near: 0.1,
                far: 1000,
            }}
            className="w-full h-full"
        >
            <Suspense>
                <Scene />
            </Suspense>
        </Canvas>
    );
}