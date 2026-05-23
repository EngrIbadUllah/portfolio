import React, { useState, useEffect, memo, useMemo, useRef, Suspense, lazy } from "react";
import { FileText, Code, Award, Globe, ArrowUpRight, Sparkles } from "lucide-react"
import { supabase } from "../supabase";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Lazy load 3D tech icons
const FloatingTechIcons = lazy(() => import("../components/3D/FloatingTechIcons"));

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

// Memoized Components
const Header = memo(() => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  return (
    <motion.div 
      ref={ref}
      className="text-center lg:mb-8 mb-2 px-[5%]"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerContainer}
    >
      <motion.div className="inline-block relative group" variants={fadeInUp}>
        <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
          About Me
        </h2>
        {/* Animated underline */}
        <motion.div 
          className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full"
          initial={{ width: 0 }}
          animate={isInView ? { width: "100%" } : { width: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      </motion.div>
      <motion.p 
        className="mt-4 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg flex items-center justify-center gap-2"
        variants={fadeInUp}
      >
        <Sparkles className="w-5 h-5 text-cyan-400" />
        Transforming ideas into digital experiences
        <Sparkles className="w-5 h-5 text-purple-400" />
      </motion.p>
    </motion.div>
  );
});

const ProfileImage = memo(() => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <motion.div 
      ref={ref}
      className="flex justify-center items-center p-6"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={scaleIn}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="relative group">
        {/* Animated gradient ring */}
        <motion.div 
          className="absolute -inset-4 rounded-full opacity-50"
          style={{
            background: "conic-gradient(from 0deg, #00d4ff, #a855f7, #6366f1, #00d4ff)"
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Glow effect */}
        <div className="absolute -inset-6 opacity-30 z-0 blur-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full" />

        <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full overflow-hidden shadow-2xl transform transition-all duration-700 group-hover:scale-105 border-4 border-white/10">
          {/* Overlay gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-purple-500/20 z-10 transition-opacity duration-700 group-hover:opacity-0" />
          
          <img
            src="/Photo.jpg"
            alt="Profile"
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            loading="lazy"
          />

          {/* Shine effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000 z-20" />
        </div>
      </div>
    </motion.div>
  );
});

const StatCard = memo(({ icon: Icon, color, value, label, description, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const countRef = useRef(null);

  // GSAP counter animation
  useEffect(() => {
    if (isInView && countRef.current) {
      const obj = { value: 0 };
      gsap.to(obj, {
        value: parseInt(value) || 0,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => {
          if (countRef.current) {
            countRef.current.textContent = Math.round(obj.value);
          }
        }
      });
    }
  }, [isInView, value]);

  return (
    <motion.div 
      ref={ref}
      className="relative group cursor-pointer"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
    >
      {/* Card glow */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${color} rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
      
      <div className="relative z-10 bg-[#0a0a1a]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 overflow-hidden h-full flex flex-col justify-between group-hover:border-white/20 transition-all duration-300">
        {/* Background gradient */}
        <div className={`absolute -z-10 inset-0 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
        
        <div className="flex items-center justify-between mb-4">
          <motion.div 
            className="w-14 h-14 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 group-hover:border-cyan-500/30 transition-all duration-300"
            whileHover={{ rotate: 10, scale: 1.1 }}
          >
            <Icon className="w-7 h-7 text-cyan-300" />
          </motion.div>
          <span 
            ref={countRef}
            className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
          >
            {value}
          </span>
        </div>

        <div>
          <p className="text-sm uppercase tracking-wider text-cyan-300/80 mb-1 font-medium">
            {label}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {description}
            </p>
            <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// 3D Scene loader
const SceneLoader = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
  </div>
);

const AboutPage = () => {
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const mainRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: projectData } = await supabase.from("projects").select("*");
      const { data: certificateData } = await supabase.from("certificates").select("*");
      setProjects(projectData || []);
      setCertificates(certificateData || []);
    };
    fetchData();
  }, []);

  const { totalProjects, totalCertificates, YearExperience } = useMemo(() => {
    const startDate = new Date("2025-09-01");
    const today = new Date();
    const experience = today.getFullYear() - startDate.getFullYear() -
      (today < new Date(today.getFullYear(), startDate.getMonth(), startDate.getDate()) ? 1 : 0);

    return {
      totalProjects: projects.length,
      totalCertificates: certificates.length,
      YearExperience: experience
    };
  }, [projects.length, certificates.length]);

  const statsData = useMemo(() => [
    {
      icon: Code,
      color: "from-cyan-500 to-blue-500",
      value: totalProjects,
      label: "Total Projects",
      description: "Innovative web solutions crafted",
    },
    {
      icon: Award,
      color: "from-purple-500 to-pink-500",
      value: totalCertificates,
      label: "Certificates",
      description: "Professional skills validated",
    },
    {
      icon: Globe,
      color: "from-cyan-500 to-purple-500",
      value: YearExperience,
      label: "Years Experience",
      description: "Continuous learning journey",
    },
  ], [totalProjects, totalCertificates, YearExperience]);

  return (
    <div
      ref={mainRef}
      className="min-h-screen text-white overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%] py-20" 
      id="About"
      itemScope
      itemType="https://schema.org/Person"
    >
      <Header />

      <div className="w-full mx-auto pt-8 sm:pt-12 relative">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Left content */}
          <motion.div 
            className="space-y-6 text-center lg:text-left"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold"
              variants={fadeInUp}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Hello, I&apos;m
              </span>
              <span className="block mt-2 text-gray-100" itemProp="name">
                Ibad Ullah
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-base sm:text-lg lg:text-xl text-gray-400 leading-relaxed text-justify"
              variants={fadeInUp}
            >
              I am a Software Engineering student at Air University, Islamabad. I specialize in building responsive and user friendly web applications using modern technologies. Currently focused on improving my frontend development skills and working on real world projects.
            </motion.p>

            {/* Quote Section */}
            <motion.div 
              className="relative bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 border border-cyan-500/20 rounded-2xl p-5 backdrop-blur-md overflow-hidden"
              variants={fadeInUp}
            >
              <div className="absolute top-2 right-4 w-20 h-20 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-2 w-16 h-16 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur-xl" />
              
              <div className="absolute top-3 left-4 text-cyan-500 opacity-40">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                </svg>
              </div>
              
              <blockquote className="text-gray-300 text-center lg:text-left italic font-medium text-sm relative z-10 pl-8">
                &quot;Every expert was once a beginner. Keep building, keep growing.&quot;
              </blockquote>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col lg:flex-row items-center lg:items-start gap-4 lg:gap-4 w-full"
              variants={fadeInUp}
            >
              <a href="/Ibad_Ullah_CV.pdf" download className="w-full lg:w-auto">
                <motion.button 
                  className="w-full lg:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FileText className="w-5 h-5" /> Download CV
                </motion.button>
              </a>
              <a href="#Portfolio" className="w-full lg:w-auto">
                <motion.button 
                  className="w-full lg:w-auto px-6 py-3 rounded-xl border border-cyan-500/30 text-cyan-300 font-medium flex items-center justify-center gap-2 hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Code className="w-5 h-5" /> View Projects
                </motion.button>
              </a>
            </motion.div>
          </motion.div>

          {/* Right - Profile Image with 3D background option */}
          <div className="relative">
            <ProfileImage />
          </div>
        </div>

        {/* Stats Grid */}
        <a href="#Portfolio">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {statsData.map((stat, index) => (
              <StatCard key={stat.label} {...stat} index={index} />
            ))}
          </div>
        </a>
      </div>

      {/* 3D Tech Icons Section */}
      <motion.div 
        className="mt-20 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <h3 className="text-2xl font-bold text-center mb-8">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            Tech Stack
          </span>
        </h3>
        <div className="h-[400px] relative">
          <Suspense fallback={<SceneLoader />}>
            <FloatingTechIcons />
          </Suspense>
        </div>
      </motion.div>

      {/* Academic Background */}
      <motion.div 
        id="Education" 
        className="w-full max-w-4xl mx-auto px-4 mt-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-center text-white mb-10">
          Academic <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Background</span>
        </h2>
        <motion.div 
          className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl hover:border-cyan-500/30 transition-all duration-300"
          whileHover={{ y: -5 }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1">BS Software Engineering</h3>
              <p className="text-cyan-400 font-medium mb-3">Air University, Islamabad</p>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="text-sm text-gray-300 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  2025 - Present
                </span>
                <span className="text-sm text-gray-300 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  2nd Semester
                </span>
                <span className="text-sm text-gray-300 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  Islamabad, Pakistan
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Currently pursuing a Bachelor of Science in Software Engineering at Air University, Islamabad. Building a strong foundation in programming, data structures, algorithms, and modern software development practices.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Currently Working On */}
      <motion.div 
        className="w-full max-w-4xl mx-auto px-4 mt-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          Currently <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Working On</span>
        </h2>
        <motion.div 
          className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:border-cyan-500/30 transition-all duration-300"
          whileHover={{ y: -5 }}
        >
          <p className="text-gray-400 text-sm leading-relaxed text-center">
            I am currently learning HTML, CSS, React.js and practicing building real world projects to strengthen my frontend development skills. My focus is on creating clean, responsive, and user friendly web applications while improving problem solving abilities.
          </p>
        </motion.div>
      </motion.div>

      {/* Professional Journey */}
      <motion.div 
        className="w-full max-w-4xl mx-auto px-4 mt-16 mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={staggerContainer}
      >
        <motion.h2 
          className="text-3xl font-bold text-center text-white mb-10"
          variants={fadeInUp}
        >
          Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Journey</span>
        </motion.h2>
        <div className="relative border-l-2 border-cyan-500/30 pl-8 space-y-10">
          <motion.div 
            className="relative"
            variants={fadeInUp}
          >
            <div className="absolute -left-[2.65rem] top-1 w-4 h-4 rounded-full bg-cyan-500 border-2 border-cyan-300 shadow-lg shadow-cyan-500/50"></div>
            <motion.div 
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300"
              whileHover={{ x: 5 }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="text-lg font-bold text-white">Fresher - Actively Learning</h3>
                  <p className="text-cyan-400 font-medium text-sm mt-1">Self-Study and Personal Projects</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs text-gray-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">2025 - Present</span>
                  <span className="text-xs text-gray-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">Self-Directed</span>
                </div>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-gray-400">
                <li className="flex gap-2"><span className="text-cyan-400 mt-1">-</span> Building personal web projects using HTML, CSS, and C++</li>
                <li className="flex gap-2"><span className="text-cyan-400 mt-1">-</span> Studying modern web development technologies and best practices</li>
                <li className="flex gap-2"><span className="text-cyan-400 mt-1">-</span> Developing problem-solving skills through consistent coding practice</li>
                <li className="flex gap-2"><span className="text-cyan-400 mt-1">-</span> Actively seeking internship and collaboration opportunities</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
        <p className="text-center text-gray-600 text-xs mt-8">More experience coming soon - stay tuned!</p>
      </motion.div>
    </div>
  );
};

export default AboutPage;
