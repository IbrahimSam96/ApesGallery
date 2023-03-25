import React, { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei"
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";


export const Pillar = ({ n }) => {

    const group = useRef()

    const gltf = useGLTF('/Models/Pillar3/Pillar3.gltf');

    const copiedScene = useMemo(() => gltf.scene.clone(), [gltf.scene])

    const x = n % 2 == 0 ? -5 : 10

    useEffect(() => {

        // gltf.scene.scale.set(1,1,1);
        // gltf.scene.position.set( 0, 0, n * 3.5);

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
            <primitive object={copiedScene} position={[x, 0, n * -15]} scale={[0.5, 0.5, 0.5]} />
        </group>
    )
}