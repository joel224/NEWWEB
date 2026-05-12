"use client";

import React from "react";
import { MotionProps, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { FiArrowRight, FiMail, FiMapPin } from "react-icons/fi";
import { SiGithub, SiTiktok, SiX, SiYoutube } from "react-icons/si";

export default function RevealBento() {
  return (
    <div className="min-h-screen bg-zinc-900 px-4 py-12 text-zinc-50">
      <Logo />
      <motion.div
        initial="initial"
        animate="animate"
        transition={{
          staggerChildren: 0.05,
        }}
        className="mx-auto grid max-w-4xl grid-flow-dense grid-cols-12 gap-4"
      >
        <HeaderBlock />
        <SocialsBlock />
        <AboutBlock />
        <LocationBlock />
        <EmailListBlock />
        <HoverButtonBlock />
        <WaitlistBlock />
        <MenuBlock />
        <ProjectTabsBlock />
        <LoadingScreenBlock />
        <FeaturesBlock />
      </motion.div>
      <Footer />
    </div>
  );
};

type BlockProps = {
  className?: string;
} & MotionProps;

const Block = ({ className, ...rest }: BlockProps) => {
  return (
    <motion.div
      variants={{
        initial: {
          scale: 0.5,
          y: 50,
          opacity: 0,
        },
        animate: {
          scale: 1,
          y: 0,
          opacity: 1,
        },
      }}
      transition={{
        type: "spring",
        mass: 3,
        stiffness: 400,
        damping: 50,
      }}
      className={twMerge(
        "col-span-4 rounded-lg border border-zinc-700 bg-zinc-800 p-6",
        className
      )}
      {...rest}
    />
  );
};

const HeaderBlock = () => (
  <Block className="col-span-12 row-span-2 md:col-span-6">
    <img
      src="https://api.dicebear.com/8.x/lorelei-neutral/svg?seed=John"
      alt="avatar"
      className="mb-4 size-14 rounded-full"
    />
    <h1 className="mb-12 text-4xl font-medium leading-tight">
      Hi, I'm Joel.{" "}
      <span className="text-zinc-400">
        I build cool websites like this one.
      </span>
    </h1>
    <a
      href="https://www.linkedin.com/in/joel-j-824099264/"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1 text-red-300 hover:underline"
    >
      Contact me <FiArrowRight />
    </a>
  </Block>
);

const SocialsBlock = () => (
  <>
    <Block
      whileHover={{
        rotate: "2.5deg",
        scale: 1.1,
      }}
      className="col-span-6 bg-red-500 md:col-span-3"
    >
      <a
        href="https://www.linkedin.com/in/joel-j-824099264/"
        target="_blank"
         rel="noopener noreferrer"
        className="grid h-full place-content-center text-3xl text-white"
      >
        <SiYoutube />
      </a>
    </Block>
    <Block
      whileHover={{
        rotate: "-2.5deg",
        scale: 1.1,
      }}
      className="col-span-6 bg-green-600 md:col-span-3"
    >
      <a
        href="https://www.linkedin.com/in/joel-j-824099264/"
        target="_blank"
        rel="noopener noreferrer"
        className="grid h-full place-content-center text-3xl text-white"
      >
        <SiGithub />
      </a>
    </Block>
    <Block
      whileHover={{
        rotate: "-2.5deg",
        scale: 1.1,
      }}
      className="col-span-6 bg-zinc-50 md:col-span-3"
    >
      <a
        href="https://www.linkedin.com/in/joel-j-824099264/"
        target="_blank"
        rel="noopener noreferrer"
        className="grid h-full place-content-center text-3xl text-black"
      >
        <SiTiktok />
      </a>
    </Block>
    <Block
      whileHover={{
        rotate: "2.5deg",
        scale: 1.1,
      }}
      className="col-span-6 bg-blue-500 md:col-span-3"
    >
      <a
        href="https://www.linkedin.com/in/joel-j-824099264/"
        target="_blank"
        rel="noopener noreferrer"
        className="grid h-full place-content-center text-3xl text-white"
      >
        <SiX />
      </a>
    </Block>
  </>
);

const AboutBlock = () => (
  <Block className="col-span-12 text-3xl leading-snug">
    <p>
      My passion is building cool stuff.{" "}
      <span className="text-zinc-400">
        I build primarily with React, Tailwind CSS, and Framer Motion. I love
        this stack so much that I even built a website about it. I've made over
        a hundred videos on the subject across YouTube and TikTok.
      </span>
    </p>
  </Block>
);

const LocationBlock = () => (
  <Block className="col-span-12 flex flex-col items-center gap-4 md:col-span-3">
    <FiMapPin className="text-3xl" />
    <p className="text-center text-lg text-zinc-400">Kochi</p>
  </Block>
);

const EmailListBlock = () => (
  <Block className="col-span-12 md:col-span-9">
    <p className="mb-3 text-lg">Drop your work </p>
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex items-center gap-2"
    >
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-1.5 transition-colors focus:border-red-300 focus:outline-0"
      />
      <button
        type="submit"
        className="flex items-center gap-2 whitespace-nowrap rounded bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-300"
      >
        <FiMail /> Send
      </button>
    </form>
  </Block>
);

const Logo = () => {
  // Temp logo from https://logoipsum.com/
  return (
    <svg
      width="40"
      height="auto"
      viewBox="0 0 50 39"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto mb-12 fill-zinc-50"
    >
      <path
        d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"
        stopColor="#000000"
      ></path>
      <path
        d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"
        stopColor="#000000"
      ></path>
    </svg>
  );
};

const Footer = () => {
  return (
    <footer className="mt-12">
      <p className="text-center text-zinc-400">
        Made with ❤️ by{" "}
        <a href="#" className="text-red-300 hover:underline">
          @JoelJoshy
        </a>
      </p>
    </footer>
  );
};

const HoverButtonBlock = () => (
  <Block className="col-span-12 md:col-span-3 p-0 overflow-hidden">
    <div className="flex h-full w-full items-center justify-center bg-red-500 py-12">
      <div className="mx-auto h-20 w-full max-w-72 bg-black">
        <button className="group flex h-full w-full items-center justify-between border-2 border-black bg-white px-8 text-xl font-semibold" style={{ transform: "translateX(0px) translateY(0px)" }}>
          <span className="relative overflow-hidden">
            <span className="inline-block text-yellow-400 transition-transform duration-300 group-hover:-translate-y-full  ">HOVER ME!</span>
            <span className="absolute left-0 top-0 block  text-black translate-y-full transition-transform duration-300 group-hover:translate-y-0">HOVER ME!</span>
          </span>
          <div className="pointer-events-none flex h-6 w-6 overflow-hidden text-2xl">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 -translate-x-full text-red-500 transition-transform duration-300 group-hover:translate-x-0" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 -translate-x-full transition-transform duration-300 group-hover:translate-x-0" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </div>
        </button>
      </div>
    </div>
  </Block>
);

const WaitlistBlock = () => (
  <Block className="col-span-12 md:col-span-9 p-0 overflow-hidden">
    <div className="no-scrollbar relative w-full h-full overflow-hidden overflow-y-scroll border border-neutral-300 bg-white" style={{ display: "block" }}>
      <div className="flex h-full min-h-[200px] items-center justify-center bg-black px-4">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="relative flex w-full max-w-md items-center gap-2 rounded-full border border-white/20 bg-gradient-to-br from-white/20 to-white/5 py-1.5 pl-6 pr-1.5"
          style={{
            // The magic: conic gradient that rotates, masked to show only the border
            background: `
              linear-gradient(#171717, #171717) padding-box,
              conic-gradient(from var(--angle), transparent 70%, #a78bfa, #60a5fa, transparent) border-box
            `,
            border: '1px solid transparent',
            animation: '8s rotate linear infinite',
          }}
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full bg-transparent text-sm text-white placeholder-white/80 focus:outline-0"
          />
          <button
            type="submit"
            className="group flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-br from-gray-50 to-gray-400 px-4 py-3 text-sm font-medium text-gray-900 transition-transform active:scale-[0.985]"
          >
            <span>Join Waitlist</span>
            <svg
              stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24"
              strokeLinecap="round" strokeLinejoin="round"
              className="-mr-4 opacity-0 transition-all group-hover:-mr-0 group-hover:opacity-100 group-active:-rotate-45"
              height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </form>
      </div>
    </div>

    {/* Put this in your global CSS or Tailwind config */}
    <style>{`
      @property --angle {
        syntax: '<angle>';
        initial-value: 0deg;
        inherits: false;
      }
      @keyframes rotate {
        to { --angle: 360deg; }
      }
    `}</style>
  </Block>
);

const MenuBlock = () => (
  <Block className="col-span-12 p-0 overflow-hidden relative min-h-[500px]">
    <div className="h-full w-full bg-neutral-100 relative min-h-[500px]">
      <div
        className="absolute z-10 rounded-xl bg-gradient-to-br from-violet-600 to-violet-500 shadow-lg shadow-violet-800/20"
        style={{ top: "16px", right: "16px", width: "calc(100% - 32px)", height: "calc(100% - 32px)" }}
      ></div>
      <button className="group absolute right-4 top-4 z-50 h-20 w-20 bg-white/0 transition-all hover:bg-white/20 rounded-bl-xl rounded-tr-xl">
        <span
          className="absolute block h-1 w-10 bg-white"
          style={{ left: "50%", top: "50%", transform: "translateX(-50%) translateY(-50%) rotate(45deg) translateZ(0px)" }}
        ></span>
        <span
          className="absolute block h-1 w-10 bg-white"
          style={{ left: "50%", top: "50%", transform: "translateX(-50%) translateY(-50%) rotate(-45deg) translateZ(0px)" }}
        ></span>
        <span
          className="absolute block h-1 w-5 bg-white"
          style={{ bottom: "50%", left: "50%", transform: "translateX(-50%) translateY(50%) rotate(45deg) translateZ(0px)" }}
        ></span>
      </button>
      <nav className="absolute right-4 top-4 z-40 h-[calc(100%_-_32px)] w-[calc(100%_-_32px)] overflow-hidden">
        <a
          href="#"
          className="grid h-20 w-20 place-content-center rounded-br-xl rounded-tl-xl bg-white transition-colors hover:bg-violet-50"
          style={{ opacity: 1, transform: "none" }}
        >
          <svg
            width="50"
            height="39"
            viewBox="0 0 50 39"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-violet-600"
          >
            <path
              d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"
              stopColor="#FFFFFF"
            ></path>
            <path
              d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"
              stopColor="#FFFFFF"
            ></path>
          </svg>
        </a>
        <div className="space-y-4 p-12 pl-4 md:pl-20 relative z-20">
          <a
            href="/"
            className="block text-5xl font-semibold text-violet-400 transition-colors hover:text-violet-50 md:text-7xl"
            style={{ opacity: 1, transform: "none" }}
          >
            home.
          </a>
          <a
            href="/portfolio"
            className="block text-5xl font-semibold text-violet-400 transition-colors hover:text-violet-50 md:text-7xl"
            style={{ opacity: 1, transform: "none" }}
          >
            portfolio.
          </a>
          <a
            href="https://www.linkedin.com/in/joel-j-824099264/"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-5xl font-semibold text-violet-400 transition-colors hover:text-violet-50 md:text-7xl"
            style={{ opacity: 1, transform: "none" }}
          >
            blog.
          </a>
          <a
             href="https://www.linkedin.com/in/joel-j-824099264/"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-5xl font-semibold text-violet-400 transition-colors hover:text-violet-50 md:text-7xl"
            style={{ opacity: 1, transform: "none" }}
          >
            about.
          </a>
        </div>
        <div className="absolute bottom-6 left-6 flex gap-4 md:flex-col z-20">
          <a href="https://www.linkedin.com/in/joel-j-824099264/" target="_blank" style={{ opacity: 1, transform: "none" }}>
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              role="img"
              viewBox="0 0 24 24"
              className="text-xl text-white transition-colors hover:text-violet-300"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path>
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/joel-j-824099264/" target="_blank" style={{ opacity: 1, transform: "none" }}>
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              role="img"
              viewBox="0 0 24 24"
              className="text-xl text-white transition-colors hover:text-violet-300"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"></path>
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/joel-j-824099264/" target="_blank" style={{ opacity: 1, transform: "none" }}>
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              role="img"
              viewBox="0 0 24 24"
              className="text-xl text-white transition-colors hover:text-violet-300"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/joel-j-824099264/" target="_blank" style={{ opacity: 1, transform: "none" }}>
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              role="img"
              viewBox="0 0 24 24"
              className="text-xl text-white transition-colors hover:text-violet-300"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
            </svg>
          </a>
        </div>
        <button
          className="absolute bottom-2 right-2 flex items-center gap-2 rounded-full bg-violet-700 px-3 py-3 text-4xl uppercase text-violet-200 transition-colors hover:bg-white hover:text-violet-600 md:bottom-4 md:right-4 md:px-6 md:text-2xl z-20"
          style={{ opacity: 1, transform: "none" }}
        >
          <span className="hidden md:block">Linkedin</span>{" "}
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </nav>
      <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 text-lg text-violet-500 z-30">
        <span>Open me</span>{" "}
        <svg
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="7" y1="17" x2="17" y2="7"></line>
          <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
      </span>
    </div>
  </Block>
);

const ProjectTabsBlock = () => (
  <Block className="col-span-12 md:col-span-12 p-0 overflow-hidden">
    <div
      className="no-scrollbar relative w-full h-full overflow-hidden border border-neutral-300 bg-white"
      style={{ display: "block" }}
    >
      <div className="bg-zinc-50 h-full flex flex-col justify-center">
        <div className="mx-auto grid w-full max-w-4xl grid-cols-2 gap-4 px-4 py-12 lg:grid-cols-4">
          <div className="rounded-lg transition-colors bg-indigo-600">
            <button className="w-full origin-top-left rounded-lg border py-3 text-xs font-medium transition-all md:text-base -translate-y-1 border-indigo-600 bg-white text-indigo-600">
              Serendipity
            </button>
          </div>
          <div className="rounded-lg transition-colors bg-zinc-900">
          <a href="/portfolio" className="block">
            <button className="w-full origin-top-left rounded-lg border py-3 text-xs font-medium transition-all md:text-base border-zinc-900 bg-white text-zinc-900 hover:-rotate-2 hover:bg-zinc-100">
              Projects
            </button>
          </a>
        </div>
          <div className="rounded-lg transition-colors bg-zinc-900">
            <button className="w-full origin-top-left rounded-lg border py-3 text-xs font-medium transition-all md:text-base border-zinc-900 bg-white text-zinc-900 hover:-rotate-2 hover:bg-zinc-100">
              Gantt
            </button>
          </div>
          <div className="rounded-lg transition-colors bg-zinc-900">
            <button className="w-full origin-top-left rounded-lg border py-3 text-xs font-medium transition-all md:text-base border-zinc-900 bg-white text-zinc-900 hover:-rotate-2 hover:bg-zinc-100">
              Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  </Block>
);

const LoadingScreenBlock = () => (
  <Block className="col-span-12 md:col-span-12 p-0 overflow-hidden">
    <div
      className="no-scrollbar relative w-full h-full overflow-hidden border border-neutral-300 bg-white"
      style={{ display: "block" }}
    >
      <div className="grid h-full min-h-[288px] place-content-center bg-neutral-950 p-4">
        <div className="flex divide-x divide-neutral-950">
          <motion.div
            animate={{ y: [-32, 0, -32] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0 }}
            className="bg-white"
            style={{ width: "32px", height: "32px", transformOrigin: "50% 50% 0px" }}
          ></motion.div>
          <motion.div
            animate={{ y: [-32, 0, -32] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.2 }}
            className="bg-white"
            style={{ width: "32px", height: "32px", transformOrigin: "50% 50% 0px" }}
          ></motion.div>
          <motion.div
            animate={{ y: [-32, 0, -32] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.4 }}
            className="bg-white"
            style={{ width: "32px", height: "32px", transformOrigin: "50% 50% 0px" }}
          ></motion.div>
          <motion.div
            animate={{ y: [-32, 0, -32] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.6 }}
            className="bg-white"
            style={{ width: "32px", height: "32px", transformOrigin: "50% 50% 0px" }}
          ></motion.div>
          <motion.div
            animate={{ y: [-32, 0, -32] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.8 }}
            className="bg-white"
            style={{ width: "32px", height: "32px", transformOrigin: "50% 50% 0px" }}
          ></motion.div>
        </div>
      </div>
    </div>
  </Block>
);

type FeatureCardProps = {
  title: string;
  description: string;
  bg: string;
  pathId: string;
  offset?: string;
};

const FeatureCard = ({ title, description, bg, pathId, offset = "" }: FeatureCardProps) => (
  <div className={`group w-full border-2 border-black ${bg} ${offset}`}>
    <motion.div
      className={`-m-0.5 border-2 border-black ${bg}`}
      whileHover={{ x: -4, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className={`relative -m-0.5 flex h-72 flex-col justify-between overflow-hidden border-2 border-black ${bg} p-8`}>
        <p className="flex items-center text-2xl font-medium uppercase text-black">
          <svg
            stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24"
            strokeLinecap="round" strokeLinejoin="round"
            className="-ml-8 mr-2 shrink-0 opacity-0 transition-all duration-300 ease-in-out group-hover:ml-0 group-hover:opacity-100"
            height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
          {title}
        </p>
        <div>
          <p className="mb-0 transition-[margin] duration-300 ease-in-out group-hover:mb-10 text-black text-sm leading-snug">
            {description}
          </p>
          <button className="absolute bottom-2 left-2 right-2 translate-y-full border-2 border-black bg-white px-4 py-2 font-bold text-black opacity-0 transition-all duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100">
            LET'S GO
          </button>
        </div>
        <svg
          width="200" height="200"
          className="pointer-events-none absolute z-10 rounded-full"
          style={{ top: 0, right: 0, transform: "translateX(50%) translateY(-50%) scale(0.75) rotate(64.8144deg)" }}
        >
          <path id={pathId} d="M100,100 m-100,0 a100,100 0 1,0 200,0 a100,100 0 1,0 -200,0" fill="none" />
          <text>
            <textPath
              href={`#${pathId}`}
              fill="black"
              className="fill-black text-2xl font-black uppercase opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
            >
              LEARN MORE • LEARN MORE • LEARN MORE • LEARN MORE •
            </textPath>
          </text>
        </svg>
      </div>
    </motion.div>
  </div>
);

const FeaturesBlock = () => (
  <Block className="col-span-12 p-0 overflow-hidden">
    <div className="no-scrollbar relative w-full overflow-hidden border border-neutral-300 bg-white">
      <section className="bg-white px-8 py-24">
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
          <FeatureCard
            title="Dynamic"
            description="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Exercitationem doloremque vitae minima."
            bg="bg-emerald-300"
            pathId="featureCircle1"
          />
          <FeatureCard
            title="Data Driven"
            description="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Exercitationem doloremque vitae minima."
            bg="bg-indigo-300"
            pathId="featureCircle2"
            offset="sm:-translate-y-6"
          />
          <FeatureCard
            title="Dutiful"
            description="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Exercitationem doloremque vitae minima."
            bg="bg-red-300"
            pathId="featureCircle3"
          />
          <FeatureCard
            title="Demure"
            description="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Exercitationem doloremque vitae minima."
            bg="bg-yellow-300"
            pathId="featureCircle4"
            offset="sm:-translate-y-6"
          />
        </div>
      </section>
    </div>
  </Block>
);

