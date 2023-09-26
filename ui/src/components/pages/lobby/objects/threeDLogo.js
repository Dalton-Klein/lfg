import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { MathUtils } from "three";

export default function ThreeDLogo() {
  const objRef = useRef(); // Create a ref to access the loaded object
  const threeDLogo = useGLTF("/assets/Logo_R.gltf");
  // const obj = useLoader(OBJLoader, "/assets/gangs-logo-3d-small.obj", (loader) => {
  //   loader.setResourcePath("/assets/"); // Set the resource path for loading related assets (e.g., textures)
  // });

  const [rotationAngle, setRotationAngle] = useState(0);
  // Function to update the rotation angle on each frame
  useFrame(() => {
    // Increase the rotation angle over time (adjust the speed as needed)
    setRotationAngle((prevAngle) => prevAngle - 0.0001);
  });
  const rotationDegrees = MathUtils.radToDeg(rotationAngle);
  const rotationRadians = [108.3, rotationDegrees, 0.01];

  return (
    <mesh rotation={rotationRadians} scale={[29, 29, 29]}>
      <primitive object={threeDLogo.scene} ref={objRef} />
    </mesh>
  );
}
// import React from "react";
// import { Decal, Float, OrbitControls, Preload, useTexture } from "@react-three/drei";
// import { ObjectLoader } from "three";
// import { useLoader } from "@react-three/fiber";

// export default function Box() {
//   const colorMap = useTexture(
//     "https://res.cloudinary.com/kultured-dev/image/upload/v1694630581/TexturesCom_Paint_Chipped_1K_albedo_qhna0w.jpg"
//   );
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   const obj = useLoader(ObjectLoader, "../../../assets/gangs-logo-3d.obj");
//   return (
//     <mesh rotation={[90, 0, 20]}>
//       {/* <boxGeometry attach="geometry" args={[3, 3, 3]} /> */}
//       <primitive object={obj} />
//       {/* <meshStandardMaterial map={colorMap} /> */}
//       <meshNormalMaterial attach="material" />
//     </mesh>
//   );
// }
