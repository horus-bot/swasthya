"use client";

import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Building2,
  Map as MapIcon,
  Calendar,
  MapPin,
  Activity,
  User,
  Bell,
  FileText,
  MessageSquare,
  ArrowRight,
  Stethoscope,
  AlertTriangle,
  Info,
  Bot,
  Search,
  Thermometer,
  Wind,
  Droplets,
  X,
  Loader2,
  ExternalLink,
  Phone,
  BarChart3,
  Newspaper,
  ChevronRight,
  Home,
  Heart
} from "lucide-react";
import { fetchParticles, fetchFullArticle } from "@/lib/api";
import NotificationDropdown from "@/components/common/NotificationDropdown";
import supabase from "@/app/lib/api/supabase";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomePage() {
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [weather, setWeather] = useState<any>(null);
  const [healthNews, setHealthNews] = useState<any[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isArticleLoading, setIsArticleLoading] = useState(false);
  const [userName, setUserName] = useState<string>('');

  // Fetch weather data from API
  useEffect(() => {
    async function loadWeather() {
      try {
        const res = await fetch('/api/weather');
        if (res.ok) {
          const data = await res.json();
          if (data?.temp_c !== undefined) setWeather(data);
        }
      } catch (err) {
        console.error('Error loading weather:', err);
      }
    }
    loadWeather();
  }, []);

  // Fetch user name from profile
  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const res = await fetch(`/api/user/profile?userId=${user.id}`);
          if (res.ok) {
            const profile = await res.json();
            if (profile?.name) setUserName(profile.name);
          }
        }
      } catch (err) {
        console.error('Error loading user:', err);
      }
    }
    loadUser();
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Use fromTo instead of from to prevent React 18 strict-mode opacity bugs
      tl.fromTo(".animate-down",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, clearProps: "all" }
      )
        .fromTo(".animate-scale",
          { scale: 0.95, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, stagger: 0.08, ease: "back.out(1.2)", clearProps: "all" },
          "-=0.3"
        )
        .fromTo(".animate-up",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, clearProps: "all" },
          "-=0.4"
        );

      // floating animation for FAB
      gsap.to(".floating-fab", {
        y: -8,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

    }, mainRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const loadArticles = async () => {
      setIsLoading(true);
      try {
        const data = await fetchParticles();
        setHealthNews(data || []);
      } catch (err) {
        console.error('Error loading articles:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadArticles();
  }, []);

  const handleNewsClick = async (news: any) => {
    setIsArticleLoading(true);
    const urlToFetch = news.link || news.url;
    if (!urlToFetch) {
      setSelectedArticle({ ...news, content: "No content available." });
      setIsArticleLoading(false);
      return;
    }

    try {
      setSelectedArticle({ ...news, isLoading: true });
      const full = await fetchFullArticle(urlToFetch);
      if (full) {
        setSelectedArticle(full);
      } else {
        setSelectedArticle({ ...news, content: "Failed to load article content." });
      }
    } catch (err) {
      console.error('Error fetching full article:', err);
      setSelectedArticle({ ...news, content: "Error loading article." });
    } finally {
      setIsArticleLoading(false);
    }
  };

  return (
    <div ref={mainRef} className="min-h-screen bg-white font-sans text-slate-900 pb-24">

      {/* SCROLLABLE CONTENT */}
      <main className="px-5 space-y-8 pt-24 lg:pt-28 max-w-7xl mx-auto w-full pb-32">

        {/* TOP SECTION: Weather */}
        {weather && (
        <div className="animate-scale w-full">
          <WeatherCardCompact weather={weather} />
        </div>
        )}

        {/* MIDDLE SECTION: Trending News (Full Width & Upgraded) */}
        <div className="animate-up space-y-4 pt-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
                <Newspaper size={20} />
              </div>
              <h3 className="font-black text-slate-800 text-2xl tracking-tight">Trending Updates</h3>
            </div>
            <Link href="/trending-news" className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-black tracking-widest uppercase transition-all shadow-sm active:scale-95">
              Explore All
            </Link>
          </div>

          <div className="relative w-full mask-fade-edges pb-4">
            <div className="flex gap-6 overflow-x-auto pb-8 pt-4 no-scrollbar px-2 snap-x snap-mandatory">
              {isLoading ? (
                [1, 2, 3, 4].map(i => <div key={i} className="min-w-70 lg:min-w-100 h-47.5 lg:h-65 bg-slate-100 rounded-[2.5rem] animate-pulse border border-slate-200 shadow-sm" />)
              ) : (
                healthNews.slice(0, 6).map((news: any, idx: number) => {
                  const cardThemes = [
                    { bg: "bg-blue-50/50", border: "border-blue-100/50", pill: "bg-white text-blue-600 border-blue-100", button: "bg-white text-blue-500 group-hover:bg-blue-500 group-hover:text-white border-blue-100" },
                    { bg: "bg-teal-50/50", border: "border-teal-100/50", pill: "bg-white text-teal-600 border-teal-100", button: "bg-white text-teal-500 group-hover:bg-teal-500 group-hover:text-white border-teal-100" },
                    { bg: "bg-rose-50/50", border: "border-rose-100/50", pill: "bg-white text-rose-600 border-rose-100", button: "bg-white text-rose-500 group-hover:bg-rose-500 group-hover:text-white border-rose-100" },
                    { bg: "bg-violet-50/50", border: "border-violet-100/50", pill: "bg-white text-violet-600 border-violet-100", button: "bg-white text-violet-500 group-hover:bg-violet-500 group-hover:text-white border-violet-100" },
                    { bg: "bg-amber-50/50", border: "border-amber-100/50", pill: "bg-white text-amber-600 border-amber-100", button: "bg-white text-amber-500 group-hover:bg-amber-500 group-hover:text-white border-amber-100" }
                  ];
                  const theme = cardThemes[idx % cardThemes.length];
                  return (
                    <div
                      key={idx}
                      onClick={() => handleNewsClick(news)}
                      className={`min-w-70 w-70 lg:min-w-100 lg:w-100 h-50 lg:h-65 ${theme.bg} border ${theme.border} p-6 lg:p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group flex flex-col justify-between active:scale-[0.98] snap-center relative overflow-hidden`}
                    >
                      {/* Soft Light Overlay */}
                      <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] pointer-events-none group-hover:bg-white/10 transition-colors duration-500"></div>

                      <div className="relative z-10 flex justify-between items-start">
                        <span className={`px-4 py-1.5 lg:px-5 lg:py-2 rounded-full text-[9px] lg:text-[11px] font-black tracking-[0.2em] uppercase border shadow-sm ${theme.pill}`}>
                          {news.source || 'Medical Update'}
                        </span>
                        <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center border transition-all duration-300 shadow-sm ${theme.button}`}>
                          <ArrowRight size={18} className="-rotate-45" />
                        </div>
                      </div>

                      <div className="relative z-10 pt-4">
                        <h4 className="text-[17px] lg:text-[22px] font-black leading-tight line-clamp-3 text-slate-800 group-hover:text-slate-900 transition-colors duration-300">
                          {news.title}
                        </h4>
                        <p className="text-[10px] lg:text-xs text-slate-500 font-extrabold mt-3 lg:mt-4 tracking-[0.2em] uppercase">{news.published || 'Just Now'}</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Services and Tips (Side by side on PC) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">

          {/* QUICK SERVICES GRID */}
          <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-800 px-1">Quick Access</h3>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <MobileServiceCard
                href="/appointments"
                title="Book Doctor"
                icon={Calendar}
                iconColor="text-teal-500"
                bgColor="bg-[#F0FDFA]"
              />
              <MobileServiceCard
                href="/reports"
                title="Analytics"
                icon={BarChart3}
                iconColor="text-blue-500"
                bgColor="bg-[#F5F8FF]"
              />
              <MobileServiceCard
                href="/instructions"
                title="Emergency"
                icon={Phone}
                iconColor="text-rose-500"
                bgColor="bg-[#FFF1F2]"
              />
              <MobileServiceCard
                href="/tracker"
                title="Alerts"
                icon={AlertTriangle}
                iconColor="text-amber-500"
                bgColor="bg-[#FFFBEB]"
              />
            </div>
          </div>

          {/* HEALTH TIPS SECTION */}
          <div className="space-y-4 animate-up">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xl font-black text-slate-800">Tips for Today</h3>
              <button className="text-sm font-bold text-teal-600 active:scale-95 transition-transform">View All</button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-5 px-5 lg:mx-0 lg:px-1 mask-fade-edges">
              {isLoading ? (
                [1, 2, 3].map(i => <SkeletonTip key={i} />)
              ) : (
                <>
                  <TipCard
                    color="bg-emerald-50"
                    iconColor="text-emerald-500"
                    title="Stay Hydrated"
                    desc="Drink 3L of water daily in Chennai's heat."
                    icon={Droplets}
                  />
                  <TipCard
                    color="bg-rose-50"
                    iconColor="text-rose-500"
                    title="Mask Up"
                    desc="Keep a mask handy in crowded areas."
                    icon={Heart}
                  />
                  <TipCard
                    color="bg-amber-50"
                    iconColor="text-amber-500"
                    title="Heat Safety"
                    desc="Avoid sun between 12 PM - 4 PM."
                    icon={Thermometer}
                  />
                </>
              )}
            </div>
          </div>
        </div>



      </main>

      {/* FLOATING ACTION BUTTON */}
      <button
        onClick={() => router.push('/chatbox')}
        className="floating-fab fixed bottom-24 right-6 w-16 h-16 bg-[#0E9488] text-white rounded-full flex items-center justify-center shadow-2xl shadow-teal-500/40 hover:scale-110 active:scale-95 transition-all z-40 border-4 border-white"
      >
        <MessageSquare size={28} />
      </button>

      {/* ARTICLE MODAL (from previous design) */}
      {selectedArticle && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-7 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800 line-clamp-1">{selectedArticle.title}</h3>
              <button onClick={() => setSelectedArticle(null)} className="p-2 rounded-full hover:bg-slate-200 text-slate-500"><X size={24} /></button>
            </div>
            <div className="p-7 overflow-y-auto custom-scrollbar">
              {isArticleLoading ? (
                <div className="flex flex-col items-center justify-center py-12"><Loader2 size={32} className="animate-spin text-teal-500 mb-2" /><p className="text-slate-500">Loading full content...</p></div>
              ) : (
                <div className="prose prose-slate">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line text-lg">{selectedArticle.content || "Discover more in the full report."}</p>
                </div>
              )}
            </div>
          </div>
          <div className="absolute inset-0 -z-10" onClick={() => setSelectedArticle(null)} />
        </div>
      )}
    </div>
  );
}

function MobileServiceCard({ href, title, icon: Icon, iconColor, bgColor }: { href: string; title: string; icon: any; iconColor: string; bgColor: string }) {
  return (
    <Link href={href} className="animate-scale bg-white/60 backdrop-blur-xl border border-slate-100 p-4 sm:p-5 rounded-4xl flex flex-col justify-between gap-4 sm:gap-6 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 hover:border-slate-200 transition-all duration-500 group relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 ${bgColor} rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700 pointer-events-none`}></div>

      <div className="flex justify-between items-start w-full relative z-10">
        <div className={`w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center ${iconColor} shadow-sm group-hover:scale-110 transition-transform duration-500`}>
          <Icon size={22} strokeWidth={2.5} />
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 shadow-sm">
          <ArrowRight size={14} className="-rotate-45" />
        </div>
      </div>
      <div className="flex flex-col relative z-10">
        <span className="text-[15px] font-black text-slate-800 tracking-tight group-hover:text-slate-900 transition-colors">{title}</span>
      </div>
    </Link>
  );
}

function TipCard({ color, iconColor, title, desc, icon: Icon }: { color: string, iconColor: string, title: string, desc: string, icon: any }) {
  return (
    <div className={`min-w-60 ${color} p-5 rounded-4xl flex flex-col gap-2 border border-black/5`}>
      <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center ${iconColor} shadow-sm border border-black/5`}>
        <Icon size={20} />
      </div>
      <h4 className="font-bold text-slate-800 mt-1">{title}</h4>
      <p className="text-[11px] text-slate-600 leading-tight">{desc}</p>
    </div>
  );
}



function WeatherCardCompact({ weather }: { weather: any }) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Dynamic Theme Mapping
  const getTheme = (condition: string) => {
    const c = condition?.toLowerCase() || '';
    if (c.includes('sunny') || c.includes('clear')) {
      return {
        bg: 'bg-[#FFFDF0] border-amber-100',
        text: 'text-slate-900',
        accent: 'text-amber-500',
        metricsBg: 'bg-amber-100/50 border-amber-200/30',
        metricsText: 'text-amber-900',
        glow: 'bg-amber-200/40',
        icon: '☀️'
      };
    }
    // Default / Rainy / Cloudy
    return {
      bg: 'bg-linear-to-br from-[#4776E6] to-[#8E54E9] border-blue-400/20',
      text: 'text-white',
      accent: 'text-blue-100',
      metricsBg: 'bg-white/10 border-white/10',
      metricsText: 'text-white',
      glow: 'bg-white/10',
      icon: '🌧️'
    };
  };

  const theme = getTheme(weather?.condition?.text);

  return (
    <div
      ref={cardRef}
      className={`${theme.bg} border ${theme.text} p-5 sm:p-6 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between shadow-xl shadow-blue-500/10 relative overflow-hidden group transition-all duration-500 cursor-pointer hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98] w-full`}
    >
      {/* FIXED BACKGROUND GLOWS */}
      <div className={`absolute -top-12 -right-12 w-32 h-32 ${theme.glow} rounded-full blur-3xl pointer-events-none`}></div>
      <div className={`absolute bottom-0 left-1/4 w-32 h-32 ${theme.glow} rounded-full blur-3xl pointer-events-none`}></div>

      {/* HEADER: Temp & Condition */}
      <div className="flex items-center gap-5 relative z-10 mb-5 md:mb-0">
        <div className={`w-14 h-14 rounded-3xl ${theme.metricsBg} backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/20 relative`}>
          {theme.icon}
        </div>
        <div>
          <p className="text-[10px] font-black tracking-widest uppercase opacity-70 mb-0.5">Today's Forecast</p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-4xl font-black tracking-tighter leading-none">{weather?.temp_c}°</h3>
            <span className="text-sm font-bold opacity-60">C</span>
          </div>
          <p className="text-xs font-bold opacity-90 mt-1 uppercase tracking-tight">{weather?.condition?.text || 'Sunny'}</p>
        </div>
      </div>

      {/* METRICS (Horizontal grid) */}
      <div className="flex gap-3 relative z-10 w-full md:w-auto overflow-x-auto no-scrollbar mask-fade-edges pb-1">
        <MetricBadge icon={Wind} label="Wind" value="14 km/h" theme={theme} />
        <MetricBadge icon={Droplets} label="Humidity" value={`${weather?.humidity}%`} theme={theme} />
        <MetricBadge icon={Activity} label="AQI" value="78" theme={theme} />
      </div>

    </div>
  );
}

function MetricBadge({ icon: Icon, label, value, theme }: { icon: any, label: string, value: string, theme: any }) {
  return (
    <div className={`flex flex-col items-center justify-center p-3 px-4 min-w-18.75 ${theme.metricsBg} rounded-2xl backdrop-blur-sm border border-black/5 shrink-0`}>
      <Icon size={16} className={`${theme.accent} mb-1.5`} />
      <span className={`text-sm font-black ${theme.metricsText} leading-none`}>{value}</span>
      <span className={`text-[9px] font-bold opacity-70 uppercase tracking-widest ${theme.metricsText} mt-1`}>{label}</span>
    </div>
  );
}

function MetricRow({ icon: Icon, label, value, theme }: { icon: any, label: string, value: string, theme: any }) {
  return (
    <div className={`flex items-center justify-between p-3 ${theme.metricsBg} rounded-2xl backdrop-blur-sm border border-black/5`}>
      <div className="flex items-center gap-2">
        <Icon size={16} className={theme.accent} />
        <span className={`text-[10px] font-bold opacity-70 uppercase tracking-wider ${theme.metricsText}`}>{label}</span>
      </div>
      <span className={`text-xs font-black ${theme.metricsText}`}>{value}</span>
    </div>
  );
}

function SkeletonTip() {
  return (
    <div className="min-w-60 bg-slate-50 p-5 rounded-4xl flex flex-col gap-3 border border-slate-100 animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-slate-200" />
      <div className="h-4 w-2/3 bg-slate-200 rounded" />
      <div className="space-y-1">
        <div className="h-2 w-full bg-slate-200 rounded" />
        <div className="h-2 w-5/6 bg-slate-200 rounded" />
      </div>
    </div>
  );
}



