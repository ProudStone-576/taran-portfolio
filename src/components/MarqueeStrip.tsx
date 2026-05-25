import Marquee from './Marquee';

const items = [
  'Active Directory',
  'Group Policy',
  'pfSense · VLAN',
  'Proxmox',
  'PowerShell',
  'Windows Server',
  'Help Desk',
  'TCP/IP · DNS · DHCP',
  'M365 Admin',
  'Bash · Cron',
];

export default function MarqueeStrip() {
  return (
    <div className="relative border-y border-acid/20 bg-ink py-6 md:py-8 overflow-hidden scroll-skew">
      <Marquee>
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-10 px-10">
            <span className="display italic text-4xl md:text-6xl text-bone">{it}</span>
            <span className="led led-green animate-led-blink" />
          </div>
        ))}
      </Marquee>
    </div>
  );
}
