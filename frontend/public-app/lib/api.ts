// Fetch a fast list of articles (headlines)
export async function fetchParticles() {
  // Returning mock news particles
  return [
    {
      id: "1",
      title: "New Multi-Specialty Hospital Opens in Chennai",
      source: "Tamil Nadu Health Dept",
      link: "https://example.com/news/1",
      date: new Date().toISOString(),
      summary: "A state-of-the-art facility has been inaugurated to provide affordable healthcare to everyone."
    },
    {
      id: "2",
      title: "Dengue Alert: Precautionary Measures Advised",
      source: "Global Health Monitor",
      link: "https://example.com/news/2",
      date: new Date(Date.now() - 3600000).toISOString(),
      summary: "Authorities warn of a potential spike in vector-borne diseases due to the recent monsoons."
    },
    {
      id: "3",
      title: "Breakthrough in Tropical Disease Treatment",
      source: "Medical Journal",
      link: "https://example.com/news/3",
      date: new Date(Date.now() - 7200000).toISOString(),
      summary: "Researchers have announced a promising new protocol for fast recovery from viral fevers."
    }
  ];
}

// Get full article content by URL
export async function fetchFullArticle(url: string) {
  // Returning a mock full article
  return {
    title: "Mock Article Title",
    source: "Mock News Source",
    link: url,
    content: "This is a simulated full article content.\n\nDue to API dependency removal, we are rendering this mock data instead of scraping the actual URL.\n\nPlease refer to the original source for the actual news.",
    date: new Date().toISOString()
  };
}

// Alias for older code expecting fetchArticleList
export async function fetchArticleList() {
  return fetchParticles();
}
