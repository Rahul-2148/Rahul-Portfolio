'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Terminal, Sparkles, Send, FileText, Download } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterXIcon, InstagramIcon, LeetcodeIcon, CodeforcesIcon } from '@/components/ui/Icons';
import { personalInfo } from '@/lib/data/portfolio';
import { Spotlight } from '@/components/ui/Spotlight';
import { Magnetic } from '@/components/ui/Magnetic';
import { gsap } from '@/lib/motion/gsap';
import { EASINGS } from '@/lib/motion/easings';
import { isReducedMotion } from '@/lib/motion/scroll';

const ROLES = [
  'Full Stack Developer',
  'MERN Stack Developer',
  'Software Engineer',
  'AI Engineer',
  'Next.js & Real-Time Specialist',
];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  // Dynamic Typewriter Effect
  const [roleIndex, setRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageSrc, setImageSrc] = useState(personalInfo.avatarUrl || '/assets/rahul.jpg');

  // Sync avatar dynamically from database / Cloudinary
  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((json) => {
        if (json?.data?.personalInfo?.avatarUrl) {
          setImageSrc(json.data.personalInfo.avatarUrl);
        }
      })
      .catch((err) => {
        console.warn('Live avatar fetch error:', err);
      });
  }, []);

  useEffect(() => {
    const fullText = ROLES[roleIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting && currentText === fullText) {
      // Pause at full word before deleting
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && currentText === '') {
      // Switch to next word
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    } else {
      const speed = isDeleting ? 35 : 75;
      timer = setTimeout(() => {
        setCurrentText((prev) =>
          isDeleting ? fullText.substring(0, prev.length - 1) : fullText.substring(0, prev.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, roleIndex]);

  // Orchestrated GSAP Entrance Timeline
  useEffect(() => {
    if (isReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: EASINGS.smoothOut } });

      tl.fromTo(
        leftColRef.current?.children || [],
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, delay: 0.1 }
      ).fromTo(
        rightColRef.current,
        { opacity: 0, scale: 0.94, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8 },
        '-=0.4'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const toggleTerminal = () => {
    window.dispatchEvent(new CustomEvent('toggle-terminal'));
  };


  return (
    <section
      ref={containerRef}
      className="relative pt-2 sm:pt-4 pb-6 sm:pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden bg-dot-grid"
    >
      {/* ====================================================
          MULTI-COLOR SPOTLIGHT BEAMS (PURPLE, CYAN, BLUE)
          ==================================================== */}
      <Spotlight
        className="-top-40 left-0 md:left-24 md:-top-20 h-screen w-[138%] lg:w-[84%] animate-spotlight"
        fill="#9333ea"
      />
      <Spotlight
        className="top-10 left-full h-[80vh] w-[50vw] animate-spotlight"
        fill="#06b6d4"
      />
      <Spotlight
        className="left-40 top-24 h-[80vh] w-[50vw] animate-spotlight"
        fill="#3b82f6"
      />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Modern 2-Column Responsive Horizontal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Personal Introduction & Dynamic Typewriter */}
          <div ref={leftColRef} className="lg:col-span-7 space-y-6">
            {/* Live Availability Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-mono backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Available for Full-Time Roles &amp; Freelance Projects</span>
            </div>

            {/* Greeting & Headline */}
            <div className="space-y-2">
              <p className="text-sm font-mono text-purple-700 dark:text-purple-400 uppercase tracking-widest font-semibold">
                Hi there, Welcome to my portfolio 👋
              </p>
              <h1 className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-foreground leading-[1.08]">
                I&apos;m{' '}
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 dark:from-purple-400 dark:via-pink-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  {personalInfo.name}
                </span>
              </h1>
            </div>

            {/* Dynamic Typewriter Effect */}
            <div className="text-lg xs:text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight min-h-[1.4em] flex items-center flex-wrap">
              <span className="text-foreground mr-2.5">I am a</span>
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 dark:from-purple-400 dark:via-pink-400 dark:to-cyan-400 bg-clip-text text-transparent">
                {currentText}
              </span>
              <span className="inline-block w-[3px] h-[0.9em] ml-1.5 bg-indigo-600 dark:bg-cyan-400 animate-pulse align-middle rounded-full" />
            </div>

            {/* Clean, Authentic Bio */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl font-normal leading-relaxed">
              I engineer robust web applications, high-concurrency real-time architectures, and modern AI products. Turning scalable backend systems into smooth, intuitive user interfaces.
            </p>

            {/* Primary Action Buttons & Socials */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 pt-2">

              {/* Spinning Conic Gradient "Hire Me" Button */}
              <Magnetic strength={0.25}>
                <a
                  href={`mailto:${personalInfo.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="CONTACT"
                  className="group relative inline-flex items-center justify-center h-11 sm:h-12 overflow-hidden rounded-full p-[1.5px] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20 whitespace-nowrap shrink-0"
                >
                  <span className="absolute inset-[-1000%] animate-spin-conic bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#00d4ff_75%,#E2CBFF_100%)]" />
                  <span className="relative inline-flex flex-row items-center justify-center rounded-full bg-slate-950 px-5 sm:px-7 py-2.5 sm:py-3 text-sm font-semibold text-white backdrop-blur-3xl group-hover:bg-slate-900 transition-colors gap-2 whitespace-nowrap">
                    <Send className="w-4 h-4 text-purple-300 shrink-0" />
                    <span className="whitespace-nowrap">Hire Me</span>
                  </span>
                </a>
              </Magnetic>

              {/* View Projects Button */}
              <Magnetic strength={0.2}>
                <Link
                  href="#work"
                  className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/25 hover:shadow-purple-500/30 hover:scale-105 active:scale-95 inline-flex flex-row items-center gap-2 whitespace-nowrap shrink-0"
                  data-cursor="WORK"
                >
                  <span className="whitespace-nowrap">View Projects</span>
                  <ArrowUpRight className="w-4 h-4 shrink-0" />
                </Link>
              </Magnetic>

              {/* Download CV / View Resumes Button */}
              <Magnetic strength={0.2}>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-resume-modal'))}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-surface/90 hover:bg-surface-elevated border border-purple-500/30 hover:border-purple-500 text-foreground font-semibold text-sm transition-all hover:scale-105 active:scale-95 shadow-md shadow-purple-500/10 inline-flex flex-row items-center gap-2 group backdrop-blur-md whitespace-nowrap shrink-0 cursor-pointer"
                  data-cursor="CV"
                  title="View & Download Curated CVs"
                >
                  <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform shrink-0" />
                  <span className="whitespace-nowrap">Download CV</span>
                  <Download className="w-3.5 h-3.5 text-muted-foreground group-hover:text-cyan-400 transition-colors shrink-0" />
                </button>
              </Magnetic>

              {/* Social Quick Links with Authentic Brand Colors */}
              <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 flex-wrap">
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#24292F] hover:bg-[#1B1F23] border border-slate-700/80 text-white shadow-md shadow-black/40 hover:border-slate-400 hover:shadow-[0_0_16px_rgba(255,255,255,0.25)] transition-all hover:scale-110 active:scale-95 inline-flex items-center justify-center shrink-0"
                  title="GitHub Profile"
                  data-cursor="GITHUB"
                >
                  <GithubIcon className="w-4 h-4 text-white shrink-0" />
                </a>

                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0A66C2] hover:bg-[#004182] border border-[#0A66C2] text-white shadow-md shadow-[#0A66C2]/40 hover:shadow-[0_0_18px_rgba(10,102,194,0.6)] transition-all hover:scale-110 active:scale-95 inline-flex items-center justify-center shrink-0"
                  title="LinkedIn Profile"
                  data-cursor="LINKEDIN"
                >
                  <LinkedinIcon className="w-4 h-4 text-white shrink-0" />
                </a>

                {personalInfo.twitter && (
                  <a
                    href={personalInfo.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black hover:bg-neutral-900 border border-neutral-800 text-white shadow-md shadow-black/50 hover:border-neutral-500 hover:shadow-[0_0_16px_rgba(255,255,255,0.2)] transition-all hover:scale-110 active:scale-95 inline-flex items-center justify-center shrink-0"
                    title="X (Twitter) Profile"
                    data-cursor="TWITTER"
                  >
                    <TwitterXIcon className="w-4 h-4 text-white shrink-0" />
                  </a>
                )}

                {personalInfo.instagram && (
                  <a
                    href={personalInfo.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#f09433] via-[#bc1888] to-[#cc2366] hover:from-[#f58529] hover:via-[#dd2a7b] hover:to-[#8134af] text-white shadow-md shadow-[#bc1888]/40 hover:shadow-[0_0_20px_rgba(214,36,159,0.65)] transition-all hover:scale-110 active:scale-95 inline-flex items-center justify-center shrink-0 border border-white/20"
                    title="Instagram Profile"
                    data-cursor="INSTAGRAM"
                  >
                    <InstagramIcon className="w-4 h-4 text-white shrink-0" />
                  </a>
                )}

                {personalInfo.leetcode && (
                  <a
                    href={personalInfo.leetcode}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#262626] hover:bg-[#1f1f1f] border border-[#FFA116]/50 text-white shadow-md shadow-[#FFA116]/25 hover:border-[#FFA116] hover:shadow-[0_0_18px_rgba(255,161,22,0.5)] transition-all hover:scale-110 active:scale-95 inline-flex items-center justify-center shrink-0"
                    title="LeetCode Profile"
                    data-cursor="LEETCODE"
                  >
                    <LeetcodeIcon className="w-4 h-4 shrink-0" />
                  </a>
                )}

                {personalInfo.codeforces && (
                  <a
                    href={personalInfo.codeforces}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#181B26] hover:bg-[#202534] border border-[#1878F3]/50 text-white shadow-md shadow-[#1878F3]/25 hover:border-[#1878F3] hover:shadow-[0_0_18px_rgba(24,120,243,0.5)] transition-all hover:scale-110 active:scale-95 inline-flex items-center justify-center shrink-0"
                    title="Codeforces Profile"
                    data-cursor="CODEFORCES"
                  >
                    <CodeforcesIcon className="w-4 h-4 shrink-0" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={toggleTerminal}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-purple-100 dark:bg-purple-950/90 hover:bg-purple-200 dark:hover:bg-purple-900 border border-purple-300 dark:border-purple-500/50 text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-white shadow-md shadow-purple-500/10 dark:shadow-purple-500/25 hover:shadow-[0_0_18px_rgba(168,85,247,0.5)] transition-all hover:scale-110 active:scale-95 inline-flex items-center justify-center shrink-0 cursor-pointer"
                  data-cursor="CLI"
                  title="Open Developer Terminal"
                >
                  <Terminal className="w-4 h-4 text-purple-600 dark:text-purple-300 shrink-0" />
                </button>
              </div>

            </div>

            {/* Clean, Non-Bulky Highlight Badges */}
            <div className="grid grid-cols-1 min-[400px]:grid-cols-3 gap-2.5 sm:gap-3 pt-4 sm:pt-5 border-t border-border max-w-lg">
              <div className="p-2.5 sm:p-3 rounded-xl bg-card border border-border shadow-xs">
                <div className="text-xl sm:text-2xl font-black text-foreground">15+</div>
                <div className="text-[11px] font-mono text-muted-foreground mt-0.5">Projects Built</div>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-card border border-border shadow-xs">
                <div className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-cyan-400">Full-Stack</div>
                <div className="text-[11px] font-mono text-muted-foreground mt-0.5">MERN &amp; Next.js</div>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-card border border-border shadow-xs">
                <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">Real-Time</div>
                <div className="text-[11px] font-mono text-muted-foreground mt-0.5">WebSockets &amp; AI</div>
              </div>
            </div>
          </div>

          {/* Right Column: Beautiful Profile Avatar Showcase Card (Shifted up to fit single view) */}
          <div ref={rightColRef} className="lg:col-span-5 flex justify-center lg:justify-end lg:-translate-y-5 xl:-translate-y-7">
            <div className="relative w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[360px] xl:max-w-[380px] group">
              {/* Outer Glowing Gradient Frame */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 opacity-40 blur-xl group-hover:opacity-75 transition-opacity duration-700 animate-pulse" />

              <div className="relative p-1 rounded-3xl bg-gradient-to-tr from-purple-500/60 via-pink-500/40 to-cyan-400/60 backdrop-blur-xl shadow-2xl">
                <div className="bg-slate-950/95 rounded-[22px] p-2.5 sm:p-3.5 overflow-hidden relative">
                  {/* Avatar Image with Error Fallback */}
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-inner">
                    <Image
                      src={imageSrc}
                      alt={`${personalInfo.name} - Full Stack Developer`}
                      width={480}
                      height={480}
                      priority
                      className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                      onError={() => setImageSrc('/assets/rahul.jpg')}
                    />

                    {/* Gradient bottom overlay on image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                    {/* Profile Overlay details */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 p-2.5 sm:p-3 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/10 flex items-center justify-between">
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                          <span>{personalInfo.name}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        </div>
                        <div className="text-[10px] sm:text-[11px] font-mono text-purple-300">
                          Full-Stack &amp; AI Engineer
                        </div>
                      </div>

                      <div className="text-[10px] font-mono px-2 py-0.5 sm:py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        Available
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Technology Badge 1 (Top-Right) */}
              <div className="absolute -top-3 -right-3 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 border border-cyan-400/40 text-cyan-300 text-[11px] font-mono shadow-xl backdrop-blur-md animate-float">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>MERN &amp; Next.js</span>
              </div>

              {/* Floating Technology Badge 2 (Bottom-Left) */}
              <div className="absolute -bottom-3 -left-3 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 border border-purple-400/40 text-purple-300 text-[11px] font-mono shadow-xl backdrop-blur-md animate-float-reverse">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>Full-Stack &amp; AI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;


