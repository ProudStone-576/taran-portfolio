import { useEffect, useState } from 'react';
import Magnetic from './components/Magnetic';

export default function Footer() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      setTime(`${h}:${m} PST`);
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="relative bg-ink border-t border-acid/15 overflow-hidden scroll-skew">
      {/* Giant name */}
      <div className="px-5 md:px-10 pt-20 pb-8">
        <div className="max-w-[1500px] mx-auto">
          <a
            href="#home"
            data-cursor="Top"
            className="block display text-[20vw] md:text-[16vw] leading-[0.8] text-bone hover:text-acid transition-colors duration-700 -tracking-[0.04em]"
          >
            Taran<span className="italic text-acid">.</span>M
          </a>
        </div>
      </div>

      <div className="px-5 md:px-10 pb-10 border-t border-acid/15">
        <div className="max-w-[1500px] mx-auto pt-10 grid grid-cols-2 md:grid-cols-12 gap-y-10 md:gap-x-10">
          <div className="col-span-2 md:col-span-4">
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-bone/40 mb-3 flex items-center gap-2">
              <span className="led led-green animate-led-blink" />
              on shift from
            </div>
            <div className="text-bone">Abbotsford, BC</div>
            <div className="text-bone/50 mono text-xs mt-1">{time}</div>
            <div className="text-acid mono text-xs mt-3">+1 (236) 632-8270</div>
          </div>

          <div className="col-span-1 md:col-span-3">
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-bone/40 mb-3">
              Navigate
            </div>
            <ul className="space-y-2 text-bone/80">
              <li><a href="#about" className="hover:text-acid transition-colors">Profile</a></li>
              <li><a href="#skills" className="hover:text-acid transition-colors">Skills</a></li>
              <li><a href="#homelab" className="hover:text-acid transition-colors">Home.Lab</a></li>
              <li><a href="#experience" className="hover:text-acid transition-colors">Service</a></li>
              <li><a href="#projects" className="hover:text-acid transition-colors">Work</a></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-3">
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-bone/40 mb-3">
              Connect
            </div>
            <ul className="space-y-2 text-bone/80">
              <li><a href="https://github.com/ProudStone-576" target="_blank" data-cursor="GitHub" className="hover:text-acid transition-colors">GitHub ↗</a></li>
              <li><a href="https://linkedin.com/in/taran-matharu-/" target="_blank" data-cursor="LinkedIn" className="hover:text-acid transition-colors">LinkedIn ↗</a></li>
              <li><a href="mailto:taranjeetsinghmatharu15@gmail.com" data-cursor="Mail" className="hover:text-acid transition-colors">Email ↗</a></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-2 md:text-right">
            <Magnetic>
              <a
                href="#contact"
                data-cursor="Talk"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-acid text-ink mono text-xs uppercase tracking-widest font-bold"
              >
                open ticket
              </a>
            </Magnetic>
          </div>
        </div>

        <div className="max-w-[1500px] mx-auto mt-16 pt-6 border-t border-acid/15 flex flex-col md:flex-row justify-between gap-4 mono text-[10px] uppercase tracking-widest text-bone/40">
          <span>© {new Date().getFullYear()} Taran Matharu — operator on shift</span>
          <span>v4.0 · NOC build · contoso.lab</span>
        </div>
      </div>
    </footer>
  );
}
