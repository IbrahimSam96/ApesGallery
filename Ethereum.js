import React, { useEffect, useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";


export const Ethereum = ({ position, scale }) => {

    const Ref = useRef();

    const url = "Models/Ethereum3/Ethereum3.gltf"
    const gltf = useLoader(GLTFLoader, url);
    const [xRotSpeed] = useState(() => Math.random());
    const [yRotSpeed] = useState(() => Math.random());

    useFrame((state, delta) => {
        gltf.scene.traverse((object) => {
            if (object instanceof Mesh) {
                object.rotation.y += delta * xRotSpeed
            }
            // Ref.current.rotation.x += delta * xRotSpeed
            // Ref.current.rotation.y += delta * yRotSpeed

            // console.log(boxRef.current)
        })

        }, [xRotSpeed, yRotSpeed]);

        useEffect(() => {
            // gltf.scene.scale.set(0.05, 0.005, 0.005);

            gltf.scene.traverse((object) => {
                if (object instanceof Mesh) {
                    object.castShadow = true;
                    object.receiveShadow = true;
                    object.material.envMapIntensity = 20;

                }
            })

        }, [gltf])

        return (
            <group ref={Ref}>
                <primitive object={gltf.scene} position={position} scale={scale} />
            </group>
        )
    }