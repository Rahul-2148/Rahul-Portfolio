'use client';

import React, { useEffect, useRef, useState } from 'react';
import { getStoredTheme, ThemeId } from '@/lib/theme';

export function ThemeBackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [theme, setLocalTheme] = useState<ThemeId>('cyber-cyan');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLocalTheme(getStoredTheme());

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<ThemeId>;
      if (customEvent.detail) {
        setLocalTheme(customEvent.detail);
      } else {
        setLocalTheme(getStoredTheme());
      }
    };

    window.addEventListener('theme-changed', handleThemeChange);

    const observer = new MutationObserver(() => {
      const current = document.documentElement.getAttribute('data-theme') as ThemeId | null;
      if (current) {
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

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse tracking with lerp
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 160,
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

    // ====================================================
    // MODE 1: CYBER CYAN — Constellation Nodes & Interactive Web
    // ====================================================
    interface CyberParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseAlpha: number;
    }

    const cyberCount = Math.min(Math.floor((width * height) / 16000), 85);
    const cyberParticles: CyberParticle[] = Array.from({ length: cyberCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      size: Math.random() * 2 + 1,
      baseAlpha: Math.random() * 0.4 + 0.2,
    }));

    // ====================================================
    // MODE 2: SYNTH VIOLET — Flowing Aurora Wave Ribbons & Nebula Particles
    // ====================================================
    interface SynthParticle {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      hue: number;
      alpha: number;
    }
    const synthParticles: SynthParticle[] = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 80 + 40,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      hue: Math.random() > 0.5 ? 280 : 320, // violet to pink
      alpha: Math.random() * 0.08 + 0.03,
    }));

    // ====================================================
    // MODE 3: MATRIX EMERALD — Digital Phosphor Stream Rain
    // ====================================================
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const matrixDrops: number[] = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));
    const chars = '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ';

    // ====================================================
    // MODE 4: SOLAR AMBER — CAD Vector Grid & Radar Sweep
    // ====================================================
    let radarAngle = 0;
    interface CADNode {
      x: number;
      y: number;
      ox: number;
      oy: number;
    }
    const cadStep = 90;
    const cadCols = Math.ceil(width / cadStep) + 1;
    const cadRows = Math.ceil(height / cadStep) + 1;
    const cadNodes: CADNode[] = [];
    for (let i = 0; i < cadCols; i++) {
      for (let j = 0; j < cadRows; j++) {
        cadNodes.push({
          x: i * cadStep,
          y: j * cadStep,
          ox: i * cadStep,
          oy: j * cadStep,
        });
      }
    }

    // ====================================================
    // MODE 5: CRIMSON OVERDRIVE — Kinetic Circuit Energy Sparks
    // ====================================================
    interface KineticParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      length: number;
      speed: number;
      alpha: number;
    }
    const kineticParticles: KineticParticle[] = Array.from({ length: 50 }, () => {
      const angle = Math.floor(Math.random() * 4) * (Math.PI / 2); // 0, 90, 180, 270 deg
      const speed = Math.random() * 2 + 1.2;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: Math.random() * 40 + 15,
        speed,
        alpha: Math.random() * 0.4 + 0.2,
      };
    });

    // ====================================================
    // MODE 6: STUDIO LIGHT — Swiss Dot-Grid with Fluid Waves
    // ====================================================
    const swissSpacing = 42;
    const swissCols = Math.ceil(width / swissSpacing) + 1;
    const swissRows = Math.ceil(height / swissSpacing) + 1;
    interface SwissDot {
      bx: number;
      by: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
    }
    const swissDots: SwissDot[] = [];
    for (let c = 0; c < swissCols; c++) {
      for (let r = 0; r < swissRows; r++) {
        const bx = c * swissSpacing;
        const by = r * swissSpacing;
        swissDots.push({ bx, by, x: bx, y: by, vx: 0, vy: 0 });
      }
    }

    let time = 0;

    // Main 60fps Animation Loop
    const render = () => {
      time += 0.015;

      // Mouse smooth interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      ctx.clearRect(0, 0, width, height);

      // ----------------------------------------------------
      // Render based on current theme
      // ----------------------------------------------------
      if (theme === 'cyber-cyan') {
        // CYBER CYAN: Interactive Constellation & Nodes
        for (let i = 0; i < cyberParticles.length; i++) {
          const p = cyberParticles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          // Mouse gravity
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (1 - dist / mouse.radius) * 0.03;
            p.x += dx * force;
            p.y += dy * force;
          }

          // Draw node
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 240, 255, ${p.baseAlpha})`;
          ctx.fill();

          // Connect to nearby nodes
          for (let j = i + 1; j < cyberParticles.length; j++) {
            const p2 = cyberParticles[j];
            const djx = p.x - p2.x;
            const djy = p.y - p2.y;
            const d = Math.sqrt(djx * djx + djy * djy);
            if (d < 120) {
              const alpha = (1 - d / 120) * 0.18;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }

          // Connect to mouse
          if (dist < mouse.radius) {
            const mouseAlpha = (1 - dist / mouse.radius) * 0.35;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${mouseAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      } else if (theme === 'synth-violet') {
        // SYNTH VIOLET: Fluid Aurora Mesh Orbs & Waves
        synthParticles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < -p.radius) p.x = width + p.radius;
          if (p.x > width + p.radius) p.x = -p.radius;
          if (p.y < -p.radius) p.y = height + p.radius;
          if (p.y > height + p.radius) p.y = -p.radius;

          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          grad.addColorStop(0, `hsla(${p.hue}, 85%, 65%, ${p.alpha})`);
          grad.addColorStop(1, `hsla(${p.hue}, 85%, 65%, 0)`);

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        });

        // Flowing Sine Wave Ribbon
        ctx.beginPath();
        for (let x = 0; x <= width; x += 15) {
          const y = height * 0.5 + Math.sin(x * 0.003 + time) * 70 + Math.cos(x * 0.006 - time * 0.5) * 35;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.12)';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (theme === 'matrix-emerald') {
        // MATRIX EMERALD: Cascading Phosphor Code Rain
        ctx.font = `${fontSize}px monospace`;
        ctx.fillStyle = 'rgba(16, 185, 129, 0.75)';

        for (let i = 0; i < matrixDrops.length; i++) {
          const text = chars[Math.floor(Math.random() * chars.length)];
          const x = i * fontSize;
          const y = matrixDrops[i] * fontSize;

          // Glowing head character
          ctx.fillStyle = 'rgba(167, 243, 208, 0.9)';
          ctx.fillText(text, x, y);

          // Darker tail
          ctx.fillStyle = 'rgba(16, 185, 129, 0.35)';
          const prevChar = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillText(prevChar, x, y - fontSize);

          if (y > height && Math.random() > 0.975) {
            matrixDrops[i] = 0;
          }
          matrixDrops[i]++;
        }
      } else if (theme === 'solar-amber') {
        // SOLAR AMBER: CAD Drafting Radar & Coordinate Grid
        radarAngle += 0.008;

        // Rotating radar beam from center top
        const cx = width * 0.5;
        const cy = height * 0.35;
        const radarRadius = Math.max(width, height) * 0.7;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(radarAngle);
        const radarGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, radarRadius);
        radarGrad.addColorStop(0, 'rgba(245, 158, 11, 0.15)');
        radarGrad.addColorStop(0.3, 'rgba(245, 158, 11, 0.04)');
        radarGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radarRadius, -0.2, 0.2);
        ctx.closePath();
        ctx.fillStyle = radarGrad;
        ctx.fill();
        ctx.restore();

        // Technical crosshair marks on CAD grid nodes near mouse
        cadNodes.forEach((node) => {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.35;
            ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`;
            ctx.lineWidth = 1;
            // Draw cross (+)
            ctx.beginPath();
            ctx.moveTo(node.x - 4, node.y);
            ctx.lineTo(node.x + 4, node.y);
            ctx.moveTo(node.x, node.y - 4);
            ctx.lineTo(node.x, node.y + 4);
            ctx.stroke();
          }
        });
      } else if (theme === 'crimson-overdrive') {
        // CRIMSON OVERDRIVE: Kinetic High-Velocity Sparks & Energy Arcs
        kineticParticles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          // Draw kinetic streak
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 8, p.y - p.vy * 8);
          ctx.strokeStyle = `rgba(255, 42, 95, ${p.alpha})`;
          ctx.lineWidth = 1.8;
          ctx.stroke();

          // Mouse proximity boost
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(255, 42, 95, ${(1 - dist / 130) * 0.4})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      } else if (theme === 'studio-light') {
        // STUDIO LIGHT: Interactive Swiss Dot Grid with Fluid Wave Ripples
        swissDots.forEach((dot) => {
          const dx = mouse.x - dot.bx;
          const dy = mouse.y - dot.by;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Fluid displacement
          if (dist < 130 && dist > 0) {
            const force = (1 - dist / 130) * 16;
            const angle = Math.atan2(dy, dx);
            dot.vx -= Math.cos(angle) * force * 0.15;
            dot.vy -= Math.sin(angle) * force * 0.15;
          }

          // Spring back to base position
          dot.vx += (dot.bx - dot.x) * 0.08;
          dot.vy += (dot.by - dot.y) * 0.08;
          dot.vx *= 0.85; // damping
          dot.vy *= 0.85;

          dot.x += dot.vx;
          dot.y += dot.vy;

          // Draw dot
          const displacement = Math.sqrt((dot.x - dot.bx) ** 2 + (dot.y - dot.by) ** 2);
          const alpha = Math.min(0.08 + displacement * 0.04, 0.45);
          const dotRadius = displacement > 1 ? 2 : 1.2;

          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 102, 204, ${alpha})`;
          ctx.fill();
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, mounted]);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
    >
      {/* Real High-Performance Canvas Animation Engine */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Ambient Vignette Gradients */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[160px] opacity-20 pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.15)' }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full blur-[160px] opacity-15 pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.12)' }}
      />
    </div>
  );
}

export default ThemeBackgroundCanvas;
