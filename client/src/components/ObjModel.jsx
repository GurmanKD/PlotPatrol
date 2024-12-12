import React, { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

const ObjViewer = ({ objUrl }) => {
  const objRef = useRef();

  useEffect(() => {
    const loader = new OBJLoader();
    loader.load(
      objUrl,
      (object) => {
        objRef.current.add(object); // Add the loaded object to the scene
      },
      undefined,
      (error) => console.error("Error loading OBJ file:", error)
    );
  }, [objUrl]);

  return (
    <group ref={objRef} />
  );
};

const ObjRenderer = ({ objUrl }) => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        {/* Render the OBJ Model */}
        <ObjViewer objUrl={objUrl} />

        {/* Camera Controls */}
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default ObjRenderer;
