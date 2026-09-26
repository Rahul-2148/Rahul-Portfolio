'use client';

import React, { useEffect, useRef, useState } from 'react';
import { getStoredTheme, ThemeMode } from '@/lib/theme';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseAlpha: number;
}

export function ThemeBackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [theme, setLocalTheme] = useState<ThemeMode>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLocalTheme(getStoredTheme());

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<ThemeMode>;
      if (customEvent.detail === 'dark' || customEvent.detail === 'light') {
        setLocalTheme(customEvent.detail);
      } else {
        setLocalTheme(getStoredTheme());
      }
    };

    window.addEventListener('theme-changed', handleThemeChange);

    const observer = new MutationObserver(() => {
      const current = document.documentElement.getAttribute('data-theme') as ThemeMode | null;
      if (current === 'dark' || current === 'light') {
        setLocalTheme(current);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => {
      window.removeEventListener('theme-changed', handleThemeChange);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId: number;
    let isTabVisible = !document.hidden;

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible && !prefersReducedMotion) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // High DPI scaling
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    // Mouse tracking with smooth lerp
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 180,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Lightweight particle constellation system
    let particles: Particle[] = [];
    const initParticles = () => {
      const logicalWidth = window.innerWidth;
      const logicalHeight = window.innerHeight;
      const count = Math.min(Math.floor((logicalWidth * logicalHeight) / 32000), 28);
      
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * logicalWidth,
        y: Math.random() * logicalHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 1.5 + 0.8,
        baseAlpha: Math.random() * 0.3 + 0.15,
      }));
    };


    initParticles();

    let lastTime = performance.now();

    const render = (time: number) => {
      if (!isTabVisible) return;

      // Throttle render loop to ~45 FPS to preserve main-thread responsiveness for instant page transitions
      const elapsed = time - lastTime;
      if (elapsed < 22) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      const delta = Math.min(elapsed / 1000, 0.1);
      lastTime = time;

      const logicalWidth = window.innerWidth;
      const logicalHeight = window.innerHeight;

      // Mouse smooth interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      ctx.clearRect(0, 0, logicalWidth, logicalHeight);

      const isLightMode = theme === 'light';

      // Colors adapted to theme
      const nodeColor = isLightMode
        ? 'rgba(67, 56, 202, ' // architectural indigo
        : 'rgba(99, 102, 241, '; // electric indigo

      const lineColor = isLightMode
        ? 'rgba(15, 23, 42, ' // slate
        : 'rgba(99, 102, 241, '; // electric

      const lineAlphaScale = isLightMode ? 0.08 : 0.18;
      const mouseAlphaScale = isLightMode ? 0.18 : 0.32;

      // Draw subtle atmospheric background grid lines
      ctx.strokeStyle = isLightMode ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.015)';
      ctx.lineWidth = 1;
      const gridSize = 80;
      for (let x = 0; x < logicalWidth; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, logicalHeight);
        ctx.stroke();
      }
      for (let y = 0; y < logicalHeight; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(logicalWidth, y);
        ctx.stroke();
      }

      // Update & Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.x += p.vx * (delta * 60);
          p.y += p.vy * (delta * 60);

          if (p.x < 0) p.x = logicalWidth;
          if (p.x > logicalWidth) p.x = 0;
          if (p.y < 0) p.y = logicalHeight;
          if (p.y > logicalHeight) p.y = 0;

          // Gentle mouse gravity / repulsion
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius && dist > 0) {
            const force = (1 - dist / mouse.radius) * 0.02;
            p.x += dx * force;
            p.y += dy * force;
          }
        }

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${nodeColor}${p.baseAlpha})`;
        ctx.fill();

        // Connect nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const djx = p.x - p2.x;
          const djy = p.y - p2.y;
          const d = Math.sqrt(djx * djx + djy * djy);
          if (d < 130) {
            const alpha = (1 - d / 130) * lineAlphaScale;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `${lineColor}${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }

        // Connect to cursor
        const mdx = mouse.x - p.x;
        const mdy = mouse.y - p.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < mouse.radius) {
          const mAlpha = (1 - mDist / mouse.radius) * mouseAlphaScale;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `${nodeColor}${mAlpha})`;
          ctx.lineWidth = 0.85;
          ctx.stroke();
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    if (prefersReducedMotion) {
      render(0); // static snapshot
    } else {
      animationFrameId = requestAnimationFrame(render);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, mounted]);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Atmospheric Soft Radiant Vignettes */}
      <div
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-[140px] opacity-25 pointer-events-none transition-colors duration-500"
        style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.15)' }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full blur-[140px] opacity-20 pointer-events-none transition-colors duration-500"
        style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.12)' }}
      />
    </div>
  );
}

export default ThemeBackgroundCanvas;
