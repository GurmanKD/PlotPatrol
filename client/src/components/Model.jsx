/* eslint-disable react/no-unknown-property */
import { Suspense } from 'react';
import { Environment, OrbitControls, OrthographicCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import { Skeleton } from '@mui/material';
import { Stage1 } from '../models/Stage1';
import { Stage2 } from '../models/Stage2';
import { Stage3 } from '../models/Stage3';
import { Stage4 } from '../models/Stage4';

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
		  {stage===1 && <Stage1 position={[0, 0, 0]} />}
		  {stage===2 && <Stage2 position={[0, 0, 0]} />}
		  {stage===3 && <Stage3 position={[0, 0, 0]} />}
		  {stage===4 && <Stage4 position={[0, 0, 0]} />}
        </Suspense>
      </Canvas>
    </div>
  );
}
