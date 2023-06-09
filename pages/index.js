import Head from 'next/head'

import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Center, Edges, Loader, MeshReflectorMaterial, ScrollControls, Stars, Stats, Text, Text3D, useCursor, useScroll, useTexture } from '@react-three/drei'
import { ethers } from 'ethers'
import { createClient } from 'urql'
import * as THREE from 'three'
import { useRoute } from 'wouter'
import useLocation from 'wouter/use-location'
import { easing } from 'maath'
import { Image } from '@react-three/drei'
import { Ape } from '../Ape'

import { useControls } from 'leva'
import { Carpet } from '../Carpet'
import { Ethereum } from '../Ethereum'


const Home = () => {

  const GOLDENRATIO = 1.61803398875

  const [address, setAddress] = useState("0x7eb413211a9DE1cd2FE8b8Bb6055636c43F7d206");

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

  const HolderOptions = {
    "BendDAO Collateral": "0x69f37e419bd1457d2a25ed3f5d418169caae8d1f",
    "machibigbrother.eth": "0x020cA66C30beC2c4Fe3861a94E4DB4A498A35872",
    "n0b0dy.eth": "0x7eb413211a9DE1cd2FE8b8Bb6055636c43F7d206",
    "panthro.eth": "0x122b19a4Be93d7c2b4522ebF7EB3F1b5B0343b2f",
    "keungz.eth": "0x6C8Ee01F1f8B62E987b3D18F6F28b22a0Ada755f",
    "jrnyclub.eth": "0x1b523DC90A79cF5ee5d095825e586e33780f7188",
    "qaz.eth": "0xA37FbD2264b48ED56Dd7dE8B9B83DB35561700eF",
    "kegvault.eth": "0xd611A3350321558BDa7d15Da88e4b74eaF4c8986",
    "bayc.01k.eth": "0x5CEFF23A72431c69fB7F0e035D98B02fD27441b5",
    "deerhunters.eth": "0xf4893542E4ec7C33356579F91bF22E8FA7CD06dc",
    "monkeybread.eth": "0x4918fc71BD92F262c4D2F73804fa805de8602743",
    "feld4014.eth": "0xC883A79E8e4594C4f89434EDb754a10Da2311139",
    "rh0729.eth": "0x840De9986997435983F3D827dF933638F1eD23d7",
    "nftsanctuary.eth": "0xb4D5b4d979E3c2AeDfe4b80fA0328713dB1A4Dca"

  }
  const TopHolders = useControls({
    "Top BAYC Holders": {
      value: address,
      options: HolderOptions,
      onChange: (v) => {
        setAddress(v.toLowerCase())
      },
    },
  });

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
      clicked.current = ref.current?.getObjectByName(params?.id)
      // console.log(ref.current)
      if (clicked.current) {
        clicked.current.parent.updateWorldMatrix(true, true)
        clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 1.9, 1.4))
        clicked.current.parent.getWorldQuaternion(q)
      }
      else {
        let x = state.mouse.x * 0.25
        let y = state.mouse.y * 0.25 + 0.2
        p.set(x, y, 6.5 + scroll.scroll.current * - (tokens.length * 1.5))
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
        <link rel="icon" href="/Coin.svg" />
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
            <Stars radius={100} depth={500} count={5000} factor={4} saturation={0} fade speed={2} />
            <Suspense fallback={null}>
              <group position={[0, -.75, 0]}>
                <Frames tokens={tokens} />

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
                <Ape />
                {tokens.map((obj, key) => {
                  return (
                    <>
                      <Carpet n={key} />
                    </>
                  )
                })
                }
                <Center position={[-7.5, 1, -2]} rotation={[0, 1, 0]}>
                  <Text3D
                    curveSegments={32}
                    bevelEnabled
                    bevelSize={0.04}
                    bevelThickness={0.1}
                    height={0.5}
                    lineHeight={0.7}
                    letterSpacing={-0.06}
                    size={1}
                    font="/font.json">
                    {`BAYC`}
                    <meshNormalMaterial />
                  </Text3D>

                </Center>
                <Ethereum position={[-6.5, 1.75, -3]} scale={[0.2, 0.2, 0.2]} />
                {/* <spotLight color={"hotpink"} position={[-5,2,4]} /> */}
                <spotLight color={"hotpink"} position={[2, 2, 7]} distance={10} />

              </group>
            </Suspense>

          </ScrollControls>

          <Stats />
        </Canvas>
        <Loader />
      </div>
    </>
  )
}

export default Home;
