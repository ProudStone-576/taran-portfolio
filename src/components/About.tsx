import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticLetters from './MagneticLetters';
import TextScramble from './TextScramble';
import WordReveal from './WordReveal';

gsap.registerPlugin(ScrollTrigger);

const principles = [
  { k: '01', t: 'User First',     d: 'A confused user is a real problem. Tone, clarity, and follow-up matter as much as the fix.' },
  { k: '02', t: 'Triage Fast',    d: 'Identify scope in 60 seconds. Isolated? Single team? Site-wide? Plan from that.' },
  { k: '03', t: 'Document It',    d: 'If it took longer than 10 minutes, it becomes a runbook. Future me reads them.' },
  { k: '04', t: 'Automate Once',  d: 'Did the same task twice? Script it. PowerShell, Bash, scheduled task — done.' },
];

const certs = [
  { c: 'CompTIA A+',                  s: 'In Progress',        v: 'core hw + os' },
  { c: 'CIS Diploma · UFV',           s: 'Dean\'s List · 3.7', v: 'networking · sysadmin · db' },
  { c: 'BSc Data Science · IIT-M',    s: 'GPA 8.5',            v: 'scripting · automation' },
  { c: 'Home Lab',                    s: 'Live',               v: 'proxmox · ad · pfsense' },
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
              ◉ 02 — operator.profile
            </div>
            <div className="mono text-xs text-bone/60 leading-loose">
              <TextScramble text="IT Support Technician" speed={50} />
              <br />
              <TextScramble text="+ Windows / Server / AD" speed={50} delay={120} />
              <br />
              <TextScramble text="+ Networking / VLAN / VPN" speed={50} delay={240} />
              <br />
              <TextScramble text="+ Scripting / Automation" speed={50} delay={360} />
              <br />
              <span className="text-acid mt-2 inline-block">
                <TextScramble text="Abbotsford, BC" speed={50} delay={480} />
              </span>
            </div>

            <div className="mt-10 mono text-[10px] uppercase tracking-widest text-bone/50 space-y-1">
              <div><span className="text-acid">phone</span> · (236) 632-8270</div>
              <div><span className="text-acid">mail</span> · taranjeetsinghmatharu15@gmail.com</div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-9">
            <h2
              data-about-line
              className="display text-[10vw] md:text-[6vw] leading-[0.95] text-bone"
            >
              <span className="block overflow-hidden"><span className="block">I keep people</span></span>
              <span className="block overflow-hidden"><span className="block"><span className="italic text-acid">working</span>. I keep</span></span>
              <span className="block overflow-hidden"><span className="block text-stroke">systems online.</span></span>
            </h2>

            <WordReveal
              className="mt-12 max-w-2xl text-lg md:text-2xl leading-relaxed"
              text="Hardware fault, account locked, VPN dropping, printer offline — I treat each one as a person blocked from their work, not a row in a queue. Backed by a CIS diploma and a Windows Server lab I run end-to-end."
              highlight={['blocked', 'lab']}
            />

            <div className="mt-10 inline-block">
              <MagneticLetters
                text="TROUBLESHOOT · DOCUMENT · AUTOMATE"
                className="display text-3xl md:text-5xl text-bone/30 hover:text-bone transition-colors"
                radius={120}
                strength={0.3}
              />
            </div>
          </div>
        </div>

        {/* Principles */}
        <div className="mt-24 md:mt-36 grid grid-cols-1 md:grid-cols-4 gap-px bg-acid/15 border border-acid/15">
          {principles.map((p) => (
            <div
              key={p.k}
              data-principle
              className="bg-ink p-8 md:p-10 group relative overflow-hidden"
            >
              <div className="mono text-[10px] uppercase tracking-[0.3em] text-bone/40 mb-6 flex items-center gap-2">
                <span className="led led-green" /> SOP {p.k}
              </div>
              <div className="display text-3xl md:text-4xl text-bone mb-4 group-hover:text-acid transition-colors duration-500">
                {p.t}
              </div>
              <p className="text-sm text-bone/60 leading-relaxed">{p.d}</p>
              <span className="absolute bottom-0 left-0 right-0 h-px bg-acid scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700" />
            </div>
          ))}
        </div>

        {/* Certs */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-px bg-bone/10 border border-bone/10">
          {certs.map((c) => (
            <div key={c.c} className="bg-ink p-6 md:p-8 group hover:bg-acid/5 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="mono text-[9px] uppercase tracking-[0.3em] text-acid">{c.s}</span>
                <span className="led led-green animate-led-blink" />
              </div>
              <div className="display text-xl text-bone mb-1">{c.c}</div>
              <div className="mono text-[10px] uppercase tracking-widest text-bone/40">{c.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
