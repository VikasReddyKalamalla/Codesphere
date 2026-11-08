import React from 'react';

interface CodexLogoProps {
  className?: string;
  size?: number;
}

export const CodexLogo: React.FC<CodexLogoProps> = ({ className = 'w-14 h-14', size }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} drop-shadow-[0_0_20px_rgba(4,170,109,0.4)]`}
      style={size ? { width: size, height: size } : undefined}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <defs>
        <linearGradient id="codexGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#04AA6D" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
        <linearGradient id="codexGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#04AA6D" />
        </linearGradient>
        <linearGradient id="codexCore" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>

      {/* CodeSphere Codex Unique Emblem: Interlocking Code Sphere & Hexagonal Matrix */}
      {/* Outer Hexagonal Shield */}
      <polygon
        points="50,6 88,27 88,73 50,94 12,73 12,27"
        stroke="url(#codexGrad1)"
        strokeWidth="4"
        strokeLinejoin="round"
        fill="#04AA6D"
        fillOpacity="0.08"
      />

      {/* Dynamic Code Chevron Angles */}
      {/* Left Chevron < */}
      <path
        d="M 38 35 L 24 50 L 38 65"
        stroke="url(#codexGrad2)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right Chevron > */}
      <path
        d="M 62 35 L 76 50 L 62 65"
        stroke="url(#codexGrad2)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Central Codex Sphere Orbit & Core */}
      <circle
        cx="50"
        cy="50"
        r="11"
        fill="url(#codexCore)"
      />
      
      <circle
        cx="50"
        cy="50"
        r="4"
        fill="#ffffff"
      />

      {/* Subtle orbital connection axis */}
      <line
        x1="50"
        y1="14"
        x2="50"
        y2="34"
        stroke="#04AA6D"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="2 3"
      />
      <line
        x1="50"
        y1="66"
        x2="50"
        y2="86"
        stroke="#04AA6D"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="2 3"
      />
    </svg>
  );
};
