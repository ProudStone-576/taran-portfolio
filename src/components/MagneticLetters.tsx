import { useEffect, useRef } from 'react';

type Props = {
  text: string;
  className?: string;
  letterClassName?: string;
  radius?: number;
  strength?: number;
  italicIndices?: number[];
  italicClassName?: string;
};

export default function MagneticLetters({
  text,
  className = '',
  letterClassName = '',
  radius = 140,
  strength = 0.4,
  italicIndices = [],
  italicClassName = 'italic text-acid',
}: Props) {
  const wrap = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!wrap.current) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const wrapEl = wrap.current;
    const letters = Array.from(wrapEl.querySelectorAll<HTMLElement>('[data-letter]'));
    if (!letters.length) return;

    const positions = letters.map((l) => {
      const r = l.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });

    let raf = 0;
    let mx = -9999, my = -9999;
    let active = false;
    let inView = false;

    const move = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const recalc = () => {
      letters.forEach((l, i) => {
        const r = l.getBoundingClientRect();
        positions[i] = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
    };

    const tick = () => {
      if (!active) return;
      letters.forEach((l, i) => {
        const p = positions[i];
        const dx = mx - p.x;
        const dy = my - p.y;
        const d = Math.hypot(dx, dy);
        if (d < radius) {
          const f = (1 - d / radius) * strength;
          l.style.transform = `translate3d(${dx * f}px, ${dy * f}px, 0)`;
        } else {
          l.style.transform = 'translate3d(0,0,0)';
        }
      });
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (active) return;
      active = true;
      recalc();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      active = false;
      cancelAnimationFrame(raf);
      letters.forEach((l) => (l.style.transform = 'translate3d(0,0,0)'));
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !document.hidden) start();
        else stop();
      },
      { threshold: 0.05 }
    );
    io.observe(wrapEl);

    const onVis = () => {
      if (document.hidden) stop();
      else if (inView) start();
    };

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('scroll', recalc, { passive: true });
    window.addEventListener('resize', recalc);
    document.addEventListener('visibilitychange', onVis);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener('mousemove', move);
      window.removeEventListener('scroll', recalc);
      window.removeEventListener('resize', recalc);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [radius, strength, text]);

  return (
    <span ref={wrap} className={className}>
      {text.split('').map((ch, i) => (
        <span
          key={i}
          data-letter
          className={`inline-block transition-transform duration-300 ease-out ${letterClassName} ${
            italicIndices.includes(i) ? italicClassName : ''
          }`}
          style={{ willChange: 'transform' }}
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  );
}
