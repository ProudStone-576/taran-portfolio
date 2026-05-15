import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-sql';

gsap.registerPlugin(ScrollTrigger);

const codeSnippets = {
  PYTHON: `import pandas as pd
from sklearn.ensemble import RandomForestClassifier

data = pd.read_csv("dataset.csv")
X = data.drop("target", axis=1)
y = data["target"]

model = RandomForestClassifier(n_estimators=200)
model.fit(X, y)

print("Accuracy:", model.score(X, y))`,

  SQL: `SELECT user_id,
       COUNT(session_id) AS sessions,
       AVG(duration)     AS avg_time
FROM   user_sessions
WHERE  created_at > NOW() - INTERVAL '30 days'
GROUP  BY user_id
ORDER  BY sessions DESC
LIMIT  50;`,

  PIPELINE: `def preprocess(df):
    df = df.dropna()
    df["ratio"] = df["sales"] / df["visits"]
    return df

clean = preprocess(raw_data)
train_model(clean)`,
};

const langMap: Record<string, string> = {
  PYTHON: 'python',
  SQL: 'sql',
  PIPELINE: 'python',
};

const SPEED = 18;

export default function CodePanel() {
  const root = useRef<HTMLElement>(null);
  const [tab, setTab] = useState<keyof typeof codeSnippets>('PYTHON');
  const [typed, setTyped] = useState('');
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    let i = 0;
    const code = codeSnippets[tab];
    setTyped('');
    setTyping(true);
    const id = setInterval(() => {
      if (i <= code.length) {
        setTyped(code.slice(0, i));
        i++;
      } else {
        clearInterval(id);
        setTyping(false);
      }
    }, SPEED);
    return () => clearInterval(id);
  }, [tab]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-code-panel]', {
        y: 80,
        opacity: 0,
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '[data-code-panel]', start: 'top 80%' },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const html = Prism.highlight(
    typed,
    Prism.languages[langMap[tab]] || Prism.languages.plaintext,
    langMap[tab]
  );

  return (
    <section
      ref={root}
      id="code"
      className="relative py-32 md:py-44 px-5 md:px-10 bg-ink overflow-hidden border-t border-bone/5"
    >
      <div className="max-w-[1500px] mx-auto scroll-skew">
        <div className="grid grid-cols-12 gap-y-12 md:gap-x-10 mb-12 md:mb-16">
          <div className="col-span-12 md:col-span-7">
            <div className="mono text-[10px] uppercase tracking-[0.4em] text-acid mb-4">
              ◉ 06 — Live Code
            </div>
            <h2 className="display text-5xl md:text-7xl text-bone leading-[0.95]">
              Real workflows, <span className="italic">not tutorials.</span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4 md:col-start-9 self-end">
            <p className="text-bone/70 leading-relaxed">
              Snippets reflect production logic — model training, analytical queries, and pipeline preprocessing. Switch tabs to see them write themselves.
            </p>
          </div>
        </div>

        <div
          data-code-panel
          className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-bone/10 border border-bone/10 rounded-3xl overflow-hidden"
        >
          {/* Code area */}
          <div className="lg:col-span-8 bg-ink p-6 md:p-10 min-h-[480px] md:min-h-[560px] flex flex-col">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-bone/10">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-bone/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-bone/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-acid" />
                </div>
                <span className="mono text-[10px] uppercase tracking-widest text-bone/40">
                  ~/taran/{tab.toLowerCase()}.{langMap[tab] === 'sql' ? 'sql' : 'py'}
                </span>
              </div>
              <div className="flex gap-2">
                {(Object.keys(codeSnippets) as Array<keyof typeof codeSnippets>).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    data-cursor="Run"
                    className={`mono text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border transition-colors ${
                      tab === t
                        ? 'bg-acid text-ink border-acid'
                        : 'border-bone/20 text-bone/60 hover:border-bone'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <pre className="mono text-sm md:text-[15px] leading-relaxed flex-1 overflow-auto whitespace-pre-wrap">
              <code
                className={`language-${langMap[tab]}`}
                dangerouslySetInnerHTML={{ __html: html }}
                style={{ color: '#e7e3da' }}
              />
              {typing && <span className="inline-block w-2 h-4 ml-0.5 bg-acid align-middle animate-pulse" />}
            </pre>
          </div>

          {/* Side */}
          <div className="lg:col-span-4 bg-ink p-6 md:p-10 flex flex-col justify-between">
            <div>
              <div className="mono text-[10px] uppercase tracking-widest text-bone/40 mb-4">
                Stack
              </div>
              <ul className="space-y-3 text-bone/80">
                {['ML / Statistical Modeling', 'Production Pipelines', 'Service Integration', 'Monitoring & Drift'].map((s) => (
                  <li key={s} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-acid" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 mt-10">
              <a
                href="https://github.com/ProudStone-576"
                target="_blank"
                data-cursor="GitHub"
                className="block w-full text-center bg-bone text-ink mono text-xs uppercase tracking-widest font-bold py-4 rounded-full hover:bg-acid transition-colors"
              >
                Browse Repos ↗
              </a>
              <a
                href="/Taran_Matharu_resume.pdf"
                target="_blank"
                data-cursor="PDF"
                className="block w-full text-center mono text-xs uppercase tracking-widest border border-bone/20 py-4 rounded-full hover:border-acid hover:text-acid transition-colors"
              >
                Download Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
