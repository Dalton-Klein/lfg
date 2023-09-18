import { useEffect, useState } from "react";

export const useInput = () => {
  const [input, setinput] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    shift: false,
    jump: false,
  });
  const keys = {
    KeyW: "forward",
    KeyS: "backward",
    KeyA: "left",
    KeyD: "right",
    ShiftLeft: "shift",
    Space: "jump",
  };
  const findKey = (key: string) => keys[key];

  useEffect(() => {
    const handleKeyDown = (e: { code: string }) => {
      setinput((m) => ({ ...m, [findKey(e.code)]: true }));
    };
    const handleKeyUp = (e: { code: string }) => {
      setinput((m) => ({ ...m, [findKey(e.code)]: false }));
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return input;
};
