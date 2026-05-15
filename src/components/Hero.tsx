import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroShader from './HeroShader';
import Magnetic from './Magnetic';
import TextScramble from './TextScramble';

gsap.registerPlugin(ScrollTrigger);

const chapters = [
  { chapter: '01 — Belief',   line1: 'Systems', line2: 'over',    line3: 'slogans.'   },
  { chapter: '02 — Method',   line1: 'Models',  line2: 'under',   line3: 'scrutiny.'  },
  { chapter: '03 — Practice', line1: 'Truth',   line2: 'through', line3: 'iteration.' },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      // Intro reveal of chapter 0
      const tl = gsap.timeline({ delay: 1.4, defaults: { ease: 'expo.out' } });
      tl.from('[data-hero-meta]', { y: 20, opacity: 0, duration: 1, stagger: 0.08 })
        .from('[data-chapter="0"] [data-hero-line] > span > span', { yPercent: 110, duration: 1.2, stagger: 0.08 }, '-=0.7')
        .from('[data-hero-sub]', { y: 30, opacity: 0, duration: 1 }, '-=0.6')
        .from('[data-hero-cta]', { y: 20, opacity: 0, duration: 0.8, stagger: 0.1 }, '-=0.5')
        .from('[data-hero-clock]', { opacity: 0, duration: 0.6 }, '-=0.4');

      const totalChapters = chapters.length;
      const pinDistance = () => window.innerHeight * (totalChapters - 0.5);

      ScrollTrigger.create({
        trigger: '[data-pin-wrap]',
        start: 'top top',
        end: pinDistance,
        pin: '[data-pin-target]',
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });

      // Carousel track translation
      gsap.to('[data-chapter-track]', {
        yPercent: -100 * (totalChapters - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: '[data-pin-wrap]',
          start: 'top top',
          end: pinDistance,
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });

      // Chapter index ticker
      const chip = root.current!.querySelector('[data-chapter-chip]');
      ScrollTrigger.create({
        trigger: '[data-pin-wrap]',
        start: 'top top',
        end: pinDistance,
        scrub: true,
        onUpdate: (self) => {
          const i = Math.min(totalChapters - 1, Math.floor(self.progress * totalChapters));
          if (chip) chip.textContent = chapters[i].chapter;
        },
      });

      const time = root.current!.querySelector('[data-clock]');
      const updateClock = () => {
        if (!time) return;
        const d = new Date();
        const h = String(d.getUTCHours()).padStart(2, '0');
        const m = String(d.getUTCMinutes()).padStart(2, '0');
        const s = String(d.getUTCSeconds()).padStart(2, '0');
        time.textContent = `${h}:${m}:${s} UTC`;
      };
      updateClock();
      const id = setInterval(updateClock, 1000);
      return () => clearInterval(id);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="home" className="relative bg-ink">
      <div data-pin-wrap className="relative">
        <div data-pin-target className="relative h-[100svh] w-full overflow-hidden bg-ink">
          <HeroShader />

          {/* Contrast veils */}
          <div
            className="absolute inset-0 z-[2] pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(10,10,10,0) 25%, rgba(10,10,10,0.35) 60%, rgba(10,10,10,0.7) 100%)',
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-1/3 z-[2] pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.85), rgba(10,10,10,0))' }}
          />
          <div
            className="absolute inset-x-0 top-0 h-32 z-[2] pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.7), rgba(10,10,10,0))' }}
          />

          {/* Top meta */}
          <div className="absolute inset-x-0 top-0 z-20 flex justify-between items-start px-5 md:px-10 pt-28 md:pt-32 mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-bone/70">
            <div data-hero-meta className="flex flex-col gap-1">
              <span className="text-acid">◉ Available for work</span>
              <span>Lat 49.05° · Long -122.31° · BC</span>
            </div>
            <div data-hero-meta data-hero-clock className="text-right flex flex-col gap-1">
              <span data-clock>00:00:00 UTC</span>
              <span>v2.0 · build_2026.01</span>
            </div>
          </div>

          {/* Chapter ticker */}
          <div
            data-chapter-chip
            className="absolute top-24 left-5 md:left-10 z-20 mono text-[9px] tracking-[0.4em] text-acid uppercase rotate-180"
            style={{ writingMode: 'vertical-rl' }}
          >
            01 — Belief
          </div>

          {/* CHAPTER CAROUSEL — single track translates Y, viewport mask shows one at a time */}
          <div className="absolute inset-0 z-10 flex items-center justify-start px-5 md:px-10 pointer-events-none overflow-hidden">
            <div
              data-chapter-track
              className="w-full"
              style={{ willChange: 'transform' }}
            >
              {chapters.map((c, i) => (
                <div
                  key={i}
                  data-chapter={i}
                  className="w-full h-[100svh] flex items-center"
                >
                  <h1
                    data-hero-line
                    className="display text-bone text-[18vw] md:text-[15vw] lg:text-[14vw] leading-[0.85] tracking-tighter"
                    style={{ textShadow: '0 4px 30px rgba(10,10,10,0.7)' }}
                  >
                    <span className="block overflow-hidden"><span className="block">{c.line1}</span></span>
                    <span className="block overflow-hidden"><span className="block italic text-acid">{c.line2}</span></span>
                    <span className="block overflow-hidden"><span className="block">{c.line3}</span></span>
                  </h1>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom row */}
          <div className="absolute inset-x-0 bottom-0 z-20 px-5 md:px-10 pb-20 md:pb-24 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <div data-hero-sub className="md:col-span-5 max-w-md">
              <div className="mono text-[10px] uppercase tracking-[0.4em] text-acid mb-3">
                <TextScramble text=">> data scientist · ai engineer" delay={1800} speed={45} />
              </div>
              <p className="text-base md:text-lg text-bone/80 leading-relaxed">
                I build models that interrogate reality — not dashboards that decorate it. Causal reasoning, time-series, engineered systems for decisions that bite back.
              </p>
            </div>

            <div className="md:col-span-4 md:col-start-7 flex flex-wrap gap-3">
              <Magnetic>
                <a
                  data-hero-cta
                  data-cursor="View"
                  href="#projects"
                  className="group relative inline-flex items-center gap-3 px-6 py-4 bg-acid text-ink mono text-xs uppercase tracking-widest font-bold rounded-full hover:gap-5 transition-all"
                >
                  Selected Work
                  <span className="w-2 h-2 rounded-full bg-ink group-hover:scale-150 transition-transform" />
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  data-hero-cta
                  data-cursor="Talk"
                  href="#contact"
                  className="inline-flex items-center gap-3 px-6 py-4 border border-bone/40 mono text-xs uppercase tracking-widest rounded-full hover:border-acid hover:text-acid transition-colors backdrop-blur-sm"
                >
                  Start a Conversation
                </a>
              </Magnetic>
            </div>

            <div data-hero-cta className="md:col-span-3 md:col-start-11 flex justify-end">
              <div className="flex flex-col items-end gap-2 mono text-[10px] uppercase tracking-[0.3em] text-bone/50">
                <span>Hold scroll</span>
                <span className="block w-px h-12 bg-bone/30 animate-scroll-hint" />
              </div>
            </div>
          </div>

          {/* Crosshair */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[3]">
            <div className="relative w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] opacity-25">
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-bone/15" />
              <span className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-px bg-bone/15" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 border border-acid/60 rotate-45" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
