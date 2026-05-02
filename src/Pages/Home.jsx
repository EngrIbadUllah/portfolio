import React, { useState, useEffect, useCallback, memo } from "react";
import { Helmet } from "react-helmet-async";
import { Github, Linkedin, Mail, ExternalLink, Instagram } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const StatusBadge = memo(() => null);

const MainTitle = memo(() => (
  <div className="space-y-2" data-aos="fade-up" data-aos-delay="600">
    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-center lg:text-left">
      <span className="relative inline-block">
        <span className="absolute -inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-2xl opacity-20"></span>
        <span className="relative bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
          Software
        </span>
      </span>
      <br />
      <span className="relative inline-block mt-2">
        <span className="absolute -inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-2xl opacity-20"></span>
        <span className="relative bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
          Engineer
        </span>
      </span>
    </h1>
  </div>
));

const TechStack = memo(({ tech }) => (
  <div className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors">
    {tech}
  </div>
));

const CTAButton = memo(({ href, text, icon: Icon }) => (
  <a href={href}>
    <button className="group relative w-[160px]">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4f52c9] to-[#8644c5] rounded-xl opacity-50 blur-md group-hover:opacity-90 transition-all duration-700"></div>
      <div className="relative h-11 bg-[#030014] rounded-lg border border-white/10 overflow-hidden">
        <span className="absolute inset-0 flex items-center justify-center gap-2 text-sm">
          <span className="text-white font-medium">{text}</span>
          <Icon className="w-4 h-4 text-gray-200" />
        </span>
      </div>
    </button>
  </a>
));

const SocialLink = memo(({ icon: Icon, link }) => (
  <a href={link} target="_blank" rel="noopener noreferrer">
    <button className="p-3">
      <div className="rounded-xl bg-black/50 p-2 border border-white/10">
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
    </button>
  </a>
));

const WORDS = [
  "Software Engineering Student",
  "Frontend Developer (Learning)",
  "Tech Enthusiast",
];
const TECH_STACK = ["HTML", "CSS", "C++", "MS Word", "MS Excel"];

const SOCIAL_LINKS = [
  { icon: Github, link: "https://github.com/EngrIbadUllah" },
  { icon: Linkedin, link: "https://www.linkedin.com/in/ibad-ullah-b28a413a7/" },
  { icon: Instagram, link: "https://www.instagram.com/growth.forgee" },
];

const Home = () => {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  useEffect(() => {
    const currentWord = WORDS[wordIndex];

    if (isTyping) {
      if (charIndex < currentWord.length) {
        setTimeout(() => {
          setText((prev) => prev + currentWord[charIndex]);
          setCharIndex((prev) => prev + 1);
        }, 80);
      } else {
        setTimeout(() => setIsTyping(false), 1500);
      }
    } else {
      if (charIndex > 0) {
        setTimeout(() => {
          setText((prev) => prev.slice(0, -1));
          setCharIndex((prev) => prev - 1);
        }, 40);
      } else {
        setIsTyping(true);
        setWordIndex((prev) => (prev + 1) % WORDS.length);
      }
    }
  }, [charIndex, isTyping, wordIndex]);

  return (
    <>
      <Helmet>
        <title>Ibad Ullah Portfolio</title>
      </Helmet>

      <div className="min-h-screen bg-[#030014] px-4 sm:px-6 lg:px-12 pt-24 pb-10 overflow-x-hidden" id="Home">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-20">

            {/* LEFT */}
            <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
              <MainTitle />

              <div className="text-lg text-gray-300 h-8">
                {text}
              </div>

              <p className="text-gray-400 max-w-xl mx-auto lg:mx-0">
                Crafting clean, responsive web experiences — one line of code at a time.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                {TECH_STACK.map((tech, i) => (
                  <TechStack key={i} tech={tech} />
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3">
                <CTAButton href="#Portofolio" text="Projects" icon={ExternalLink} />
                <CTAButton href="#Contact" text="Contact" icon={Mail} />
              </div>

              <div className="flex justify-center lg:justify-start gap-4">
                {SOCIAL_LINKS.map((s, i) => (
                  <SocialLink key={i} {...s} />
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <img
                src="Animation1.gif"
                alt="animation"
                className="w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[500px]"
              />
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Home);