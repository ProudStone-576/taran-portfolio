import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    n: '01',
    title: 'Motor Unit Degeneration Simulator',
    tag: 'Research · Neural ODE',
    description:
      'Hybrid mechanistic + Neural ODE simulator for studying motor unit degeneration, intervention timing, and non-identifiability under explicit assumptions.',
    tech: ['Neural ODE', 'Python', 'Scientific ML'],
    link: 'https://github.com/ProudStone-576/motor-unit-degeneration-simulator',
    accent: 'acid',
    size: 'lg',
  },
  {
    n: '02',
    title: 'Volatility Regime Engine',
    tag: 'Finance · Time-Series',
    description:
      'ML pipeline detecting volatility regimes via rolling statistics and market state transitions for risk analysis.',
    tech: ['Time Series', 'ML', 'Finance'],
    link: 'https://github.com/ProudStone-576/volatility-regime-engine',
    accent: 'plasma',
    size: 'md',
  },
  {
    n: '03',
    title: 'Real-time Sudoku Vision Solver',
    tag: 'Computer Vision',
    description: 'Detects Sudoku grids in real-time and solves via backtracking under live video constraints.',
    tech: ['OpenCV', 'Python', 'Algorithms'],
    link: 'https://github.com/ProudStone-576/realtime-sudoku-vision-solver',
    accent: 'bone',
    size: 'sm',
  },
  {
    n: '04',
    title: 'AI Solution Evaluation System',
    tag: 'Systems',
    description: 'MySQL-based platform managing AI tasks, solutions, feedback, ratings, automated evaluations.',
    tech: ['MySQL', 'System Design', 'AI Eval'],
    link: 'https://github.com/ProudStone-576/ai-solution-evaluation-system',
    accent: 'cobalt',
    size: 'md',
  },
  {
    n: '05',
    title: 'Bulldozer Price Prediction',
    tag: 'Deep Learning · Tabular',
    description: 'TensorFlow neural network predicting bulldozer auction prices on structured tabular data.',
    tech: ['TensorFlow', 'Neural Net', 'Regression'],
    link: 'https://github.com/ProudStone-576/Bulldozer-price-prediction-model',
    accent: 'bone',
    size: 'sm',
  },
  {
    n: '06',
    title: 'Heart Disease Prediction',
    tag: 'Healthcare ML',
    description: 'Supervised learning for heart disease risk on clinical data with validated metrics.',
    tech: ['Classification', 'Healthcare', 'Python'],
    link: 'https://github.com/ProudStone-576/Heart-Disease-Model',
    accent: 'acid',
    size: 'md',
  },
];

const accentMap: Record<string, string> = {
  acid: 'group-hover:bg-acid group-hover:text-ink',
  plasma: 'group-hover:bg-plasma group-hover:text-ink',
  cobalt: 'group-hover:bg-cobalt group-hover:text-bone',
  bone: 'group-hover:bg-bone group-hover:text-ink',
};

const sizeMap: Record<string, string> = {
  lg: 'md:col-span-8 md:row-span-2 md:min-h-[640px]',
  md: 'md:col-span-4 md:min-h-[310px]',
  sm: 'md:col-span-4 md:min-h-[310px]',
};

export default function ProjectsSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-card]').forEach((el, i) => {
        gsap.from(el, {
          y: 80,
          opacity: 0,
          duration: 1,
          ease: 'expo.out',
          delay: (i % 3) * 0.08,
          scrollTrigger: { trigger: el, start: 'top 90%' },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="projects"
      className="relative py-32 md:py-44 px-5 md:px-10 bg-ink overflow-hidden border-t border-bone/5"
    >
      <div className="max-w-[1500px] mx-auto scroll-skew">
        <div className="grid grid-cols-12 gap-y-12 md:gap-x-10 mb-16 md:mb-24">
          <div className="col-span-12 md:col-span-7">
            <div className="mono text-[10px] uppercase tracking-[0.4em] text-acid mb-4">
              ◉ 05 — Selected Work
            </div>
            <h2 className="display text-6xl md:text-[8vw] text-bone leading-[0.9]">
              Things I've <span className="italic text-acid">shipped.</span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4 md:col-start-9 self-end">
            <p className="text-bone/70 leading-relaxed">
              Each project is selected not for quantity, but for what it proves about how I think and build.
            </p>
            <a
              href="https://github.com/ProudStone-576"
              target="_blank"
              data-cursor="GitHub"
              className="mt-6 inline-flex items-center gap-2 mono text-xs uppercase tracking-widest text-bone hover:text-acid transition-colors"
            >
              All repos <span>↗</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5 auto-rows-fr">
          {projects.map((p, idx) => (
            <a
              key={p.n}
              href={p.link}
              target="_blank"
              data-card
              data-parallax-vel
              data-cursor="Open"
              style={{ ['--vel-mul' as never]: ((idx % 3) - 1) * 1.4 + 0.4 }}
              className={`relative group bg-bone/[0.02] border border-bone/10 rounded-3xl overflow-hidden p-7 md:p-9 flex flex-col justify-between transition-colors duration-500 ${sizeMap[p.size]} ${accentMap[p.accent]}`}
            >
              <div className="flex items-center justify-between">
                <span className="mono text-[10px] uppercase tracking-[0.3em] text-bone/40 group-hover:text-current transition-colors">
                  {p.n} · {p.tag}
                </span>
                <span className="text-2xl text-bone/30 group-hover:text-current group-hover:rotate-45 transition-all duration-500">
                  ↗
                </span>
              </div>

              <div>
                <h3 className={`display ${p.size === 'lg' ? 'text-4xl md:text-6xl' : 'text-2xl md:text-3xl'} mb-4 leading-tight`}>
                  {p.title}
                </h3>
                <p className={`text-sm md:text-base text-bone/65 group-hover:text-current/80 leading-relaxed ${p.size === 'lg' ? 'max-w-md' : 'max-w-sm'}`}>
                  {p.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border border-bone/15 text-bone/60 group-hover:border-current/30 group-hover:text-current transition-colors"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
