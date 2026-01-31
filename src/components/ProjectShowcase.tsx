import { motion } from "framer-motion";

export default function ProjectsSection() {
  const projects = [
    {
      title: "Motor Unit Degeneration Simulator",
      description:
        "Hybrid mechanistic + Neural ODE simulator for studying motor unit degeneration, intervention timing, and non-identifiability under explicit assumptions.",
      meaning: "Represents research-grade modeling and scientific rigor.",
      tech: ["Neural ODE", "Python", "Scientific ML"],
      link: "https://github.com/ProudStone-576/motor-unit-degeneration-simulator",
    },
    {
      title: "Volatility Regime Engine",
      description:
        "Machine learning pipeline to detect volatility regimes using rolling statistics and market state transitions for financial risk analysis.",
      meaning: "Represents time-series reasoning and risk-aware ML.",
      tech: ["Time Series", "ML", "Finance"],
      link: "https://github.com/ProudStone-576/volatility-regime-engine",
    },
    {
      title: "Real-time Sudoku Vision Solver",
      description:
        "Computer vision system that detects Sudoku grids in real time and solves them using backtracking algorithms.",
      meaning: "Represents algorithmic thinking under real-time constraints.",
      tech: ["OpenCV", "Python", "Algorithms"],
      link: "https://github.com/ProudStone-576/realtime-sudoku-vision-solver",
    },
    {
      title: "AI Solution Evaluation System",
      description:
        "MySQL-based system for managing AI tasks, solutions, user feedback, ratings, and automated evaluations at scale.",
      meaning: "Represents system design and scalable evaluation logic.",
      tech: ["MySQL", "System Design", "AI Evaluation"],
      link: "https://github.com/ProudStone-576/ai-solution-evaluation-system",
    },
    {
      title: "Bulldozer Price Prediction Model",
      description:
        "TensorFlow-based neural network for predicting bulldozer auction prices using structured tabular data.",
      meaning: "Represents applied deep learning beyond toy datasets.",
      tech: ["TensorFlow", "Neural Network", "Regression"],
      link: "https://github.com/ProudStone-576/Bulldozer-price-prediction-model",
    },
    {
      title: "Heart Disease Prediction Model",
      description:
        "Supervised learning model to predict heart disease risk using clinical data and validated metrics.",
      meaning: "Represents responsible ML applied to healthcare data.",
      tech: ["Classification", "Healthcare ML", "Python"],
      link: "https://github.com/ProudStone-576/Heart-Disease-Model",
    },
  ];

  return (
    <section
      id="projects"
      className="relative w-full bg-black text-white px-6 md:px-12 py-28 overflow-hidden"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/5 blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20 max-w-2xl">
          <div className="w-14 h-[2px] bg-gradient-to-r from-white to-white/20 mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-5 tracking-tight">
            Selected Projects
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Each project is chosen not for quantity, but for what it proves
            about how I think and build systems.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true }}
              className="group relative rounded-2xl border border-white/10 bg-black/60 backdrop-blur-sm p-7 transition-all duration-300 hover:border-white/30 hover:-translate-y-2"
            >
              {/* Hover meaning overlay */}
              <div className="absolute inset-0 rounded-2xl bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center px-6 text-center pointer-events-none">
                <p className="text-sm text-gray-200 leading-relaxed">
                  {project.meaning}
                </p>
              </div>

              {/* Content */}
              <div className="relative z-10 group-hover:opacity-20 transition-opacity duration-300">
                <h3 className="text-xl font-semibold mb-3 tracking-tight">
                  {project.title}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed mb-5">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-3 py-1 rounded-full border border-white/20 text-gray-300 bg-white/5"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <a
                  href={project.link}
                  target="_blank"
                  className="inline-flex items-center text-sm font-medium text-white"
                >
                  View on GitHub →
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
