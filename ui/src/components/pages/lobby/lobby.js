import React, { Suspense, useState, useRef } from "react";
import "./lobby.scss";
import { useNavigate } from "react-router-dom";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Player from "./objects/player";
import Lights from "./objects/lights";

export default function LobbyPage(socketRef) {
  const navigate = useNavigate();
  const [position, setPosition] = useState([0, 0.35, 0]);
  const handleKeyPress = (event) => {
    const speed = 0.1; // Adjust the movement speed as needed

    switch (event.key) {
      case "ArrowUp":
        setPosition([position[0], position[1], position[2] - speed]);
        break;
      case "ArrowDown":
        setPosition([position[0], position[1], position[2] + speed]);
        break;
      case "ArrowLeft":
        setPosition([position[0] - speed, position[1], position[2]]);
        break;
      case "ArrowRight":
        setPosition([position[0] + speed, position[1], position[2]]);
        break;
      default:
        break;
    }
  };

  return (
    <div className="lobby-master">
      <h1 className="text">lobby</h1>
      <Canvas
        frameloop="always"
        gl={{ preserveDrawingBuffer: true }}
        style={{
          width: "90vw",
          height: "80vw",
          outline: "none",
        }}
        onKeyDown={handleKeyPress}
        tabIndex={0}
        shadows
      >
        {/* <PerspectiveCamera makeDefault /> */}
        <OrbitControls enableZoom={false} />
        <Lights></Lights>
        <Suspense fallback={null}>
          <Player />
          <mesh rotation-x={Math.PI * -0.5} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color={"#458745"} />
          </mesh>
        </Suspense>
      </Canvas>
    </div>
  );
}
