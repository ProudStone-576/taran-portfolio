

import { useEffect, useRef, useState } from 'react';

const SELECTOR = 'a, button, [data-cursor], input, textarea';

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let visible = true;
    let raf = 0;

    const move = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate3d(${mx - 4}px, ${my - 4}px, 0)`;
    };

    const tick = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    const onVis = () => {
      if (document.hidden) {
        visible = false;
        cancelAnimationFrame(raf);
      } else if (!visible) {
        visible = true;
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('visibilitychange', onVis);

    const onOver = (e: MouseEvent) => {
      const t = (e.target as Element)?.closest?.(SELECTOR) as HTMLElement | null;
      if (!t) return;
      setHover(true);
      setText(t.dataset.cursor ?? '');
    };
    const onOut = (e: MouseEvent) => {
      const t = (e.target as Element)?.closest?.(SELECTOR) as HTMLElement | null;
      if (!t) return;
      const next = (e.relatedTarget as Element | null)?.closest?.(SELECTOR);
      if (next) return;
      setHover(false);
      setText('');
    };

    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', move);
      document.removeEventListener('visibilitychange', onVis);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-acid rounded-full pointer-events-none z-[9999]"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 w-9 h-9 border rounded-full pointer-events-none z-[9998] flex items-center justify-center transition-[width,height,border-color,background-color] duration-300 ${
          hover ? 'w-20 h-20 border-acid bg-acid/10' : 'border-bone/40'
        }`}
        style={{ willChange: 'transform' }}
      >
        {text && <span className="mono text-[10px] uppercase text-acid">{text}</span>}
      </div>
    </>
  );
}
