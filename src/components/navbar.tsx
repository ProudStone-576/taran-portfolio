import { useEffect, useState } from 'react';
import { Atom } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const domains = [
  'Data Science & Analytics',
  'AI / Machine Learning',
  'Data Engineering & Pipelines',
  'Backend & API Systems',
  'Financial & Time-Series Modeling',
  'Synthetic Data & Privacy Engineering',
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 md:h-20
        transition-colors duration-300
        ${scrolled ? 'bg-black/90 border-b border-white/10' : 'bg-transparent'}
      `}
      style={{ backdropFilter: scrolled ? 'blur(10px)' : 'none' }}
    >
      <div className="max-w-7xl mx-auto h-full px-4 md:px-6 flex items-center justify-between">

        {/* Logo */}
        <a href="#top" className="flex items-center gap-2 text-white font-semibold text-lg">
          <Atom className="w-5 h-5" />
          TARAN
        </a>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          <li className="relative group cursor-default">
            <span className="hover:text-white transition-colors">Domains</span>
            <ul className="
              absolute left-1/2 -translate-x-1/2 mt-3
              hidden group-hover:block
              bg-black border border-white/10 rounded-md p-4
              space-y-2 min-w-[260px]
            ">
              {domains.map(d => (
                <li key={d} className="text-gray-400 text-sm">{d}</li>
              ))}
            </ul>
          </li>

          <li><a href="#about" className="hover:text-white">About</a></li>
          <li><a href="#projects" className="hover:text-white">Projects</a></li>
          <li><a href="#process" className="hover:text-white">Process</a></li>
          <li><a href="#contact" className="hover:text-white">Contact</a></li>
        </ul>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3 text-sm">
          <a
            href="src/assets/Taran_Matharu_resume.pdf"
            className="px-3 py-1.5 border border-white/30 rounded text-white"
          >
            Resume
          </a>
          <a
            href="https://github.com/ProudStone-576"
            target="_blank"
            className="px-3 py-1.5 bg-white text-black rounded"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/taran-matharu-/"
            target="_blank"
            className="px-3 py-1.5 bg-white text-black rounded"
          >
            LinkedIn
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(v => !v)}
          className="md:hidden w-8 h-8 flex flex-col justify-center gap-1"
          aria-label="Menu"
        >
          <span className="h-0.5 bg-white w-full" />
          <span className="h-0.5 bg-white w-4/5 ml-auto" />
          <span className="h-0.5 bg-white w-3/5 ml-auto" />
        </button>
      </div>

      {/* Mobile Menu Overlay + Panel */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Menu */}
            <motion.div
              className="md:hidden bg-black border-t border-white/10 px-6 py-8"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <ul className="flex flex-col gap-6 text-lg text-gray-300">

                <li className="text-white font-medium">Domains</li>
                <ul className="pl-4 space-y-2 text-sm text-gray-400">
                  {domains.map(d => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>

                <li><a href="#about" onClick={() => setMobileOpen(false)}>About</a></li>
                <li><a href="#projects" onClick={() => setMobileOpen(false)}>Projects</a></li>
                <li><a href="#process" onClick={() => setMobileOpen(false)}>Process</a></li>
                <li><a href="#contact" onClick={() => setMobileOpen(false)}>Contact</a></li>

                <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                  <a
                    href="/resume.pdf"
                    className="border border-white/30 rounded px-4 py-2 text-center"
                  >
                    Resume
                  </a>
                  <a
                    href="https://github.com/ProudStone-576"
                    className="bg-white text-black rounded px-4 py-2 text-center"
                  >
                    GitHub
                  </a>
                </div>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
