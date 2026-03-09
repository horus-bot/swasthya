"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchArticleList } from "@/lib/api";
import { Bot } from "lucide-react";

export default function HealthFeed() {
  const router = useRouter();
  const [articles, setArticles] = useState<Array<{ title: string; source: string; link: string }>>([]);

  const loadArticles = async () => {
    const data = await fetchArticleList();
    setArticles(data || []);
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleAskAI = (article: any) => {
    const query = encodeURIComponent(`I want to know more about the health article: "${article.title}". What precautions should I take?`);
    router.push(`/chatbox?q=${query}`);
  };

  return (
    <div>
      <button onClick={loadArticles}>Refresh</button>

      {articles.map((article, i) => (
        <div key={i} className="border-b border-gray-200 p-4 mb-4">
          <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{article.source}</p>
          <div className="flex gap-3">
            <a 
              href={article.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Read full article
            </a>
            <button 
              onClick={() => handleAskAI(article)}
              className="inline-flex items-center gap-2 px-3 py-1 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700 transition-colors"
            >
              <Bot size={14} /> Ask AI
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
