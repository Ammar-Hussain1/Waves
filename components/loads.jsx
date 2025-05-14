import { useGLTF } from '@react-three/drei'

// ✅ These lines preload GLB models as soon as this file is imported
useGLTF.preload('/sydney.glb')
useGLTF.preload('/snow.glb')

import React from 'react'

function Loads() {
  return (
<div></div>
  )
}

export default Loads
// Add more models if needed
