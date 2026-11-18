'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// Fallback metadata for category headers/backgrounds if needed
const categoryMeta: Record<string, { title: string; description: string; image: string }> = {
  marvel: {
    title: 'Marvel',
    description: 'Explore the latest news, easter eggs, cinematic universe theories, and comic deep-dives into the Marvel multiverse.',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1200&auto=format&fit=crop',
  },
  'dc-comics': {
    title: 'DC Comics',
    description: 'Get deep insights into Gotham, Metropolis, James Gunn’s DCU chapter one, and upcoming character arcs.',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop',
  },
  anime: {
    title: 'Anime',
    description: 'Stay ahead with final saga theories, episode breakdowns, and major announcements from the world of Japanese animation.',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop',
  },
  'movies-series': {
    title: 'Movies & Series',
    description: 'Your go-to spot for box office hits, hidden easter eggs, and episodic television breakdowns.',
    image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=1200&auto=format&fit=crop',
  },
  'k-drama': {
    title: 'K-Drama',
    description: 'Catch up on trending romance, sci-fi thrillers, and upcoming shows dominating Korean television.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
  },
};

export default function CategoryDynamicPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const meta = categoryMeta[slug] || {
    title: slug ? slug.replace('-', ' ').toUpperCase() : 'Category',
    description: 'Explore the latest updates and articles for this category.',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1200&auto=format&fit=crop',
  };

  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch live articles and filter by category
  useEffect(() => {
    async function fetchCategoryArticles() {
      try {
        const response = await fetch('/api/posts');
        if (response.ok) {
          const data = await response.json();
          const posts = Array.isArray(data) ? data : data.posts || [];
          
          // Filter posts that match the current category slug
          const filtered = posts.filter((post: any) => {
            const postCategorySlug = post.categorySlug || `/category/${post.category?.toLowerCase()}`.replace(/\s+/g, '-');
            return postCategorySlug.includes(slug) || post.category?.toLowerCase() === meta.title.toLowerCase();
          });

          setArticles(filtered);
        }
      } catch (error) {
        console.error('Failed to fetch category articles:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      fetchCategoryArticles();
    }
  }, [slug, meta.title]);

  return (
    <main className="flex min-h-screen flex-col bg-black text-white relative">
    
      {/* Category Hero Banner */}
      <section className="px-6 pt-10 pb-6 flex justify-center">
        <div 
          className="w-full max-w-7xl h-[300px] md:h-[400px] bg-cover bg-center rounded-2xl overflow-hidden relative flex flex-col justify-end p-8 md:p-12 shadow-2xl border border-zinc-800"
          style={{ backgroundImage: `url('${meta.image}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
          <div className="relative z-10 space-y-3">
            <span className="text-xs bg-[#b5ff42] text-black font-bold px-3 py-1 rounded uppercase tracking-wider">
              Category
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight capitalize">
              {meta.title}
            </h1>
            <p className="text-zinc-300 text-sm md:text-base max-w-2xl leading-relaxed">
              {meta.description}
            </p>
          </div>
        </div>
      </section>

      {/* Dynamic Articles List */}
      <section className="flex flex-col items-start px-6 py-10 w-full min-h-[300px]">
        <div className="w-full max-w-7xl mx-auto">
          <div className="w-full md:w-[80%] space-y-6">
            {isLoading ? (
              <div className="text-zinc-500 py-12 text-center">Loading articles...</div>
            ) : articles.length > 0 ? (
              articles.map((article) => (
                <div
                  key={article.id || article._id}
                  className="group flex flex-col md:flex-row bg-[#121212] rounded-2xl overflow-hidden border border-zinc-800 shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  <Link href={article.slug ? `/posts/${article.slug}` : `/posts/${article.id}`} className="md:w-[42%] h-64 md:h-auto relative overflow-hidden shrink-0 block">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url('${article.image || article.imageUrl}')` }}
                    ></div>
                  </Link>
                  <div className="flex flex-col justify-between p-6 md:p-8 md:w-[58%]">
                    <div>
                      <div className="flex justify-between items-center text-xs mb-3">
                        <span className="text-[#22c55e] font-bold tracking-wide uppercase">
                          {meta.title}
                        </span>
                        <span className="text-zinc-400">
                          {article.date || (article.created_at ? new Date(article.created_at).toLocaleDateString() : '')}
                        </span>
                      </div>
                      <Link href={article.slug ? `/posts/${article.slug}` : `/posts/${article.id}`} className="block">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-[#b5ff42] transition-colors leading-snug">
                          {article.title}
                        </h3>
                      </Link>
                      <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                        {article.description || article.excerpt}
                      </p>
                    </div>
                    <div className="text-xs text-zinc-400 pt-2 border-t border-zinc-800/80">
                      Authored By: <Link href={article.authorSlug || '#'} className="text-zinc-200 font-medium hover:text-[#b5ff42]">{article.author || 'Admin'}</Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-zinc-500 py-12 text-center bg-[#121212] rounded-2xl border border-zinc-800 w-full">
                <p className="text-base font-semibold text-zinc-300">No articles found in this category yet.</p>
                <p className="text-xs text-zinc-500 mt-1">Publish an article from your admin dashboard with this category to see it appear here!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}