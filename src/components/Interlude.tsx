import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Props = {
  chapter: string;
  title: string;
  subtitle?: string;
  invert?: boolean;
};

export default function Interlude({ chapter, title, subtitle, invert = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const text = ref.current!.querySelector('[data-interlude-title]');
      const meta = ref.current!.querySelector('[data-interlude-meta]');
      const chip = ref.current!.querySelector('[data-interlude-chip]');

      gsap.fromTo(
        text,
        { yPercent: 8, scale: 0.94, opacity: 0.4 },
        {
          yPercent: -8,
          scale: 1.05,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        }
      );

      gsap.fromTo(
        meta,
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 70%',
            end: 'top 20%',
            scrub: 0.5,
          },
        }
      );

      gsap.fromTo(
        chip,
        { scale: 0, rotate: -45 },
        {
          scale: 1,
          rotate: 0,
          ease: 'expo.out',
          duration: 0.8,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className={`relative py-32 md:py-44 px-5 md:px-10 overflow-hidden ${
        invert ? 'bg-bone text-ink' : 'bg-ink text-bone'
      }`}
    >
      <div className="max-w-[1500px] mx-auto">
        <div data-interlude-meta className="flex items-center gap-3 mb-12">
          <span
            data-interlude-chip
            className={`inline-block w-3 h-3 rounded-full ${invert ? 'bg-ink' : 'bg-acid'}`}
          />
          <span className="mono text-[10px] uppercase tracking-[0.4em] opacity-60">
            Interlude · Chapter {chapter}
          </span>
        </div>

        <h2
          data-interlude-title
          className={`display leading-[0.85] tracking-tighter ${
            invert ? 'text-ink' : 'text-bone'
          }`}
          style={{ fontSize: 'clamp(4rem, 18vw, 22rem)' }}
        >
          {title}
        </h2>

        {subtitle && (
          <div data-interlude-meta className="mt-12 max-w-2xl">
            <p className={`text-lg md:text-2xl leading-snug ${invert ? 'text-ink/70' : 'text-bone/70'}`}>
              {subtitle}
            </p>
          </div>
        )}

        {/* Big crosshair marker */}
        <div className="absolute right-5 md:right-10 bottom-10 mono text-[10px] uppercase tracking-[0.3em] opacity-40 flex items-center gap-3">
          <span>{chapter}</span>
          <span className="block w-12 h-px bg-current" />
        </div>
      </div>
    </section>
  );
}
