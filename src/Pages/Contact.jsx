import React, { useState, useEffect } from "react";
import { Share2, User, Mail, MessageSquare, Send, MapPin, Clock, Github, Linkedin, Instagram } from "lucide-react";
import SocialLinks from "../components/SocialLinks";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { AOS.init({ once: false }); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    Swal.fire({ title: 'Sending Message...', html: 'Please wait while we send your message', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); } });
    try {
      const formSubmitUrl = 'https://formsubmit.co/ibadullahse@gmail.com';
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('message', formData.message);
      submitData.append('_subject', 'New Message from Portfolio Website');
      submitData.append('_captcha', 'false');
      submitData.append('_template', 'table');
      await axios.post(formSubmitUrl, submitData, { headers: { 'Content-Type': 'multipart/form-data' } });
      Swal.fire({ title: 'Sent!', text: 'Your message has been sent successfully!', icon: 'success', confirmButtonColor: '#6366f1', timer: 2000, timerProgressBar: true });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      if (error.request && error.request.status === 0) {
        Swal.fire({ title: 'Sent!', text: 'Your message has been sent successfully!', icon: 'success', confirmButtonColor: '#6366f1', timer: 2000, timerProgressBar: true });
        setFormData({ name: "", email: "", message: "" });
      } else {
        Swal.fire({ title: 'Failed!', text: 'Something went wrong. Please try again later.', icon: 'error', confirmButtonColor: '#6366f1' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-[5%] lg:px-[10%]" id="Contact">
      {/* Heading */}
      <div className="text-center lg:mt-[5%] mt-10 mb-10 px-[5%] sm:px-0">
        <h2 data-aos="fade-down" data-aos-duration="1000"
          className="inline-block text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
          Contact Me
        </h2>
        <p data-aos="fade-up" data-aos-duration="1100"
          className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          Have a question? Send me a message and I'll get back to you as soon as possible.
        </p>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-16">

        {/* LEFT — Contact Form */}
        <div data-aos="fade-right"
          className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-10 transition-all duration-500 hover:shadow-[#6366f1]/10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
                Contact
              </h2>
              <p className="text-gray-400 text-sm">Want to discuss something? Send me a message and let's talk.</p>
            </div>
            <Share2 className="w-8 h-8 text-[#6366f1] opacity-50" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div data-aos="fade-up" data-aos-delay="100" className="relative group">
              <User className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#6366f1] transition-colors" />
              <input type="text" name="name" placeholder="Your Name" value={formData.name}
                onChange={handleChange} disabled={isSubmitting} required
                className="w-full p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 transition-all duration-300 hover:border-[#6366f1]/30 disabled:opacity-50" />
            </div>
            <div data-aos="fade-up" data-aos-delay="200" className="relative group">
              <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#6366f1] transition-colors" />
              <input type="email" name="email" placeholder="Your Email" value={formData.email}
                onChange={handleChange} disabled={isSubmitting} required
                className="w-full p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 transition-all duration-300 hover:border-[#6366f1]/30 disabled:opacity-50" />
            </div>
            <div data-aos="fade-up" data-aos-delay="300" className="relative group">
              <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#6366f1] transition-colors" />
              <textarea name="message" placeholder="Your Message" value={formData.message}
                onChange={handleChange} disabled={isSubmitting} required
                className="w-full resize-none p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 transition-all duration-300 hover:border-[#6366f1]/30 h-36 disabled:opacity-50" />
            </div>
            <button data-aos="fade-up" data-aos-delay="400" type="submit" disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#6366f1]/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <Send className="w-5 h-5" />
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* RIGHT — Info + Social Links */}
        <div data-aos="fade-left" className="flex flex-col gap-6">

          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-indigo-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="text-gray-400 text-sm font-medium">Email</span>
              </div>
              <p className="text-white text-sm font-semibold break-all">ibadullahse@gmail.com</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-indigo-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-gray-400 text-sm font-medium">Location</span>
              </div>
              <p className="text-white text-sm font-semibold">Islamabad, Pakistan</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-indigo-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <span className="text-2xl">💼  </span>
                </div>
                <span className="text-gray-400 text-sm font-medium">Education</span>
              </div>
              <p className="text-white text-sm font-semibold">2nd Semester</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-indigo-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <span className="text-blue-400 text-sm">🎓</span>
                </div>
                <span className="text-gray-400 text-sm font-medium">Status</span>
              </div>
              <p className="text-white text-sm font-semibold">Open to Opportunities</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex-1">
            <SocialLinks />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;
