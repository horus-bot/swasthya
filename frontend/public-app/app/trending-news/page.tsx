"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Bot, 
  Share2, 
  ArrowLeft,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Info,
  ExternalLink,
  X,
  Loader2,
  Star,
  Building2,
  Stethoscope,
  Activity,
  Phone
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { motion } from 'framer-motion';
import { fetchParticles, fetchFullArticle } from '@/lib/api';
import type { HospitalWithDetails } from '@/app/types/database';

// Helper to get news severity and priority rating (inferred from content)
const getNewsPriority = (title: string): { severity: 'Critical' | 'High' | 'Medium' | 'Low'; rating: number; color: 'red' | 'orange' | 'yellow' | 'blue' } => {
  const lowerTitle = title.toLowerCase();
  
  // Critical keywords - highest priority
  if (lowerTitle.includes('outbreak') || lowerTitle.includes('emergency') || lowerTitle.includes('critical') || lowerTitle.includes('death') || lowerTitle.includes('fatal')) {
    return { severity: 'Critical', rating: 5, color: 'red' };
  }
  
  // High priority keywords
  if (lowerTitle.includes('alert') || lowerTitle.includes('warning') || lowerTitle.includes('spread') || lowerTitle.includes('infection') || lowerTitle.includes('hospital') || lowerTitle.includes('treatment')) {
    return { severity: 'High', rating: 4, color: 'orange' };
  }
  
  // Medium priority keywords
  if (lowerTitle.includes('health') || lowerTitle.includes('medical') || lowerTitle.includes('disease') || lowerTitle.includes('virus') || lowerTitle.includes('fever') || lowerTitle.includes('symptoms')) {
    return { severity: 'Medium', rating: 3, color: 'yellow' };
  }
  
  // Low priority - general health news
  return { severity: 'Low', rating: 2, color: 'blue' };
};

// Helper to extract domain from URL
const getDomain = (url: string) => {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return 'news';
  }
};

function mapHospitalToDisplay(h: HospitalWithDetails) {
  const totalDoctors = h.hospital_doctors?.[0]?.total_doctors ?? 0;
  const availableDoctors = h.hospital_doctors?.[0]?.available_doctors ?? 0;
  const status = availableDoctors === 0 ? 'Critical' : availableDoctors < totalDoctors / 2 ? 'Busy' : 'Available';
  return {
    id: h.id,
    name: h.hospital_name,
    zone: h.address ?? 'N/A',
    type: 'General',
    rating: 4.5,
    doctors: totalDoctors,
    beds: h.hospital_equipment_inventory?.reduce((sum, e) => sum + (e.total_quantity ?? 0), 0) ?? 0,
    status,
    image: `https://ui-avatars.com/api/?name=${encodeURIComponent(h.hospital_name)}&background=0d9488&color=fff&size=300`,
  };
}

export default function TrendingNewsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'news' | 'hospitals'>('news');
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [isArticleLoading, setIsArticleLoading] = useState(false);
  const [hospitals, setHospitals] = useState<{ id: string | number; name: string; zone: string; type: string; rating: number; doctors: number; beds: number; status: string; image: string }[]>([]);

  // Load hospitals from DB
  useEffect(() => {
    async function loadHospitals() {
      try {
        const res = await fetch('/api/hospitals');
        if (res.ok) {
          const data: HospitalWithDetails[] = await res.json();
          if (data.length > 0) {
            setHospitals(data.map(mapHospitalToDisplay));
            return;
          }
        }
      } catch (err) {
        console.error('Error loading hospitals:', err);
      }
    }
    loadHospitals();
  }, []);

  // Load articles on mount
  useEffect(() => {
    const loadArticles = async () => {
      setIsLoading(true);
      try {
        const data = await fetchParticles();
        setNewsArticles(data || []);
      } catch (err) {
        console.error('Error loading articles:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadArticles();
  }, []);

  const filteredNews = newsArticles.filter(item => {
    const priority = getNewsPriority(item.title);
    const matchesFilter = filter === 'All' || priority.severity === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.source?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredHospitals = hospitals.filter(h => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewsClick = async (news: any) => {
    setIsArticleLoading(true);
    const urlToFetch = news.link || news.url;
    
    if (!urlToFetch) {
      setSelectedArticle({ ...news, content: t.common.info });
      setIsArticleLoading(false);
      return;
    }

    try {
      setSelectedArticle({ ...news, isLoading: true });
      const full = await fetchFullArticle(urlToFetch);
      if (full) {
        setSelectedArticle(full);
      } else {
        setSelectedArticle({ ...news, content: t.common.readMore + " via " + getDomain(urlToFetch) });
      }
    } catch (err) {
      console.error('Error fetching full article:', err);
      setSelectedArticle({ ...news, content: t.common.info });
    } finally {
      setIsArticleLoading(false);
    }
  };

  const handleAskAI = (news: any) => {
    const query = encodeURIComponent(`I want to know more about the trending news: "${news.title}". What precautions should I take?`);
    router.push(`/chatbox?q=${query}`);
  };

  const getSeverityBadge = (priority: { severity: 'Critical' | 'High' | 'Medium' | 'Low'; rating: number; color: 'red' | 'orange' | 'yellow' | 'blue' }) => {
    const localizedSeverity = {
       'Critical': t.common.critical,
       'High': t.common.high,
       'Medium': t.common.medium,
       'Low': t.common.low
    }[priority.severity] || priority.severity;

    const colorMap: Record<'red' | 'orange' | 'yellow' | 'blue', string> = {
      red: 'bg-red-100 text-red-700 border-red-200',
      orange: 'bg-orange-100 text-orange-700 border-orange-200',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      blue: 'bg-blue-100 text-blue-700 border-blue-200'
    };
    
    const iconMap: Record<'Critical' | 'High' | 'Medium' | 'Low', typeof AlertTriangle> = {
      Critical: AlertTriangle,
      High: AlertTriangle,
      Medium: Info,
      Low: CheckCircle2
    };
    
    const Icon = iconMap[priority.severity] || Info;
    
    return (
      <div className="flex flex-col items-end gap-1">
        <span className={`px-2 py-1 text-xs font-bold rounded-full flex items-center gap-1 border ${colorMap[priority.color]}`}>
          <Icon size={12}/> {localizedSeverity}
        </span>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={10}
              className={`fill-current ${i < priority.rating ? 'text-yellow-400' : 'text-gray-200'}`}
            />
          ))}
          <span className="text-xs font-bold text-gray-600 ml-1">{priority.rating}/5</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-28 md:pb-12">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <Link href="/home" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="w-6 h-6 text-gray-700" />
             </Link>
             <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                   <TrendingUp className="text-teal-600" /> {t.trending.title}
                </h1>
                <p className="text-sm text-gray-500">{t.trending.subtitle}</p>
             </div>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                   type="text" 
                   placeholder={t.trending.searchPlaceholder}
                   className="w-full pl-9 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                <Filter className="w-5 h-5 text-gray-600" />
             </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto mt-4 px-1">
           <div className="flex space-x-4 border-b border-gray-200">
              <button 
                onClick={() => setActiveTab('news')} 
                className={`pb-2 px-1 text-sm font-medium transition-all ${activeTab === 'news' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                 {t.trending.tabNews}
              </button>
              <button 
                onClick={() => setActiveTab('hospitals')} 
                className={`pb-2 px-1 text-sm font-medium transition-all ${activeTab === 'hospitals' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                 {t.trending.tabHospitals}
              </button>
           </div>
        </div>
      </div>

      {activeTab === 'news' && (
      <>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6 overflow-x-auto no-scrollbar">
         <div className="flex gap-2">
            {['All', 'Critical', 'High', 'Medium', 'Low'].map((f) => (
               <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                     filter === f 
                     ? 'bg-teal-600 text-white shadow-md shadow-teal-200' 
                     : 'bg-white text-gray-600 border border-gray-200 hover:border-teal-300 hover:text-teal-600'
                  }`}
               >
                  {f === 'Critical' ? t.common.critical : f === 'High' ? t.common.high : f === 'Medium' ? t.common.medium : f === 'Low' ? t.common.info : f}
               </button>
            ))}
         </div>
      </div>

      {/* Article Modal Overlay */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800 pr-8 line-clamp-2">
                {selectedArticle.title}
              </h3>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              {selectedArticle.isLoading || isArticleLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-4 border-teal-100 border-t-teal-600 animate-spin"></div>
                  </div>
                  <p className="text-slate-500 font-medium animate-pulse">{t.common.loading}</p>
                </div>
              ) : (
                <div className="prose prose-slate max-w-none">
                  {selectedArticle.source && (
                    <div className="flex items-center gap-2 mb-6">
                       <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                         {selectedArticle.source}
                       </span>
                    </div>
                  )}
                  <div className="text-slate-700 leading-relaxed whitespace-pre-line text-lg">
                    {selectedArticle.content || t.common.info}
                  </div>
                  
                  {selectedArticle.link && (
                     <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                       <a 
                         href={selectedArticle.link} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="inline-flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-800 hover:underline"
                       >
                         {t.trending.readSource} <ExternalLink size={16} />
                       </a>
                       <button 
                         onClick={() => handleAskAI(selectedArticle)}
                         className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                       >
                         <Bot size={16} /> {t.common.askAI}
                       </button>
                     </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Backdrop click to close */}
          <div className="absolute inset-0 -z-10" onClick={() => setSelectedArticle(null)} />
        </div>
      )}

      {/* News Feed Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
         {isLoading ? (
           <div className="flex flex-col items-center justify-center py-20">
             <Loader2 size={48} className="animate-spin text-teal-500 mb-4" />
             <p className="text-slate-500 text-lg">Loading trending news...</p>
           </div>
         ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((news, index) => {
                const priority = getNewsPriority(news.title);
                const domain = getDomain(news.link);
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={news.link || index} 
                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer"
                    onClick={() => handleNewsClick(news)}
                  >
                    <div className="flex justify-between items-start mb-4">
                       <div className="flex items-center gap-2">
                          <img src="https://ui-avatars.com/api/?name=Health+Dept&background=0d9488&color=fff" alt="Source" className="w-8 h-8 rounded-full" />
                          <div>
                             <p className="text-xs font-bold text-gray-900">{news.source || 'Health Dept.'}</p>
                             <p className="text-[10px] text-gray-500">{t.trending.justNow}</p>
                          </div>
                       </div>
                       {getSeverityBadge(priority)}
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight grow">
                       {news.title}
                    </h3>

                    <div className="mt-auto pt-4 border-t border-gray-50">
                       <div className="flex items-center gap-4 text-gray-500 text-xs mb-4">
                          <span className="flex items-center gap-1"><ExternalLink size={14} /> {domain}</span>
                          <span className="text-blue-600 hover:text-blue-800 font-medium">{t.common.readMore} →</span>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-3">
                          <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               handleAskAI(news);
                             }}
                             className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-teal-50 text-teal-700 font-semibold text-sm hover:bg-teal-100 transition-colors"
                          >
                             <Bot size={16} /> {t.common.askAI}
                          </button>
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-gray-700 font-semibold text-sm hover:bg-gray-100 transition-colors"
                          >
                             <Share2 size={16} /> {t.common.share}
                          </button>
                       </div>
                    </div>
                  </motion.div>
                );
              })}
           </div>
         )}
         
         {!isLoading && filteredNews.length === 0 && (
           <div className="text-center py-20">
             <p className="text-slate-500 text-lg">{t.common.noResults}</p>
           </div>
         )}
      </div>
      </>
      )}

      {activeTab === 'hospitals' && (
         <div className="max-w-7xl mx-auto px-4 py-6 pb-20">
            <h2 className="text-xl font-bold mb-4 text-slate-800">{t.trending.hospitalsTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredHospitals.map((hospital, index) => (
                  <motion.div 
                     key={hospital.id}
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: index * 0.1 }}
                     className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
                  >
                     <div className="h-40 bg-gray-200 relative">
                        <img src={hospital.image} alt={hospital.name} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-slate-800 flex items-center gap-1">
                           <Star size={12} className="text-yellow-500 fill-current" /> {hospital.rating}
                        </div>
                     </div>
                     <div className="p-5">
                        <h3 className="font-bold text-lg text-slate-900 mb-1">{hospital.name}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mb-4">
                           <MapPin size={14} /> {hospital.zone} • {hospital.type}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                           <div className="bg-blue-50 p-2 rounded-lg">
                              <p className="text-[10px] text-blue-500 font-bold uppercase">{t.trending.doctors}</p>
                              <p className="text-lg font-bold text-blue-700 flex items-center gap-1">
                                 <Stethoscope size={16} /> {hospital.doctors}
                              </p>
                           </div>
                           <div className="bg-emerald-50 p-2 rounded-lg">
                              <p className="text-[10px] text-emerald-500 font-bold uppercase">{t.trending.beds}</p>
                              <p className="text-lg font-bold text-emerald-700 flex items-center gap-1">
                                 <Activity size={16} /> {hospital.beds}
                              </p>
                           </div>
                        </div>

                        <div className="flex items-center justify-between">
                           <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              hospital.status === 'Available' ? 'bg-green-100 text-green-700' :
                              hospital.status === 'Busy' ? 'bg-orange-100 text-orange-700' :
                              'bg-red-100 text-red-700'
                           }`}>
                              {hospital.status}
                           </span>
                           <button className="text-teal-600 text-sm font-bold flex items-center gap-1 hover:underline">
                              {t.hospitals.call} <Phone size={14} />
                           </button>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>
            {filteredHospitals.length === 0 && (
               <div className="text-center py-20 text-slate-500">{t.common.noResults}</div>
            )}
         </div>
      )}
    </div>
  );
}