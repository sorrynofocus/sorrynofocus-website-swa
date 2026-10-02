import { useEffect, useRef, useState, type CSSProperties } from 'react';

/*
  A faint rocket that occasionally drifts across its parent element.
  The parent needs `position: relative; overflow: hidden;`.

  Timing: first pass a few seconds after the page loads, then a random wait
  between passes (FIRST_DELAY / GAP below). Nothing renders for visitors who
  have "reduce motion" turned on.
*/

const FIRST_DELAY: [number, number] = [2000, 5000]; // ms
const GAP: [number, number] = [12000, 30000]; // ms between passes
const DURATION: [number, number] = [11, 16]; // seconds to cross

const rand = ([min, max]: [number, number]) => min + Math.random() * (max - min);

interface Flight {
  id: number;
  top: number; // % from top of the parent
  climb: number; // px it rises while crossing
  duration: number; // s
  reverse: boolean; // fly right-to-left
}

export default function RocketFlyby({ opacity = 0.45 }: { opacity?: number }) {
  const [flight, setFlight] = useState<Flight | null>(null);
  const timer = useRef<number>(0);

  const schedule = (range: [number, number]) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      // Skip a pass while the tab is in the background; try again later.
      if (document.hidden) return schedule(GAP);
      setFlight({
        id: Date.now(),
        top: rand([25, 75]),
        climb: rand([40, 140]),
        duration: rand(DURATION),
        reverse: Math.random() < 0.3,
      });
    }, rand(range));
  };

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    schedule(FIRST_DELAY);
    return () => window.clearTimeout(timer.current);
  }, []);

  const onDone = () => {
    setFlight(null);
    schedule(GAP);
  };

  if (!flight) return null;

  // Tilt the nose to match the climb over the distance travelled.
  const distance = window.innerWidth + 320; // screen width + rocket-with-trail width
  const angle = (Math.atan2(flight.climb, distance) * 180) / Math.PI;

  const style = {
    top: `${flight.top}%`,
    animationDuration: `${flight.duration}s`,
    '--climb': `${-flight.climb}px`,
    '--angle': `${-angle}deg`,
    '--dir': flight.reverse ? -1 : 1,
  } as CSSProperties;

  // The body stays faint; the engine flame is brighter so it reads as a glowing burn.
  const flameOpacity = Math.min(1, opacity * 2);

  return (
    <div className="rocket-lane" aria-hidden="true">
      <div key={flight.id} className="rocket" style={style} onAnimationEnd={onDone}>
        <span className="rocket-trail" style={{ opacity }} />
        <svg viewBox="0 0 120 24" width="96" height="19">
          <defs>
            <linearGradient id="rocket-flame-outer" x1="1" x2="0" y1="0" y2="0">
              <stop offset="0" stopColor="#ffb347" />
              <stop offset="0.45" stopColor="#ff6a1a" stopOpacity="0.75" />
              <stop offset="1" stopColor="#ff3d00" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="rocket-flame-core" x1="1" x2="0" y1="0" y2="0">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.5" stopColor="#ffe2b0" />
              <stop offset="1" stopColor="#ffb060" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* exhaust flame: orange outer plume + white-hot core */}
          <g className="rocket-flame" opacity={flameOpacity}>
            <path d="M16 7.8 Q-32 12 16 16.2 Z" fill="url(#rocket-flame-outer)" />
            <path d="M16 9.6 Q-6 12 16 14.4 Z" fill="url(#rocket-flame-core)" />
          </g>

          <g opacity={opacity}>
            {/* fins */}
            <path d="M22 9 L15 3.5 L32 9 Z M22 15 L15 20.5 L32 15 Z" fill="#cfd3da" />
            {/* nozzle */}
            <path d="M22 10 L16 9.2 V14.8 L22 14 Z" fill="#8d939c" />
            {/* body + nose cone */}
            <path d="M21 9 H90 Q108 9 117 12 Q108 15 90 15 H21 Z" fill="#f2f3f5" />
            {/* interstage band */}
            <rect x="70" y="9" width="3" height="6" fill="#9aa0a8" />
          </g>
        </svg>
      </div>
      <style>{css}</style>
    </div>
  );
}

const css = `
  .rocket-lane {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }
  .rocket {
    position: absolute;
    left: 0;
    display: flex;
    align-items: center;
    animation-name: rocket-fly;
    animation-timing-function: linear;
    animation-fill-mode: both;
    will-change: transform;
  }
  .rocket svg {
    display: block;
    overflow: visible;
  }
  /* Long fading exhaust trail behind the rocket */
  .rocket-trail {
    width: 220px;
    height: 1px;
    margin-right: -6px;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.55));
  }
  .rocket-flame {
    transform-origin: 16px 12px;
    animation: rocket-flicker 0.12s ease-in-out infinite alternate;
  }
  @keyframes rocket-fly {
    /* --dir 1: from just off the left edge to just off the right edge. --dir -1: the reverse. */
    from {
      transform: translateX(calc((1 - var(--dir)) * 50vw - (1 + var(--dir)) * 50%)) translateY(0)
        scaleX(var(--dir)) rotate(var(--angle));
    }
    to {
      transform: translateX(calc((1 + var(--dir)) * 50vw - (1 - var(--dir)) * 50%)) translateY(var(--climb))
        scaleX(var(--dir)) rotate(var(--angle));
    }
  }
  @keyframes rocket-flicker {
    from { transform: scaleX(0.8); opacity: 0.85; }
    to { transform: scaleX(1.15); opacity: 1; }
  }
`;
