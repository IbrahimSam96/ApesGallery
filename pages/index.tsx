import Head from 'next/head'
// import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Edges, Gltf, Html, MeshReflectorMaterial, OrbitControls, ScrollControls, Stars, Stats, Svg, Text, useCursor, useScroll, useTexture } from '@react-three/drei'
import { ethers } from 'ethers'
import { createClient } from 'urql'
import * as THREE from 'three'
import { useRoute } from 'wouter'
import useLocation from 'wouter/use-location'
import { easing } from 'maath'
import { Image } from '@react-three/drei'
import { Ape } from '../Ape'
import { EffectComposer, Bloom, DepthOfField, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from "postprocessing";
import Link from 'next/link'
import { useRouter } from 'next/router'



const Home = () => {

  const GOLDENRATIO = 1.61803398875

  const [address, setAddress] = useState("0x69f37e419bd1457d2a25ed3f5d418169caae8d1f");

  const [tokens, setTokens] = useState([]);
  const MutantAPIURL = "https://api.thegraph.com/subgraphs/name/ibrahimsam96/boredandmutant-apes"
  const BoredAPIURL = "https://api.thegraph.com/subgraphs/name/gautamraju15/bayc-indexer"

  const Mutantquery = `
  {
    tokens(where: {owner_: {id: "${address}"}}) {
      tokenID
      imageURI
      contentURI
    }
  }
`
  const Boredquery = `
{
  boredApeTokens(where: {owner: "${address}"}) {
    tokenID
    imageURI
    owner {
      id
    }
  }
}
`
  const client = createClient({
    url: MutantAPIURL
  })
  const client2 = createClient({
    url: BoredAPIURL
  })

  useEffect(() => {
    let isAddress = ethers.utils.isAddress(address)
    if (isAddress) {
      fetchData()
    }
  }, [address])

  async function fetchData() {
    const mutantresponse = await client.query(Mutantquery, {}).toPromise();
    const boredresponse = await client2.query(Boredquery, {}).toPromise();

    let positionedArr = [];

    if (mutantresponse.data.tokens.length > 0) {
      mutantresponse.data.tokens.map((obj, key) => {
        let variable = obj
        variable.collection = "Mutant Ape"
        positionedArr.push(variable)
      });
    }
    if (boredresponse.data.boredApeTokens.length > 0) {
      boredresponse.data.boredApeTokens.map((obj, key) => {
        let variable = obj
        variable.collection = "Bored Ape"
        positionedArr.push(variable)
      })
    }

    if (positionedArr.length > 0) {
      positionedArr.map((obj, key) => {
        // Assign position property foreach object.
        let x = key % 2 == 0 ? 1.5 : -1.5;
        let y = key == 0 ? 1.5 : key * -1.5
        obj.position = [x, 0, y];

        obj.rotation = key % 2 == 0 ? [0, -Math.PI / 3.5, 0] : [0, Math.PI / 3.5, 0]

      })
    }
    setTokens(positionedArr);
    // console.log('positionedArr:', positionedArr)
    // console.log(positionedArr[0].imageURI.slice(-46))


  }

  const Frame = ({ tokenID, imageURI, collection, ...props }) => {

    const project = useRef()
    const frame = useRef();
    const [, params] = useRoute('/3D/:id')
    const [hovered, hover] = useState(false)
    const [location, setLocation] = useLocation()
    const router = useRouter()
    const isActive = params?.id === tokenID;
    useCursor(hovered)


    const ImageMaterial = () => {
      const texture = useTexture(`\Textures/${tokenID}.`)
      return (
        <meshBasicMaterial ref={project} map={texture} toneMapped={false} />
      )
    }


    return (
      <group {...props}>
        <mesh
          ref={project}
          name={tokenID}
          onPointerOver={(e) => (e.stopPropagation(), hover(true))}
          onPointerOut={() => hover(false)}
          scale={[1.1, GOLDENRATIO, 0.05]}
          position={[0, GOLDENRATIO / 1.9, 0]}
        >
          <boxGeometry />
          <meshStandardMaterial color={"black"} metalness={0.5} roughness={0.5} envMapIntensity={2} />
          <mesh ref={frame} raycast={() => null} scale={[0.95, 0.93, 0.9]} position={[0, 0, 0.2]}>
            <boxGeometry />

            <Edges
              scale={1.1}
              threshold={15} // Display edges only when the angle between two faces exceeds this value (default=15 degrees)
              color={isActive || hovered ? "orange" : "grey"}
            />
          </mesh>

          <Image raycast={() => null} ref={project} position={[0, 0, 0.7]} url={`https://apes-gallery.infura-ipfs.io/ipfs/${imageURI.slice(-46)}`} />
        </mesh>

        <Text onClick={() => {
          if (collection == "Bored Ape") {
            console.log("Its a Bored Ape")
            window.open(`https://www.apecoinmarketplace.com/collections/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/networks/mainnet/tokens/${tokenID}`);
          }
          else {
            console.log("Its a Mutant Ape")

            window.open(`https://www.apecoinmarketplace.com/collections/0x60e4d786628fea6478f785a6d7e704777c86a7c6/networks/mainnet/tokens/${tokenID}`);
          }
        }} color={"White"} maxWidth={0.1} anchorX="left" anchorY="top" position={[0.65, GOLDENRATIO, 0]} fontSize={0.05}>
          {`#${tokenID}`}
        </Text>

      </group>
    )
  }

  const Frames = ({ tokens, q = new THREE.Quaternion(), p = new THREE.Vector3() }) => {
    const ref = useRef();
    const clicked = useRef();
    const [, params] = useRoute('/:id')
    const [, setLocation] = useLocation()
    const scroll = useScroll()

    useFrame((state, delta) => {
      clicked.current = ref.current.getObjectByName(params?.id)
      // console.log(ref.current)
      if (clicked.current) {
        clicked.current.parent.updateWorldMatrix(true, true)
        clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 1.9, 1.4))
        clicked.current.parent.getWorldQuaternion(q)
      }
      else {
        let x = state.mouse.x * 0.25
        let y = state.mouse.y * 0.25
        p.set(x, y, 5.5 + scroll.scroll.current * - (tokens.length * 1.5))
        q.identity()
      }
    })

    // Selects object to ease, 
    // How fast camera moves after each project is selected
    useFrame((state, dt) => {
      easing.damp3(state.camera.position, p, 0.3, dt)
      easing.dampQ(state.camera.quaternion, q, 0.3, dt)

    })

    return (
      <React.Fragment>
        <group
          ref={ref}
          onClick={(e) => {
            e.stopPropagation(),
              setLocation(clicked.current == e.object ? '/' : '/' + e.object.name)
          }}
          onPointerMissed={() => setLocation('/')}>
          {tokens.map((props, index) => <Frame key={props.imageURI} {...props} index={index} /> /* prettier-ignore */)}

        </group>
      </React.Fragment>
    )
  }

  return (
    <>
      <Head>
        <title>Ape Gallery</title>
        <meta name="View Gallery of BAYC holders" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`h-full min-h-screen w-full grid grid-cols-[repeat(7,1fr)] grid-rows-[60px,1fr] bg-[black]`}>
        <input
          placeholder='Search By Owner Address'
          className={` px-2 self-center justify-self-center col-start-1 col-end-8 bg-black hover:bg-[#353434] border-slate-500 border-[1px] rounded-sm focus:outline-none text-neutral-50 min-w-[300px]`}
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value.toLowerCase())
          }}
        >
        </input>
        <Canvas
          dpr={[1, 2]}
          className={`row-start-2 col-start-1 col-span-7`}
          shadows
          camera={{ fov: 70, position: [0, 2, 15] }}
        >
          <ambientLight intensity={0.8} />
          <ScrollControls pages={tokens.length} infinite >

            <group position={[0, -.75, 0]}>
              <Frames tokens={tokens} />
              <Ape />
              <Stars radius={100} depth={500} count={5000} factor={4} saturation={0} fade speed={2} />
              <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
                <planeGeometry args={[50, 150 * tokens.length]} />
                <MeshReflectorMaterial
                  blur={[300, 100]}
                  resolution={2048}
                  mixBlur={1}
                  mixStrength={50}
                  roughness={1}
                  depthScale={1.2}
                  minDepthThreshold={0.4}
                  maxDepthThreshold={1.4}
                  color="#050505"
                  metalness={0.5}
                />
              </mesh>
            </group>
          </ScrollControls>

          <Stats />
        </Canvas>
      </div>
    </>
  )
}

export default Home;
