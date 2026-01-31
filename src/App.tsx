import Navbar from "./components/navbar";
import Footer from "./Footer";
import SplineScene from "./components/SplineScene";
import ServicesWithCube from "./components/service";
import TypingCodePanel from "./components/panelSection";
import ProcessSection from "./components/processSet";
import AboutSection from "./components/About";
import ContactUs from "./components/contact";
import VisitorsBook from "./components/visitors";
import ProjectsSection from "./components/ProjectShowcase";

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-20 space-y-24 md:space-y-32">
        {/* Hero */}
        <section
          id="home"
          className="min-h-screen flex items-center justify-center"
        >
          <SplineScene />
        </section>

        {/* About */}
        <section id="about" className="px-4 md:px-12">
          <AboutSection />
        </section>

        {/* Services */}
        <section
          id="services"
          className="min-h-screen flex items-center justify-center px-4 md:px-12"
        >
          <ServicesWithCube />
        </section>

        {/* Process */}
        <section id="process" className="px-4 md:px-12">
          <ProcessSection />
        </section>

        {/* Projects */}
        <section id="projects" className="px-4 md:px-12">
          <TypingCodePanel />
        </section>

         {/* Projects */}
        <section id="projects" className="px-4 md:px-12">
          <ProjectsSection/>
        </section>


        {/* Visitors */}
        <section id="visitors" className="px-4 md:px-12 pb-24">
          <VisitorsBook />
        </section>

        {/* Contact */}
        <section
          id="contact"
          className="min-h-screen flex items-center justify-center px-4 md:px-12"
        >
          <ContactUs />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
