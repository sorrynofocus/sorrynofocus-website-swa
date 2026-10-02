import { useEffect, useRef } from 'react';

/*
  A React "island": the only piece of the home page that ships JavaScript.
  Astro renders everything else to plain HTML at build time.

  Draws a slowly drifting starfield on a <canvas>. It respects the
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
