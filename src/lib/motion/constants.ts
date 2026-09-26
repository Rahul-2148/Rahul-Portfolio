export const MOTION = {
  duration: {
    instant: 0.15,
    fast: 0.25,
    normal: 0.45,
    slow: 0.75,
    choreographed: 1.2,
  },
  stagger: {
    tight: 0.05,
    normal: 0.08,
    relaxed: 0.12,
  },
  distance: {
    subtle: 12,
    normal: 24,
    editorial: 48,
  },
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;
