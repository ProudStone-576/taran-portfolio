import Navbar from './components/navbar';
import Footer from './Footer';
import SmoothScroll from './components/SmoothScroll';
import Cursor from './components/Cursor';
import Loader from './components/Loader';
import Hero from './components/Hero';
import MarqueeStrip from './components/MarqueeStrip';
import About from './components/About';
import Skills from './components/Skills';
import HomeLab from './components/HomeLab';
import Process from './components/Process';
import Experience from './components/Experience';
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
        <Skills />

        <Interlude
          chapter="04"
          title="Lab."
          subtitle="A real Windows-Server domain on real hardware. Active Directory, VLANs, firewall, tickets, monitoring — running as you read this."
        />

        <HomeLab />
        <Process />
        <Experience />

        <Interlude
          chapter="07"
          title="Proof."
          subtitle="Scripts, GPOs, runbooks, dashboards. Built to keep users productive — not to win a hackathon."
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
