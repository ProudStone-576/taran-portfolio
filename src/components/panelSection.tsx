import { useEffect, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-sql';

const codeSnippets = {
  PYTHON: `import pandas as pd
from sklearn.ensemble import RandomForestClassifier

data = pd.read_csv("dataset.csv")
X = data.drop("target", axis=1)
y = data["target"]

model = RandomForestClassifier(n_estimators=200)
model.fit(X, y)

print("Model Accuracy:", model.score(X, y))`,

  SQL: `SELECT user_id,
       COUNT(session_id) AS sessions,
       AVG(duration) AS avg_time
FROM user_sessions
GROUP BY user_id
ORDER BY sessions DESC;`,

  PIPELINE: `def preprocess(df):
    df = df.dropna()
    df["ratio"] = df["sales"] / df["visits"]
    return df

clean_data = preprocess(raw_data)
train_model(clean_data)`
};

const langMap = {
  PYTHON: 'python',
  SQL: 'sql',
  PIPELINE: 'python',
};

const TYPING_SPEED = 28;

export default function TypingCodePanel() {
  const [activeTab, setActiveTab] = useState<'PYTHON' | 'SQL' | 'PIPELINE'>('PYTHON');
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let index = 0;
    const code = codeSnippets[activeTab];
    setTypedText('');
    setIsTyping(true);

    const interval = setInterval(() => {
      if (index <= code.length) {
        setTypedText(code.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, TYPING_SPEED);

    return () => clearInterval(interval);
  }, [activeTab]);

  const highlightedCode = Prism.highlight(
    typedText,
    Prism.languages[langMap[activeTab]] || Prism.languages.plaintext,
    langMap[activeTab]
  );

  return (
    <div className="relative w-full min-h-screen flex justify-center items-center bg-black overflow-hidden p-4 sm:p-4">

      {/* Background Grid — hidden on mobile only */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none hidden sm:block"
        style={{
          backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px),
                           linear-gradient(to bottom, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Decorative Boxes — hidden on mobile only */}
      <div className="absolute inset-0 justify-center items-center hidden sm:flex">
        <div className="grid grid-cols-4 gap-8 w-full max-w-6xl h-[80vh]">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="border border-white/5 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Main Panel */}
      <div
        className="
          relative z-10
          flex flex-col lg:flex-row
          w-full max-w-6xl
          min-h-[80vh] sm:min-h-[80vh]
          bg-black border border-white/10
          rounded-xl shadow-2xl overflow-hidden
        "
      >

        {/* Code Section */}
        <div
          className="
            w-full lg:w-3/5
            p-4 sm:p-6 md:p-8
            font-mono text-sm md:text-base
            overflow-visible sm:overflow-y-auto
          "
        >
          {/* Tabs — scrollable on mobile only */}
          <div className="flex space-x-4 mb-6 overflow-x-auto sm:overflow-visible">
            {Object.keys(codeSnippets).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as never)}
                className={`shrink-0 px-4 sm:px-5 py-2 rounded-lg font-medium transition ${
                  activeTab === tab
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <pre className="whitespace-pre-wrap leading-relaxed px-3 sm:px-4 py-4 min-h-[40vh] sm:min-h-[60vh]">
            <code
              className={`language-${langMap[activeTab]}`}
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
            {isTyping && <span className="ml-1 animate-pulse text-white">▋</span>}
          </pre>
        </div>

        {/* Divider — unchanged */}
        <div className="w-px bg-white/10 hidden lg:block" />

        {/* Info Panel */}
        <div
          className="
            w-full lg:w-2/5
            p-6 sm:p-8
            flex flex-col justify-center
            border-t border-white/10 lg:border-t-0
          "
        >
          <div className="mb-6 sm:mb-8">
            <div className="w-12 h-1 bg-white mb-4 rounded" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
              Data. Models. Systems.
              <br />
              <span className="text-gray-400">Engineering Intelligence</span>
            </h2>
            <p className="text-gray-400 mb-6 leading-relaxed text-sm sm:text-base">
              Real workflows: machine learning models, analytical queries,
              and automated data pipelines. Code reflects production logic,
              not tutorials.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <a
              href="https://github.com/ProudStone-576"
              className="block w-full bg-white text-black font-semibold py-3 rounded-lg text-center"
            >
              View GitHub
            </a>

            <a
              href="src\assets\Taran_Matharu_resume.pdf"
              className="block w-full border border-white/20 text-white font-semibold py-3 rounded-lg text-center"
            >
              Download Resume
            </a>
          </div>

          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
            <div className="flex flex-wrap gap-2 sm:space-x-4 text-gray-500 text-sm select-none">
              <span>ML Models</span>
              <span>•</span>
              <span>Data Pipelines</span>
              <span>•</span>
              <span>Automation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollbar — unchanged */}
      <style>{`
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
