'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 350 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable on desktop non-touch devices with fine pointer
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    setVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('[data-cursor], button, a, input, textarea, [role="button"]');
      if (interactive) {
        setIsHovered(true);
        const text = interactive.getAttribute('data-cursor');
        setCursorText(text || '');
      } else {
        setIsHovered(false);
        setCursorText('');
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setCursorText('');
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[99999] hidden lg:block"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      <motion.div
        animate={{
          scale: isHovered ? (cursorText ? 2.6 : 1.7) : 1,
          backgroundColor: isHovered
            ? cursorText
              ? 'var(--primary)'
              : 'rgba(var(--accent-rgb), 0.15)'
            : 'rgba(var(--accent-rgb), 0.35)',
          borderColor: isHovered ? 'var(--primary)' : 'rgba(var(--accent-rgb), 0.6)',
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="flex items-center justify-center rounded-full border border-primary backdrop-blur-xs w-6 h-6 text-[8px] font-mono font-bold tracking-wider text-primary-foreground select-none"
      >
        {cursorText && (
          <span className="scale-75 uppercase tracking-widest">{cursorText}</span>
        )}
      </motion.div>
    </motion.div>
  );
}
export default CustomCursor;
