import React, { useEffect, useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";


export const Ethereum = () => {


    const url = "Models/Ethereum/Ethereum.gltf"
    const gltf = useLoader(GLTFLoader, url);


    useEffect(() => {
        gltf.scene.scale.set(0.003, 0.003, 0.003);
        gltf.scene.position.set(-3, 2, 1);

        gltf.scene.traverse((object) => {
            if (object instanceof Mesh) {
                object.castShadow = true;
                object.receiveShadow = true;
                object.material.envMapIntensity = 20;

            }
        })

    }, [gltf])

    return (
        <group>
            <primitive object={gltf.scene} />
        </group>
    )
}