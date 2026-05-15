import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticLetters from './MagneticLetters';
import TextScramble from './TextScramble';
import WordReveal from './WordReveal';

gsap.registerPlugin(ScrollTrigger);

const principles = [
  { k: '01', t: 'Mechanism', d: 'Find what moves the system, not what moves with it.' },
  { k: '02', t: 'Measurement', d: 'Numbers must mean something. Define before you compute.' },
  { k: '03', t: 'Iteration', d: 'A model is a hypothesis. Tested in production, not slides.' },
  { k: '04', t: 'Restraint', d: 'Simpler systems are debuggable systems. Bigger isn\'t better.' },
];

export default function About() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>('[data-about-line] > span > span');
      gsap.set(lines, { yPercent: 110 });
      ScrollTrigger.create({
        trigger: '[data-about-line]',
        start: 'top 80%',
        onEnter: () => {
          gsap.to(lines, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.07 });
        },
      });

      gsap.utils.toArray<HTMLElement>('[data-principle]').forEach((el, i) => {
        gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: 'expo.out',
          delay: i * 0.08,
          scrollTrigger: { trigger: el, start: 'top 88%' },
        });
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="about"
      className="relative py-32 md:py-44 px-5 md:px-10 bg-ink overflow-hidden"
    >
      <div className="max-w-[1500px] mx-auto scroll-skew">
        <div className="grid grid-cols-12 gap-y-16 md:gap-x-10">
          <div className="col-span-12 md:col-span-3">
            <div className="mono text-[10px] uppercase tracking-[0.4em] text-acid mb-6">
              ◉ 02 — About
            </div>
            <div className="mono text-xs text-bone/40 leading-loose">
              <TextScramble text="Data Scientist" speed={50} />
              <br />
              <TextScramble text="+ AI / ML Engineer" speed={50} delay={120} />
              <br />
              <TextScramble text="+ Systems Builder" speed={50} delay={240} />
              <br />
              <span className="text-acid mt-2 inline-block">
                <TextScramble text="Based in BC, Canada" speed={50} delay={360} />
              </span>
            </div>
          </div>

          <div className="col-span-12 md:col-span-9">
            <h2
              data-about-line
              className="display text-[10vw] md:text-[6vw] leading-[0.95] text-bone"
            >
              <span className="block overflow-hidden"><span className="block">I build models</span></span>
              <span className="block overflow-hidden"><span className="block">that <span className="italic text-acid">interrogate</span> reality —</span></span>
              <span className="block overflow-hidden"><span className="block text-stroke">not decorate it.</span></span>
            </h2>

            <WordReveal
              className="mt-12 max-w-2xl text-lg md:text-2xl leading-relaxed"
              text="Tools matter only when thinking is sound. My focus is extracting decision value from messy data where correlation fails and causality matters — across motor unit dynamics, financial volatility, and applied ML systems."
              highlight={['causality', 'mechanisms']}
            />

            <div className="mt-10 inline-block">
              <MagneticLetters
                text="SYSTEMS THINKING · DATA · AI"
                className="display text-3xl md:text-5xl text-bone/30 hover:text-bone transition-colors"
                radius={120}
                strength={0.3}
              />
            </div>
          </div>
        </div>

        {/* Principles bento */}
        <div className="mt-24 md:mt-36 grid grid-cols-1 md:grid-cols-4 gap-px bg-bone/10 border border-bone/10">
          {principles.map((p) => (
            <div
              key={p.k}
              data-principle
              className="bg-ink p-8 md:p-10 group relative overflow-hidden"
            >
              <div className="mono text-[10px] uppercase tracking-[0.3em] text-bone/40 mb-6">
                Principle {p.k}
              </div>
              <div className="display text-3xl md:text-4xl text-bone mb-4 group-hover:text-acid transition-colors duration-500">
                {p.t}
              </div>
              <p className="text-sm text-bone/60 leading-relaxed">{p.d}</p>
              <span className="absolute bottom-0 left-0 right-0 h-px bg-acid scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700" />
              <span className="absolute -top-10 -right-10 w-20 h-20 bg-acid/0 group-hover:bg-acid/20 rounded-full blur-2xl transition-colors duration-700" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
