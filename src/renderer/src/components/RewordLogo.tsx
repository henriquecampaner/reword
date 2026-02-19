import React from 'react';

interface RewordLogoProps {
  /** When true, only the icon (left mark) is rendered; no wordmark. */
  iconOnly?: boolean;
  className?: string;
  width?: number | string;
  height?: number | string;
  'aria-label'?: string;
}

export function RewordLogo({
  iconOnly = false,
  className,
  width,
  height,
  'aria-label': ariaLabel = 'Reword logo'
}: RewordLogoProps): React.JSX.Element {
  const iconViewBox = '60 50 160 160';
  const fullViewBox = '42.909 34.987 612.771 191.277';

  const icon = (
    <g filter="url(#rewordShadow)">
      <rect
        x="60"
        y="50"
        width="160"
        height="160"
        rx="44"
        fill="url(#rewordGlass)"
        stroke="#1F2937"
        strokeOpacity="0.8"
      />
      <rect
        x="60"
        y="50"
        width="160"
        height="80"
        rx="44"
        fill="url(#rewordHighlight)"
      />
      <g transform="translate(60,50)">
        <path
          d="M110 34 C 142 34, 168 60, 168 92 C 168 124, 142 150, 110 150 C 78 150, 52 124, 52 92 C 52 60, 78 34, 110 34Z"
          fill="none"
          stroke="url(#rewordBrand)"
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.95"
          filter="url(#rewordGlow)"
        />
        <rect x="62" y="78" width="96" height="10" rx="5" fill="#E5E7EB" opacity="0.92" />
        <rect x="62" y="100" width="74" height="10" rx="5" fill="#E5E7EB" opacity="0.78" />
        <path d="M160 78 L184 78 L172 62 Z" fill="url(#rewordBrand)" />
        <g transform="translate(44,44)">
          <path
            d="M24 14 L27 22 L35 25 L27 28 L24 36 L21 28 L13 25 L21 22 Z"
            fill="url(#rewordBrand)"
            opacity="0.95"
          />
          <circle cx="38" cy="14" r="2.4" fill="#A855F7" opacity="0.9" />
        </g>
      </g>
    </g>
  );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={iconOnly ? iconViewBox : fullViewBox}
      width={width ?? (iconOnly ? 36 : 980)}
      height={height ?? (iconOnly ? 36 : 260)}
      role="img"
      aria-label={ariaLabel}
      className={className}
    >
      <defs>
        <linearGradient id="rewordBrand" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4F46E5" />
          <stop offset="0.55" stopColor="#7C3AED" />
          <stop offset="1" stopColor="#A855F7" />
        </linearGradient>
        <linearGradient id="rewordGlass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0B1220" stopOpacity="0.92" />
          <stop offset="1" stopColor="#111827" stopOpacity="0.92" />
        </linearGradient>
        <filter id="rewordShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow
            dx="0"
            dy="10"
            stdDeviation="12"
            floodColor="#000000"
            floodOpacity="0.35"
          />
        </filter>
        <filter id="rewordGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="rewordHighlight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.16" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      {icon}
      {!iconOnly && (
        <g transform="translate(260,0)">
          <text
            style={{
              fill: 'rgb(11, 18, 32)',
              fontFamily:
                'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
              fontSize: 92,
              fontWeight: 750,
              letterSpacing: -1.5,
              whiteSpace: 'pre'
            }}
          >
            <tspan x="-57" y="155">
              Re
            </tspan>
            <tspan style={{ fill: 'rgb(255, 255, 255)' }}>word</tspan>
            <tspan />
          </text>
          <text
            style={{
              whiteSpace: 'pre',
              fontSize: 92,
              fontWeight: 750,
              letterSpacing: -1.5,
              fontFamily:
                'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"'
            }}
            x="-57"
            y="155"
            fill="url(#rewordBrand)"
          >
            Re
          </text>
          <text
            style={{
              fill: 'rgb(255, 255, 255)',
              fontFamily:
                'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial',
              fontSize: 22,
              fontWeight: 520,
              whiteSpace: 'pre',
              opacity: 0.95
            }}
            x="32"
            y="196"
          >
            Instant tone rewrites
          </text>
        </g>
      )}
    </svg>
  );
}
