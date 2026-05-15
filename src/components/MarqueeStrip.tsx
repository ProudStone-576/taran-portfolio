import Marquee from './Marquee';

const items = [
  'Causal Modeling',
  'Time-Series',
  'Neural ODEs',
  'Data Engineering',
  'ML Systems',
  'Synthetic Data',
  'Backend APIs',
  'Risk Analytics',
];

export default function MarqueeStrip() {
  return (
    <div className="relative border-y border-bone/10 bg-ink py-6 md:py-8 overflow-hidden scroll-skew">
      <Marquee>
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-10 px-10">
            <span className="display italic text-4xl md:text-6xl text-bone">{it}</span>
            <span className="w-2 h-2 rounded-full bg-acid" />
          </div>
        ))}
      </Marquee>
    </div>
  );
}
