import { gsap } from './gsap';
import { EASINGS } from './easings';
import { MOTION, BREAKPOINTS } from './constants';

export function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isDesktopPointer(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.innerWidth >= BREAKPOINTS.lg &&
    window.matchMedia('(pointer: fine)').matches
  );
}

/**
 * Reusable scroll-triggered element reveal
 */
export function createScrollReveal(
  target: gsap.DOMTarget,
  options?: {
    trigger?: gsap.DOMTarget;
    y?: number;
    duration?: number;
    delay?: number;
    stagger?: number;
  }
) {
  if (isReducedMotion()) {
    gsap.set(target, { opacity: 1, y: 0 });
    return;
  }

  const trigger = options?.trigger || target;

  return gsap.fromTo(
    target,
    {
      opacity: 0,
      y: options?.y ?? MOTION.distance.normal,
    },
    {
      opacity: 1,
      y: 0,
      duration: options?.duration ?? MOTION.duration.normal,
      delay: options?.delay ?? 0,
      stagger: options?.stagger ?? 0,
      ease: EASINGS.smoothOut,
      scrollTrigger: {
        trigger: trigger as Element,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    }
  );
}

/**
 * Reusable parallax movement on scroll
 */
export function createParallax(
  target: gsap.DOMTarget,
  amount: number = 40,
  trigger?: gsap.DOMTarget
) {
  if (isReducedMotion() || !isDesktopPointer()) return;

  return gsap.to(target, {
    y: amount,
    ease: 'none',
    scrollTrigger: {
      trigger: (trigger || target) as Element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
    },
  });
}
