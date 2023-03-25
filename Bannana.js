import React, { useEffect, useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";


export const Bannana = () => {

    const [active, setActive] = useState(false)
    const url = "Models/Bannana/Bannana.gltf"
    const gltf = useLoader(GLTFLoader, url);


    useEffect(() => {
        gltf.scene.scale.set(0.6, 0.5, 0.5);
        gltf.scene.position.set(2, 1.1, 3.0);
        gltf.scene.rotation.set(1.5, 0, Math.PI / 3.5);

        gltf.scene.traverse((object) => {
            if (object instanceof Mesh) {
                object.castShadow = true;
                object.receiveShadow = true;
                object.material.envMapIntensity = 20;
            }
        })

    }, [gltf])

    return <primitive object={gltf.scene} />
}