import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";


export const Carpet = ({ n }) => {
    const group = useRef()
    const url = "Models/Carpet/Carpet.gltf"
    const gltf = useLoader(GLTFLoader, url);
    const copiedScene = useMemo(() => gltf.scene.clone(), [gltf.scene])

    const x = 0
    const y = 0.4

    useEffect(() => {
        gltf.scene.scale.set(8, 4, 5);

        // gltf.scene.rotation.set(0, 0, 0);

        gltf.scene.traverse((object) => {
            if (object instanceof Mesh) {
                object.castShadow = true;
                object.receiveShadow = true;
                object.material.envMapIntensity = 20;
            }
        })

    }, [gltf])

    return (
        <group ref={group}>
            <primitive object={copiedScene} position={[x, y, n * -10]} scale={[8, 4, 5]} />
        </group>
    )
}