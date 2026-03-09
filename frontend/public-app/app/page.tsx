"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { Logo } from "../components/logo";
import { ArrowRight, Activity, ShieldCheck, HeartPulse } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const heartbeatRef = useRef<SVGPathElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline for entrance animation
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 0. Initial States
      gsap.set([logoRef.current, titleRef.current, subtitleRef.current, buttonRef.current, featuresRef.current], { 
        opacity: 0, 
        y: 30 
      });
      gsap.set(heartbeatRef.current, { drawSVG: "0%" }); // Requires plugin, we'll fake it with stroke-dasharray

      // Fake drawSVG setup manually
      if (heartbeatRef.current) {
        const length = heartbeatRef.current.getTotalLength();
        gsap.set(heartbeatRef.current, { 
          strokeDasharray: length, 
          strokeDashoffset: length,
          opacity: 1
        });
      }

      // 1. Heartbeat Animation
      tl.to(heartbeatRef.current, {
        strokeDashoffset: 0,
        duration: 2,
        ease: "power2.inOut",
      })
      .to(heartbeatRef.current, {
        opacity: 0,
        duration: 0.5,
      }, "-=0.5");

      // 2. Logo Pop
      tl.fromTo(logoRef.current, 
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: "elastic.out(1, 0.5)" },
        "-=0.3"
      );

      // 3. Text Stagger
      tl.to([titleRef.current, subtitleRef.current], {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 0.8,
      }, "-=0.5");

      // 4. Features floating in
      tl.to(featuresRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
      }, "-=0.4");

      // 5. Button Reveal
      tl.to(buttonRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
      }, "-=0.2");

      // Background Animation Loop
      gsap.to(".floating-orb", {
        y: "random(-20, 20)",
        x: "random(-20, 20)",
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          each: 1,
          from: "random"
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleStart = () => {
    setIsExiting(true);
    
    // Exit Animation
    const tl = gsap.timeline({ 
      onComplete: () => router.push("/home") 
    });

    tl.to([titleRef.current, subtitleRef.current, featuresRef.current, buttonRef.current], {
      opacity: 0,
      y: -20,
      stagger: 0.1,
      duration: 0.4
    })
    .to(logoRef.current, {
      scale: 15, // Zoom into the logo
      opacity: 0,
      duration: 0.8,
      ease: "power2.in"
    }, "-=0.2")
    .to(bgRef.current, {
      opacity: 0, 
      duration: 0.5
    }, "-=0.4");
  };

  return (
    <div ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-900 text-white">
      
      {/* Dynamic Background */}
      <div ref={bgRef} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 opacity-90"></div>
        <div className="floating-orb absolute top-1/4 left-1/4 w-64 h-64 bg-teal-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>
        <div className="floating-orb absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>
        <div className="floating-orb absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
      </div>

      {/* Heartbeat SVG Layer */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none opacity-50">
        <svg width="100%" height="200" viewBox="0 0 1000 200" className="w-full max-w-4xl">
          <path
            ref={heartbeatRef}
            d="M0,100 L200,100 L230,50 L260,150 L290,100 L1000,100"
            fill="none"
            stroke="rgba(45, 212, 191, 0.5)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-0"
          />
        </svg>
      </div>

      {/* Content Container */}
      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
        
        {/* Logo Section */}
        <div ref={logoRef} className="mb-8 relative inline-block">
          <div className="absolute inset-0 bg-teal-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
          <div className="relative bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-2xl">
            <Logo width={80} height={80} className="text-teal-400 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]" />
          </div>
        </div>

        {/* Text Section */}
        <div className="space-y-6 mb-12">
          <h1 ref={titleRef} className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-200 via-white to-teal-200">
            Swasthya
          </h1>
          <p ref={subtitleRef} className="text-xl md:text-2xl text-teal-100/80 max-w-2xl mx-auto font-light leading-relaxed">
            Revolutionizing public healthcare with intelligent, accessible, and unified digital solutions.
          </p>
        </div>

        {/* Feature Highlights (Mini cards) */}
        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
          <FeatureBadge icon={HeartPulse} text="Real-time Monitoring" />
          <FeatureBadge icon={ShieldCheck} text="Secure Records" />
          <FeatureBadge icon={Activity} text="AI Diagnostics" />
        </div>

        {/* CTA Button */}
        <div className="relative group">
            <div className={`absolute -inset-1 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 ${isExiting ? 'opacity-0' : ''}`}></div>
            <button
              ref={buttonRef}
              onClick={handleStart}
              disabled={isExiting}
              className="relative px-12 py-5 bg-white text-teal-900 rounded-full font-bold text-xl shadow-xl hover:shadow-2xl transform transition-all duration-200 hover:-translate-y-1 active:scale-95 flex items-center gap-3 mx-auto"
            >
              Get Started
              <ArrowRight className={`w-6 h-6 transition-transform duration-300 ${isExiting ? 'translate-x-10 opacity-0' : 'group-hover:translate-x-1'}`} />
            </button>
        </div>

      </div>

      {/* Footer Text */}
      <div className="absolute bottom-8 left-0 right-0 text-center text-teal-500/40 text-sm font-medium z-10">
        Powered by Government Health Initiative &bull; 2026
      </div>
    </div>
  );
}

function FeatureBadge({ icon: Icon, text }: { icon: any, text: string }) {
  return (
    <div className="flex items-center justify-center gap-3 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/5 text-teal-100 hover:bg-white/10 transition-colors duration-300">
      <Icon className="w-5 h-5 text-teal-400" />
      <span className="font-medium">{text}</span>
    </div>
  );
}