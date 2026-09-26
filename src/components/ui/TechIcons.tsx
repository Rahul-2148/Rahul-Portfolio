import React from 'react';
import {
  Code2,
  Users,
  Palette,
  Briefcase,
  Headphones,
  Truck,
  Boxes,
  Factory,
  Workflow,
  LifeBuoy,
  Film,
} from 'lucide-react';

export interface TechIconProps {
  name: string;
  className?: string;
}

/* =========================================================================
   INDIVIDUAL AUTHENTIC BRAND SVG ICONS
   Pixel-perfect, lightweight, official brand colors & vector paths
   ========================================================================= */

export function NextJsIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 180" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="90" cy="90" r="90" fill="black" />
      <path
        d="M149.508 157.438L69.147 54H54V125.97H66.113V69.377L138.6 162.685C142.348 161.127 145.996 159.372 149.508 157.438Z"
        fill="url(#nextjs-grad-a)"
      />
      <rect x="115" y="54" width="12" height="72" fill="url(#nextjs-grad-b)" />
      <defs>
        <linearGradient id="nextjs-grad-a" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="nextjs-grad-b" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ViteIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 257" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="vite-grad-a" x1="-0.828%" x2="57.636%" y1="7.652%" y2="78.411%">
          <stop offset="0%" stopColor="#41D1FF" />
          <stop offset="100%" stopColor="#BD34FE" />
        </linearGradient>
        <linearGradient id="vite-grad-b" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%">
          <stop offset="0%" stopColor="#FFEA83" />
          <stop offset="8.333%" stopColor="#FFDD35" />
          <stop offset="100%" stopColor="#FFA800" />
        </linearGradient>
      </defs>
      <path
        fill="url(#vite-grad-a)"
        d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 002.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62z"
      />
      <path
        fill="url(#vite-grad-b)"
        d="M185.432.121L97.44 17.653a3.268 3.268 0 00-2.634 3.014l-5.474 92.456a3.27 3.27 0 003.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.044c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.637-3.91-3.992l10.686-47.904c.54-2.421-1.583-4.576-4.004-4.072l-1.688.352z"
      />
    </svg>
  );
}

export function AwsIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.2 9.5c-.3.6-.8 1-1.5 1-.9 0-1.4-.7-1.4-1.6 0-1 .6-1.7 1.5-1.7.6 0 1.1.4 1.4 1v-3.2H6.9c-2.4 0-3.9 1.6-3.9 3.8 0 2.2 1.4 3.7 3.8 3.7.8 0 1.6-.3 2.1-.8v.7h2v-8h-2.7v4.4zm6.6-4.5h-1.9l-1.9 6.8h1.9l.4-1.6h2.2l.4 1.6h2l-2.1-6.8zm-1.1 3.9l.7-2.6.7 2.6h-1.4zm8.6-3.9h-1.9l-1.2 5.1-1.3-5.1h-1.6l-1.3 5.1-1.2-5.1h-1.9l2.1 7.2h1.8l1.3-4.7 1.3 4.7h1.8l2-7.2z"
        className="fill-[#232F3E] dark:fill-white"
      />
      <path
        d="M19.7 16.9c-2.7 1.9-6.6 2.9-10.1 2.9-4.8 0-9.1-1.7-12.4-4.5-.3-.2-.3-.6 0-.8.3-.3.8-.2 1.1.1 3 2.5 7 4 11.4 4 3.1 0 6.6-.9 9.1-2.5.4-.3.9 0 .9.3z"
        fill="#FF9900"
      />
      <path
        d="M21 15.6c-.3-.4-2-.2-3-.1-.3 0-.4-.3-.1-.5 1.7-1.3 3.6-.9 3.8-.7.3.3 0 2.2-1.6 3.6-.2.2-.5.1-.4-.2.4-.8.9-1.8 1.3-2.1z"
        fill="#FF9900"
      />
    </svg>
  );
}

export function AzureIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="azure-beam" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0078D4" />
          <stop offset="100%" stopColor="#005BA1" />
        </linearGradient>
        <linearGradient id="azure-fold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5EA0EF" />
          <stop offset="100%" stopColor="#0078D4" />
        </linearGradient>
      </defs>
      <path
        d="M13.06 3.48a.85.85 0 00-.76.47L3.43 19.38a.85.85 0 00.76 1.23h3.58a.85.85 0 00.76-.47l4.53-8.86 4.08 3.59-4.08 7.99a.85.85 0 00.76 1.23h6.4a.85.85 0 00.76-1.23L13.82 3.95a.85.85 0 00-.76-.47z"
        fill="url(#azure-beam)"
      />
      <path
        d="M14.77 15.34l-3.32-2.92 4.46-8.73a.85.85 0 01.76-.47h3.58a.85.85 0 01.76 1.23l-6.24 10.89z"
        fill="url(#azure-fold)"
      />
    </svg>
  );
}

export function ReactIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="-11.5 -10.23174 23 20.46348" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
      <g stroke="#61DAFB" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}

export function TypeScriptIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="16" fill="#3178C6" />
      <path
        d="M68 40h-40v14h13v50h14V54h13V40zm24.6 28.5c5.3 0 9.8 1.6 13.5 4.8 3.7 3.2 5.6 7.6 5.6 13.2 0 6-2 10.7-6 14-4 3.3-9.5 5-16.5 5-4.4 0-8.6-.6-12.5-1.9V90.4c3.8 1.8 7.7 2.7 11.7 2.7 3.6 0 6.3-.7 8.2-2.1 1.9-1.4 2.8-3.4 2.8-6 0-2.2-.8-4-2.4-5.3-1.6-1.3-4.2-2.3-7.7-3.1-5.7-1.3-9.9-3.2-12.6-5.7-2.7-2.5-4-6.1-4-10.8 0-5.4 1.8-9.7 5.5-12.8 3.7-3.1 8.6-4.6 14.8-4.6 4.3 0 8.2.6 11.7 1.8v12.8c-3.5-1.5-7.1-2.2-10.8-2.2-3.1 0-5.5.6-7.1 1.8-1.6 1.2-2.4 2.9-2.4 5.1 0 2 .8 3.6 2.4 4.8 1.6 1.2 4.1 2.2 7.5 3z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function JavaScriptIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="16" fill="#F7DF1E" />
      <path
        d="M67.3 90.7c2.3 3.8 5.6 6.3 10.8 6.3 4.5 0 7.4-2.2 7.4-5.3 0-3.7-3-5-8.1-7.2l-2.8-1.2c-8-3.4-13.3-7.7-13.3-16.9 0-8.3 6.4-14.7 16.5-14.7 7.2 0 12.3 2.5 16 8.9l-7.7 4.9c-1.7-3.1-3.6-4.3-8.3-4.3-3.6 0-5.9 2.2-5.9 4.9 0 3.3 2.4 4.6 7.4 6.8l2.8 1.2c9.5 4.1 14.2 8.4 14.2 17.5 0 9.9-7.7 15.6-18.4 15.6-10.4 0-16.9-5-20.2-11.7l7.6-4.9zm-38.8.8c1.8 3.1 3.5 5.7 7.5 5.7 3.9 0 6.4-1.6 6.4-7.7V52.3h10.9v37.1c0 11.5-6.8 16.9-16.8 16.9-9 0-14.3-4.8-17.3-10.6l9.3-4.2z"
        fill="#000000"
      />
    </svg>
  );
}

export function NodeJsIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 289" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M128 0L247.9 69.2v138.6L128 277 8.1 207.8V69.2L128 0z" fill="#5FA04E" />
      <path d="M128 25.6L225.8 82v112.8L128 251.2 30.2 194.8V82L128 25.6z" fill="#222222" />
      <path
        d="M136.2 170.8c-1.9 1.1-4.2 1.6-6.7 1.6-5.8 0-9.2-2.9-9.2-7.9v-25.7h15.9v-10.8h-15.9v-13h-12.7v13h-8.8v10.8h8.8v26.5c0 12.1 7.6 18.7 19.8 18.7 5.1 0 9.7-1 12.7-2.6l-3.9-10.6zm42.7-32.5c-15.2 0-25 10.9-25 25.4 0 14.8 9.9 25.4 25.2 25.4 15.2 0 25.2-10.7 25.2-25.4 0-14.6-9.9-25.4-25.4-25.4zm0 39.5c-7.9 0-12.6-6.2-12.6-14.1 0-7.9 4.7-14.1 12.6-14.1 7.8 0 12.5 6.2 12.5 14.1 0 7.9-4.7 14.1-12.5 14.1z"
        fill="#5FA04E"
      />
    </svg>
  );
}

export function ExpressIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="5" fill="#2A2A2A" />
      <path
        d="M5 8h4.5l2 3.5 2-3.5H18l-3.2 5 3.2 5h-4.5l-2-3.5-2 3.5H5l3.2-5L5 8z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function MongoDbIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 1.5C11.5 3 7 7.5 7 13.5c0 3.7 2.4 6.8 5 8.5.5-1.5 1-4 1-7V1.5z" fill="#47A248" />
      <path d="M12 1.5C12.5 3 17 7.5 17 13.5c0 3.7-2.4 6.8-5 8.5-.5-1.5-1-4-1-7V1.5z" fill="#499D4A" />
      <path
        d="M12 22c-.2 0-.4 0-.5-.1-.3-.2-.5-.5-.5-.9v-6.5c0-.6.4-1 1-1s1 .4 1 1V21c0 .4-.2.7-.5.9-.2.1-.3.1-.5.1z"
        fill="#3F8C40"
      />
    </svg>
  );
}

export function PostgresIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="#336791" />
      <path
        d="M15.5 16.5c-.3.3-.8.5-1.4.5-.9 0-1.5-.4-2.1-1.1l-1 1.2c-.2.3-.6.5-1 .5-.7 0-1.3-.6-1.3-1.3V9.9c0-.5.4-.9.9-.9h4.4c1.4 0 2.5.4 3.2 1.2.7.7 1.1 1.8 1.1 3 0 1.5-.6 2.8-1.7 3.7z"
        fill="#FFFFFF"
      />
      <path
        d="M14 11.2h-2.5v4.2H13v-1.8h1c1 0 1.6-.6 1.6-1.2 0-.7-.6-1.2-1.6-1.2z"
        fill="#336791"
      />
    </svg>
  );
}

export function RedisIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M1.5 7.5L12 2l10.5 5.5L12 13 1.5 7.5z" fill="#DC382D" />
      <path
        d="M1.5 12L12 17.5 22.5 12M1.5 16.5L12 22l10.5-5.5"
        stroke="#A82820"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="7.5" r="1.5" fill="#FFFFFF" />
    </svg>
  );
}

export function DockerIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.98 7.37H11.7V9.6h2.28V7.37zm2.74 0h-2.28V9.6h2.28V7.37zm-5.48 0H8.96V9.6h2.28V7.37zm2.74-2.69H11.7v2.23h2.28V4.68zm2.74 0h-2.28v2.23h2.28V4.68zm-5.48 0H8.96v2.23h2.28V4.68zm-2.74 2.69H6.22V9.6h2.28V7.37zm8.22 0h-2.28V9.6h2.28V7.37zm2.74 0h-2.28V9.6h2.28V7.37zm4.18 3.51c-.34-.23-1.07-.37-1.92-.23-.22-.84-.79-1.55-1.53-2.01l-.54-.34-.35.53c-.56.84-.71 1.95-.44 2.91-.42.23-.97.35-1.59.35H1.47c-.24 0-.44.2-.44.44.23 2.95 1.55 5.56 3.74 7.22 2.11 1.6 4.77 2.45 7.6 2.45 6.77 0 10.63-4.8 10.63-10.33 0-.32 0-.64-.04-.96.65-.4 1.15-.99 1.4-1.68l.21-.61-.59.26z"
        fill="#2496ED"
      />
    </svg>
  );
}

export function SocketIoIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="#010101" stroke="#00D4FF" strokeWidth="1.5" />
      <path d="M10 6L7 13h4l-2 5 7-8h-4.5L14 6h-4z" fill="#FFFFFF" />
    </svg>
  );
}

export function TailwindIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z"
        fill="#06B6D4"
      />
    </svg>
  );
}

export function PythonIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.92 2.05c-4.88 0-4.57 2.11-4.57 2.11l.01 2.18h4.65v.66H5.43s-3.05.35-3.05 4.54 2.67 4.36 2.67 4.36h1.59v-2.22s-.09-2.67 2.63-2.67h4.52s2.54.04 2.54-2.47V4.54s.38-2.49-4.41-2.49zm-2.49 1.4c.46 0 .83.37.83.83s-.37.83-.83.83-.83-.37-.83-.83.37-.83.83-.83z"
        fill="#3776AB"
      />
      <path
        d="M12.08 21.95c4.88 0 4.57-2.11 4.57-2.11l-.01-2.18h-4.65v-.66h6.58s3.05-.35 3.05-4.54-2.67-4.36-2.67-4.36h-1.59v2.22s.09 2.67-2.63 2.67h-4.52s-2.54-.04-2.54 2.47v3.98s-.38 2.49 4.41 2.49zm2.49-1.4c-.46 0-.83-.37-.83-.83s.37-.83.83-.83.83.37.83.83-.37.83-.83.83z"
        fill="#FFD438"
      />
    </svg>
  );
}

export function ReduxIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10.5" fill="#764ABC" opacity="0.15" />
      <path
        d="M15.5 4.5c1.4.8 2.4 2.1 2.8 3.6.4 1.5.2 3.1-.5 4.4l-1.2 2.1c-.4.7-1 1.3-1.7 1.7s-1.5.6-2.3.6c-.8 0-1.6-.2-2.3-.6s-1.3-1-1.7-1.7l-1.2-2.1c-.7-1.3-.9-2.9-.5-4.4.4-1.5 1.4-2.8 2.8-3.6 1.4-.8 3-.9 4.5-.4s2.7 1.6 3.3 3.1"
        stroke="#764ABC"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="2.5" fill="#764ABC" />
    </svg>
  );
}

export function ZustandIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="13" r="7" fill="#443E38" />
      <circle cx="7" cy="8" r="3" fill="#443E38" />
      <circle cx="17" cy="8" r="3" fill="#443E38" />
      <circle cx="7" cy="8" r="1.5" fill="#E8B898" />
      <circle cx="17" cy="8" r="1.5" fill="#E8B898" />
      <ellipse cx="12" cy="15" rx="3.5" ry="2.5" fill="#E8B898" />
      <ellipse cx="12" cy="14" rx="1.2" ry="0.8" fill="#1A1817" />
      <circle cx="9.5" cy="12" r="0.8" fill="#FFFFFF" />
      <circle cx="14.5" cy="12" r="0.8" fill="#FFFFFF" />
    </svg>
  );
}

export function GitIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21.62 10.95L13.05 2.38a1.48 1.48 0 00-2.1 0L8.85 4.48l2.65 2.65a1.76 1.76 0 011.83 1.83l2.55 2.55a1.76 1.76 0 11-1.06 1.02l-2.38-2.38v5.39a1.76 1.76 0 11-1.5 0V9.88a1.75 1.75 0 01-.94-.78L7.38 11.7l14.24 14.24a1.48 1.48 0 002.1 0l6.9-6.9a1.48 1.48 0 000-2.1l-9-9.01z"
        fill="#F05032"
      />
    </svg>
  );
}

export function GitHubIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export function CloudinaryIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM13 14c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z"
        fill="#3448C5"
      />
    </svg>
  );
}

export function RazorpayIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 3h11.5c3.5 0 5.5 2 5.5 5 0 2.2-1.2 3.8-3.2 4.5L21 21h-4.8l-2.6-7.2H9.2V21H4V3zm5.2 7h5.8c1.2 0 2.2-.7 2.2-1.9s-1-1.9-2.2-1.9H9.2V10z"
        fill="#0082FB"
      />
      <path d="M11 12l5 9h-3.5L8.5 12H11z" fill="#024D9C" />
    </svg>
  );
}

export function StripeIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="5" fill="#635BFF" />
      <path
        d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C17.652.795 15.034 0 12.097 0 6.643 0 2.8 2.871 2.8 7.363c0 6.452 8.784 5.378 8.784 8.163 0 1.055-.86 1.501-2.276 1.501-2.583 0-5.497-1.196-7.391-2.274L1 20.354C3.178 21.411 6.355 22 9.532 22c5.845 0 9.878-2.853 9.878-7.475 0-6.732-8.835-5.594-8.835-8.243z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function VercelIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L24 22H0L12 2Z" />
    </svg>
  );
}

export function ClaudeIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z"
        fill="#D97706"
      />
    </svg>
  );
}

export function DeepSeekIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 57 43" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M55.6128,3.4712c-.5953-.2917-.8517.2642-1.1998.5466-.1191.0911-.2198.2095-.3206.3188-.8701.9292-1.8867,1.5398-3.2148,1.4668-1.9417-.1094-3.5995.5012-5.065,1.9863-.3114-1.8313-1.3463-2.9248-2.9217-3.6262-.8242-.3645-1.6577-.729-2.2348-1.5217-.403-.5647-.5129-1.1934-.7144-1.813-.1283-.3735-.2565-.7563-.687-.8201-.4671-.0728-.6503.3188-.8335.647-.7327,1.3394-1.0166,2.8154-.9892,4.3096.0641,3.3621,1.4838,6.0406,4.3047,7.9449.3206.2187.403.4372.3023.7563-.1924.656-.4214,1.2937-.6228,1.9497-.1283.4192-.3207.5103-.7694.3279-1.5479-.6467-2.8852-1.6035-4.0667-2.7605-2.0058-1.9407-3.8193-4.0818-6.0815-5.7583-.5312-.3918-1.0625-.7561-1.6121-1.1025-2.3081-2.2412.3023-4.0818.9068-4.3003.6319-.2278.2198-1.0115-1.8227-1.0022-2.0425.009-3.9109.6924-6.2922,1.6035-.348.1367-.7145.2368-1.09.3188-2.1615-.4099-4.4055-.5012-6.7502-.2368-4.4147.4919-7.9408,2.5784-10.5328,6.1409C.1914,13.1289-.5413,17.9941.3563,23.0691c.9434,5.3481,3.6727,9.7761,7.8676,13.2385,4.3506,3.5896,9.3606,5.3481,15.0758,5.011,3.4713-.2004,7.3364-.665,11.6961-4.355,1.099.5467,2.2531.7652,4.1674.9292,1.4746.1367,2.8943-.0728,3.9933-.3005,1.7219-.3645,1.6029-1.959.9801-2.2505-5.0466-2.3506-3.9385-1.394-4.9459-2.1685,2.5645-3.0339,6.4297-6.1865,7.9409-16.4001.119-.8108.0183-1.3211,0-1.9771-.0092-.4008.0824-.5556.5404-.6013,1.2639-.1458,2.4912-.4919,3.6178-1.1115,3.2698-1.7857,4.5886-4.7195,4.9-8.2364.0459-.5376-.0091-1.0935-.577-1.3757ZM27.119,35.123c-4.8909-3.8447-7.263-5.1113-8.2431-5.0566-.9159.0547-.751,1.1025-.5496,1.7859.2107.6741.4855,1.1389.8701,1.731.2656.3918.4489.9748-.2655,1.4123-1.5754.9749-4.314-.3281-4.4423-.3918-3.1872-1.877-5.8525-4.3553-7.7302-7.7444-1.8135-3.262-2.8667-6.7605-3.0408-10.4961-.0458-.9019.2198-1.221,1.1174-1.3848,1.1815-.2187,2.3997-.2644,3.5812-.0913,4.9918.729,9.2415,2.9612,12.8043,6.4963,2.0333,2.0135,3.572,4.419,5.1566,6.7696,1.6852,2.4963,3.4987,4.8745,5.8068,6.8242.8151.6833,1.4654,1.2026,2.0882,1.5854-1.8775.2095-5.01.2552-7.1532-1.4397ZM29.4637,20.0442c0-.4009.3206-.7197.7237-.7197.0916,0,.174.018.2473.0453.1008.0366.1924.0913.2656.1731.1283.1277.2015.3098.2015.5012,0,.4009-.3205.7197-.7234.7197s-.7145-.3188-.7145-.7197ZM36.7452,23.7798c-.4671.1914-.9342.3552-1.383.3735-.6961.0364-1.4563-.2461-1.8684-.5923-.6411-.5376-1.0991-.8381-1.2914-1.7766-.0825-.4009-.0367-1.0205.0367-1.3757.1648-.7654-.0184-1.2573-.5587-1.7039-.4397-.3645-.9984-.4646-1.6121-.4646-.229,0-.4395-.1003-.5953-.1823-.2565-.1275-.467-.4464-.2656-.8382.0641-.1274.3756-.4373.4489-.4919.8335-.4739,1.7952-.3189,2.6836.0364.8244.3371,1.4472.9567,2.3447,1.8313.9159,1.0568,1.0807,1.3486,1.6028,2.1411.4123.6196.7878,1.2573,1.0442,1.9863.1557.4556-.0458.8291-.5862,1.0569Z"
        fill="#4D6BFE"
      />
    </svg>
  );
}

export function GeminiIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2C12 7.52 7.52 12 2 12c5.52 0 10 4.48 10 10 0-5.52 4.48-10 10-10-5.52 0-10-4.48-10-10z"
        fill="url(#gemini-icon-grad)"
      />
      <defs>
        <linearGradient id="gemini-icon-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4E82EE" />
          <stop offset="0.5" stopColor="#9B72CF" />
          <stop offset="1" stopColor="#E056FD" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function GroqIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 201 201" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="201" height="201" rx="44" fill="#F55036" />
      <path
        fill="#FFFFFF"
        d="m128 49 1.895 1.52C136.336 56.288 140.602 64.49 142 73c.097 1.823.148 3.648.161 5.474l.03 3.247.012 3.482.017 3.613c.01 2.522.016 5.044.02 7.565.01 3.84.041 7.68.072 11.521.007 2.455.012 4.91.016 7.364l.038 3.457c-.033 11.717-3.373 21.83-11.475 30.547-4.552 4.23-9.148 7.372-14.891 9.73l-2.387 1.055c-9.275 3.355-20.3 2.397-29.379-1.13-5.016-2.38-9.156-5.17-13.234-8.925 3.678-4.526 7.41-8.394 12-12l3.063 2.375c5.572 3.958 11.135 5.211 17.937 4.625 6.96-1.384 12.455-4.502 17-10 4.174-6.784 4.59-12.222 4.531-20.094l.012-3.473c.003-2.414-.005-4.827-.022-7.241-.02-3.68 0-7.36.026-11.04-.003-2.353-.008-4.705-.016-7.058l.025-3.312c-.098-7.996-1.732-13.21-6.681-19.47-6.786-5.458-13.105-8.211-21.914-7.792-7.327 1.188-13.278 4.7-17.777 10.601C75.472 72.012 73.86 78.07 75 85c2.191 7.547 5.019 13.948 12 18 5.848 3.061 10.892 3.523 17.438 3.688l2.794.103c2.256.082 4.512.147 6.768.209v16c-16.682.673-29.615.654-42.852-10.848-8.28-8.296-13.338-19.55-13.71-31.277.394-9.87 3.93-17.894 9.562-25.875l1.688-2.563C84.698 35.563 110.05 34.436 128 49Z"
      />
    </svg>
  );
}

export function GrokIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M9.27 15.29l7.978-5.897c.391-.29.95-.177 1.137.272.98 2.369.542 5.215-1.41 7.169-1.951 1.954-4.667 2.382-7.149 1.406l-2.711 1.257c3.889 2.661 8.611 2.003 11.562-.953 2.341-2.344 3.066-5.539 2.388-8.42l.006.007c-.983-4.232.242-5.924 2.75-9.383.06-.082.12-.164.179-.248l-3.301 3.305v-.01L9.267 15.292M7.623 16.723c-2.792-2.67-2.31-6.801.071-9.184 1.761-1.763 4.647-2.483 7.166-1.425l2.705-1.25a7.808 7.808 0 00-1.829-1A8.975 8.975 0 005.984 5.83c-2.533 2.536-3.33 6.436-1.962 9.764 1.022 2.487-.653 4.246-2.34 6.022-.599.63-1.199 1.259-1.682 1.925l7.62-6.815" />
    </svg>
  );
}

export function JwtIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="url(#jwt-icon-grad)" strokeWidth="2.5" />
      <path d="M8.5 8.5h7v2.2h-2.3v5.8h-2.4v-5.8H8.5V8.5z" fill="currentColor" />
      <defs>
        <linearGradient id="jwt-icon-grad" x1="3" y1="3" x2="21" y2="21">
          <stop stopColor="#FB015B" />
          <stop offset="0.5" stopColor="#D63AFF" />
          <stop offset="1" stopColor="#00B9F1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function DjangoIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="4" fill="#092E20" />
      <path
        d="M12.8 6.5h2.1V15c0 2.2-.9 3.5-3.3 3.5-.8 0-1.5-.1-2.1-.3v-1.7c.4.2.9.3 1.4.3 1.2 0 1.9-.6 1.9-1.9V6.5zm-5 4.5c.9 0 1.5.5 1.8 1.1V11h2v6.5h-2v-.8c-.4.6-1.1 1-1.9 1-1.7 0-2.8-1.5-2.8-3.6 0-2.2 1.1-3.6 2.9-3.6zm.5 5.5c.9 0 1.4-.7 1.4-1.9s-.5-1.9-1.4-1.9-1.4.7-1.4 1.9.5 1.9 1.4 1.9z"
        fill="#44B78B"
      />
    </svg>
  );
}

export function FastApiIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#009688" />
      <path d="M11 6l-5 8h4.5l-1.5 5 6-9h-4.5l1.5-4h-1z" fill="#FFFFFF" />
    </svg>
  );
}

export function CppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.25 15.65L13.72 20.6a3.46 3.46 0 01-3.44 0L1.75 15.65a3.48 3.48 0 01-1.75-3.02v-1.26c0-1.26.67-2.42 1.75-3.02L10.28 3.4a3.46 3.46 0 013.44 0l8.53 4.95a3.48 3.48 0 011.75 3.02v1.26c0 1.26-.67 2.42-1.75 3.02z"
        fill="#00599C"
      />
      <path
        d="M10.2 14.5a3.5 3.5 0 01-2.5-.9 3.3 3.3 0 010-4.8 3.5 3.5 0 012.5-.9c1 0 1.9.4 2.5 1.1l-1.3 1.1c-.3-.4-.7-.6-1.2-.6a1.8 1.8 0 00-1.3.5 1.7 1.7 0 000 2.5c.3.3.8.5 1.3.5.5 0 .9-.2 1.2-.6l1.3 1.1c-.6.7-1.5 1.1-2.5 1.1z"
        fill="#FFFFFF"
      />
      <path d="M14.2 11h.8v-.8h.8v.8h.8v.8h-.8v.8h-.8v-.8h-.8V11z" fill="#FFFFFF" />
      <path d="M17.4 11h.8v-.8h.8v.8h.8v.8h-.8v.8h-.8v-.8h-.8V11z" fill="#FFFFFF" />
    </svg>
  );
}

export function FlaskIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 3h6v2h-1v4.25l4.5 7.5A2.5 2.5 0 0116.35 20.5H7.65A2.5 2.5 0 015.5 16.75l4.5-7.5V5H9V3z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.8 15.5h8.4"
        stroke="#00C49F"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="10" cy="18" r="0.75" fill="#00C49F" />
      <circle cx="13.5" cy="17.5" r="0.6" fill="#00C49F" />
    </svg>
  );
}

export function AntigravityIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="agy-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4285F4" />
          <stop offset="33%" stopColor="#34A853" />
          <stop offset="66%" stopColor="#FBBC05" />
          <stop offset="100%" stopColor="#EA4335" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="9" stroke="url(#agy-grad)" strokeWidth="2" strokeDasharray="3 2" />
      <path d="M12 4L14.2 9.8L20 12L14.2 14.2L12 20L9.8 14.2L4 12L9.8 9.8L12 4Z" fill="url(#agy-grad)" />
      <circle cx="12" cy="12" r="2.2" fill="#FFFFFF" />
    </svg>
  );
}

export function WindsurfIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="windsurf-grad" x1="2" y1="4" x2="22" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00C896" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
      </defs>
      <path
        d="M3.5 14C6 9 9.5 6.5 14 7C11.5 9.5 11 12 12.5 14C14 16 17.5 16.5 21 13C19 17.5 15 20 10.5 19.5C7 19 4.8 17 3.5 14Z"
        fill="url(#windsurf-grad)"
      />
      <path
        d="M7 8C9 5 12.5 3.5 16.5 4C14.5 6 14 8 15.5 9.5C17 11 20 11.5 23 8.5C21.5 12 18 14 14 13.5C11 13 9 11 7 8Z"
        fill="#00EAAC"
        opacity="0.85"
      />
    </svg>
  );
}

export function DevinIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="5" fill="#0D1117" />
      <rect x="1" y="1" width="22" height="22" rx="4" stroke="#10B981" strokeWidth="1.5" strokeOpacity="0.4" />
      <path d="M7 7.5L12 12L7 16.5" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="13" y1="16.5" x2="17" y2="16.5" stroke="#06B6D4" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function WebRtcIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="#FF6B6B" strokeWidth="2" />
      <circle cx="12" cy="12" r="5" fill="#4D96FF" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="#6BCB77" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function MongooseIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C7 6 5 11 5 15c0 4 3 7 7 7s7-3 7-7c0-4-2-9-7-13z" fill="#880000" />
      <path d="M12 5v14" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Html5Icon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M3 2l1.6 18.2L12 22l7.4-1.8L21 2H3z" fill="#E34F26" />
      <path d="M12 3.8v16.3l5.8-1.5 1.3-14.8H12z" fill="#EF652A" />
      <path d="M12 8.4H7.8l.3 3.4H12V8.4zm0 5.4H9.6l.2 2.3 2.2.6v-2.9z" fill="#EBEBEB" />
      <path d="M12 8.4h4.2l-.4 4.5-3.8 1.1v-2.3l1.8-.5.2-1.7H12V8.4z" fill="#FFFFFF" />
    </svg>
  );
}

export function Css3Icon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M3 2l1.6 18.2L12 22l7.4-1.8L21 2H3z" fill="#1572B6" />
      <path d="M12 3.8v16.3l5.8-1.5 1.3-14.8H12z" fill="#33A9DC" />
      <path d="M12 8.4H7.8l.3 3.4H12V8.4zm0 5.4H9.6l.2 2.3 2.2.6v-2.9z" fill="#EBEBEB" />
      <path d="M12 8.4h4.2l-.4 4.5-3.8 1.1v-2.3l1.8-.5.2-1.7H12V8.4z" fill="#FFFFFF" />
    </svg>
  );
}

export function LinuxIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="14" rx="6" ry="7" fill="#F8B800" />
      <ellipse cx="12" cy="14" rx="4.5" ry="6" fill="#000000" />
      <ellipse cx="12" cy="15.5" rx="3.5" ry="4" fill="#FFFFFF" />
      <circle cx="10.5" cy="8" r="3" fill="#000000" />
      <circle cx="13.5" cy="8" r="3" fill="#000000" />
      <circle cx="10.5" cy="8" r="1" fill="#FFFFFF" />
      <circle cx="13.5" cy="8" r="1" fill="#FFFFFF" />
      <ellipse cx="12" cy="10" rx="1.8" ry="1.2" fill="#FFA500" />
    </svg>
  );
}

export function VsCodeIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.27a1 1 0 0 0-.005 1.417L4.54 12 .322 15.313a1 1 0 0 0 .005 1.417l1.322 1.212a1 1 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zM18 17.683L9.66 12 18 6.317v11.366z" fill="#007ACC" />
    </svg>
  );
}

export function ExcelIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="4" fill="#107C41" />
      <path d="M6.5 6.5h11v11h-11z" fill="#185C37" />
      <path d="M15.5 15.5h-2l-1.5-2.5-1.5 2.5h-2l2.4-3.5-2.2-3.5h2l1.3 2.3 1.3-2.3h2l-2.2 3.5 2.4 3.5z" fill="#FFFFFF" />
    </svg>
  );
}

export function PowerBiIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M19 4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-2.5a.5.5 0 0 1-.5-.5V4.5a.5.5 0 0 1 .5-.5H19z" fill="#F2C811" />
      <path d="M13.5 8.5a1 1 0 0 1 1 1v9.5a1 1 0 0 1-1 1h-2.5a.5.5 0 0 1-.5-.5V9a.5.5 0 0 1 .5-.5h2.5z" fill="#E6AD10" />
      <path d="M8 13a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5.5a.5.5 0 0 1-.5-.5V13.5a.5.5 0 0 1 .5-.5H8z" fill="#C98A0C" />
    </svg>
  );
}

export function FlipkartIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="5" fill="#2874F0" />
      <path d="M14.5 5.5h-5a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h2.5a.5.5 0 0 0 .5-.5v-4h2a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-2V8.5h2.5a.5.5 0 0 0 .5-.5V6a.5.5 0 0 0-.5-.5z" fill="#FFE500" />
      <path d="M17.5 12h-1.5l1.2-4.5h-2.2l-.5 2h-1l.8-3H18a.5.5 0 0 1 .5.6l-1 4.9z" fill="#FFFFFF" opacity="0.9" />
    </svg>
  );
}

export function MsOfficeIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M14.5 2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5L14.5 2z" fill="#EA3E23" />
      <path d="M14 2v6.5H20.5" fill="#FA826E" />
      <path d="M7 13h10v1.5H7zm0 3h7v1.5H7z" fill="#FFFFFF" />
    </svg>
  );
}

export function ShadcnIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 256" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <line x1="208" y1="128" x2="128" y2="208" stroke="currentColor" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="192" y1="40" x2="40" y2="192" stroke="currentColor" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MaterialUiIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M0 2.475v10.39l3 1.733V7.67l6 3.465 6-3.465v3.465l3-1.733V2.475L12 0 6 3.465 0 2.475z" fill="#007FFF" />
      <path d="M3 5.94v8.66l6 3.465V9.405l-6-3.465z" fill="#0059B2" />
      <path d="M15 9.405v8.66l6-3.465V5.94l-6 3.465z" fill="#00B0FF" />
      <path d="M9 12.87v8.655l3 1.733 3-1.733V12.87l-3 1.732-3-1.732z" fill="#007FFF" />
    </svg>
  );
}

export function BootstrapIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="5" fill="#7952B3" />
      <path
        d="M8.2 6.5h4.6c1.6 0 2.7.4 3.4 1.1.7.7 1 1.6 1 2.7 0 .9-.3 1.6-.8 2.2-.5.5-1.2.9-2.1 1 1.1.2 1.9.6 2.5 1.3.6.7.9 1.6.9 2.7 0 1.2-.4 2.2-1.2 3-.8.8-2 1.2-3.7 1.2H8.2V6.5zm2.4 4.3h2.1c.8 0 1.4-.2 1.7-.5.4-.3.6-.8.6-1.4 0-.6-.2-1.1-.6-1.4-.4-.3-1-.5-1.7-.5h-2.1v3.8zm0 2.1v4.3h2.4c.9 0 1.6-.2 2.1-.6.5-.4.7-1 .7-1.7 0-.7-.2-1.2-.7-1.5-.5-.4-1.2-.5-2.1-.5h-2.4z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

/* =========================================================================
   INTELLIGENT LOOKUP HELPER & COMPONENT
   ========================================================================= */

export function TechIcon({ name, className = 'w-4 h-4' }: TechIconProps) {
  const norm = name.trim().toLowerCase();

  // Next.js
  if (norm.includes('next') || norm === 'next.js') {
    return <NextJsIcon className={className} />;
  }

  // Vite
  if (norm.includes('vite')) {
    return <ViteIcon className={className} />;
  }

  // AWS
  if (norm.includes('aws') || norm.includes('amazon')) {
    return <AwsIcon className={className} />;
  }

  // Microsoft Azure
  if (norm.includes('azure')) {
    return <AzureIcon className={className} />;
  }

  // React
  if (norm.includes('react') && !norm.includes('webrtc')) {
    return <ReactIcon className={className} />;
  }

  // TypeScript
  if (norm === 'ts' || norm.includes('typescript')) {
    return <TypeScriptIcon className={className} />;
  }

  // JavaScript
  if (norm === 'js' || norm.includes('javascript')) {
    return <JavaScriptIcon className={className} />;
  }

  // Node.js
  if (norm.includes('node')) {
    return <NodeJsIcon className={className} />;
  }

  // Express
  if (norm.includes('express')) {
    return <ExpressIcon className={className} />;
  }

  // MongoDB
  if (norm.includes('mongo') && !norm.includes('mongoose')) {
    return <MongoDbIcon className={className} />;
  }

  // Mongoose
  if (norm.includes('mongoose')) {
    return <MongooseIcon className={className} />;
  }

  // PostgreSQL
  if (norm.includes('postgres') || norm.includes('psql') || norm.includes('sql')) {
    return <PostgresIcon className={className} />;
  }

  // Redis
  if (norm.includes('redis')) {
    return <RedisIcon className={className} />;
  }

  // Docker
  if (norm.includes('docker')) {
    return <DockerIcon className={className} />;
  }

  // Socket.IO / WebSockets
  if (norm.includes('socket')) {
    return <SocketIoIcon className={className} />;
  }

  // Tailwind CSS
  if (norm.includes('tailwind')) {
    return <TailwindIcon className={className} />;
  }

  // shadcn/ui
  if (norm.includes('shadcn')) {
    return <ShadcnIcon className={className} />;
  }

  // Material UI / MUI
  if (norm.includes('material') || norm.includes('mui')) {
    return <MaterialUiIcon className={className} />;
  }

  // Bootstrap
  if (norm.includes('bootstrap')) {
    return <BootstrapIcon className={className} />;
  }

  // Python / Python ML
  if (norm.includes('python')) {
    return <PythonIcon className={className} />;
  }

  // Django
  if (norm.includes('django')) {
    return <DjangoIcon className={className} />;
  }

  // FastAPI
  if (norm.includes('fastapi')) {
    return <FastApiIcon className={className} />;
  }

  // Flask
  if (norm === 'flask' || norm.includes('flask')) {
    return <FlaskIcon className={className} />;
  }

  // C++ / CPP
  if (norm === 'c++' || norm === 'cpp' || norm.includes('c++')) {
    return <CppIcon className={className} />;
  }

  // Redux
  if (norm.includes('redux')) {
    return <ReduxIcon className={className} />;
  }

  // Zustand
  if (norm.includes('zustand')) {
    return <ZustandIcon className={className} />;
  }

  // Git
  if (norm === 'git') {
    return <GitIcon className={className} />;
  }

  // GitHub
  if (norm.includes('github')) {
    return <GitHubIcon className={className} />;
  }

  // Cloudinary
  if (norm.includes('cloudinary')) {
    return <CloudinaryIcon className={className} />;
  }

  // Razorpay
  if (norm.includes('razorpay')) {
    return <RazorpayIcon className={className} />;
  }

  // Stripe
  if (norm.includes('stripe')) {
    return <StripeIcon className={className} />;
  }

  // Vercel
  if (norm.includes('vercel')) {
    return <VercelIcon className={className} />;
  }

  // Claude
  if (norm.includes('claude') || norm.includes('anthropic')) {
    return <ClaudeIcon className={className} />;
  }

  // DeepSeek
  if (norm.includes('deepseek')) {
    return <DeepSeekIcon className={className} />;
  }

  // Gemini
  if (norm.includes('gemini')) {
    return <GeminiIcon className={className} />;
  }

  // Grok (xAI)
  if (norm === 'grok' || norm.includes('grok') || norm.includes('xai')) {
    return <GrokIcon className={className} />;
  }

  // Groq (LPU)
  if (norm.includes('groq')) {
    return <GroqIcon className={className} />;
  }

  // Google Antigravity
  if (norm.includes('antigravity') || norm === 'agy' || norm.includes('google antigravity')) {
    return <AntigravityIcon className={className} />;
  }

  // Windsurf
  if (norm.includes('windsurf')) {
    return <WindsurfIcon className={className} />;
  }

  // Devin AI
  if (norm.includes('devin')) {
    return <DevinIcon className={className} />;
  }

  // Generic AI
  if (norm === 'ai' || norm.includes('artificial')) {
    return <GeminiIcon className={className} />;
  }

  // JWT
  if (norm.includes('jwt') || norm.includes('token')) {
    return <JwtIcon className={className} />;
  }

  // WebRTC
  if (norm.includes('webrtc')) {
    return <WebRtcIcon className={className} />;
  }

  // HTML
  if (norm.includes('html')) {
    return <Html5Icon className={className} />;
  }

  // CSS
  if (norm.includes('css')) {
    return <Css3Icon className={className} />;
  }

  // Linux
  if (norm.includes('linux')) {
    return <LinuxIcon className={className} />;
  }

  // UI/UX Design (IT Domain)
  if (norm.includes('design') || norm.includes('ui/ux') || norm.includes('figma') || norm.includes('wireframing')) {
    return <Palette className={className} />;
  }

  // Non-IT: BPO & Customer Operations
  if (norm.includes('bpo') || norm.includes('customer') || norm.includes('telecalling') || norm.includes('inbound') || norm.includes('outbound')) {
    return <Headphones className={className} />;
  }

  // Non-IT: CRM & Ticket Management
  if (norm.includes('crm') || norm.includes('ticket') || norm.includes('helpdesk')) {
    return <LifeBuoy className={className} />;
  }

  // Non-IT: Supply Chain Management
  if (norm.includes('supply chain') || norm.includes('logistics') || norm.includes('dispatch') || norm.includes('freight')) {
    return <Truck className={className} />;
  }

  // Non-IT: Inventory & Warehouse Control
  if (norm.includes('inventory') || norm.includes('warehouse') || norm.includes('stock')) {
    return <Boxes className={className} />;
  }

  // Non-IT: Manufacturing & Quality Control
  if (norm.includes('manufacturing') || norm.includes('six sigma') || norm.includes('quality') || norm.includes('inspection')) {
    return <Factory className={className} />;
  }

  // Non-IT: Leadership & Team Operations
  if (norm.includes('leadership') || norm.includes('workforce') || norm.includes('team')) {
    return <Users className={className} />;
  }

  // Non-IT: Vendor & Stakeholder Management
  if (norm.includes('vendor') || norm.includes('procurement') || norm.includes('stakeholder')) {
    return <Briefcase className={className} />;
  }

  // Non-IT: Process Optimization & SOPs
  if (norm.includes('optimization') || norm.includes('process') || norm.includes('sop') || norm.includes('workflow')) {
    return <Workflow className={className} />;
  }

  // VS Code (IT Domain)
  if (norm.includes('vs code') || norm.includes('vscode')) {
    return <VsCodeIcon className={className} />;
  }

  // Non-IT: Flipkart Smart Assist CRM
  if (norm.includes('flipkart') || norm.includes('smart assist')) {
    return <FlipkartIcon className={className} />;
  }

  // Non-IT: Microsoft Excel
  if (norm.includes('excel')) {
    return <ExcelIcon className={className} />;
  }

  // Non-IT: Power BI
  if (norm.includes('power bi') || norm.includes('powerbi')) {
    return <PowerBiIcon className={className} />;
  }

  // Non-IT: MS Office Suite / Word / PowerPoint
  if (norm.includes('office') || norm.includes('word') || norm.includes('powerpoint')) {
    return <MsOfficeIcon className={className} />;
  }

  // Non-IT: Video Editing
  if (norm.includes('video') || norm.includes('editing') || norm.includes('premiere')) {
    return <Film className={className} />;
  }

  // Fallback icon
  return <Code2 className={className} />;
}

export default TechIcon;
