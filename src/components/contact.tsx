import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from './Magnetic';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>('[data-contact-line] > span > span');
      gsap.set(lines, { yPercent: 110 });
      ScrollTrigger.create({
        trigger: '[data-contact-line]',
        start: 'top 80%',
        onEnter: () => gsap.to(lines, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08 }),
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="contact"
      className="relative py-32 md:py-44 px-5 md:px-10 bg-ink overflow-hidden border-t border-bone/5"
    >
      <div className="max-w-[1500px] mx-auto scroll-skew">
        <div className="grid grid-cols-12 mb-16 md:mb-24 gap-y-8">
          <div className="col-span-12 md:col-span-4">
            <div className="mono text-[10px] uppercase tracking-[0.4em] text-acid mb-4">
              ◉ 07 — Contact
            </div>
            <p className="text-bone/70 max-w-xs leading-relaxed">
              Technical collaboration, research conversations, or system-level work. The inbox is open.
            </p>
          </div>
          <div className="col-span-12 md:col-span-8">
            <h2
              data-contact-line
              className="display text-[14vw] md:text-[10vw] leading-[0.9] text-bone"
            >
              <span className="block overflow-hidden"><span className="block">Let's build</span></span>
              <span className="block overflow-hidden"><span className="block italic text-acid">something</span></span>
              <span className="block overflow-hidden"><span className="block">that thinks.</span></span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-bone/10 border border-bone/10 rounded-3xl overflow-hidden mb-12">
          {[
            { l: 'Email', v: 'taranjeetsinghmatharu15@gmail.com', href: 'mailto:taranjeetsinghmatharu15@gmail.com' },
            { l: 'Phone', v: '+1 (236) 632-8270', href: 'tel:+12366328270' },
            { l: 'Location', v: 'Abbotsford, BC · Canada' },
          ].map((c) => (
            <div key={c.l} className="md:col-span-4 bg-ink p-8 md:p-10 group hover:bg-acid/5 transition-colors">
              <div className="mono text-[10px] uppercase tracking-[0.3em] text-bone/40 mb-3">
                {c.l}
              </div>
              {c.href ? (
                <a
                  href={c.href}
                  data-cursor="Copy"
                  className="display text-2xl md:text-3xl text-bone group-hover:text-acid transition-colors break-all"
                >
                  {c.v}
                </a>
              ) : (
                <div className="display text-2xl md:text-3xl text-bone">{c.v}</div>
              )}
            </div>
          ))}
        </div>

        <form
          action="https://formsubmit.co/taranjeetsinghmatharu15@gmail.com"
          method="POST"
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5"
        >
          <input type="text" name="_honey" className="hidden" autoComplete="off" />
          <input type="hidden" name="_subject" value="New inquiry from portfolio" />
          <input type="hidden" name="_template" value="table" />

          <input
            name="name"
            placeholder="Your name"
            required
            data-cursor="Type"
            className="bg-bone/[0.03] border border-bone/15 text-bone placeholder-bone/30 px-6 py-5 rounded-2xl focus:outline-none focus:border-acid transition-colors mono text-sm"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            data-cursor="Type"
            className="bg-bone/[0.03] border border-bone/15 text-bone placeholder-bone/30 px-6 py-5 rounded-2xl focus:outline-none focus:border-acid transition-colors mono text-sm"
          />
          <textarea
            name="message"
            rows={6}
            placeholder="Describe the problem, idea, or system."
            required
            data-cursor="Type"
            className="md:col-span-2 bg-bone/[0.03] border border-bone/15 text-bone placeholder-bone/30 px-6 py-5 rounded-2xl focus:outline-none focus:border-acid transition-colors mono text-sm resize-none"
          />
          <div className="md:col-span-2 flex justify-end">
            <Magnetic strength={0.25}>
              <button
                type="submit"
                data-cursor="Send"
                className="group inline-flex items-center gap-4 px-8 py-5 bg-acid text-ink mono text-xs uppercase tracking-widest font-bold rounded-full hover:gap-6 transition-all"
              >
                Send inquiry
                <span className="w-2 h-2 rounded-full bg-ink group-hover:scale-150 transition-transform" />
              </button>
            </Magnetic>
          </div>
        </form>
      </div>
    </section>
  );
}
