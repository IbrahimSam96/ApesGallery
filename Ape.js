import React, { useEffect, useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from 'three'

import { useAnimations, useGLTF, useScroll } from "@react-three/drei";
import { easing } from "maath";


export const Ape = ({ q = new THREE.Quaternion(), p = new THREE.Vector3() }) => {
    const GOLDENRATIO = 1.61803398875
    const ref = useRef();

    const [active, setActive] = useState(false)
    const url = "Models/Ape/Ape.gltf"
    const gltf = useLoader(GLTFLoader, url);

    const { animations } = useGLTF(url)
    const { actions, clips } = useAnimations(animations)



    useEffect(() => {
        gltf.scene.scale.set(0.8, 0.8, 0.8);
        gltf.scene.position.set(-2, 0, 1.5);
        gltf.scene.rotation.set(0, 1, 0);

        gltf.scene.traverse((object) => {
            if (object instanceof Mesh) {
                object.castShadow = true;
                object.receiveShadow = true;
                object.material.envMapIntensity = 20;
            }
        })

        console.log(ref.current)
    }, [gltf])

    let mixer
    if (gltf.animations.length) {
        mixer = new THREE.AnimationMixer(gltf.scene);
        gltf.animations.forEach(clip => {
            const action = mixer.clipAction(clip)
            action.play();
        });
    }
    useFrame((state, delta) => {
        mixer?.update(delta)

    })


    const handleClick = () => {
        setActive(true)
    }


    useFrame((state, delta) => {

        if (active) {
            ref.current.updateWorldMatrix(true, true)
            ref.current.localToWorld(p.set(2, 1.9, -1))
            ref.current.getWorldQuaternion(q)
        }
        else {
            p.set(0, 0, 5.5)
            q.identity()
        }
    })

    // Selects object to ease, 
    // How fast camera moves after each project is selected
    useFrame((state, dt) => {
        if(active){
            easing.damp3(state.camera.position, p, 0.3, dt)
            easing.dampQ(state.camera.quaternion, q, 0.3, dt)
    
        }

    })

    return <primitive ref={ref} object={gltf.scene} onClick={handleClick} onPointerMissed={() => setActive(false)} />
}