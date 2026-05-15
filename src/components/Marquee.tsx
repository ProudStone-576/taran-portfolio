import { useEffect, useRef, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  reverse?: boolean;
  className?: string;
  baseSpeed?: number;
  reactive?: boolean;
};

export default function Marquee({
  children,
  reverse = false,
  className = '',
  baseSpeed = 40,
  reactive = true,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const inner = innerRef.current;
    if (!track || !inner) return;

    let raf = 0;
    let x = 0;
    let last = performance.now();
    let dir = reverse ? -1 : 1;
    let scrollDirMul = 1;
    let half = inner.offsetWidth;
    let running = true;

    const measure = () => {
      half = inner.offsetWidth;
    };
    measure();
    if (document.fonts?.ready) document.fonts.ready.then(measure);

    const onResize = () => measure();
    window.addEventListener('resize', onResize);

    const onDir = (e: Event) => {
      if (!reactive) return;
      const d = (e as CustomEvent<number>).detail;
      scrollDirMul = d === -1 ? -1 : 1;
    };
    window.addEventListener('scroll-dir', onDir);

    const tick = (now: number) => {
      if (!running) return;
      const dt = Math.min(64, now - last);
      last = now;

      const velAbs = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--scroll-vel-abs').trim() || '0'
      );
      const boost = reactive ? 1 + velAbs * 0.5 : 1;
      const pxPerSec = baseSpeed * boost;
      x -= pxPerSec * dir * scrollDirMul * (dt / 1000);

      if (half > 0) {
        // Wrap into [-half, 0]
        if (x <= -half) x += half;
        if (x >= 0) x -= half;
      }
      track.style.transform = `translate3d(${x}px, 0, 0)`;
      raf = requestAnimationFrame(tick);
    };

    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener('visibilitychange', onVis);

    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll-dir', onDir);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [reverse, reactive, baseSpeed]);

  return (
    <div className={`overflow-hidden w-full ${className}`}>
      <div ref={trackRef} className="flex" style={{ willChange: 'transform' }}>
        <div ref={innerRef} className="flex shrink-0">
          {children}
        </div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
