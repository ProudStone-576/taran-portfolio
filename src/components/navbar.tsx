import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Magnetic from './Magnetic';

const links = [
  { href: '#about',      label: 'Profile' },
  { href: '#skills',     label: 'Skills' },
  { href: '#homelab',    label: 'Home.Lab' },
  { href: '#process',    label: 'Process' },
  { href: '#experience', label: 'Service' },
  { href: '#projects',   label: 'Work' },
  { href: '#contact',    label: 'Ticket' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div
          className={`mx-auto max-w-[1500px] px-5 md:px-10 pt-5 md:pt-6 transition-all duration-500 ${
            scrolled ? 'pt-3 md:pt-3' : ''
          }`}
        >
          <div
            className={`flex items-center justify-between px-5 md:px-6 py-3 transition-all duration-500 border ${
              scrolled
                ? 'bg-ink/80 backdrop-blur-xl border-acid/20'
                : 'bg-transparent border-transparent'
            }`}
          >
            <a href="#home" data-cursor="Top" className="flex items-center gap-3 group">
              <span className="relative w-7 h-7 bg-acid flex items-center justify-center">
                <span className="absolute inset-0 bg-acid animate-ping opacity-50" />
                <span className="relative w-2 h-2 bg-ink" />
              </span>
              <span className="mono text-xs uppercase tracking-[0.25em] text-bone group-hover:text-acid transition-colors">
                taran<span className="text-bone/40">.matharu</span>
              </span>
            </a>

            <ul className="hidden md:flex items-center gap-1">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    data-cursor="Go"
                    className="relative px-4 py-2 mono text-xs uppercase tracking-widest text-bone/70 hover:text-bone transition-colors group"
                  >
                    <span>{l.label}</span>
                    <span className="absolute left-4 right-4 -bottom-0.5 h-px bg-acid scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                  </a>
                </li>
              ))}
            </ul>

            <div className="hidden md:block">
              <Magnetic>
                <a
                  href="/Taran_Matharu_resume.pdf"
                  target="_blank"
                  data-cursor="PDF"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-acid text-ink mono text-xs uppercase tracking-widest font-bold hover:bg-bone transition-colors"
                >
                  resume.pdf
                  <span className="block w-1.5 h-1.5 bg-ink" />
                </a>
              </Magnetic>
            </div>

            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
              className="md:hidden flex flex-col gap-1.5 w-8 h-8 items-center justify-center"
            >
              <span className={`h-px w-6 bg-bone transition-transform ${open ? 'translate-y-[3px] rotate-45' : ''}`} />
              <span className={`h-px w-6 bg-bone transition-transform ${open ? '-translate-y-[3px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden bg-ink"
          >
            <motion.ul
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{
                show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
                hidden: {},
              }}
              className="h-full flex flex-col items-start justify-center px-8 gap-4"
            >
              {links.map((l) => (
                <motion.li
                  key={l.href}
                  variants={{
                    hidden: { y: 50, opacity: 0 },
                    show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } },
                  }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="display text-5xl text-bone hover:text-acid transition-colors"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <motion.li
                variants={{
                  hidden: { y: 50, opacity: 0 },
                  show: { y: 0, opacity: 1, transition: { duration: 0.6 } },
                }}
                className="mt-8"
              >
                <a
                  href="/Taran_Matharu_resume.pdf"
                  target="_blank"
                  className="mono text-xs uppercase tracking-widest border border-acid/40 px-5 py-3"
                >
                  resume.pdf ↗
                </a>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
