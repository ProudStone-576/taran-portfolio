import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Magnetic from './Magnetic';

const bootLines = [
  '[ OK ]  initrd: loading kernel modules ............ done',
  '[ OK ]  systemd[1]: starting taran.matharu.service',
  '[ OK ]  active directory: contoso.lab        ........ online',
  '[ OK ]  dhcp-server   (192.168.10.0/24)      ........ leases ok',
  '[ OK ]  dns-resolver  (forward + reverse)    ........ healthy',
  '[ OK ]  pfsense       (vlan 10/20/30/99)     ........ no drops',
  '[ OK ]  proxmox-ve    (3 nodes, 14 vms)      ........ quorate',
  '[ OK ]  freshdesk     (queue: 7 open)        ........ polling',
  '[ OK ]  ssh-agent     keys loaded            ........ ready',
  '> operator handshake ........................... taran.matharu',
  '> role .......................................... IT Support Technician',
  '> standby for incoming tickets .................. listening',
];

const stats = [
  { k: 'Uptime',     v: '99.97%',   sub: 'lab · 90d',     color: 'acid'  },
  { k: 'Tickets',    v: '1,284',    sub: 'resolved',      color: 'acid'  },
  { k: 'Users',      v: '15+',      sub: 'supported',     color: 'acid'  },
  { k: 'VMs',        v: '14',       sub: 'proxmox live',  color: 'amber' },
  { k: 'Auto-Saved', v: '20h/wk',   sub: 'PowerShell',    color: 'acid'  },
  { k: 'MTTR',       v: '< 12m',    sub: 'L1 incidents',  color: 'amber' },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [clock, setClock] = useState('00:00:00 PST');
  const [bootIdx, setBootIdx] = useState(0);
  const [cpu, setCpu] = useState(23);
  const [mem, setMem] = useState(47);
  const [net, setNet] = useState(8);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      const s = String(d.getSeconds()).padStart(2, '0');
      setClock(h + ':' + m + ':' + s + ' PST');
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (bootIdx >= bootLines.length) return;
    const t = setTimeout(() => setBootIdx((i) => i + 1), 180 + Math.random() * 120);
    return () => clearTimeout(t);
  }, [bootIdx]);

  useEffect(() => {
    const id = setInterval(() => {
      setCpu((v) => Math.max(6, Math.min(92, v + (Math.random() - 0.5) * 14)));
      setMem((v) => Math.max(20, Math.min(88, v + (Math.random() - 0.5) * 6)));
      setNet((v) => Math.max(1, Math.min(96, v + (Math.random() - 0.5) * 20)));
    }, 900);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 1.2, defaults: { ease: 'expo.out' } });
      tl.from('[data-hero-fade]', { y: 18, autoAlpha: 0, duration: 0.9, stagger: 0.06 })
        .from('[data-hero-cta]', { y: 16, autoAlpha: 0, duration: 0.7, stagger: 0.08 }, '-=0.6');
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="home" className="relative bg-ink min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/0 via-ink/40 to-ink pointer-events-none" />

      {/* corner brackets */}
      {(['tl', 'tr', 'bl', 'br'] as const).map((p) => (
        <Bracket key={p} pos={p} />
      ))}

      {/* TOP META */}
      <div
        data-hero-fade
        className="absolute top-20 md:top-24 inset-x-0 z-20 px-5 md:px-12 flex justify-between items-center mono text-[10px] uppercase tracking-[0.35em] text-bone/65"
      >
        <div className="flex items-center gap-3">
          <span className="led led-green animate-led-pulse" />
          <span className="text-acid">link · up · operator · on-shift</span>
          <span className="hidden md:inline text-bone/30">·</span>
          <span className="hidden md:inline">abbotsford · bc · 49.05°n -122.31°w</span>
        </div>
        <div className="flex items-center gap-3 text-bone/70">
          <span className="hidden md:inline tabular-nums text-acid">{clock}</span>
          <span className="hidden md:inline text-bone/30">·</span>
          <span>noc · v4 · 2026</span>
        </div>
      </div>

      <div className="relative z-10 max-w-[1500px] mx-auto px-5 md:px-12 pt-40 md:pt-44 pb-24 grid grid-cols-12 gap-5 md:gap-8">
        {/* IDENTITY + HEADLINE */}
        <div className="col-span-12 lg:col-span-7 flex flex-col justify-between">
          <div>
            <div data-hero-fade className="mono text-[10px] uppercase tracking-[0.4em] text-acid mb-6 flex items-center gap-3">
              <span className="led led-green animate-led-blink" />
              <span>◉ 00 — operator.callsign</span>
            </div>

            <h1
              data-hero-fade
              className="display text-bone text-[16vw] md:text-[10vw] lg:text-[8.5vw] leading-[0.85] tracking-tight"
            >
              <span className="block">Taran</span>
              <span className="block italic text-acid">Matharu<span className="text-bone">.</span></span>
            </h1>

            <div data-hero-fade className="mt-6 mono text-sm md:text-base text-bone/80 uppercase tracking-[0.35em]">
              <span className="text-amber">IT</span> · Support · Technician
            </div>

            <p data-hero-fade className="mt-8 text-bone/75 text-base md:text-lg leading-relaxed max-w-xl">
              I keep users productive and systems online. Hardware, networking,
              Windows Server, <span className="text-acid">Active Directory</span> — and a
              self-built home lab that mirrors a real corporate environment.
              Live status below.
            </p>

            <div data-hero-cta className="mt-10 flex flex-wrap gap-3">
              <Magnetic>
                <a
                  href="#homelab"
                  data-cursor="Lab"
                  className="group relative inline-flex items-center gap-3 px-6 py-4 bg-acid text-ink mono text-[11px] uppercase tracking-[0.3em] font-bold hover:gap-5 transition-all"
                >
                  <span className="led led-red" />
                  inspect home.lab
                  <span className="w-1.5 h-1.5 bg-ink group-hover:scale-150 transition-transform" />
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="#contact"
                  data-cursor="Ticket"
                  className="inline-flex items-center gap-3 px-6 py-4 border border-acid/40 mono text-[11px] uppercase tracking-[0.3em] text-bone hover:border-acid hover:text-acid transition-colors backdrop-blur-sm bg-ink/30"
                >
                  open · ticket
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="/Taran_Matharu_resume.pdf"
                  target="_blank"
                  data-cursor="PDF"
                  className="inline-flex items-center gap-3 px-6 py-4 border border-bone/20 mono text-[11px] uppercase tracking-[0.3em] text-bone/80 hover:border-bone hover:text-bone transition-colors"
                >
                  resume.pdf ↗
                </a>
              </Magnetic>
            </div>
          </div>

          {/* stat strip */}
          <div data-hero-cta className="mt-12 grid grid-cols-3 md:grid-cols-6 gap-px bg-bone/10 border border-bone/10">
            {stats.map((s) => (
              <div key={s.k} className="bg-ink p-3 md:p-4">
                <div className="mono text-[9px] uppercase tracking-[0.3em] text-bone/40">{s.k}</div>
                <div className={'display text-xl md:text-2xl mt-1 ' + (s.color === 'amber' ? 'term-amber' : 'term')}>
                  {s.v}
                </div>
                <div className="mono text-[9px] text-bone/40 mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* TERMINAL BOOT PANEL */}
        <div data-hero-fade className="col-span-12 lg:col-span-5 self-end">
          <div className="panel scanlines">
            <div className="flex items-center justify-between px-4 py-2 border-b border-acid/20 bg-rack/70">
              <div className="flex items-center gap-2">
                <span className="led led-red" />
                <span className="led led-amber" />
                <span className="led led-green animate-led-blink" />
                <span className="mono text-[10px] uppercase tracking-widest text-bone/50 ml-2">
                  ~ / noc / boot.log
                </span>
              </div>
              <span className="mono text-[10px] text-acid">live</span>
            </div>

            <div className="p-4 md:p-5 min-h-[320px] md:min-h-[360px] term text-[11px] md:text-[12px] leading-[1.55] tabular-nums">
              {bootLines.slice(0, bootIdx).map((l, i) => {
                const isOk = l.startsWith('[ OK ]');
                const isPrompt = l.startsWith('>');
                return (
                  <div key={i} className="flex gap-2">
                    {isOk && <span className="text-acid">[ OK ]</span>}
                    {isPrompt && <span className="text-amber">{'>'}</span>}
                    <span className={isOk ? 'text-bone/85' : isPrompt ? 'text-bone' : 'text-bone/70'}>
                      {isOk ? l.replace('[ OK ]  ', '') : l.replace(/^>\s/, '')}
                    </span>
                  </div>
                );
              })}
              {bootIdx < bootLines.length && (
                <div className="text-acid term-cursor" />
              )}
              {bootIdx >= bootLines.length && (
                <div className="mt-2 text-acid term-cursor">root@noc:~$ </div>
              )}
            </div>

            {/* live meters */}
            <div className="border-t border-acid/20 grid grid-cols-3">
              {[
                { l: 'cpu', v: cpu, c: 'acid' },
                { l: 'mem', v: mem, c: 'acid' },
                { l: 'net', v: net, c: 'amber' },
              ].map((m) => (
                <div key={m.l} className="p-3 border-r border-acid/10 last:border-r-0">
                  <div className="flex items-center justify-between mono text-[9px] uppercase tracking-widest text-bone/50">
                    <span>{m.l}</span>
                    <span className={m.c === 'amber' ? 'term-amber' : 'term'}>{Math.round(m.v)}%</span>
                  </div>
                  <div className="mt-2 h-1.5 bg-bone/10 overflow-hidden">
                    <div
                      className={'h-full ' + (m.c === 'amber' ? 'bg-amber' : 'bg-acid')}
                      style={{ width: m.v + '%', boxShadow: '0 0 8px currentColor' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* legend */}
          <div className="mt-3 flex items-center justify-between mono text-[10px] uppercase tracking-[0.3em] text-bone/45">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5"><span className="led led-green" /> nominal</span>
              <span className="flex items-center gap-1.5"><span className="led led-amber" /> warn</span>
              <span className="flex items-center gap-1.5"><span className="led led-red" /> incident</span>
            </div>
            <span>scroll · descend</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Bracket({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const base = 'absolute z-[15] w-6 h-6 md:w-8 md:h-8 border-acid/40 pointer-events-none';
  const map = {
    tl: ' top-4 left-4 md:top-6 md:left-6 border-t border-l',
    tr: ' top-4 right-4 md:top-6 md:right-6 border-t border-r',
    bl: ' bottom-4 left-4 md:bottom-6 md:left-6 border-b border-l',
    br: ' bottom-4 right-4 md:bottom-6 md:right-6 border-b border-r',
  };
  return <span className={base + map[pos]} />;
}
