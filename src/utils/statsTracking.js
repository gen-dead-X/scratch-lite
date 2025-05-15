import { v4 as uuidv4 } from "uuid";

const sessionStats = {
  id: uuidv4(),
  startTime: new Date(),
  animations: {
    move: 0,
    turn: 0,
    goto: 0,
    repeat: 0,
    say: 0,
    think: 0,
  },
  collisions: 0,
  spritesCreated: 0,
  animationsExchanged: 0,
};

/**
 * Track sprite creation
 * @param {string} type - Type of sprite created
 */
export const trackSpriteCreation = (type) => {
  sessionStats.spritesCreated++;

  try {
    sessionStorage.setItem("scratchLiteStats", JSON.stringify(sessionStats));
  } catch (error) {
    console.warn("Failed to store session stats", error);
  }

  return sessionStats.spritesCreated;
};

/**
 * Track animation execution
 * @param {string} type - Type of animation executed
 */
export const trackAnimation = (type) => {
  if (type in sessionStats.animations) {
    sessionStats.animations[type]++;
  }

  try {
    sessionStorage.setItem("scratchLiteStats", JSON.stringify(sessionStats));
  } catch (error) {
    console.warn("Failed to store session stats", error);
  }

  return sessionStats.animations[type];
};

/**
 * Track collision event
 */
export const trackCollision = () => {
  sessionStats.collisions++;

  try {
    sessionStorage.setItem("scratchLiteStats", JSON.stringify(sessionStats));
  } catch (error) {
    console.warn("Failed to store session stats", error);
  }

  return sessionStats.collisions;
};

/**
 * Track animation exchanges
 */
export const trackAnimationExchange = () => {
  sessionStats.animationsExchanged++;

  try {
    sessionStorage.setItem("scratchLiteStats", JSON.stringify(sessionStats));
  } catch (error) {
    console.warn("Failed to store session stats", error);
  }

  return sessionStats.animationsExchanged;
};

/**
 * Get current stats
 */
export const getSessionStats = () => {
  return { ...sessionStats };
};
