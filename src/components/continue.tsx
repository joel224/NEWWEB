'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiHeart, FiCalendar, FiMapPin, FiClock, FiCheck, FiX, FiCheckCircle } from 'react-icons/fi';

export default function WeddingInvitation() {
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  // RSVP Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attending: 'yes',
    guests: '1',
    diet: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate premium server submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
    }, 1500);
  };

  return (
    <main className="w-full min-h-screen bg-[#faf8f5] text-[#4a584d] flex flex-col items-center py-16 px-4 relative overflow-hidden select-none">
      
      {/* Soft linen/canvas paper texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Floating dynamic white flower petals in the background */}
      <div className="absolute top-24 left-10 w-4 h-4 bg-white/60 rounded-full blur-[1px] animate-pulse pointer-events-none" />
      <div className="absolute top-96 right-12 w-3 h-3 bg-white/40 rounded-full blur-[1px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-48 left-16 w-5 h-5 bg-white/50 rounded-full blur-[2px] animate-pulse pointer-events-none" />

      {/* Elegant minimalist Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/portfolio">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 hover:bg-white border border-[#e5e0d8] text-[#5c6e60] text-xs font-semibold shadow-sm transition-all cursor-pointer hover:shadow-md">
            <FiArrowLeft className="w-4 h-4" />
            <span>Portfolio</span>
          </div>
        </Link>
      </div>

      {/* MAIN CONTAINER FOR COLLAGE */}
      <div className="w-full max-w-lg flex flex-col items-center gap-8 z-10 py-6">

        {/* 1. Pink Watercolor Envelope Section */}
        <motion.div 
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="relative w-full max-w-[340px] aspect-[4/5] flex items-center justify-center filter drop-shadow-[0_15px_30px_rgba(235,190,195,0.35)]"
        >
          <img 
            src="/images/wedding/envelope.png" 
            alt="Watercolor Floral Envelope"
            className="w-full h-full object-contain select-none"
          />
          {/* Decorative floating flowers */}
          <div className="absolute -top-3 left-6 w-5 h-5 bg-white/90 rounded-full flex items-center justify-center text-[10px] text-pink-300 font-bold shadow-sm rotate-12">❀</div>
          <div className="absolute bottom-6 right-2 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center text-[12px] text-pink-300 font-bold shadow-sm -rotate-12">❀</div>
        </motion.div>

        {/* 2. Overlapping Invitation Cards Stack */}
        <div className="relative w-full min-h-[460px] mt-[-80px] flex flex-col items-center">
          
          {/* Main Sage Green Invitation Card (Leaned Left) */}
          <motion.div
            initial={{ opacity: 0, x: -60, rotate: -4 }}
            animate={{ opacity: 1, x: 0, rotate: -4 }}
            transition={{ duration: 1.0, delay: 0.3, ease: 'easeOut' }}
            className="absolute left-2 top-0 md:w-[240px] w-[200px] aspect-[3/4] bg-[#67826e] text-white p-6 rounded-[28px] shadow-[0_15px_35px_rgba(103,130,110,0.3)] flex flex-col items-center justify-between text-center border-4 border-white/15"
          >
            {/* Elegant double scallop border effect */}
            <div className="absolute inset-2 border border-white/10 rounded-[22px] pointer-events-none" />
            
            <span className="text-[7.5px] tracking-[0.3em] font-semibold uppercase text-white/70 mt-2">
              My Experience  
            </span>

            <div className="flex flex-col my-auto gap-0.5">
              <h1 className="font-['Playwrite_AT'] font-light text-[35px] leading-tight text-[#fbfaf7] tracking-normal select-none italic font-semibold">
                Node.js
              </h1>
              <span className="text-[12px] tracking-[0.2em] font-medium text-white/60 italic my-0.5">
                and
              </span>
              <h1 className="font-['Playwrite_AT'] font-light text-[35px] leading-tight text-[#fbfaf7] tracking-normal select-none italic font-semibold">
                Next.js
              </h1>
            </div>

            <div className="flex flex-col items-center gap-1.5 mb-2">
              <span className="text-[7px] tracking-[0.25em] font-semibold uppercase text-white/80">
                open to collab for  
              </span>
              <span className="text-[8.5px] tracking-[0.15em] font-bold uppercase text-white/95 border-b border-white/20 pb-0.5">
                Web Development
              </span>
              <span className="text-[7px] tracking-[0.25em] font-semibold uppercase text-white/80">
                Design
              </span>
            </div>
          </motion.div>

          {/* White Save the Date Card (Leaned Right) */}
          <motion.div
            initial={{ opacity: 0, x: 60, rotate: 3 }}
            animate={{ opacity: 1, x: 0, rotate: 3 }}
            transition={{ duration: 1.0, delay: 0.5, ease: 'easeOut' }}
            className="absolute md:right-2 right-0 top-10 md:w-[240px] w-[180px] aspect-[3/4] bg-white text-[#4a584d] p-6 rounded-[28px] shadow-[0_15px_35px_rgba(0,0,0,0.06)] border border-[#e8e4db] flex flex-col items-center justify-between text-center"
          >
            {/* Elegant thin pink ribbon border */}
            <div className="absolute inset-3 border border-[#f3dada] rounded-[20px] pointer-events-none" />
            
            {/* Ribbon Corner Decorations */}
            <div className="absolute top-4 left-4 text-[#f0afaf] text-xs rotate-[-45deg] select-none">🎗</div>
            <div className="absolute bottom-4 right-4 text-[#f0afaf] text-xs rotate-[135deg] select-none">🎗</div>

            <span className="text-[8px] tracking-[0.2em] font-bold uppercase text-[#8ea093] mt-2">
              Woxro Technology's
            </span>

            <div className="flex flex-col my-auto gap-0.5">
              <span className="font-['Cinzel',serif] text-[28px] font-medium leading-none tracking-tight text-[#425045]">
                From
              </span>
              <span className="font-['Playwrite_AT'] text-[24px] text-[#b38484] italic my-1 font-semibold">
                November
              </span>
              <span className="font-['Cinzel',serif] text-[18px] tracking-[0.1em] font-bold text-[#8ea093]">
                2025
              </span>
            </div>

            <div className="flex flex-col gap-0.5 mb-2">
              <span className="text-[6.5px] tracking-[0.2em] uppercase font-bold text-[#a4b2a8]">
                Lead fullstack developer
              </span>
              <span className="text-[5.5px] tracking-[0.15em] uppercase text-white bg-[#8ea093] px-2 py-0.5 rounded-full font-bold">
                infopark kortty 
              </span>
            </div>
          </motion.div>
          
          {/* Overlapping RSVP Gold Oval Button */}
          <motion.div
            initial={{ scale: 0, rotate: -8 }}
            animate={{ scale: 1, rotate: -8 }}
            transition={{ type: 'spring', stiffness: 120, delay: 0.8 }}
            whileHover={{ scale: 1.05, rotate: -5 }}
            onClick={() => setShowRsvpModal(true)}
            className="absolute left-[34%] top-[175px] md:w-[130px] w-[98px]    h-[75px] bg-[#e9dc9d] hover:bg-[#ebd88d] text-[#5e532b] rounded-[50px] shadow-[0_8px_20px_rgba(233,220,157,0.45)] border-2 border-white flex flex-col items-center justify-center text-center cursor-pointer select-none z-10 transition-colors duration-300"
          >
            <span className="text-[7.5px] tracking-[0.25em] font-bold uppercase text-[#7d703e]">Kindly</span>
            <span className="font-['Playwrite_AT'] text-[20px] font-semibold text-[#5a4f27] my-[-1px] select-none italic">
              Collab
            </span>
            <span className="text-[7.5px] tracking-[0.25em] font-bold uppercase text-[#7d703e]">Here</span>
          </motion.div>

          {/* Details Semi-Circle Button */}
          <motion.div
            initial={{ scale: 0, rotate: 5 }}
            animate={{ scale: 1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 120, delay: 1.0 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
            onClick={() => setShowDetails(!showDetails)}
            className="absolute right-1 top-[270px] w-[130px] h-[65px] bg-[#eceae1] hover:bg-[#e4e2d7] text-[#4d5750] rounded-t-[70px] border-t-2 border-x-2 border-white shadow-[0_8px_20px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center text-center cursor-pointer z-10 transition-colors duration-300"
          >
            <span className="text-[6.5px] tracking-[0.15em] font-bold uppercase text-[#7a887e] mt-1.5">Tap here for the</span>
            <span className="font-['Playwrite_AT'] text-[15px] font-bold text-[#536156] select-none italic my-0.5">
              Details
            </span>
          </motion.div>

          {/* Botanical Watercolor Card & Pink envelope (Leaned under) */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            transition={{ duration: 1.0, delay: 0.7 }}
            className="absolute left-6 top-[233px]  md:top-[280px] w-[150px] aspect-[2/3] bg-white border border-[#ebd8d8] p-3 rounded-[16px] shadow-[0_10px_25px_rgba(0,0,0,0.03)] flex flex-col items-center justify-between"
          >
            <div className="w-full h-[82%] bg-[#faf9f6] rounded-[10px] overflow-hidden border border-[#eae6dd] flex items-center justify-center p-1.5">
              <img 
                src="/images/wedding/botanical.png" 
                alt="Wildflower Illustration"
                className="w-full h-full object-contain filter drop-shadow-sm select-none"
              />
            </div>
            <div className="w-full flex items-center justify-between px-1">
              <span className="text-[5.5px] font-serif text-[#a6b5ad] italic">Gladiolus communis</span>
              <span className="text-[5.5px] font-serif text-[#a6b5ad]">Plate III</span>
            </div>
          </motion.div>

        </div>

        {/* 3. Dropdown Event Details Panel */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="w-full max-w-[460px] bg-white border border-[#e3dfd7] rounded-3xl p-6 shadow-md overflow-hidden mt-6"
            >
              <div className="flex flex-col gap-4 text-center">
                <h3 className="font-['Cinzel',serif] text-sm tracking-[0.2em] uppercase font-bold text-[#5c6e60] border-b border-[#ebd8d8] pb-2">
                  Full-Stack Development
                </h3>
                
                <div className="grid grid-cols-3 gap-3 text-center py-2">
                  <div className="flex flex-col items-center gap-1.5">
                    <FiCalendar className="text-[#a4b5aa] w-4 h-4" />
                    <span className="text-[8px] font-bold uppercase tracking-wider text-[#a0ad9d]">Date</span>
                    <span className="text-[9.5px] font-semibold text-[#5c6e60]">NOV, 2025</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 border-x border-[#f0ece5]">
                    <FiClock className="text-[#a4b5aa] w-4 h-4" />
                    <span className="text-[8px] font-bold uppercase tracking-wider text-[#a0ad9d]">Till</span>
                    <span className="text-[9.5px] font-semibold text-[#5c6e60]">March, 2026</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <FiMapPin className="text-[#a4b5aa] w-4 h-4" />
                    <span className="text-[8px] font-bold uppercase tracking-wider text-[#a0ad9d]">Location</span>
                    <span className="text-[9.5px] font-semibold text-[#5c6e60]">Thrissue infopark</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 text-left border-t border-[#f0ece5] pt-3 text-[11px] leading-relaxed">
                  <p>
                    <strong className="text-[#5c6e60]">Full-Stack Development:</strong> I specialize in Next.js/React.js for the frontend ( Figma to design ) and expertise in developing backend systems using Node.js and PHP.
                  </p>
                  <p>
                    <strong className="text-[#5c6e60]">API & Database Proficiency:</strong>  I have a proven track record in building and integrating REST APIs and critical third-party services like Worldline and SendGrid. 
                  </p>
                  <p>
                    <strong className="text-[#5c6e60]">Architectural Leadership:</strong> I specialize in designing scalable architectures, including leading a migration from monolithic to headless architecture to enable independent scaling and faster deployments.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. Couple Polaroid Snapshot Collage (Grid of snaps) */}
        <div className="w-full grid grid-cols-2 gap-4 mt-6 max-w-[460px]">
          
          <Link href="/portfolio" className="cursor-pointer block">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: -2 }}
              whileHover={{ scale: 1.03, zIndex: 10 }}
              viewport={{ once: true }}
              className="bg-white p-3 pb-6 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.04)] border border-[#e8e4db] flex flex-col gap-3 rotate-[-2deg] transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="w-full aspect-[4/5] rounded-lg overflow-hidden bg-[#fbfaf6]">
                <img 
                  src="/iiii/1.png" 
                  alt="Finn and Rosie blowing dandelions" 
                  className="w-full h-full object-cover select-none"
                />
              </div>
              <div className="text-center font-['Playwrite_AT'] text-xs text-[#a2b0a6] select-none italic font-semibold">
                Air breeze
              </div>
            </motion.div>
          </Link>

          <Link href="/portfolio" className="cursor-pointer block">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 3 }}
              whileHover={{ scale: 1.03, zIndex: 10 }}
              viewport={{ once: true }}
              className="bg-white p-3 pb-6 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.04)] border border-[#e8e4db] flex flex-col gap-3 rotate-[3deg] mt-4 transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="w-full aspect-[4/5] rounded-lg overflow-hidden bg-[#fbfaf6]">
                <img 
                  src="/iiii/2.jpg" 
                  alt="Lying down in wildflowers" 
                  className="w-full h-full object-cover select-none"
                />
              </div>
              <div className="text-center font-['Playwrite_AT'] text-xs text-[#a2b0a6] select-none italic font-semibold">
                 Creative ear
              </div>
            </motion.div>
          </Link>

          <Link href="/portfolio" className="cursor-pointer block col-span-2 max-w-[240px] mx-auto w-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
              whileInView={{ opacity: 1, scale: 1, rotate: -4 }}
              whileHover={{ scale: 1.03, zIndex: 10 }}
              viewport={{ once: true }}
              className="bg-white p-3 pb-6 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.04)] border border-[#e8e4db] flex flex-col gap-3 rotate-[-4deg] transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="w-full aspect-[4/5] rounded-lg overflow-hidden bg-[#fbfaf6]">
                <img 
                  src="/iiii/5.png" 
                  alt="Hexagonal Green Velvet Ring Box" 
                  className="w-full h-full object-cover select-none"
                />

              </div> 
              <div className="text-center font-['Playwrite_AT'] text-xs text-[#a2b0a6] select-none italic font-semibold">
                the vows
              </div>
            </motion.div>
          </Link>

        </div>

        {/* Footnote */}
        <div className="mt-12 text-center flex flex-col items-center gap-2">
          <FiHeart className="text-pink-300 w-4 h-4 fill-pink-100 animate-pulse" />
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#a4b2a8] font-bold">
            Joel Joshy • 12.03.20.26
          </span>
        </div>

      </div>

      {/* RSVP FORM GLASSMORPHIC MODAL */}
      <AnimatePresence>
        {showRsvpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRsvpModal(false)}
              className="absolute inset-0 bg-[#344036]/50 backdrop-blur-sm"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white/95 backdrop-blur-md rounded-[32px] shadow-2xl border border-white p-8 z-10"
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowRsvpModal(false)}
                className="absolute top-5 right-5 text-[#88988d] hover:text-[#4a584d] p-1.5 rounded-full hover:bg-[#f3f0e8] transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>

              {!formSubmitted ? (
                <form onSubmit={handleRsvpSubmit} className="flex flex-col gap-5">
                  <div className="text-center mb-2">
                    <h3 className="font-['Cinzel',serif] text-[20px] font-bold text-[#5c6e60] tracking-wider">
                      Website Template 
                    </h3>
                    <p className="text-[11px] text-[#8e9c92] tracking-wide mt-1">
                      I invite you to celebrate with me
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-[#7a887d] pl-1">Your Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      required 
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full bg-[#fbfaf6] border border-[#e5e0d8] rounded-xl px-4 py-2.5 text-xs text-[#4a584d] focus:outline-none focus:border-[#8ea093] focus:ring-1 focus:ring-[#8ea093]"
                    />
                  </div>

                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-[#7a887d] pl-1">Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. eleanor@vance.com"
                      className="w-full bg-[#fbfaf6] border border-[#e5e0d8] rounded-xl px-4 py-2.5 text-xs text-[#4a584d] focus:outline-none focus:border-[#8ea093] focus:ring-1 focus:ring-[#8ea093]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-[#7a887d] pl-1">Attendance</label>
                      <select 
                        name="attending"
                        value={formData.attending}
                        onChange={handleInputChange}
                        className="w-full bg-[#fbfaf6] border border-[#e5e0d8] rounded-xl px-3 py-2.5 text-xs text-[#4a584d] focus:outline-none focus:border-[#8ea093]"
                      >
                        <option value="yes">Joyfully Colab ? </option>
                        <option value="no">Sadly Decline</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-[#7a887d] pl-1">Number of Team </label>
                      <select 
                        name="guests"
                        disabled={formData.attending === 'no'}
                        value={formData.guests}
                        onChange={handleInputChange}
                        className="w-full bg-[#fbfaf6] border border-[#e5e0d8] rounded-xl px-3 py-2.5 text-xs text-[#4a584d] focus:outline-none focus:border-[#8ea093] disabled:opacity-50"
                      >
                        <option value="1">1 Person</option>
                        <option value="2">2 People</option>
                        <option value="3">3 People</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-[#7a887d] pl-1">Any notes ?</label>
                    <input 
                      type="text" 
                      name="diet" 
                      value={formData.diet}
                      onChange={handleInputChange}
                      placeholder="e.g. Hey...  "
                      className="w-full bg-[#fbfaf6] border border-[#e5e0d8] rounded-xl px-4 py-2.5 text-xs text-[#4a584d] focus:outline-none focus:border-[#8ea093]"
                    />
                  </div>

                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-[#7a887d] pl-1">  Message (Optional)</label>
                    <textarea 
                      name="message" 
                      rows={3}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Share some messages or wishes..."
                      className="w-full bg-[#fbfaf6] border border-[#e5e0d8] rounded-xl px-4 py-2.5 text-xs text-[#4a584d] focus:outline-none focus:border-[#8ea093] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#67826e] hover:bg-[#58705f] text-white py-3 rounded-full font-bold text-xs tracking-wider uppercase transition-colors duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {isSubmitting ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <FiHeart className="w-3.5 h-3.5 fill-white/20" />
                        <span>Send Response</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-6 gap-4"
                >
                  <div className="w-16 h-16 bg-[#eaf4ed] rounded-full flex items-center justify-center text-[#558261]">
                    <FiCheckCircle className="w-9 h-9" />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-['Cinzel',serif] text-lg font-bold text-[#5c6e60]">
                      Response Received!
                    </h3>
                    <p className="text-xs text-[#7c8b80] leading-relaxed max-w-[280px]">
                      {formData.attending === 'yes' 
                        ? `Thank you, ${formData.name}! I am delighted that you'll celebrate with us.`
                        : `Thank you, ${formData.name}. We will miss you, but greatly appreciate your warm response.`}
                    </p>
                  </div>

                  <button
                    onClick={() => setShowRsvpModal(false)}
                    className="mt-4 px-6 py-2.5 bg-[#67826e] hover:bg-[#58705f] text-white rounded-full font-bold text-[10px] tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    Close Window
                  </button>
                </motion.div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
}
