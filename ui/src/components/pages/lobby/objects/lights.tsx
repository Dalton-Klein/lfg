import React, { Suspense, useState, useRef } from "react";
import { useHelper } from "@react-three/drei";

import { DirectionalLightHelper } from "three";
export default function Lights() {
  const lightRef = useRef<any>();

  useHelper(lightRef, DirectionalLightHelper, 5, "red");
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight ref={lightRef} position={[0, 20, 20]} intensity={0.8} castShadow />
    </>
  );
}
