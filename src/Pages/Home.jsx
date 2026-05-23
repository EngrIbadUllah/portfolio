import React, { useState, useEffect, useCallback, memo, Suspense, lazy } from "react"
import { Helmet } from "react-helmet-async"
import { Github, Linkedin, Mail, ExternalLink, Instagram, ChevronDown } from "lucide-react"
import AOS from 'aos'
import 'aos/dist/aos.css'
import { supabase } from "../supabase"
import { motion } from "framer-motion"

// Lazy load 3D components for performance
const HeroScene = lazy(() => import("../components/3D/HeroScene"))

const MainTitle = memo(() => (
  <div className="space-y-2">
    <motion.h1 
      className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <span className="relative inline-block">
        <span className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-purple-500 blur-3xl opacity-20"></span>
        <span className="relative bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
          Software
        </span>
      </span>
      <br />
      <span className="relative inline-block mt-2">
        <span className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-purple-500 blur-3xl opacity-20"></span>
        <span className="relative bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Engineer
        </span>
      </span>
    </motion.h1>
  </div>
));

const TechStack = memo(({ tech, index }) => (
  <motion.div 
    className="group relative px-4 py-2 rounded-full overflow-hidden"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
    whileHover={{ scale: 1.05 }}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md border border-white/10 rounded-full"></div>
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/20 group-hover:to-purple-500/20 transition-all duration-300 rounded-full"></div>
    <span className="relative text-sm text-gray-300 group-hover:text-white transition-colors font-medium">
      {tech}
    </span>
  </motion.div>
));

const CTAButton = memo(({ href, text, icon: Icon, primary }) => (
  <motion.a 
    href={href}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 1 }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <button className="group relative w-[160px] h-12 overflow-hidden rounded-xl">
      <div className={`absolute -inset-0.5 ${primary ? 'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500' : 'bg-gradient-to-r from-white/20 to-white/10'} rounded-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300`}></div>
      <div className={`relative h-full ${primary ? 'bg-[#030014]' : 'bg-white/5 backdrop-blur-sm'} rounded-xl flex items-center justify-center gap-2 border border-white/10`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        <span className={`relative text-sm font-medium ${primary ? 'bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent' : 'text-gray-300 group-hover:text-white'} transition-colors`}>
          {text}
        </span>
        <Icon className={`w-4 h-4 ${primary ? 'text-cyan-300' : 'text-gray-400 group-hover:text-white'} group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transform transition-all duration-300`} />
      </div>
    </button>
  </motion.a>
));

const SocialLink = memo(({ icon: Icon, link, label, index }) => (
  <motion.a 
    href={link} 
    target="_blank" 
    rel="noopener noreferrer" 
    aria-label={label}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
    whileHover={{ y: -3 }}
  >
    <button className="group relative p-3" aria-label={label}>
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
      <div className="relative rounded-xl bg-white/5 backdrop-blur-xl p-3 flex items-center justify-center border border-white/10 group-hover:border-cyan-500/30 transition-all duration-300">
        <Icon className="w-5 h-5 text-gray-400 group-hover:text-cyan-300 transition-colors" />
      </div>
    </button>
  </motion.a>
));

const ScrollIndicator = memo(() => (
  <motion.div 
    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 2, duration: 1 }}
  >
    <span className="text-xs text-gray-500 uppercase tracking-widest">Scroll</span>
    <motion.div
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <ChevronDown className="w-5 h-5 text-cyan-500/50" />
    </motion.div>
  </motion.div>
));

const SceneLoader = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="relative">
      <div className="w-16 h-16 border-2 border-cyan-500/30 rounded-full animate-ping"></div>
      <div className="absolute inset-0 w-16 h-16 border-2 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
    </div>
  </div>
);

const TYPING_SPEED = 100;
const ERASING_SPEED = 50;
const PAUSE_DURATION = 2000;
const WORDS = ["Software Engineering Student", "Frontend Developer", "Tech Enthusiast", "Creative Problem Solver"];
const TECH_STACK = ["React", "JavaScript", "Tailwind CSS", "C++", "Git"];
const SOCIAL_LINKS = [
  { icon: Github, link: "https://github.com/EngrIbadUllah", label: "GitHub Profile" },
  { icon: Linkedin, link: "https://www.linkedin.com/in/ibad-ullah-b28a413a7/", label: "LinkedIn Profile" },
  { icon: Instagram, link: "https://www.instagram.com/growth.forgee", label: "Instagram Profile" }
];

const Home = () => {
  const [projects, setProjects] = useState([]);  
  const [text, setText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase.from("projects").select("*");
      setProjects(data || []);
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    AOS.init({ once: false });
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    return () => setIsLoaded(false);
  }, []);

  const handleTyping = useCallback(() => {
    if (isTyping) {
      if (charIndex < WORDS[wordIndex].length) {
        setText(prev => prev + WORDS[wordIndex][charIndex]);
        setCharIndex(prev => prev + 1);
      } else {
        setTimeout(() => setIsTyping(false), PAUSE_DURATION);
      }
    } else {
      if (charIndex > 0) {
        setText(prev => prev.slice(0, -1));
        setCharIndex(prev => prev - 1);
      } else {
        setWordIndex(prev => (prev + 1) % WORDS.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, wordIndex]);

  useEffect(() => {
    const timeout = setTimeout(
      handleTyping,
      isTyping ? TYPING_SPEED : ERASING_SPEED
    );
    return () => clearTimeout(timeout);
  }, [handleTyping]);

  return (
    <>
      <Helmet>
        <title>Ibad Ullah | Software Engineering Student and Frontend Developer</title>
        <meta name="description" content="Ibad Ullah is a Software Engineering student focused on frontend web development, building clean and responsive digital solutions." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://github.com/EngrIbadUllah" />
        <meta property="og:title" content="Ibad Ullah — Software Engineering Student" />
        <meta property="og:description" content="Portfolio of Ibad Ullah, Software Engineering student focused on web development and modern technologies." />
        <meta property="og:url" content="https://github.com/EngrIbadUllah" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Ibad Ullah",
            "jobTitle": "Software Engineering Student",
            "url": "https://github.com/EngrIbadUllah",
            "sameAs": [
              "https://github.com/EngrIbadUllah",
              "https://www.linkedin.com/in/ibad-ullah-b28a413a7/",
              "https://www.instagram.com/growth.forgee"
            ]
          }
        `}</script>
      </Helmet>

      <div className="min-h-screen bg-[#030014] relative overflow-hidden" id="Home">
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>

        <div className={`relative z-10 transition-all duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
          <div className="container mx-auto min-h-screen px-[5%] lg:px-[8%]">
            <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen gap-8 lg:gap-12 py-20 lg:py-0">
              
              {/* Left Column - Content */}
              <div className="w-full lg:w-1/2 space-y-6 text-left order-2 lg:order-1">
                <MainTitle />

                {/* Typing Effect */}
                <motion.div 
                  className="h-10 flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <span className="text-xl md:text-2xl font-light text-gray-300">
                    {text}
                  </span>
                  <span className="w-[3px] h-7 bg-gradient-to-t from-cyan-500 to-purple-500 ml-1 animate-pulse"></span>
                </motion.div>

                {/* Description */}
                <motion.p 
                  className="text-base md:text-lg text-gray-400 max-w-xl leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  Crafting clean, responsive web experiences with modern technologies. 
                  Passionate about turning ideas into elegant digital solutions.
                </motion.p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-3">
                  {TECH_STACK.map((tech, index) => (
                    <TechStack key={index} tech={tech} index={index} />
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-row gap-4 pt-4">
                  <CTAButton href="#Portfolio" text="View Projects" icon={ExternalLink} primary />
                  <CTAButton href="#Contact" text="Contact Me" icon={Mail} />
                </div>

                {/* Social Links */}
                <div className="flex gap-4 pt-2">
                  {SOCIAL_LINKS.map((social, index) => (
                    <SocialLink key={index} {...social} index={index} />
                  ))}
                </div>
              </div>

              {/* Right Column - 3D Scene */}
              <div className="w-full lg:w-1/2 h-[350px] sm:h-[450px] lg:h-[600px] relative order-1 lg:order-2">
                {/* Glow effect behind 3D scene */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl"></div>
                
                {/* 3D Scene */}
                <Suspense fallback={<SceneLoader />}>
                  <HeroScene className="relative z-10" />
                </Suspense>
              </div>
            </div>

            {/* Scroll Indicator */}
            <ScrollIndicator />
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Home);
