import React, { useEffect, useRef, useState } from "react";
import { useLoader, useFrame, useThree } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { useTexture, useGLTF, useAnimations, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { MathUtils } from "three";
import { useInput } from "../hooks/useInput";

let walkDirection = new THREE.Vector3();
let rotateAngle = new THREE.Vector3(0, 1, 0);
let rotateQuarternion = new THREE.Quaternion();
let cameraTarget = new THREE.Vector3();

//Calc direction to move in based on inputs
const directionOffset = ({ forward, backward, left, right }) => {
  let directionOffset = 0;
  if (forward) {
    if (left) {
      directionOffset = Math.PI / 4;
    } else if (right) {
      directionOffset = -Math.PI / 4;
    }
  } else if (backward) {
    if (left) {
      directionOffset = Math.PI / 4 + Math.PI / 2;
    } else if (right) {
      directionOffset = -Math.PI / 4 - Math.PI / 2;
    } else {
      directionOffset = Math.PI;
    }
  } else if (left) {
    directionOffset = Math.PI / 2;
  } else if (right) {
    directionOffset = -Math.PI / 2;
  }
  return directionOffset;
};

export default function Player() {
  // const { forward, backward, left, right, jump, shift } = useInput();
  // const objRef = useRef(); // Create a ref to access the loaded object
  // const player = useGLTF("/assets/gasMask4.glb");
  // const { actions } = useAnimations(player.animations, player.scene);
  // const currentAction = useRef("");
  // const controlsRef = useRef<any>();
  // const camera = useThree((state) => state.camera);
  // const updateCameraTarget = (moveX: number, moveZ: number) => {
  //   camera.position.x += moveX;
  //   camera.position.z += moveZ;
  //   cameraTarget.x = player.scene.position.x;
  //   cameraTarget.y = player.scene.position.y + 2;
  //   cameraTarget.z = player.scene.position.z;
  //   if (controlsRef.current) controlsRef.current.target = cameraTarget;
  // };
  // player.scene.traverse((object: any) => {
  //   if (object?.isMesh) {
  //     object.castShadow = true;
  //   }
  // });
  // useEffect(() => {
  //   let action = "";
  //   if (jump) {
  //     action = "jump";
  //   } else if (forward || backward || left || right) {
  //     action = "walk";
  //     if (shift) {
  //       action = "run";
  //     }
  //   } else {
  //     action = "idle";
  //   }
  //   // actions?.walk?.play();
  //   if (currentAction.current != action) {
  //     const nextActionToPlay = actions[action];
  //     const current = actions[currentAction.current];
  //     current?.fadeOut(0.2);
  //     nextActionToPlay?.reset().fadeIn(0.2).play();
  //     currentAction.current = action;
  //   }
  //   console.log("moving forward", forward);
  // }, [forward, backward, left, right, jump, shift]);
  // useFrame((state, delta) => {
  //   if (currentAction.current === "run" || currentAction.current === "walk") {
  //     let angleYCameraDirection = Math.atan2(
  //       camera.position.x - player.scene.position.x,
  //       camera.position.z - player.scene.position.z
  //     );
  //     let newDirectionOffset = directionOffset({
  //       forward,
  //       backward,
  //       left,
  //       right,
  //     });
  //     rotateQuarternion.setFromAxisAngle(rotateAngle, angleYCameraDirection + newDirectionOffset);
  //     player.scene.quaternion.rotateTowards(rotateQuarternion, 0.2);
  //     camera.getWorldDirection(walkDirection);
  //     walkDirection.y = 0;
  //     walkDirection.normalize();
  //     walkDirection.applyAxisAngle(rotateAngle, newDirectionOffset);
  //     //Run/walk velocity
  //     const velocity = currentAction.current == "run" ? 7 : 3.5;
  //     //Move Player & Camera
  //     const moveX = walkDirection.x * velocity * delta;
  //     const moveZ = walkDirection.z * velocity * delta;
  //     player.scene.position.x += moveX;
  //     player.scene.position.z += moveZ;
  //     updateCameraTarget(moveX, moveZ);
  //   }
  // });
  // return (
  //   <>
  //     <OrbitControls ref={controlsRef} />
  //     <primitive object={player.scene} ref={objRef} receiveShadow castShadow />
  //   </>
  // );
}
