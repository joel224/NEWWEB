import React from 'react';

interface GlassButtonProps {
    text?: string;
}

const GlassGradientButton: React.FC<GlassButtonProps> = ({ text = "Explore Campus" }) => {
    return (
        <button className="
      relative px-8 py-3 rounded-xl font-medium text-white
      transition-all duration-300 ease-in-out
      mt-12 group
      
      /* Dark Red Gradient */
      bg-gradient-to-r from-[#5a0f0f]/40 via-[#7a1c1c]/40 to-[#a83232]/40
      
      /* Glassmorphism Effects */
      backdrop-blur-lg 
      border border-red-200/10
      shadow-[0_8px_32px_0_rgba(120,20,20,0.25)]
      
      /* Hover States */
      hover:scale-105 
      hover:border-red-200/30
      hover:shadow-[0_8px_32px_0_rgba(168,50,50,0.45)]
      
      /* Active/Click State */
      active:scale-95
    ">
            <span className="relative z-10">{text}</span>

            {/* Inner Glow */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#5a0f0f]/20 via-[#7a1c1c]/20 to-[#a83232]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
    );
};

export default GlassGradientButton;