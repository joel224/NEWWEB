'use client';

import React from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiHeart } from 'react-icons/fi';
import PretextJ from '@/components/PretextJ';
import Dance from '@/components/Dance';

export default function PretextJShowcase() {
  return (
    <main className="w-full min-h-screen bg-[#3b0501] text-white flex flex-col items-center justify-center p-6 md:p-12 relative">
      
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/portfolio">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs transition-all cursor-pointer">
            <FiArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </div>
        </Link>
      </div>

      {/* Main Showcase Section */}
      <div className="w-full max-w-4xl z-10">
        <PretextJ />
      </div>

      {/* Google Fonts Import for all comparison variants */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Marcellus&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Bellefair&family=Italiana&family=Cinzel:wght@400..900&display=swap');
      `}} />

      {/* Centered Flex Container at top-[78%] containing all requested font variants side-by-side for perfect comparison */}
      <div className="absolute top-[78%] z-30 flex flex-wrap justify-center gap-3 max-w-5xl px-6">
        
        

        {/* Variant 7: Italiana ("Vintage Love Letter") */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-[white/20] text-[#fcc5bb] hover:text-white font-['Italiana',serif] text-xl tracking-[0.2em] shadow-lg transition-all cursor-pointer backdrop-blur-md border-t border-[#ff6145]/20">
          <span>N & R</span>
        </div>

      </div>

      {/* Floating Link to Wedding Invitation */}
      <div className="fixed bottom-6 left-6 z-30 md:bottom-8 md:left-8">
        <Link href="/wedding">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border-t border-white/20 text-pink-600/50 hover:text-white text-xs font-semibold shadow-lg transition-all cursor-pointer backdrop-blur-md">
            <FiHeart className="w-3.5 h-3.5 text-pink-300 fill-pink-300/20" />
            <span>Wedding Invitation</span>
          </div>
        </Link>
      </div>

      {/* Floating MJ Dancer */}
      <div className="fixed bottom-6 right-6 z-30 md:bottom-8 md:right-8 animate-fade-in">
        <Dance />
      </div>

    </main>
  );
}
