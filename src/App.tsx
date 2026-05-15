import Navbar from './components/navbar';
import Footer from './Footer';
import SmoothScroll from './components/SmoothScroll';
import Cursor from './components/Cursor';
import Loader from './components/Loader';
import Hero from './components/Hero';
import MarqueeStrip from './components/MarqueeStrip';
import About from './components/About';
import Skills from './components/Skills';
import Process from './components/Process';
import CodePanel from './components/panelSection';
import ProjectsSection from './components/ProjectShowcase';
import Contact from './components/contact';
import Interlude from './components/Interlude';
import ScrollHUD from './components/ChromaticScroll';

function App() {
  return (
    <div className="relative bg-ink text-bone grain">
      <SmoothScroll />
      <Loader />
      <Cursor />
      <Navbar />
      <ScrollHUD />

      <main>
        <Hero />
        <MarqueeStrip />
        <About />

        <Interlude
          chapter="03"
          title="Method."
          subtitle="Most analysis predicts outcomes. I isolate mechanisms — separate triggers from amplifiers, construct causal graphs, test counterfactual scenarios."
        />

        <Skills />
        <Process />

        <Interlude
          chapter="05"
          title="Proof."
          subtitle="Six selected projects. Each chosen for what it proves about how I think — not for quantity."
          invert
        />

        <ProjectsSection />
        <CodePanel />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

export default App;
