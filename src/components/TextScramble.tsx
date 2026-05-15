import { useEffect, useRef } from 'react';

const CHARS = '!<>-_\\/[]{}—=+*^?#________ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

type Props = {
  text: string;
  className?: string;
  trigger?: boolean;
  delay?: number;
  speed?: number;
};

export default function TextScramble({
  text,
  className = '',
  trigger = true,
  delay = 0,
  speed = 30,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    let raf = 0;
    let t: number | null = null;
    let timer: number | null = null;
    let alive = true;
    let fired = false;
    let io: IntersectionObserver | null = null;

    const run = () => {
      if (fired || !alive) return;
      fired = true;

      const queue: { from: string; to: string; start: number; end: number; char?: string }[] = [];
      const oldText = el.dataset.scrambleFrom ?? '';

      for (let i = 0; i < text.length; i++) {
        const from = oldText[i] || '';
        const to = text[i];
        const start = Math.floor(Math.random() * 16);
        const end = start + Math.floor(Math.random() * 24) + 8;
        queue.push({ from, to, start, end });
      }

      let frame = 0;

      const tick = () => {
        if (!alive) return;
        let out = '';
        let complete = 0;
        for (let i = 0, n = queue.length; i < n; i++) {
          const { from, to, start, end } = queue[i];
          let char = queue[i].char;
          if (frame >= end) {
            complete++;
            out += to;
          } else if (frame >= start) {
            if (!char || Math.random() < 0.28) {
              char = CHARS[Math.floor(Math.random() * CHARS.length)];
              queue[i].char = char;
            }
            out += `<span style="color:#C6FF3D">${char}</span>`;
          } else {
            out += from;
          }
        }
        el.innerHTML = out;
        if (complete === queue.length) return;
        frame++;
        timer = window.setTimeout(() => {
          raf = requestAnimationFrame(tick);
        }, 1000 / speed);
      };
      tick();
    };

    if (!trigger) {
      el.textContent = text;
      return () => { alive = false; };
    }

    t = window.setTimeout(() => {
      if (!alive) return;
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            run();
            io?.disconnect();
            io = null;
          }
        },
        { threshold: 0.3 }
      );
      io.observe(el);
    }, delay);

    return () => {
      alive = false;
      if (t !== null) clearTimeout(t);
      if (timer !== null) clearTimeout(timer);
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, [text, trigger, delay, speed]);

  return <span ref={ref} className={className}>{text}</span>;
}
