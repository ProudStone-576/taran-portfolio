import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FaWindows, FaNetworkWired, FaHeadset, FaServer, FaTerminal, FaShieldAlt,
} from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

const skills = [
  {
    i: <FaWindows />,
    t: 'OS & Desktop',
    d: 'Win 7/10/11, Win Server, Ubuntu, macOS — image, deploy, repair.',
    k: ['Windows 11', 'Server 2022', 'Ubuntu', 'macOS', 'MDT'],
  },
  {
    i: <FaServer />,
    t: 'Servers & Directory',
    d: 'AD, Group Policy, DNS, DHCP, file shares, M365 admin.',
    k: ['Active Directory', 'GPO', 'DNS', 'DHCP', 'M365'],
  },
  {
    i: <FaNetworkWired />,
    t: 'Networking',
    d: 'TCP/IP, VLAN segmentation, VPN, firewall config, remote support.',
    k: ['TCP/IP', 'VLAN', 'VPN', 'pfSense', 'RDP/SSH'],
  },
  {
    i: <FaHeadset />,
    t: 'Help Desk',
    d: 'Ticket triage, escalation, end-user training, runbook docs.',
    k: ['Jira', 'Freshdesk', 'GLPI', 'ServiceNow', 'SLA'],
  },
  {
    i: <FaTerminal />,
    t: 'Scripting & Automation',
    d: 'PowerShell, Bash, Python — provisioning, reporting, scheduled jobs.',
    k: ['PowerShell', 'Bash', 'Python', 'SQL', 'Git'],
  },
  {
    i: <FaShieldAlt />,
    t: 'Endpoint & Security',
    d: 'Patching (WSUS), AV/EDR, backup verify, account hygiene.',
    k: ['WSUS', 'Defender', 'Veeam', 'BitLocker', '2FA'],
  },
];

export default function Skills() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!track.current || !wrap.current) return;
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      if (isMobile) return;

      const totalScroll = track.current.scrollWidth - window.innerWidth;
      gsap.to(track.current, {
        x: -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: wrap.current,
          start: 'top top',
          end: () => `+=${totalScroll + 200}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={wrap}
      id="skills"
      className="relative bg-ink overflow-hidden"
    >
      <div className="px-5 md:px-10 pt-32 md:pt-44 pb-12 md:pb-20">
        <div className="max-w-[1500px] mx-auto flex items-end justify-between flex-wrap gap-6">
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.4em] text-acid mb-4 flex items-center gap-3">
              <span className="led led-green animate-led-blink" />
              ◉ 03 — capability.matrix
            </div>
            <h2 className="display text-5xl md:text-7xl text-bone leading-[0.95]">
              What I can <span className="italic text-acid">support.</span>
            </h2>
          </div>
          <div className="mono text-xs text-bone/40 max-w-xs uppercase tracking-widest">
            <span className="text-acid">→</span> drag · scroll
          </div>
        </div>
      </div>

      <div
        ref={track}
        className="flex gap-6 px-5 md:px-10 pb-32 md:pb-44 overflow-x-auto md:overflow-visible md:w-max md:flex-nowrap snap-x snap-mandatory md:snap-none"
        style={{ scrollbarWidth: 'none' }}
      >
        {skills.map((s, i) => (
          <article
            key={s.t}
            className="snap-start shrink-0 w-[80vw] sm:w-[60vw] md:w-[420px] lg:w-[480px] h-[60vh] md:h-[520px] relative group bg-bone/[0.02] border border-acid/15 rounded-none p-8 md:p-10 flex flex-col justify-between overflow-hidden hover:border-acid transition-colors duration-500 scanlines"
            data-cursor=""
          >
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-acid/[0.04] rounded-full blur-3xl group-hover:bg-acid/10 transition-colors duration-700" />

            <div className="relative">
              <div className="flex items-center justify-between mb-12">
                <span className="mono text-[10px] uppercase tracking-[0.3em] text-bone/40 flex items-center gap-2">
                  <span className="led led-green" />
                  cap.{String(i + 1).padStart(2, '0')} / {String(skills.length).padStart(2, '0')}
                </span>
                <span className="text-3xl text-acid/60 group-hover:text-acid transition-colors duration-500">
                  {s.i}
                </span>
              </div>

              <h3 className="display text-4xl md:text-5xl text-bone mb-6 group-hover:translate-x-2 transition-transform duration-500">
                {s.t}
              </h3>
              <p className="text-bone/70 text-base leading-relaxed max-w-xs">{s.d}</p>
            </div>

            <div className="relative flex flex-wrap gap-2">
              {s.k.map((k) => (
                <span
                  key={k}
                  className="mono text-[10px] uppercase tracking-widest px-3 py-1.5 border border-acid/20 text-bone/70 hover:border-acid hover:text-acid transition-colors"
                >
                  {k}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
