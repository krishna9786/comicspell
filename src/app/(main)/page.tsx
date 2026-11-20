// src/app/(main)/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Category quick navigation cards
const categoryCards = [
  {
    id: 'anime',
    title: 'Anime',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop',
    slug: '/category/anime',
  },
  {
    id: 'marvel',
    title: 'Marvel',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop',
    slug: '/category/marvel',
  },
  {
    id: 'dc',
    title: 'DC Comics',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
    slug: '/category/dc-comics',
  },
  {
    id: 'kdrama',
    title: 'K-Drama',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
    slug: '/category/k-drama',
  },
  {
    id: 'movies',
    title: 'Movie/Series',
    image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=600&auto=format&fit=crop',
    slug: '/category/movies-series',
  },
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // States for live fetched articles
  const [spotlightItems, setSpotlightItems] = useState<any[]>([]);
  const [repeaterArticles, setRepeaterArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch live articles from your API endpoint on mount
  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch('/api/posts');
        if (response.ok) {
          const data = await response.json();
          const posts = Array.isArray(data) ? data : data.posts || [];

          const featured = posts.filter((p: any) => p.is_spotlight || p.isSpotlight).slice(0, 5);
          setSpotlightItems(featured);
          setCurrentIndex(0);
          setRepeaterArticles(posts);
        }
      } catch (error) {
        console.error('Failed to fetch live articles:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchArticles();
  }, []);

  // Handle Auto-slide every 5 seconds
  useEffect(() => {
    if (spotlightItems.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % spotlightItems.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [spotlightItems.length]);

  const handleNext = () => {
    if (spotlightItems.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % spotlightItems.length);
  };

  const handlePrev = () => {
    if (spotlightItems.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + spotlightItems.length) % spotlightItems.length);
  };

  const currentItem = spotlightItems[currentIndex];
  const currentItemImage = currentItem?.image_url || currentItem?.image || currentItem?.imageUrl;

  return (
    <main className="flex min-h-screen flex-col bg-black text-white relative">

      {/* Section 1: Spotlight Slider Section */}
      <section className="flex flex-col items-center px-6 pt-6 pb-6">
        <div className="w-full max-w-7xl bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 relative shadow-2xl">
          {isLoading ? (
            <div className="h-[390px] md:h-[550px] flex items-center justify-center text-zinc-500 text-sm">
              Loading spotlight...
            </div>
          ) : !currentItem ? (
            <div className="h-[390px] md:h-[550px] flex items-center justify-center text-zinc-500 text-sm">
              No featured articles available. Publish an article with spotlight enabled to see it here.
            </div>
          ) : (
            <div
              className="h-[390px] md:h-[550px] bg-cover bg-center flex flex-col justify-end p-8 md:p-12 relative transition-all duration-700 ease-in-out"
              style={{ backgroundImage: currentItemImage ? `url('${currentItemImage}')` : undefined }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

              <div className="relative z-10">
                <a
                  href={currentItem.categorySlug || `/category/${currentItem.category?.toLowerCase()}`}
                  className="text-xs bg-[#b5ff42] text-black font-bold px-2.5 py-1 rounded mb-3 inline-block hover:opacity-90 transition"
                >
                  {currentItem.category}
                </a>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white max-w-3xl leading-tight">
                  {currentItem.title}
                </h2>
                <a
                  href={currentItem.slug ? `/posts/${currentItem.slug}` : `/posts/${currentItem.id}`}
                  className="mt-4 inline-block bg-[#22c55e] text-black font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-[#16a34a] transition"
                >
                  Read More
                </a>
              </div>

              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 text-white p-3 rounded-full hover:bg-black transition z-20 cursor-pointer"
              >
                &#10094;
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 text-white p-3 rounded-full hover:bg-black transition z-20 cursor-pointer"
              >
                &#10095;
              </button>

              <div className="absolute bottom-6 right-8 flex space-x-2 z-20">
                {spotlightItems.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                      currentIndex === idx ? 'bg-[#b5ff42] w-6' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section 2: Category Quick Navigation Cards */}
      <section className="flex justify-center px-6 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 w-full max-w-7xl">
          {categoryCards.map((card) => (
            <a
              key={card.id}
              href={card.slug}
              className="group relative h-72 md:h-80 rounded-2xl overflow-hidden border border-zinc-800 shadow-[0_12px_24px_-4px_rgba(39,39,42,0.7)] transform transition-all duration-300 hover:scale-105 hover:shadow-[0_18px_32px_-4px_rgba(63,63,70,0.9)]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:scale-110 group-hover:blur-[2px]"
                style={{ backgroundImage: `url('${card.image}')` }}
              ></div>

              <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black via-black/80 to-transparent z-10 pointer-events-none"></div>

              <div className="absolute inset-x-0 bottom-4 flex justify-center z-20 px-4">
                <span className="w-[90%] text-center bg-zinc-900/90 text-zinc-200 text-xs md:text-sm font-bold py-3 px-4 rounded-3xl border-0 shadow-[0_10px_20px_rgba(0,0,0,0.9)] transition-all duration-300 group-hover:scale-105 group-hover:bg-[#b5ff42] group-hover:text-black group-hover:shadow-[0_14px_25px_rgba(0,0,0,0.95)]">
                  {card.title}
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Section 3: Dynamic Repeater Section */}
      <section className="flex flex-col items-start px-6 py-6 w-full">
        <div className="w-full max-w-7xl mx-auto">
          <div className="w-full md:w-[80%] space-y-6">
            {isLoading ? (
              <div className="text-zinc-500 text-sm py-10">Loading articles...</div>
            ) : repeaterArticles.length === 0 ? (
              <div className="text-zinc-500 text-sm py-10">No articles found. Publish a post from your admin dashboard to see it appear here!</div>
            ) : (
              repeaterArticles.map((article) => {
                const postImage = article.image_url || article.image || article.imageUrl;
                const postDate = article.published_on
                  ? new Date(article.published_on).toLocaleDateString('en-GB')
                  : article.date || (article.created_at ? new Date(article.created_at).toLocaleDateString() : '');

                return (
                  <div
                    key={article.id || article._id}
                    className="group flex flex-col md:flex-row bg-[#121212] rounded-2xl overflow-hidden border border-zinc-800 shadow-[0_12px_24px_-4px_rgba(39,39,42,0.7)] transform transition-all duration-300 hover:scale-[1.02] hover:border-zinc-700 hover:shadow-[0_20px_40px_-4px_rgba(45,45,48,0.9)]"
                  >
                    {/* Article Thumbnail */}
                    <Link href={article.slug ? `/posts/${article.slug}` : `/posts/${article.id}`} className="md:w-[42%] h-64 md:h-auto relative overflow-hidden shrink-0 block bg-zinc-900">
                      {postImage && (
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                          style={{ backgroundImage: `url('${postImage}')` }}
                        ></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden"></div>
                    </Link>

                    {/* Article Content */}
                    <div className="flex flex-col justify-between p-6 md:p-8 md:w-[58%]">
                      <div>
                        {/* Category & Date Header */}
                        <div className="flex justify-between items-center text-xs mb-3">
                          <Link
                            href={article.categorySlug || `/category/${article.category?.toLowerCase()}`}
                            className="text-[#22c55e] font-bold tracking-wide uppercase hover:underline z-10 relative"
                          >
                            {article.category}
                          </Link>
                          <span className="text-zinc-400">
                            {postDate}
                          </span>
                        </div>

                        {/* Title */}
                        <Link href={article.slug ? `/posts/${article.slug}` : `/posts/${article.id}`} className="block">
                          <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-[#b5ff42] transition-colors leading-snug">
                            {article.title}
                          </h3>
                        </Link>

                        {/* Description */}
                        <Link href={article.slug ? `/posts/${article.slug}` : `/posts/${article.id}`} className="block">
                          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                            {article.short_description || article.description || article.excerpt}
                          </p>
                        </Link>
                      </div>

                      {/* Author Info */}
                      <div className="text-xs text-zinc-400 pt-2 border-t border-zinc-800/80">
                        Authored By:{' '}
                        <Link
                          href={article.authorSlug || '#'}
                          className="text-zinc-200 font-medium hover:text-[#b5ff42] transition-colors z-10 relative"
                        >
                          {article.author || 'Admin'}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

    </main>
  );
}