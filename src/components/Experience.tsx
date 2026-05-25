import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const jobs = [
  {
    id: 'EX-01',
    role: 'Customer Service Agent',
    org: 'Executive Aviation · Abbotsford Airport (YXX)',
    when: 'Apr 2025 — Present',
    where: 'Abbotsford, BC',
    status: 'active',
    bullets: [
      'Operate check-in kiosks, boarding scanners, baggage printers, and flight software daily; resolve most hardware/software faults on the spot.',
      'Diagnose technical issues and escalate complex problems to IT with detailed reporting that shortens resolution time.',
    ],
    tech: ['Kiosks', 'Scanners', 'Printers', 'Flight Ops Sw'],
  },
  {
    id: 'EX-02',
    role: 'IT Technician (Part-Time)',
    org: 'ONeID Trust Technologies — EdTech Platform',
    when: 'Jan 2025 — Oct 2025',
    where: 'Abbotsford, BC',
    status: 'closed',
    bullets: [
      'Provided day-to-day technical support to 15+ users — software errors, network connectivity, hardware faults.',
      'Administered 8+ services and databases; maintained 99%+ uptime through proactive monitoring and rapid recovery.',
      'Managed Jira ticket queue, wrote troubleshooting guides, documented configurations to speed up new-user onboarding.',
      'Built Python and Bash scripts that automated repetitive manual tasks, saving 20+ hours per week across the team.',
    ],
    tech: ['Jira', 'Python', 'Bash', 'SQL', 'Linux'],
  },
  {
    id: 'EX-03',
    role: 'General Clerk',
    org: 'Save-On-Foods',
    when: 'Jun 2023 — Oct 2025',
    where: 'Abbotsford, BC',
    status: 'closed',
    bullets: [
      'Operated and troubleshot POS systems, barcode scanners, self-checkout terminals, and printers daily; escalated complex issues to IT.',
      'Trained 10+ new staff on POS systems, equipment procedures, and inventory processes.',
    ],
    tech: ['POS', 'Scanners', 'Inventory Sys'],
  },
];

export default function Experience() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-exp-head]', {
        y: 60, opacity: 0, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: '[data-exp-head]', start: 'top 80%' },
      });
      gsap.utils.toArray<HTMLElement>('[data-exp-card]').forEach((el, i) => {
        gsap.from(el, {
          y: 70, opacity: 0, duration: 0.9, ease: 'expo.out',
          delay: i * 0.08,
          scrollTrigger: { trigger: el, start: 'top 88%' },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="experience"
      className="relative py-32 md:py-44 px-5 md:px-10 bg-ink overflow-hidden border-t border-acid/15"
    >
      <div className="max-w-[1500px] mx-auto scroll-skew">
        <div data-exp-head className="grid grid-cols-12 gap-y-12 md:gap-x-10 mb-16 md:mb-24">
          <div className="col-span-12 md:col-span-7">
            <div className="mono text-[10px] uppercase tracking-[0.4em] text-acid mb-4 flex items-center gap-3">
              <span className="led led-green animate-led-blink" />
              ◉ 06 — service.log
            </div>
            <h2 className="display text-5xl md:text-7xl text-bone leading-[0.95]">
              Field <span className="italic text-acid">history.</span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4 md:col-start-9 self-end">
            <p className="text-bone/70 leading-relaxed">
              Roles where the work was always hands-on: real users, real hardware,
              real downtime to fix. Time on shift, not time in a slide deck.
            </p>
          </div>
        </div>

        {/* timeline */}
        <div className="relative">
          {/* spine */}
          <div className="absolute left-3 md:left-1/2 top-0 bottom-0 w-px bg-acid/20" />

          <div className="space-y-12">
            {jobs.map((j, i) => (
              <div
                key={j.id}
                data-exp-card
                className={
                  'relative grid grid-cols-12 gap-5 md:gap-10 items-start ' +
                  (i % 2 === 0 ? '' : 'md:flex-row-reverse')
                }
              >
                {/* node */}
                <div className="absolute left-3 md:left-1/2 -translate-x-1/2 top-2 z-10 flex items-center justify-center">
                  <span className={
                    'w-3 h-3 rounded-full ring-4 ring-ink ' +
                    (j.status === 'active' ? 'bg-acid animate-led-blink' : 'bg-bone/30')
                  } />
                </div>

                {/* card */}
                <div className={
                  'col-span-12 pl-10 md:pl-0 ' +
                  (i % 2 === 0 ? 'md:col-span-5 md:pr-12 md:text-right' : 'md:col-span-5 md:col-start-8 md:pl-12')
                }>
                  <div className="mono text-[10px] uppercase tracking-[0.3em] text-bone/40 mb-2 flex items-center gap-2 md:justify-end">
                    <span className={j.status === 'active' ? 'text-acid' : 'text-bone/40'}>{j.id}</span>
                    <span>·</span>
                    <span>{j.when}</span>
                  </div>
                  <h3 className="display text-2xl md:text-3xl text-bone">{j.role}</h3>
                  <div className="mono text-[11px] text-acid mt-1">{j.org}</div>
                  <div className="mono text-[10px] text-bone/40 mt-0.5">{j.where}</div>

                  <ul className="mt-5 space-y-2.5">
                    {j.bullets.map((b, k) => (
                      <li key={k} className="text-sm text-bone/75 leading-relaxed flex gap-2.5">
                        <span className="text-acid shrink-0">▸</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={'mt-4 flex flex-wrap gap-2 ' + (i % 2 === 0 ? 'md:justify-end' : '')}>
                    {j.tech.map((t) => (
                      <span
                        key={t}
                        className="mono text-[10px] uppercase tracking-widest px-2.5 py-1 border border-bone/15 text-bone/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
