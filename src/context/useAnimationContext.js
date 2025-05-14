import { useContext } from "react";
import { AnimationContext } from "./AnimationContext";

export function useAnimationContext() {
  return useContext(AnimationContext);
}
