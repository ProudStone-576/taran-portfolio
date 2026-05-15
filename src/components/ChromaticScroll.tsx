import { useEffect, useRef, useState } from 'react';

const SECTIONS: { id: string; label: string }[] = [
  { id: 'home', label: '01 / Belief' },
  { id: 'about', label: '02 / About' },
  { id: 'skills', label: '03 / Capability' },
  { id: 'process', label: '04 / Process' },
  { id: 'projects', label: '05 / Selected Work' },
  { id: 'code', label: '06 / Live Code' },
  { id: 'contact', label: '07 / Contact' },
];

export default function ScrollHUD() {
  const barRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const [section, setSection] = useState('01 / Belief');

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    type Cached = { id: string; label: string; top: number };
    let cache: Cached[] = [];
    let docMax = 0;

    const cacheLayout = () => {
      cache = SECTIONS.flatMap((s) => {
        const el = document.getElementById(s.id);
        return el ? [{ id: s.id, label: s.label, top: el.offsetTop }] : [];
      });
      docMax = document.documentElement.scrollHeight - window.innerHeight;
    };

    cacheLayout();
    if (document.fonts?.ready) document.fonts.ready.then(cacheLayout);

    let lastY = window.scrollY;
    let vel = 0;
    let raf = 0;
    let queuedSection = section;

    const tick = () => {
      const y = window.scrollY;
      const dy = Math.abs(y - lastY);
      vel += (dy - vel) * 0.18;
      lastY = y;

      const p = docMax > 0 ? Math.min(1, y / docMax) : 0;
      if (percentRef.current) {
        percentRef.current.textContent = (p * 100).toFixed(0).padStart(3, '0');
      }
      if (barRef.current) {
        barRef.current.style.width = `${Math.min(100, vel * 4)}px`;
      }

      const mid = y + window.innerHeight / 2;
      let next = cache[0]?.label ?? section;
      for (let i = cache.length - 1; i >= 0; i--) {
        if (cache[i].top <= mid) {
          next = cache[i].label;
          break;
        }
      }
      if (next !== queuedSection) {
        queuedSection = next;
        setSection(next);
      }

      raf = requestAnimationFrame(tick);
    };

    const onResize = () => cacheLayout();

    raf = requestAnimationFrame(tick);
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="fixed bottom-5 left-5 right-5 md:bottom-6 md:left-6 md:right-6 z-40 pointer-events-none flex items-end justify-between gap-4 mono text-[10px] uppercase tracking-[0.3em] text-bone/50">
      <div className="hidden md:flex items-end gap-3">
        <span className="text-acid">◉</span>
        <span>{section}</span>
      </div>

      <div className="flex items-end gap-3 ml-auto">
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-bone/30">vel</span>
          <div className="relative w-[100px] h-[2px] bg-bone/15 overflow-hidden">
            <div ref={barRef} className="absolute inset-y-0 left-0 bg-acid" style={{ width: 0 }} />
          </div>
        </div>
        <span className="tabular-nums text-bone">
          <span ref={percentRef}>000</span>
          <span className="text-bone/40">%</span>
        </span>
      </div>
    </div>
  );
}
