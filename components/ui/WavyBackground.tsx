'use client';

import { useEffect, useRef } from 'react';

export default function WavyBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
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

    // Wave parameters
    let step = 0;
    const lines = [
      { color: 'rgba(26, 86, 219, 0.06)', amplitude: 45, speed: 0.008, wavelength: 0.003, offsetY: 0.4 },
      { color: 'rgba(99, 102, 241, 0.05)', amplitude: 55, speed: 0.006, wavelength: 0.002, offsetY: 0.5 },
      { color: 'rgba(14, 165, 233, 0.05)', amplitude: 35, speed: 0.010, wavelength: 0.004, offsetY: 0.6 },
      { color: 'rgba(15, 23, 42, 0.04)',  amplitude: 65, speed: 0.004, wavelength: 0.0025, offsetY: 0.45 },
    ];

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      step += 1;

      lines.forEach((line) => {
        ctx.beginPath();
        ctx.fillStyle = line.color;

        const baseHeight = height * line.offsetY;

        ctx.moveTo(0, height);
        ctx.lineTo(0, baseHeight);

        for (let x = 0; x <= width; x += 10) {
          const y =
            baseHeight +
            Math.sin(x * line.wavelength + step * line.speed) * line.amplitude +
            Math.cos(x * line.wavelength * 0.5 + step * line.speed * 0.7) * (line.amplitude * 0.4);
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.85,
      }}
    />
  );
}
