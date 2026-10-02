import { useEffect, useRef } from 'react';

/*
  A React "island": the only piece of the home page that ships JavaScript.
  Astro renders everything else to plain HTML at build time.

  Draws a slowly drifting starfield on a <canvas>, with an occasional
  shooting star (tune METEOR_MIN_GAP / METEOR_MAX_GAP below). It respects the
  visitor's "reduce motion" setting (draws one still frame instead) and
  pauses when the browser tab is hidden.
*/

interface Props {
  /** Stars per 10,000 px² of screen. */
  density?: number;
  /** Drift speed in px per frame. */
  speed?: number;
}

interface Star {
  x: number;
  y: number;
  z: number; // depth 0..1: closer stars are bigger, brighter and faster
  twinkle: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number; // px per frame
  vy: number;
  length: number; // tail length in px
  life: number; // frames left
  maxLife: number;
}

/** Random number between min and max. */
const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** Wait between shooting stars, in ms. Lower = more frequent. */
const METEOR_MIN_GAP = 2500;
const METEOR_MAX_GAP = 9000;

export default function StarField({ density = 1.2, speed = 0.08 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let meteors: Meteor[] = [];
    let nextMeteorAt = performance.now() + rand(1500, 4000);

    // A shooting star: starts somewhere in the upper part of the sky and
    // streaks down-left (or occasionally down-right) for under a second.
    const spawnMeteor = () => {
      const goLeft = Math.random() < 0.75;
      const angle = rand(0.35, 0.65); // radians below horizontal
      const velocity = rand(4.5, 7.5); // px per frame: lower = slower streaks
      const maxLife = Math.round(rand(70, 115)); // frames visible (~1.2-1.9s at 60fps)
      meteors.push({
        x: goLeft ? rand(width * 0.3, width * 1.05) : rand(-width * 0.05, width * 0.7),
        y: rand(-height * 0.05, height * 0.45),
        vx: Math.cos(angle) * velocity * (goLeft ? -1 : 1),
        vy: Math.sin(angle) * velocity,
        length: rand(90, 180),
        life: maxLife,
        maxLife,
      });
    };

    const drawMeteors = (now: number) => {
      if (now >= nextMeteorAt) {
        spawnMeteor();
        if (Math.random() < 0.15) spawnMeteor(); // the occasional pair
        nextMeteorAt = now + rand(METEOR_MIN_GAP, METEOR_MAX_GAP);
      }

      for (const m of meteors) {
        m.x += m.vx;
        m.y += m.vy;
        m.life -= 1;

        // Fade in quickly, then fade out
        const t = m.life / m.maxLife;
        const alpha = Math.min(1, (1 - t) * 6) * t;
        const speedNorm = Math.hypot(m.vx, m.vy);
        const tailX = m.x - (m.vx / speedNorm) * m.length;
        const tailY = m.y - (m.vy / speedNorm) * m.length;

        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255,255,255,${(0.9 * alpha).toFixed(3)})`);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // Bright head
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
      meteors = meteors.filter((m) => m.life > 0);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(((width * height) / 10_000) * density);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random(),
        twinkle: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        if (!reduceMotion) {
          s.x -= speed * (0.3 + s.z * 1.7);
          s.twinkle += 0.02;
          if (s.x < -2) {
            s.x = width + 2;
            s.y = Math.random() * height;
          }
        }
        const alpha = (0.25 + s.z * 0.75) * (0.75 + Math.sin(s.twinkle) * 0.25);
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 0.3 + s.z * 1.1, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduceMotion) drawMeteors(performance.now());
    };

    const loop = () => {
      draw();
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      if (reduceMotion) draw();
      else loop();
    };

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(frame);
      else start();
    };

    const onResize = () => {
      resize();
      start();
    };

    resize();
    start();
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [density, speed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  );
}
