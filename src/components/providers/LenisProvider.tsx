'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ReactLenis } from 'lenis/react';
import type { LenisRef } from 'lenis/react';
import { ScrollTrigger } from '@/lib/motion/gsap';

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch devices — disable Lenis on mobile for native finger scrolling
  useEffect(() => {
    const isTouch =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(hover: none)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
  }, []);

  useEffect(() => {
    if (isAdmin || isTouchDevice) return;
    const lenis = lenisRef.current?.lenis;
    if (!lenis) return;

    const handleScroll = () => {
      ScrollTrigger.update();
    };

    lenis.on('scroll', handleScroll);

    return () => {
      lenis.off('scroll', handleScroll);
    };
  }, [isAdmin, isTouchDevice]);

  // Skip Lenis entirely on admin pages and touch/mobile devices
  if (isAdmin || isTouchDevice) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        lerp: 0.1,
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.0,
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}

export default LenisProvider;
