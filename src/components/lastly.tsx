'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const socials = [
    { name: '(Behance)', url: 'https://www.linkedin.com/in/joel-j-824099264/' },
    { name: '(Dribbble)', url: 'https://www.linkedin.com/in/joel-j-824099264/' },
    { name: '(Linkedin)', url: 'https://www.linkedin.com/in/joel-j-824099264/' },
    { name: '(Medium)', url: 'https://www.linkedin.com/in/joel-j-824099264/' },
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Reveal animation for the text and links
      gsap.fromTo(
        containerRef.current?.querySelectorAll('.contact-heading, .email-section, .social-link') || [],
        { 
          y: 30, 
          opacity: 0 
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
          }
        }
      );

      // Subtle pulse for the PNG graphic
      gsap.to('.footer-graphic', {
        opacity: 0.8,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
    id="contact"
      ref={containerRef} 
      className="relative h-screen w-full bg-[#0a0a0a] overflow-hidden font-sans"
    >
      {/* Injecting the custom rolling-text CSS to perfectly match your snippet */}
      <style>{`
        .rolling-text {
          display: inline-block;
          font-size: 14px;
          line-height: 20px;
          height: 20px;
          text-decoration: none;
          overflow: hidden;
          color: #FFF;
          font-weight: 400;
          letter-spacing: -0.03em;
          position: relative;
        }
        .rolling-text .block {
          position: relative;
        }
        .rolling-text .letter {
          display: inline-block;
          transition: transform 0.6s cubic-bezier(0.76, 0, 0.24, 1);
          position: relative;
          color: #fff;
        }
        .rolling-text .letter::before {
          content: attr(data-letter);
          position: absolute;
          top: 100%;
          left: 0;
          color: #FFF;
        }
        .rolling-text:hover .letter {
          transform: translateY(-100%);
        }
      `}</style>

      {/* =========================================
          LEFT SIDE: PNG GRAPHIC
          ========================================= */}
      <img 
        src="/Contact.png"
        alt="Design Graphic"
        className="footer-graphic absolute left-[30px] top-0 h-full w-auto object-contain opacity-60 z-0 pointer-events-none"
      />

      {/* =========================================
          RIGHT SIDE: CONTENT & LINKS
          ========================================= */}
      <div 
        ref={textRef} 
        className="contact-content absolute right-[30px] bottom-[30px] h-[66.2vh] w-[30vw] min-w-[300px] md:min-w-[470px] flex flex-col justify-between items-start z-10"
      >
        
        {/* Main Heading */}
        <h2 className="contact-heading max-w-[300px] text-white font-normal text-[32px] leading-none tracking-[-0.05em]">
          Engineering the Human Connection and digital experiences
        </h2>

        {/* Contact Info & Socials */}
        <div className="contact-info flex flex-col gap-[10vh] w-full">
          
          <div className="email-section flex flex-col w-full">
            <div className="email-label text-white opacity-70 text-[12px] font-normal leading-[1.5] tracking-[-0.36px]">
              For work:
            </div>
            <a 
               href="mailto:joeljoshy224@gmail.com"
              className="email-text text-white text-[20px] font-normal leading-none tracking-[-1px] hover:text-neutral-300 transition-colors mt-1"
            >
              joeljoshy224@gmail.com
            </a>
          </div>

          <div className="social-links flex justify-between items-center gap-[20px] w-full pt-6 border-t border-neutral-900/50">
            {socials.map((social) => (
              <a 
                key={social.name} 
                href={social.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="rolling-text social-link"
              >
                <div className="block">
                  {social.name.split('').map((char, index) => (
                    <span 
                      key={index} 
                      data-letter={char} 
                      className="letter"
                      style={{ transitionDelay: `${index * 0.015}s` }}
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
}