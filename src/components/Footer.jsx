import React from "react";
import { Github, Linkedin, Instagram, Mail, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full mt-10 border-t border-white/10 bg-[#030014]">
      <div className="px-[5%] lg:px-[10%] py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
              Ibad Ullah
            </h3>
            <p className="text-gray-400 text-sm mt-1">Software Engineering Student • Air University</p>
          </div>

          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#Home" className="hover:text-white transition-colors duration-300">Home</a>
            <a href="#About" className="hover:text-white transition-colors duration-300">About</a>
            <a href="#Portfolio" className="hover:text-white transition-colors duration-300">Portfolio</a>
            <a href="#Contact" className="hover:text-white transition-colors duration-300">Contact</a>
          </div>

          <div className="flex gap-4">
            <a href="https://github.com/EngrIbadUllah" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#6366f1]/50 transition-all duration-300">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://www.linkedin.com/in/ibad-ullah-b28a413a7/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#6366f1]/50 transition-all duration-300">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="https://www.instagram.com/growth.forgee" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#6366f1]/50 transition-all duration-300">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="mailto:ibadullahse@gmail.com" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#6366f1]/50 transition-all duration-300">
              <Mail className="w-4 h-4" />
            </a>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
            © {currentYear} Ibad Ullah. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;