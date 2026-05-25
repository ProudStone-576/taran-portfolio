import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    n: '01',
    title: 'Windows Server Home Lab',
    tag: 'Sysadmin · AD · pfSense',
    description:
      'Self-built multi-VM lab on Proxmox: Windows Server domain controller (AD, DNS, DHCP, GPO), domain-joined clients, pfSense firewall with VLAN segmentation, self-hosted help-desk and monitoring stack. Documented as step-by-step runbooks.',
    tech: ['Proxmox', 'Windows Server', 'Active Directory', 'pfSense', 'VLAN'],
    link: '#homelab',
    accent: 'acid',
    size: 'lg',
  },
  {
    n: '02',
    title: 'PowerShell Onboarding Toolkit',
    tag: 'Automation',
    description:
      'Scripts that provision a new starter end-to-end — AD account, group membership, M365 license, home drive, manager notification — in under 15 seconds vs ~20 minutes manual.',
    tech: ['PowerShell', 'AD Module', 'Graph API'],
    link: 'https://github.com/ProudStone-576',
    accent: 'amber',
    size: 'md',
  },
  {
    n: '03',
    title: 'Bash Maintenance Suite',
    tag: 'Linux · Cron',
    description:
      'Set of Bash scripts for log rotation, backup verification, certificate expiry checks, disk usage alerts. Saved ~20h/wk at ONeID.',
    tech: ['Bash', 'cron', 'systemd', 'rsync'],
    link: 'https://github.com/ProudStone-576',
    accent: 'bone',
    size: 'sm',
  },
  {
    n: '04',
    title: 'GPO Hardening Baseline',
    tag: 'Endpoint Security',
    description:
      'Group Policy baseline applied to the lab: AppLocker rules, BitLocker enforcement, audit logging, USB control. Validated against CIS benchmarks.',
    tech: ['GPO', 'AppLocker', 'BitLocker', 'CIS'],
    link: '#homelab',
    accent: 'cobalt',
    size: 'md',
  },
  {
    n: '05',
    title: 'Help-Desk KB',
    tag: 'Documentation',
    description:
      'Markdown knowledge base — common Outlook, VPN, printer, AD lockout fixes. Each article includes user-facing summary + tech-facing recipe.',
    tech: ['Markdown', 'Wiki.js', 'Mermaid'],
    link: '#',
    accent: 'bone',
    size: 'sm',
  },
  {
    n: '06',
    title: 'Network Monitoring Dashboard',
    tag: 'Observability',
    description:
      'Zabbix + Grafana stack monitoring the lab — host availability, switch port utilisation, certificate expiry, backup job status. Email alerts on threshold.',
    tech: ['Zabbix', 'Grafana', 'SNMP'],
    link: '#homelab',
    accent: 'acid',
    size: 'md',
  },
];

const accentMap: Record<string, string> = {
  acid: 'group-hover:bg-acid group-hover:text-ink',
  amber: 'group-hover:bg-amber group-hover:text-ink',
  cobalt: 'group-hover:bg-cobalt group-hover:text-bone',
  bone: 'group-hover:bg-bone group-hover:text-ink',
};

const sizeMap: Record<string, string> = {
  lg: 'md:col-span-8 md:row-span-2 md:min-h-[640px]',
  md: 'md:col-span-4 md:min-h-[310px]',
  sm: 'md:col-span-4 md:min-h-[310px]',
};

export default function ProjectsSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-card]').forEach((el, i) => {
        gsap.from(el, {
          y: 80,
          opacity: 0,
          duration: 1,
          ease: 'expo.out',
          delay: (i % 3) * 0.08,
          scrollTrigger: { trigger: el, start: 'top 90%' },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="projects"
      className="relative py-32 md:py-44 px-5 md:px-10 bg-ink overflow-hidden border-t border-acid/15"
    >
      <div className="max-w-[1500px] mx-auto scroll-skew">
        <div className="grid grid-cols-12 gap-y-12 md:gap-x-10 mb-16 md:mb-24">
          <div className="col-span-12 md:col-span-7">
            <div className="mono text-[10px] uppercase tracking-[0.4em] text-acid mb-4 flex items-center gap-3">
              <span className="led led-green animate-led-blink" />
              ◉ 07 — projects.deployed
            </div>
            <h2 className="display text-6xl md:text-[8vw] text-bone leading-[0.9]">
              Things I've <span className="italic text-acid">built.</span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4 md:col-start-9 self-end">
            <p className="text-bone/70 leading-relaxed">
              Hands-on infra and tooling — built to actually run, not to look good on a slide.
            </p>
            <a
              href="https://github.com/ProudStone-576"
              target="_blank"
              data-cursor="GitHub"
              className="mt-6 inline-flex items-center gap-2 mono text-xs uppercase tracking-widest text-bone hover:text-acid transition-colors"
            >
              All repos <span>↗</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5 auto-rows-fr">
          {projects.map((p, idx) => (
            <a
              key={p.n}
              href={p.link}
              target={p.link.startsWith('http') ? '_blank' : undefined}
              data-card
              data-parallax-vel
              data-cursor="Open"
              style={{ ['--vel-mul' as never]: ((idx % 3) - 1) * 1.4 + 0.4 }}
              className={`relative group bg-bone/[0.02] border border-acid/15 overflow-hidden p-7 md:p-9 flex flex-col justify-between transition-colors duration-500 ${sizeMap[p.size]} ${accentMap[p.accent]}`}
            >
              <div className="flex items-center justify-between">
                <span className="mono text-[10px] uppercase tracking-[0.3em] text-bone/40 group-hover:text-current transition-colors flex items-center gap-2">
                  <span className="led led-green animate-led-blink" />
                  {p.n} · {p.tag}
                </span>
                <span className="text-2xl text-bone/30 group-hover:text-current group-hover:rotate-45 transition-all duration-500">
                  ↗
                </span>
              </div>

              <div>
                <h3 className={`display ${p.size === 'lg' ? 'text-4xl md:text-6xl' : 'text-2xl md:text-3xl'} mb-4 leading-tight`}>
                  {p.title}
                </h3>
                <p className={`text-sm md:text-base text-bone/65 group-hover:text-current/80 leading-relaxed ${p.size === 'lg' ? 'max-w-md' : 'max-w-sm'}`}>
                  {p.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="mono text-[10px] uppercase tracking-widest px-2.5 py-1 border border-bone/15 text-bone/60 group-hover:border-current/30 group-hover:text-current transition-colors"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
