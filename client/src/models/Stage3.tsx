import React from 'react'
import { useGLTF } from '@react-three/drei'

export function Stage3(props) {
  const { nodes, materials } = useGLTF('/stage3.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.mesh_0.geometry} material={nodes.mesh_0.material} />
    </group>
  )
}

useGLTF.preload('/stage3.glb')
