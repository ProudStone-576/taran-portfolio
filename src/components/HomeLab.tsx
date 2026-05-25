import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ────────────────────────────────────────────────────────────────────────────
// Static lab inventory
// ────────────────────────────────────────────────────────────────────────────

type VM = {
  id: string;
  name: string;
  os: string;
  cpu: number;
  ram: string;
  role: string;
  state: 'running' | 'running' | 'paused';
};

const VMS: VM[] = [
  { id: 'vm-101', name: 'DC01',          os: 'Win Server 2022', cpu: 2, ram: '4 GB',  role: 'Active Directory · DNS · DHCP', state: 'running' },
  { id: 'vm-102', name: 'FILE01',        os: 'Win Server 2022', cpu: 2, ram: '4 GB',  role: 'File Server · SMB · Shadow Copy', state: 'running' },
  { id: 'vm-103', name: 'WSUS01',        os: 'Win Server 2019', cpu: 2, ram: '4 GB',  role: 'WSUS · Patch Management', state: 'running' },
  { id: 'vm-201', name: 'WIN11-CLIENT',  os: 'Windows 11 Pro',  cpu: 2, ram: '4 GB',  role: 'Domain-joined Test Client', state: 'running' },
  { id: 'vm-202', name: 'WIN10-CLIENT',  os: 'Windows 10 Pro',  cpu: 2, ram: '4 GB',  role: 'GPO Validation', state: 'running' },
  { id: 'vm-301', name: 'PFSENSE',       os: 'pfSense 2.7',     cpu: 2, ram: '2 GB',  role: 'Firewall · VLAN Router', state: 'running' },
  { id: 'vm-302', name: 'PIHOLE',        os: 'Debian 12',       cpu: 1, ram: '1 GB',  role: 'DNS Sinkhole', state: 'running' },
  { id: 'vm-401', name: 'GLPI',          os: 'Ubuntu 22.04',    cpu: 2, ram: '4 GB',  role: 'Help-Desk Ticketing', state: 'running' },
  { id: 'vm-402', name: 'ZABBIX',        os: 'Ubuntu 22.04',    cpu: 2, ram: '4 GB',  role: 'Network Monitoring', state: 'running' },
  { id: 'vm-403', name: 'GRAFANA',       os: 'Ubuntu 22.04',    cpu: 1, ram: '2 GB',  role: 'Dashboards · Alerts', state: 'running' },
  { id: 'vm-501', name: 'VEEAM',         os: 'Win Server 2022', cpu: 2, ram: '4 GB',  role: 'Backup Repository', state: 'running' },
  { id: 'vm-601', name: 'KALI',          os: 'Kali Linux',      cpu: 2, ram: '4 GB',  role: 'Sec Testing (isolated)', state: 'paused' },
  { id: 'vm-602', name: 'SIEM',          os: 'Wazuh',           cpu: 4, ram: '8 GB',  role: 'Log Aggregation', state: 'running' },
  { id: 'vm-603', name: 'ANSIBLE',       os: 'Ubuntu 22.04',    cpu: 1, ram: '2 GB',  role: 'Provisioning Runner', state: 'running' },
];

const VLANS = [
  { id: 10,  name: 'USERS',     cidr: '192.168.10.0/24',  color: 'acid'   },
  { id: 20,  name: 'SERVERS',   cidr: '192.168.20.0/24',  color: 'cobalt' },
  { id: 30,  name: 'MGMT',      cidr: '192.168.30.0/24',  color: 'amber'  },
  { id: 99,  name: 'ISOLATED',  cidr: '192.168.99.0/24',  color: 'plasma' },
];

const TICKETS_SEED = [
  { id: 'HD-2841', user: 'k.singh',   sub: 'Outlook calendar invites disappearing',     prio: 'P3', age: '2h', stat: 'Triaged' },
  { id: 'HD-2842', user: 'r.lopez',   sub: 'Printer offline — \\\\PRINT01\\HR-LASER',   prio: 'P2', age: '47m', stat: 'In Progress' },
  { id: 'HD-2843', user: 'j.nakamura',sub: 'New starter — AD account + M365 license',   prio: 'P3', age: '1h', stat: 'Awaiting Manager' },
  { id: 'HD-2844', user: 'a.patel',   sub: 'VPN drops every ~15min from home',          prio: 'P2', age: '23m', stat: 'In Progress' },
  { id: 'HD-2845', user: 'm.brown',   sub: 'Cannot reach SHARE01\\Finance',             prio: 'P1', age: '8m',  stat: 'On Call' },
  { id: 'HD-2846', user: 'l.wong',    sub: 'Laptop battery degraded — replacement req.',prio: 'P4', age: '3h', stat: 'Parts Ordered' },
  { id: 'HD-2847', user: 't.dubois',  sub: 'Teams audio device not detected',           prio: 'P3', age: '14m', stat: 'Open' },
];

const AD_USERS = [
  { sam: 'k.singh',    ou: 'OU=Sales,DC=contoso,DC=lab',   groups: 'Sales · SalesRO',          last: '12m ago',  locked: false },
  { sam: 'r.lopez',    ou: 'OU=HR,DC=contoso,DC=lab',      groups: 'HR · Printing',            last: '38m ago',  locked: false },
  { sam: 'j.nakamura', ou: 'OU=Eng,DC=contoso,DC=lab',     groups: 'Eng · DevOps · VPN',       last: 'just now', locked: false },
  { sam: 'a.patel',    ou: 'OU=Eng,DC=contoso,DC=lab',     groups: 'Eng · VPN',                last: '4h ago',   locked: false },
  { sam: 'svc.backup', ou: 'OU=Services,DC=contoso,DC=lab',groups: 'Veeam · BackupOperators',  last: '1m ago',   locked: false },
  { sam: 'l.wong',     ou: 'OU=Marketing,DC=contoso,DC=lab', groups: 'Marketing',              last: '2d ago',   locked: true  },
];

const PS_LINES = [
  'PS C:\\Users\\taran> Get-ADUser -Filter * -Properties LastLogonDate | ?{ $_.LastLogonDate -lt (Get-Date).AddDays(-90) }',
  '',
  'SamAccountName  Enabled  LastLogonDate',
  '--------------  -------  -------------',
  'p.evans         True     2025-12-04',
  'm.lin           True     2025-11-22',
  's.farouk        False    2025-09-18',
  '',
  'PS C:\\Users\\taran> .\\Onboard-NewUser.ps1 -First "Jordan" -Last "Park" -Dept "Sales" -Manager "k.singh"',
  '[+] Generating sAMAccountName ........... j.park',
  '[+] Creating AD account ................. OK',
  '[+] Adding to groups (Sales, Printing) .. OK',
  '[+] Provisioning M365 E3 license ........ OK',
  '[+] Creating home drive H:\\j.park ....... OK',
  '[+] Emailing manager k.singh ............ OK',
  '[+] Total runtime ....................... 11.4s   (vs ~18 min manual)',
  '',
  'PS C:\\Users\\taran> _',
];

const RACK_DEVICES = [
  { u: '1U',  label: 'PATCH PANEL · 24-PORT CAT6',  type: 'panel',  leds: 12, color: 'bone' },
  { u: '1U',  label: 'CISCO SG350 · 24-PORT POE',   type: 'switch', leds: 18, color: 'acid' },
  { u: '1U',  label: 'PFSENSE FIREWALL · 4 NIC',    type: 'fw',     leds: 4,  color: 'amber' },
  { u: '2U',  label: 'PROXMOX NODE 01 · R720',      type: 'srv',    leds: 6,  color: 'acid' },
  { u: '2U',  label: 'PROXMOX NODE 02 · R720',      type: 'srv',    leds: 6,  color: 'acid' },
  { u: '2U',  label: 'PROXMOX NODE 03 · R720',      type: 'srv',    leds: 6,  color: 'acid' },
  { u: '1U',  label: 'TRUENAS · 4× 4TB ZFS',        type: 'srv',    leds: 8,  color: 'amber' },
  { u: '1U',  label: 'UPS · APC SMT1500',           type: 'ups',    leds: 3,  color: 'acid' },
];

// ────────────────────────────────────────────────────────────────────────────

export default function HomeLab() {
  const root = useRef<HTMLElement>(null);
  const [activeVlan, setActiveVlan] = useState(10);
  const [tickets, setTickets] = useState(TICKETS_SEED);
  const [psIdx, setPsIdx] = useState(0);
  const [tab, setTab] = useState<'topology' | 'rack' | 'tickets' | 'ad' | 'ps'>('topology');
  const [pingMs, setPingMs] = useState(2);
  const [bwIn, setBwIn] = useState(124);
  const [bwOut, setBwOut] = useState(38);

  // PowerShell typewriter
  useEffect(() => {
    if (tab !== 'ps') return;
    if (psIdx >= PS_LINES.length) return;
    const t = setTimeout(() => setPsIdx((i) => i + 1), 220);
    return () => clearTimeout(t);
  }, [psIdx, tab]);

  useEffect(() => {
    if (tab === 'ps' && psIdx === 0) {
      const id = setInterval(() => setPsIdx((i) => (i < PS_LINES.length ? i + 1 : i)), 220);
      return () => clearInterval(id);
    }
  }, [tab, psIdx]);

  // Live metrics jitter
  useEffect(() => {
    const id = setInterval(() => {
      setPingMs((v) => Math.max(1, Math.min(18, v + (Math.random() - 0.5) * 4)));
      setBwIn((v) => Math.max(20, Math.min(940, v + (Math.random() - 0.5) * 80)));
      setBwOut((v) => Math.max(8, Math.min(620, v + (Math.random() - 0.5) * 40)));
    }, 1200);
    return () => clearInterval(id);
  }, []);

  // Ticket rotation (simulate new ticket every ~10s)
  useEffect(() => {
    let counter = 0;
    const id = setInterval(() => {
      setTickets((prev) => {
        const next = [...prev];
        const head = next.shift();
        counter += 1;
        if (head) next.push({ ...head, id: 'HD-R-' + (3000 + counter), age: '1m' });
        return next;
      });
    }, 11000);
    return () => clearInterval(id);
  }, []);

  // GSAP reveal
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-lab-head]', {
        y: 60, opacity: 0, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: '[data-lab-head]', start: 'top 80%' },
      });
      gsap.from('[data-lab-panel]', {
        y: 80, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08,
        scrollTrigger: { trigger: '[data-lab-grid]', start: 'top 80%' },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const runningVms = useMemo(() => VMS.filter((v) => v.state === 'running').length, []);

  return (
    <section
      ref={root}
      id="homelab"
      className="relative bg-ink overflow-hidden border-t border-acid/15"
    >
      {/* faint grid bg */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

      <div className="relative max-w-[1500px] mx-auto px-5 md:px-10 py-32 md:py-44">
        {/* HEADER */}
        <div data-lab-head className="grid grid-cols-12 gap-y-12 md:gap-x-10 mb-16">
          <div className="col-span-12 md:col-span-7">
            <div className="mono text-[10px] uppercase tracking-[0.4em] text-acid mb-4 flex items-center gap-3">
              <span className="led led-green animate-led-blink" />
              ◉ 04 — home.lab / live
            </div>
            <h2 className="display text-6xl md:text-[7vw] text-bone leading-[0.9]">
              The lab is <span className="italic text-acid">running.</span>
            </h2>
            <p className="mt-6 text-bone/70 max-w-2xl leading-relaxed">
              Virtualised on Proxmox. Windows Server domain. pfSense with four VLANs.
              Self-hosted help-desk, monitoring, SIEM, backup. Every config
              documented as a runbook. Telemetry below is simulated for browser,
              but the topology is real.
            </p>
          </div>

          <div className="col-span-12 md:col-span-5 self-end">
            <div className="grid grid-cols-3 gap-px bg-acid/15 border border-acid/15">
              {[
                { l: 'VMs running',  v: runningVms + ' / ' + VMS.length, c: 'acid'  },
                { l: 'VLANs',        v: VLANS.length,                   c: 'acid'  },
                { l: 'Open tickets', v: tickets.length,                 c: 'amber' },
              ].map((s) => (
                <div key={s.l} className="bg-ink p-4">
                  <div className="mono text-[9px] uppercase tracking-[0.3em] text-bone/40">{s.l}</div>
                  <div className={'display text-3xl mt-1 ' + (s.c === 'amber' ? 'term-amber' : 'term')}>
                    {s.v}
                  </div>
                </div>
              ))}
            </div>

            {/* live wire ticker */}
            <div className="mt-3 panel scanlines">
              <div className="px-3 py-2 flex items-center justify-between mono text-[10px] uppercase tracking-widest text-bone/50 border-b border-acid/15">
                <span className="flex items-center gap-2"><span className="led led-green animate-led-pulse" /> wire · live</span>
                <span>monitor:zabbix</span>
              </div>
              <div className="grid grid-cols-3 px-3 py-3 mono text-[11px]">
                <div>
                  <div className="text-bone/40 text-[9px] uppercase tracking-widest">ping gw</div>
                  <div className="term">{pingMs.toFixed(0)} ms</div>
                </div>
                <div>
                  <div className="text-bone/40 text-[9px] uppercase tracking-widest">in</div>
                  <div className="term">{bwIn.toFixed(0)} Mb/s</div>
                </div>
                <div>
                  <div className="text-bone/40 text-[9px] uppercase tracking-widest">out</div>
                  <div className="term-amber">{bwOut.toFixed(0)} Mb/s</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TAB SWITCHER */}
        <div data-lab-panel className="flex flex-wrap gap-2 mb-6">
          {[
            { k: 'topology', l: 'Network Topology'  },
            { k: 'rack',     l: 'Server Rack'       },
            { k: 'tickets',  l: 'Help-Desk Queue'   },
            { k: 'ad',       l: 'Active Directory'  },
            { k: 'ps',       l: 'PowerShell Console' },
          ].map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k as typeof tab)}
              data-cursor="View"
              className={
                'mono text-[10px] uppercase tracking-[0.3em] px-4 py-2.5 border transition-all ' +
                (tab === t.k
                  ? 'bg-acid text-ink border-acid'
                  : 'border-bone/15 text-bone/60 hover:border-acid hover:text-acid')
              }
            >
              {t.l}
            </button>
          ))}
        </div>

        {/* MAIN GRID */}
        <div data-lab-grid className="grid grid-cols-12 gap-px bg-acid/15 border border-acid/15">
          {/* PANEL: VM LIST (always visible) */}
          <div data-lab-panel className="col-span-12 lg:col-span-4 bg-ink p-5 md:p-6 min-h-[560px]">
            <PanelHeader title="virtual.machines" sub={runningVms + ' running'} />
            <div className="mt-4 space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
              {VMS.map((v) => (
                <div
                  key={v.id}
                  className="group flex items-center justify-between gap-3 px-3 py-2 border border-transparent hover:border-acid/30 hover:bg-acid/5 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={
                      'led ' +
                      (v.state === 'running' ? 'led-green animate-led-blink' : 'led-amber')
                    } />
                    <div className="min-w-0">
                      <div className="mono text-[11px] text-bone truncate">{v.name}</div>
                      <div className="mono text-[9px] uppercase tracking-widest text-bone/40 truncate">
                        {v.os} · {v.role}
                      </div>
                    </div>
                  </div>
                  <div className="mono text-[9px] text-bone/40 shrink-0">{v.cpu}c · {v.ram}</div>
                </div>
              ))}
            </div>
          </div>

          {/* PANEL: MAIN VIEW */}
          <div data-lab-panel className="col-span-12 lg:col-span-8 bg-ink p-5 md:p-6 min-h-[560px] relative">
            {tab === 'topology' && (
              <TopologyView activeVlan={activeVlan} setActiveVlan={setActiveVlan} />
            )}
            {tab === 'rack' && <RackView />}
            {tab === 'tickets' && <TicketsView tickets={tickets} />}
            {tab === 'ad' && <AdView />}
            {tab === 'ps' && <PsView lines={PS_LINES.slice(0, psIdx)} done={psIdx >= PS_LINES.length} />}
          </div>
        </div>

        {/* RUNBOOK STRIP */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-px bg-acid/15 border border-acid/15">
          {[
            { n: '01', t: 'Build Runbook',    d: 'Every config — Proxmox, AD, GPO, pfSense — written as step-by-step recovery doc.' },
            { n: '02', t: 'Patch Tuesday',    d: 'WSUS approves → test ring → prod ring. Reboot windows enforced by GPO.' },
            { n: '03', t: 'Backup Verify',    d: 'Veeam jobs nightly. Restore-tested monthly against isolated VM.' },
            { n: '04', t: 'Incident Drill',   d: 'Quarterly: kill a DC, fail over DNS, rebuild from snapshot. Time it.' },
          ].map((r) => (
            <div key={r.n} className="bg-ink p-5 md:p-6 group hover:bg-acid/5 transition-colors">
              <div className="mono text-[10px] uppercase tracking-[0.4em] text-acid mb-3">RB-{r.n}</div>
              <div className="display text-2xl text-bone mb-2 group-hover:text-acid transition-colors">{r.t}</div>
              <p className="text-sm text-bone/60 leading-relaxed">{r.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PanelHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-acid/15 pb-3">
      <div className="flex items-center gap-2">
        <span className="led led-green animate-led-blink" />
        <span className="mono text-[10px] uppercase tracking-[0.3em] text-bone/70">{title}</span>
      </div>
      {sub && <span className="mono text-[10px] uppercase tracking-widest text-acid">{sub}</span>}
    </div>
  );
}

// ─── TOPOLOGY ───────────────────────────────────────────────────────────────

function TopologyView({
  activeVlan,
  setActiveVlan,
}: {
  activeVlan: number;
  setActiveVlan: (n: number) => void;
}) {
  const nodes = [
    { id: 'wan',    label: 'WAN', x: 50,  y: 12, vlan: 0,  kind: 'wan' },
    { id: 'fw',     label: 'pfSense', x: 50, y: 30, vlan: 0,  kind: 'fw' },
    { id: 'sw',     label: 'Core Switch', x: 50, y: 50, vlan: 0,  kind: 'sw' },
    { id: 'u-pc',   label: 'WIN11 Clients', x: 14, y: 78, vlan: 10, kind: 'pc' },
    { id: 'u-prn',  label: 'Printers', x: 32, y: 88, vlan: 10, kind: 'pc' },
    { id: 's-dc',   label: 'DC01 · AD', x: 50, y: 78, vlan: 20, kind: 'srv' },
    { id: 's-file', label: 'FILE01', x: 62, y: 88, vlan: 20, kind: 'srv' },
    { id: 'm-prx',  label: 'Proxmox MGMT', x: 78, y: 78, vlan: 30, kind: 'srv' },
    { id: 'iso',    label: 'KALI · SIEM', x: 92, y: 88, vlan: 99, kind: 'srv' },
  ];

  const vlanColor = (id: number) => {
    const v = VLANS.find((x) => x.id === id);
    if (!v) return '#39FF7A';
    if (v.color === 'acid')   return '#39FF7A';
    if (v.color === 'cobalt') return '#3D5BFF';
    if (v.color === 'amber')  return '#FFB23D';
    return '#FF3D7F';
  };

  return (
    <div className="h-full flex flex-col">
      <PanelHeader title="network.topology" sub={'vlan ' + (activeVlan || 'all')} />

      <div className="flex flex-wrap gap-2 mt-4">
        <button
          onClick={() => setActiveVlan(0)}
          className={
            'mono text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-colors ' +
            (activeVlan === 0 ? 'bg-bone text-ink border-bone' : 'border-bone/20 text-bone/60 hover:border-bone')
          }
        >
          all
        </button>
        {VLANS.map((v) => (
          <button
            key={v.id}
            onClick={() => setActiveVlan(v.id)}
            className={
              'mono text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-colors flex items-center gap-2 ' +
              (activeVlan === v.id ? 'bg-acid/15 text-bone border-acid' : 'border-bone/20 text-bone/60 hover:border-bone')
            }
            style={{
              borderColor: activeVlan === v.id ? vlanColor(v.id) : undefined,
              color:       activeVlan === v.id ? vlanColor(v.id) : undefined,
            }}
          >
            <span className="led" style={{ background: vlanColor(v.id), boxShadow: '0 0 6px ' + vlanColor(v.id) }} />
            vlan{v.id} · {v.name}
          </button>
        ))}
      </div>

      <div className="relative mt-6 flex-1 min-h-[400px] border border-acid/15 grid-bg-fine">
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {/* edges */}
          {[
            ['wan', 'fw'],
            ['fw', 'sw'],
            ['sw', 'u-pc'],
            ['sw', 'u-prn'],
            ['sw', 's-dc'],
            ['sw', 's-file'],
            ['sw', 'm-prx'],
            ['sw', 'iso'],
          ].map(([a, b]) => {
            const na = nodes.find((n) => n.id === a)!;
            const nb = nodes.find((n) => n.id === b)!;
            const dim = activeVlan !== 0 && nb.vlan !== activeVlan && nb.vlan !== 0;
            return (
              <line
                key={a + b}
                x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                stroke={dim ? 'rgba(232,237,231,0.08)' : vlanColor(nb.vlan)}
                strokeWidth={0.25}
                strokeDasharray="0.6 0.4"
                style={{ filter: dim ? 'none' : 'drop-shadow(0 0 1px ' + vlanColor(nb.vlan) + ')' }}
              />
            );
          })}
        </svg>

        {nodes.map((n) => {
          const dim = activeVlan !== 0 && n.vlan !== activeVlan && n.vlan !== 0;
          const color = vlanColor(n.vlan);
          return (
            <div
              key={n.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-opacity"
              style={{ left: n.x + '%', top: n.y + '%', opacity: dim ? 0.25 : 1 }}
            >
              <div
                className="flex flex-col items-center gap-1"
              >
                <div
                  className="relative w-9 h-9 flex items-center justify-center border bg-ink"
                  style={{ borderColor: color, boxShadow: '0 0 12px ' + color + '55' }}
                >
                  <span className="text-[10px] mono uppercase" style={{ color }}>
                    {n.kind === 'wan' && 'WAN'}
                    {n.kind === 'fw' && 'FW'}
                    {n.kind === 'sw' && 'SW'}
                    {n.kind === 'pc' && 'PC'}
                    {n.kind === 'srv' && 'SRV'}
                  </span>
                  <span
                    className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 animate-led-blink"
                    style={{ background: color, boxShadow: '0 0 6px ' + color }}
                  />
                </div>
                <div className="mono text-[9px] uppercase tracking-widest text-bone/70 whitespace-nowrap">
                  {n.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        {VLANS.map((v) => {
          const c = vlanColor(v.id);
          return (
            <div
              key={v.id}
              className="border border-bone/10 px-3 py-2 flex items-center gap-3 hover:border-acid/30 transition-colors"
              onMouseEnter={() => setActiveVlan(v.id)}
            >
              <span className="led" style={{ background: c, boxShadow: '0 0 6px ' + c }} />
              <div className="min-w-0">
                <div className="mono text-[10px] text-bone">vlan{v.id} · {v.name}</div>
                <div className="mono text-[9px] text-bone/40">{v.cidr}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── RACK ───────────────────────────────────────────────────────────────────

function RackView() {
  return (
    <div className="h-full flex flex-col">
      <PanelHeader title="server.rack · 12u" sub="all green" />

      <div className="grid grid-cols-12 gap-5 mt-5 flex-1">
        {/* RACK */}
        <div className="col-span-12 md:col-span-7">
          <div className="bg-rack border border-acid/20 p-3 space-y-1.5">
            {RACK_DEVICES.map((d, i) => (
              <RackUnit key={i} {...d} />
            ))}
            {/* empty space */}
            <div className="bg-black/40 border border-bone/5 h-6 flex items-center justify-end pr-3">
              <span className="mono text-[8px] uppercase tracking-widest text-bone/20">1U · empty</span>
            </div>
          </div>
        </div>

        {/* SPECS */}
        <div className="col-span-12 md:col-span-5 space-y-2">
          {[
            { k: 'Total CPU cores',  v: '36' },
            { k: 'Total RAM',        v: '192 GB' },
            { k: 'Total storage',    v: '16 TB ZFS RAID-Z' },
            { k: 'Power draw',       v: '~340 W' },
            { k: 'Idle temp',        v: '24 °C' },
            { k: 'UPS runtime',      v: '~22 min' },
            { k: 'Backbone',         v: '1 GbE · 10G uplink' },
            { k: 'Documented as',    v: 'Markdown + Mermaid' },
          ].map((r) => (
            <div key={r.k} className="flex justify-between items-center border-b border-bone/10 pb-1.5">
              <span className="mono text-[10px] uppercase tracking-widest text-bone/50">{r.k}</span>
              <span className="mono text-[11px] text-acid">{r.v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RackUnit({ u, label, type, leds, color }: { u: string; label: string; type: string; leds: number; color: string }) {
  const isSrv = type === 'srv';
  const isPanel = type === 'panel';
  const accent = color === 'amber' ? '#FFB23D' : color === 'acid' ? '#39FF7A' : '#E8EDE7';
  const tall = u === '2U' ? 'h-12' : 'h-6';

  return (
    <div className={'relative bg-black border border-bone/15 ' + tall + ' flex items-center justify-between px-3'}>
      {/* faceplate accents */}
      {isSrv && (
        <div className="absolute left-1 top-1 bottom-1 w-1.5 border border-bone/20 flex flex-col justify-between py-0.5">
          <span className="block w-full h-0.5 bg-bone/30" />
          <span className="block w-full h-0.5 bg-bone/30" />
        </div>
      )}
      {isPanel && (
        <div className="absolute inset-y-1 left-6 right-24 grid grid-cols-12 gap-px">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="bg-bone/10 border border-bone/20" />
          ))}
        </div>
      )}
      <span className={'mono text-[9px] uppercase tracking-widest ' + (isPanel ? 'ml-3' : 'ml-5')} style={{ color: accent + 'cc' }}>
        {label}
      </span>
      <div className="flex items-center gap-1.5">
        {/* fan */}
        {isSrv && (
          <span className="inline-block w-3 h-3 border border-bone/30 rounded-full animate-rack-fan">
            <span className="block w-full h-px bg-bone/40 translate-y-1.5" />
          </span>
        )}
        {/* LEDs */}
        {Array.from({ length: leds }).map((_, i) => (
          <span
            key={i}
            className="led"
            style={{
              background: i === leds - 1 ? '#FFB23D' : accent,
              boxShadow: '0 0 4px ' + (i === leds - 1 ? '#FFB23D' : accent),
              animation: 'led-blink ' + (1 + (i % 4) * 0.3).toFixed(1) + 's steps(2, end) infinite',
            }}
          />
        ))}
        <span className="mono text-[8px] uppercase tracking-widest text-bone/30 ml-2">{u}</span>
      </div>
    </div>
  );
}

// ─── TICKETS ────────────────────────────────────────────────────────────────

function TicketsView({ tickets }: { tickets: typeof TICKETS_SEED }) {
  const prioColor = (p: string) => p === 'P1' ? 'term-danger' : p === 'P2' ? 'term-amber' : 'term';
  return (
    <div className="h-full flex flex-col">
      <PanelHeader title="freshdesk.queue" sub={tickets.length + ' open'} />

      <div className="mt-4 grid grid-cols-12 gap-3 mono text-[9px] uppercase tracking-widest text-bone/40 border-b border-bone/10 pb-2">
        <div className="col-span-2">id</div>
        <div className="col-span-2">user</div>
        <div className="col-span-5">subject</div>
        <div className="col-span-1">prio</div>
        <div className="col-span-1">age</div>
        <div className="col-span-1">stat</div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tickets.map((t) => (
          <div
            key={t.id}
            className="grid grid-cols-12 gap-3 py-2.5 border-b border-bone/5 mono text-[11px] hover:bg-acid/5 transition-colors"
          >
            <div className="col-span-2 text-bone/60">{t.id}</div>
            <div className="col-span-2 text-bone">{t.user}</div>
            <div className="col-span-5 text-bone/80 truncate">{t.sub}</div>
            <div className={'col-span-1 ' + prioColor(t.prio)}>{t.prio}</div>
            <div className="col-span-1 text-bone/50">{t.age}</div>
            <div className="col-span-1 text-acid text-[9px] uppercase">{t.stat}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-4 gap-3 mono text-[10px]">
        {[
          { l: 'MTTR (L1)',  v: '11.4 m', c: 'term' },
          { l: 'CSAT',       v: '4.8 / 5', c: 'term' },
          { l: 'SLA met',    v: '97.2%',  c: 'term' },
          { l: 'P1 open',    v: '1',      c: 'term-danger' },
        ].map((m) => (
          <div key={m.l} className="border border-bone/10 px-3 py-2">
            <div className="text-[9px] uppercase tracking-widest text-bone/40">{m.l}</div>
            <div className={'text-lg ' + m.c}>{m.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AD ─────────────────────────────────────────────────────────────────────

function AdView() {
  return (
    <div className="h-full flex flex-col">
      <PanelHeader title="active.directory · contoso.lab" sub="bound" />

      <div className="grid grid-cols-12 gap-5 mt-4 flex-1">
        <div className="col-span-12 md:col-span-4 border border-bone/10 p-3 overflow-y-auto">
          <div className="mono text-[9px] uppercase tracking-widest text-bone/40 mb-2">tree</div>
          <Tree />
        </div>

        <div className="col-span-12 md:col-span-8">
          <div className="grid grid-cols-12 gap-3 mono text-[9px] uppercase tracking-widest text-bone/40 border-b border-bone/10 pb-2">
            <div className="col-span-3">sam</div>
            <div className="col-span-5">ou</div>
            <div className="col-span-3">groups</div>
            <div className="col-span-1">stat</div>
          </div>
          {AD_USERS.map((u) => (
            <div key={u.sam} className="grid grid-cols-12 gap-3 py-2 border-b border-bone/5 mono text-[11px] hover:bg-acid/5 transition-colors">
              <div className="col-span-3 text-bone">{u.sam}</div>
              <div className="col-span-5 text-bone/60 truncate">{u.ou}</div>
              <div className="col-span-3 text-acid text-[10px]">{u.groups}</div>
              <div className="col-span-1">
                {u.locked
                  ? <span className="term-danger text-[9px] uppercase">locked</span>
                  : <span className="term text-[9px] uppercase">ok</span>}
              </div>
            </div>
          ))}

          <div className="mt-4 grid grid-cols-4 gap-3 mono text-[10px]">
            {[
              { l: 'Total users',       v: '147' },
              { l: 'OUs',               v: '12' },
              { l: 'GPOs linked',       v: '23' },
              { l: 'Last replication',  v: '38s ago' },
            ].map((m) => (
              <div key={m.l} className="border border-bone/10 px-3 py-2">
                <div className="text-[9px] uppercase tracking-widest text-bone/40">{m.l}</div>
                <div className="text-lg term">{m.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Tree() {
  const node = (depth: number, label: string, type: 'dc' | 'ou' | 'cn') => (
    <div className="flex items-center gap-2 py-1 mono text-[11px]" style={{ paddingLeft: depth * 14 }}>
      <span className="text-bone/30">{type === 'dc' ? '╾' : type === 'ou' ? '└─' : '·'}</span>
      <span className={type === 'dc' ? 'text-acid' : type === 'ou' ? 'text-bone' : 'text-bone/60'}>{label}</span>
    </div>
  );
  return (
    <div>
      {node(0, 'DC=contoso,DC=lab', 'dc')}
      {node(1, 'OU=Sales', 'ou')}
      {node(2, 'k.singh', 'cn')}
      {node(1, 'OU=HR', 'ou')}
      {node(2, 'r.lopez', 'cn')}
      {node(1, 'OU=Eng', 'ou')}
      {node(2, 'j.nakamura', 'cn')}
      {node(2, 'a.patel', 'cn')}
      {node(1, 'OU=Marketing', 'ou')}
      {node(2, 'l.wong', 'cn')}
      {node(1, 'OU=Services', 'ou')}
      {node(2, 'svc.backup', 'cn')}
      {node(1, 'OU=ServerOps', 'ou')}
      {node(1, 'OU=Workstations', 'ou')}
    </div>
  );
}

// ─── POWERSHELL ─────────────────────────────────────────────────────────────

function PsView({ lines, done }: { lines: string[]; done: boolean }) {
  return (
    <div className="h-full flex flex-col">
      <PanelHeader title="powershell · automation.ps1" sub={done ? 'idle' : 'running'} />

      <div className="mt-4 bg-black/60 border border-acid/20 flex-1 p-5 scanlines relative overflow-auto">
        <pre className="mono text-[12px] leading-[1.6] text-bone/85 whitespace-pre-wrap">
          {lines.map((l, i) => {
            const isPrompt = l.startsWith('PS ');
            const isOk = l.startsWith('[+]');
            return (
              <div key={i}>
                {isPrompt && <span className="text-acid">{l}</span>}
                {isOk && <span className="text-amber">{l}</span>}
                {!isPrompt && !isOk && <span>{l || ' '}</span>}
              </div>
            );
          })}
          {done && <span className="term-cursor text-acid" />}
        </pre>
      </div>

      <div className="mt-3 mono text-[10px] uppercase tracking-widest text-bone/40 flex justify-between">
        <span>encoding · utf-8</span>
        <span>signing · self-signed · valid</span>
      </div>
    </div>
  );
}
