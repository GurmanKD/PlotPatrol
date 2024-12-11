
import React from 'react'
import { useGLTF } from '@react-three/drei'

export function Stage1(props) {
  const { nodes, materials } = useGLTF('/stage1.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.mesh_0.geometry} material={nodes.mesh_0.material} />
    </group>
  )
}

useGLTF.preload('/stage1.glb')
