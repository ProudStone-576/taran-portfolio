import { Atom, Globe, Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-black via-neutral-900 to-black text-white overflow-hidden">
      
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px),
                           linear-gradient(to bottom, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-14 md:py-10">
        
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 border-b border-white/10 pb-10 md:pb-8">
          
          {/* Identity */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Atom className="h-6 w-6 text-white" />
              <span className="text-lg md:text-xl font-semibold tracking-wide">
                Taran Matharu
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Data Scientist & AI Engineer.  
              Building analytical systems, machine learning models, and scalable data pipelines.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest">
              Navigate
            </h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#projects" className="hover:text-white transition-colors">Projects</a></li>
              <li><a href="#process" className="hover:text-white transition-colors">Workflow</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest">
              Connect
            </h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-center space-x-3">
                <Github className="h-4 w-4" />
                <a
                  href="https://github.com/ProudStone-576"
                  target="_blank"
                  className="hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Linkedin className="h-4 w-4" />
                <a
                  href="https://linkedin.com/in/taran-matharu-/"
                  target="_blank"
                  className="hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4" />
                <a
                  href="mailto:taranjeetsinghmatharu15@gmail.com"
                  className="hover:text-white transition-colors break-all sm:break-normal"
                >
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-8 gap-4 text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} Taran Matharu. All rights reserved.
          </p>
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>Built on the internet. Runs everywhere.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
