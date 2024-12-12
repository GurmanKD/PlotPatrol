/* eslint-disable react/no-unknown-property */
import { Suspense } from 'react';
import { Environment, OrbitControls, OrthographicCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import { Skeleton } from '@mui/material';

function Loading() {
  return (
    <Skeleton animation="wave" variant="rounded" width="100%" height="75vh" />
  );
}

export default function Model({stage,size}) {
	console.log(stage);

  return (
    <div style={{ height: '32vh' }}>
      <Canvas>
        <OrthographicCamera makeDefault position={[0, 0, 105]} zoom={size} />

        <OrbitControls
          enablePan={false} 
          target={[0, 0, 0]} 
          maxPolarAngle={Math.PI / 2} 
          minPolarAngle={0}
        />

        <ambientLight castShadow />
        <Environment preset="sunset"></Environment>

        <Suspense fallback={<Loading />}>

        </Suspense>
      </Canvas>
    </div>
  );
}
