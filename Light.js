import React, { useEffect, useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Mesh, MeshBasicMaterial } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";


export const Light = () => {


    const url = "Models/Light/Light.gltf"
    const gltf = useLoader(GLTFLoader, url);


    useEffect(() => {
        gltf.scene.scale.set(0.009, 0.009, 0.009);
        gltf.scene.position.set(-3.5, 0, 2);

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