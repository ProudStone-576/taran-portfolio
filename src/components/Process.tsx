import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { n: '01', t: 'Receive & Acknowledge', d: 'Ticket lands. Reply in minutes, not hours. Set expectation early — even "investigating" lowers user anxiety.', accent: 'acid' },
  { n: '02', t: 'Triage & Scope',         d: 'One user or many? Recurring or new? Hardware, software, network, account? Tag, prioritise, route.', accent: 'amber' },
  { n: '03', t: 'Reproduce & Isolate',    d: 'Mirror the user\'s steps. Eliminate variables: account, machine, network, application. Find the layer.', accent: 'bone' },
  { n: '04', t: 'Resolve or Escalate',    d: 'Fix where I can. Escalate cleanly when needed — full repro steps, logs, what I already tried. No bouncing.', accent: 'acid' },
  { n: '05', t: 'Document & Close',       d: 'KB article or runbook update. Tag root cause. Close with clear user-facing note.', accent: 'amber' },
  { n: '06', t: 'Patch the Pattern',      d: 'If three users hit the same thing, the system is wrong. Script, GPO, image change — fix the source.', accent: 'bone' },
];

const accentBg: Record<string, string> = {
  acid: 'bg-acid text-ink',
  amber: 'bg-amber text-ink',
  bone: 'bg-bone text-ink',
};
const accentDot: Record<string, string> = {
  acid: 'bg-acid',
  amber: 'bg-amber',
  bone: 'bg-bone',
};

export default function Process() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-stack-card]');
      const total = cards.length;

      cards.forEach((card, i) => {
        const isLast = i === total - 1;
        if (isLast) return;

        gsap.to(card, {
          scale: 0.86,
          rotationX: -8,
          opacity: 0.35,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'center center',
            endTrigger: cards[i + 1],
            end: 'center center',
            scrub: 0.6,
          },
        });
      });

      gsap.from('[data-process-head]', {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '[data-process-head]', start: 'top 80%' },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="process"
      className="relative bg-ink overflow-hidden border-t border-acid/15"
      style={{ perspective: '1200px' }}
    >
      <div className="px-5 md:px-10 pt-32 md:pt-44 pb-16">
        <div className="max-w-[1500px] mx-auto">
          <div data-process-head className="grid grid-cols-12 gap-y-12 md:gap-x-10">
            <div className="col-span-12 md:col-span-5">
              <div className="mono text-[10px] uppercase tracking-[0.4em] text-acid mb-4 flex items-center gap-3">
                <span className="led led-green animate-led-blink" />
                ◉ 05 — incident.workflow
              </div>
              <h2 className="display text-5xl md:text-7xl text-bone leading-[0.95]">
                Ticket in.<br />
                <span className="italic text-acid">Resolved out.</span>
              </h2>
            </div>
            <div className="col-span-12 md:col-span-6 md:col-start-7 self-end">
              <p className="text-bone/70 text-lg leading-relaxed max-w-lg">
                Six stages from "user pings" to "closed with a runbook." Every step
                cuts the time the next person spends on the same fault.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative px-5 md:px-10 pb-32 md:pb-44">
        <div className="max-w-[1500px] mx-auto relative">
          {steps.map((s, i) => (
            <div
              key={s.n}
              data-stack-card
              className="sticky top-[14vh] mb-[14vh] mx-auto w-full max-w-5xl"
              style={{ zIndex: i + 1, transformOrigin: 'center top' }}
            >
              <article
                className={`relative rounded-none corner-cut overflow-hidden p-8 md:p-14 min-h-[60vh] md:min-h-[58vh] flex flex-col justify-between ${accentBg[s.accent]}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="mono text-[10px] uppercase tracking-[0.4em] opacity-70 mb-3">
                      Stage {s.n} / {String(steps.length).padStart(2, '0')}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-block w-2 h-2 rounded-full ${accentDot[s.accent === 'bone' ? 'acid' : 'bone']} animate-pulse`} />
                      <span className="mono text-xs uppercase tracking-widest opacity-80">
                        {s.accent === 'acid' && 'Critical path'}
                        {s.accent === 'amber' && 'Diagnostic'}
                        {s.accent === 'bone' && 'Knowledge work'}
                      </span>
                    </div>
                  </div>

                  <div className="display text-7xl md:text-9xl leading-none opacity-90">
                    {s.n}
                  </div>
                </div>

                <div>
                  <h3 className="display text-4xl md:text-7xl mb-6 leading-[0.95] tracking-tight max-w-3xl">
                    {s.t}
                  </h3>
                  <p className="text-base md:text-xl leading-relaxed max-w-2xl opacity-80">
                    {s.d}
                  </p>
                </div>

                <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 mono text-[10px] uppercase tracking-[0.3em] opacity-50 flex items-center gap-3">
                  <span className="block w-12 h-px bg-current" />
                  <span>{String((i + 1) / steps.length * 100).slice(0, 3)}%</span>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
