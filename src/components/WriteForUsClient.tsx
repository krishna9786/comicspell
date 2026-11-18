// src/components/WriteForUsClient.tsx
'use client';

import React, { useState, useEffect } from 'react';

interface WriteForUsPortalProps {
  initialPost?: any;
  onSubmitAction?: (formData: FormData) => Promise<void>;
}

export default function WriteForUsPortal({ initialPost, onSubmitAction }: WriteForUsPortalProps) {
    
  const [postTitle, setPostTitle] = useState(initialPost?.title || '');
  const [postContent, setPostContent] = useState(
    initialPost?.content || 
`At first glance, Spider-Man: Brand New Day sounds optimistic. It feels like the perfect title for Peter Parker after the heartbreaking ending of Spider-Man: No Way Home. The world has forgotten who Peter Parker is, his closest friends have moved on, and the young hero who once fought alongside the Avengers now stands completely alone.

But Marvel rarely chooses a title without purpose.

Behind those three simple words lies one of the most controversial chapters in Spider-Man comic history—a story that divided fans, reshaped Peter Parker's life, and continues to spark debate years later.

So, is Marvel simply borrowing the name, or are they quietly telling us where Tom Holland's Spider-Man is headed?

A New Beginning After Losing Everything

The ending of No Way Home left Peter Parker with a choice no hero should have to make. To save the multiverse, he sacrificed his own identity. MJ forgot him. Ned forgot him. Even Happy Hogan no longer recognized the young man beneath the mask.

That ending perfectly sets up the premise of Spider-Man: Brand New Day. Sony's official description`
  );
  const [selectedCategory, setSelectedCategory] = useState(initialPost?.category || 'Marvel');
  const [imageCredit, setImageCredit] = useState(initialPost?.image_credit || 'Image Credit: Marvel Studios / Sony Pictures');
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialPost?.image_url || '');
  const [uploadedUrl, setUploadedUrl] = useState<string>(initialPost?.image_url || '');
  const [isUploading, setIsUploading] = useState(false);

  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  
  const [activeQuote, setActiveQuote] = useState({
    quote: "With great power comes great responsibility, and with great writing comes the power to shape universes.",
    author: "Stan Lee"
  });
  const [animateQuote, setAnimateQuote] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const categoryQuotes: Record<string, { quote: string; author: string }> = {
    'Marvel': {
      quote: "That is America's ass—and this is your universe to write. Make every panel legendary.",
      author: "MCU Editorial"
    },
    'DC Comics': {
      quote: "It's not who you are underneath, but what you do that defines you. Write your masterpiece.",
      author: "Batman Begins"
    },
    'Anime & Manga': {
      quote: "If you don't take risks, you can't create a future! Push your storytelling beyond its limits.",
      author: "Monkey D. Luffy"
    },
    'Movies / Series': {
      quote: "Great movies and stories are legends that keep walking in our hearts. Tell yours brilliantly.",
      author: "Cinema Lore"
    },
    'K-Drama': {
      quote: "Every heart-wrenching twist and emotional peak starts with a single passionate sentence.",
      author: "K-Drama Scriptwriter"
    }
  };

  const availableCategories = [
    { name: 'Marvel', icon: '🔴', desc: 'Marvel Cinematic Universe & Comics' },
    { name: 'DC Comics', icon: '🔵', desc: 'DC Extended Universe & Graphic Novels' },
    { name: 'Anime & Manga', icon: '⚡', desc: 'Japanese Animation & Serialization' },
    { name: 'Movies / Series', icon: '🎬', desc: 'General Cinema & Television' },
    { name: 'K-Drama', icon: '☕', desc: 'Korean Drama Series & Specials' },
  ];

  const filteredCategories = availableCategories.filter(cat => 
    cat.name.toLowerCase().includes(categorySearchQuery.toLowerCase()) ||
    cat.desc.toLowerCase().includes(categorySearchQuery.toLowerCase())
  );

  const wordCount = postContent.trim() ? postContent.trim().split(/\s+/).length : 0;

  const triggerQuoteAnimation = (catName: string) => {
    setAnimateQuote(false);
    if (categoryQuotes[catName]) {
      setActiveQuote(categoryQuotes[catName]);
    } else {
      setActiveQuote({
        quote: "Every great story starts with a writer who believed in the impossible.",
        author: "Comicspell Creators"
      });
    }
    setTimeout(() => {
      setAnimateQuote(true);
    }, 50);
  };

  useEffect(() => {
    triggerQuoteAnimation(selectedCategory || 'Marvel');
  }, [selectedCategory]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setUploadedUrl('');
    }
  };

  const handleUploadClick = async () => {
    if (!imageFile) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setUploadedUrl(data.url);
        setImagePreview(data.url);
        alert('Image uploaded and attached!');
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  const applyFormatting = (tagStart: string, tagEnd: string = '') => {
    const textarea = document.getElementById('main-editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = postContent.substring(start, end);
    const replacement = tagStart + selectedText + tagEnd;

    const newContent = postContent.substring(0, start) + replacement + postContent.substring(end);
    setPostContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tagStart.length, end + tagStart.length);
    }, 0);
  };

  const insertTextAtCursor = (textToInsert: string) => {
    const textarea = document.getElementById('main-editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newContent = postContent.substring(0, start) + textToInsert + postContent.substring(start);
    setPostContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    }, 0);
  };

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!postTitle.trim()) {
      alert('Please enter a post title before submitting.');
      return;
    }

    const finalImageUrl = uploadedUrl || initialPost?.image_url || '';

    if (onSubmitAction) {
      const formData = new FormData(e.currentTarget);
      if (initialPost?.id) formData.append('postId', String(initialPost.id));
      formData.append('title', postTitle);
      formData.append('content', postContent);
      formData.append('short_description', postContent.substring(0, 150));
      formData.append('category', selectedCategory);
      formData.append('image_url', finalImageUrl);
      formData.append('image_credit', imageCredit);

      await onSubmitAction(formData);
      return;
    }
  };

  return (
    <div className="flex-1 flex flex-row overflow-hidden bg-[#0a0a0a]">
      
      {/* Center / Main Editor Workspace */}
      <main className={`flex-1 p-5 lg:p-6 max-w-4xl mx-auto w-full overflow-hidden flex flex-col justify-between ${isFullScreen ? 'fixed inset-0 z-50 bg-[#0a0a0a] max-w-none p-8' : ''}`}>
        {isSubmitted ? (
          <div className="bg-[#141d0c] border border-[#b5ff42] p-8 rounded-2xl text-center space-y-4 my-auto">
            <div className="text-4xl">📤</div>
            <h2 className="text-2xl font-black text-[#b5ff42]">Submitted to Admin Panel for Review</h2>
            <p className="text-sm text-zinc-300 max-w-md mx-auto">
              Your submission has been successfully queued in the admin review database. Once inspected for continuity and lore alignment, the editorial team will publish it live.
            </p>
            <button 
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="mt-4 bg-[#b5ff42] text-black font-bold px-6 py-2 rounded-xl text-xs hover:opacity-90 transition cursor-pointer"
            >
              Create Another Submission
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col h-full justify-between">
            
            <div className="space-y-4 flex-1 flex flex-col min-h-0 overflow-y-auto pr-1">
              {/* Post Title Input */}
              <div className="space-y-1 shrink-0">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Post Title</label>
                <input
                  type="text"
                  required
                  placeholder="[Series Name] Review / Breakdown: [Specific Issue or Theme]"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full bg-[#141414] border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#b5ff42] font-semibold transition"
                />
              </div>

              {/* Rich Text Editor matched with Website Light Black Theme */}
              <div className="border border-zinc-800 rounded-2xl bg-[#121212] text-white overflow-hidden shadow-2xl flex flex-col min-h-[380px]">
                
                {/* Top Action Toolbar */}
                <div className="bg-[#181818] border-b border-zinc-800 px-3 py-2 flex flex-wrap items-center gap-1.5 text-zinc-300 text-xs shrink-0 select-none">
                  
                  <button 
                    type="button" 
                    title="Generate AI Content Suggestions"
                    onClick={() => insertTextAtCursor('\n\n[AI Generated Lore Insight]: Check issue continuity or alternate timeline consequences.\n\n')}
                    className="flex items-center gap-1 text-[#b5ff42] font-semibold px-2 py-1 rounded hover:bg-zinc-800 transition cursor-pointer border border-[#b5ff42]/20"
                  >
                    <span>✦</span> Content AI
                  </button>
                  
                  <div className="h-4 w-[1px] bg-zinc-800 mx-1"></div>

                  <select 
                    title="Change Text Style, Headings & Blocks"
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'title') applyFormatting('\n# ', '\n');
                      if (val === 'subtitle') applyFormatting('\n## ', '\n');
                      if (val === 'h1') applyFormatting('\n# ', '\n');
                      if (val === 'h2') applyFormatting('\n## ', '\n');
                      if (val === 'h3') applyFormatting('\n### ', '\n');
                      if (val === 'h4') applyFormatting('\n#### ', '\n');
                      if (val === 'h5') applyFormatting('\n##### ', '\n');
                      if (val === 'h6') applyFormatting('\n###### ', '\n');
                      if (val === 'quote') applyFormatting('\n> ', '\n');
                      if (val === 'p') applyFormatting('\n', '\n');
                      e.target.value = '';
                    }}
                    className="bg-[#222222] text-white text-xs font-medium cursor-pointer px-2 py-1 rounded border border-zinc-700 focus:outline-none"
                  >
                    <option value="">Paragraph ▼</option>
                    <option value="title">Title</option>
                    <option value="subtitle">Subtitle</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                    <option value="h4">Heading 4</option>
                    <option value="h5">Heading 5</option>
                    <option value="h6">Heading 6</option>
                    <option value="quote">Quote Block</option>
                    <option value="p">Normal Paragraph</option>
                  </select>

                  <div className="h-4 w-[1px] bg-zinc-800 mx-1"></div>

                  <button type="button" title="Bold Text (Ctrl+B)" onClick={() => applyFormatting('**', '**')} className="p-1.5 hover:bg-zinc-800 rounded transition font-bold cursor-pointer">B</button>
                  <button type="button" title="Underline Text (Ctrl+U)" onClick={() => applyFormatting('<u>', '</u>')} className="p-1.5 hover:bg-zinc-800 rounded transition underline cursor-pointer">U</button>
                  <button type="button" title="Italicize Text (Ctrl+I)" onClick={() => applyFormatting('*', '*')} className="p-1.5 hover:bg-zinc-800 rounded transition italic cursor-pointer">I</button>
                  <button type="button" title="Strikethrough text" onClick={() => applyFormatting('~~', '~~')} className="p-1.5 hover:bg-zinc-800 rounded transition line-through cursor-pointer">S</button>
                  <button type="button" title="Highlight Text Color" onClick={() => applyFormatting('<mark>', '</mark>')} className="p-1.5 hover:bg-zinc-800 rounded transition font-serif cursor-pointer">A</button>
                  <button type="button" title="Text Highlight Marker" onClick={() => applyFormatting('==', '==')} className="p-1.5 hover:bg-zinc-800 rounded transition cursor-pointer">HL</button>

                  <div className="ml-auto flex items-center gap-1.5">
                    <button 
                      type="button" 
                      title="Toggle Fullscreen Workspace" 
                      onClick={() => setIsFullScreen(!isFullScreen)} 
                      className="flex items-center gap-1 text-[11px] text-zinc-300 hover:text-white px-2 py-1 rounded hover:bg-zinc-800 transition cursor-pointer font-medium"
                      aria-label="Toggle Fullscreen"
                    >
                      {isFullScreen ? (
                        <svg className="w-4 h-4 fill-current text-[#b5ff42]" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>
                      ) : (
                        <svg className="w-4 h-4 fill-current text-[#b5ff42]" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Main Textarea Editor Content */}
                <div className="p-5 flex-1 flex flex-col min-h-[260px] bg-[#121212] relative">
                  <textarea
                    id="main-editor-textarea"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="w-full h-full flex-1 bg-transparent text-zinc-200 text-sm focus:outline-none resize-none leading-relaxed overflow-y-auto font-sans"
                    placeholder="Start writing your article here..."
                  />
                </div>

                {/* Bottom Professional Toolbar */}
                <div className="bg-[#161616] border-t border-zinc-800 px-4 py-2 flex flex-wrap items-center justify-between text-zinc-400 text-xs shrink-0">
                  <div className="flex items-center space-x-2 overflow-x-auto">
                    <button type="button" title="Insert Image Asset" onClick={() => insertTextAtCursor('![Image Description](https://image_url_here)')} className="px-2 py-1 hover:bg-zinc-800 rounded transition cursor-pointer">Image</button>
                    <button type="button" title="Insert Video Embed" onClick={() => insertTextAtCursor('\n[Video Embed: URL]\n')} className="px-2 py-1 hover:bg-zinc-800 rounded transition cursor-pointer">Video</button>
                    <button type="button" title="Image Gallery Grid" onClick={() => insertTextAtCursor('\n[Gallery Grid]\n')} className="px-2 py-1 hover:bg-zinc-800 rounded transition cursor-pointer">Gallery</button>
                    <button type="button" title="Insert Data Table" onClick={() => insertTextAtCursor('\n| Column 1 | Column 2 |\n| --- | --- |\n| Data 1 | Data 2 |\n')} className="px-2 py-1 hover:bg-zinc-800 rounded transition cursor-pointer">Table</button>
                    <button type="button" title="Task Checklist" onClick={() => insertTextAtCursor('\n- [ ] Task item\n')} className="px-2 py-1 hover:bg-zinc-800 rounded transition cursor-pointer">Checklist</button>
                    <button type="button" title="Code Block Snippet" onClick={() => applyFormatting('\n```typescript\n', '\n```\n')} className="px-2 py-1 hover:bg-zinc-800 rounded transition cursor-pointer">Code</button>
                  </div>
                  
                  <div className="text-[11px] text-zinc-500 font-mono shrink-0 pl-2">
                    Words: {wordCount}
                  </div>
                </div>

              </div>

              {/* SECTIONS BELOW TEXT EDITOR */}
              <div className="space-y-4 pt-2 border-t border-zinc-800/80">
                
                {/* 1. Content Category Section with Quote Animation Morale Booster */}
                <div className="bg-[#141414] border border-zinc-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-300">Content Category</label>
                    <button 
                      type="button"
                      onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                      className="text-xs text-[#b5ff42] hover:underline cursor-pointer"
                    >
                      Open Content Categories Collection
                    </button>
                  </div>

                  {/* Active Category Tag */}
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedCategory ? (
                      <div className="bg-[#1a1a1a] border border-zinc-700/80 rounded-xl px-3 py-1.5 flex items-center gap-2.5 text-xs text-white shadow-sm">
                        <span className="w-5 h-5 rounded-full bg-red-950 flex items-center justify-center text-[10px]">🔴</span>
                        <span className="font-semibold">{selectedCategory}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategory('');
                            triggerQuoteAnimation('');
                          }}
                          className="w-4 h-4 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center text-[10px] transition cursor-pointer"
                          title="Remove category"
                        >
                          ✕
                        </button>
                        <button
                          type="button"
                          onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                          className="text-zinc-400 hover:text-white text-xs cursor-pointer ml-1"
                        >
                          ⌄
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                        className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2 text-xs text-zinc-400 hover:text-white transition cursor-pointer"
                      >
                        + Select Category
                      </button>
                    )}
                  </div>

                  {/* MORALE BOOSTER QUOTE ANIMATION CONTAINER */}
                  <div className="bg-gradient-to-r from-[#182010] via-[#141414] to-[#141414] border border-[#b5ff42]/30 rounded-xl p-3.5 relative overflow-hidden shadow-lg">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#b5ff42]"></div>
                    <div className={`transition-all duration-700 transform ${animateQuote ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-98'}`}>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#b5ff42] uppercase tracking-wider mb-1">
                        <span>✨ Writer's Inspiration Boost</span>
                      </div>
                      <p className="text-xs text-zinc-200 italic font-medium leading-relaxed">
                        "{activeQuote.quote}"
                      </p>
                      <p className="text-[10px] text-zinc-400 mt-1 font-mono text-right">
                        — {activeQuote.author}
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Type of media such as Anime, DC Comics, Marvel Movies, K-Drama, Manga
                  </p>

                  {/* Category Dropdown Picker / Collection Modal Box */}
                  {categoryDropdownOpen && (
                    <div className="bg-[#1a1a1a] border border-zinc-700 rounded-xl p-3 space-y-2 mt-2">
                      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                        <span className="text-xs font-bold text-white">Select Media Category</span>
                        <button 
                          type="button" 
                          onClick={() => setCategoryDropdownOpen(false)}
                          className="text-xs text-zinc-400 hover:text-white cursor-pointer"
                        >
                          Done
                        </button>
                      </div>
                      <input 
                        type="text" 
                        placeholder="Search categories..."
                        value={categorySearchQuery}
                        onChange={(e) => setCategorySearchQuery(e.target.value)}
                        className="w-full bg-[#121212] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#b5ff42]"
                      />
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {filteredCategories.map((cat) => (
                          <div
                            key={cat.name}
                            onClick={() => {
                              setSelectedCategory(cat.name);
                              setCategoryDropdownOpen(false);
                              triggerQuoteAnimation(cat.name);
                            }}
                            className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition ${selectedCategory === cat.name ? 'bg-[#b5ff42]/15 text-[#b5ff42] border border-[#b5ff42]/30 font-semibold' : 'hover:bg-zinc-800 text-zinc-300'}`}
                          >
                            <span className="flex items-center gap-2">
                              <span>{cat.icon}</span> {cat.name}
                            </span>
                            <span className="text-[10px] text-zinc-500">{cat.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Featured Image Upload Box */}
                <div className="space-y-3 bg-[#141414] border border-zinc-800 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-300">Featured Image</label>
                    {uploadedUrl && (
                      <span className="text-[11px] font-semibold text-[#b5ff42]">✓ Uploaded</span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      className="flex-1 text-xs text-zinc-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer"
                    />

                    {imageFile && !uploadedUrl && (
                      <button
                        type="button"
                        onClick={handleUploadClick}
                        disabled={isUploading}
                        className="px-4 py-1.5 rounded-lg bg-[#b5ff42] text-black text-xs font-bold hover:bg-[#9ee032] disabled:opacity-50 transition cursor-pointer"
                      >
                        {isUploading ? 'Uploading...' : 'Upload'}
                      </button>
                    )}
                  </div>
                  
                  {imagePreview && (
                    <div className="mt-2 relative w-full max-w-md h-44 rounded-lg overflow-hidden border border-zinc-800">
                      <img src={imagePreview} alt="Featured preview" className="object-cover w-full h-full" />
                    </div>
                  )}

                  <p className="text-[11px] text-zinc-400">Main image for the item</p>
                </div>

                {/* 3. Image Credit Section */}
                <div className="bg-[#141414] border border-zinc-800 rounded-2xl p-4 space-y-2">
                  <label className="text-xs font-bold text-zinc-300">Image Credit</label>
                  <input
                    type="text"
                    value={imageCredit}
                    onChange={(e) => setImageCredit(e.target.value)}
                    placeholder="Image Credit: Marvel Studios / Sony Pictures"
                    className="w-full bg-[#121212] border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#b5ff42] transition"
                  />
                </div>

              </div>

            </div>

            {/* Submission Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 shrink-0">
              <button
                type="submit"
                name="status"
                value="draft"
                className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold px-4 py-2 rounded-xl text-xs transition border border-zinc-800 cursor-pointer"
              >
                Save as Draft
              </button>

              <button
                type="submit"
                name="status"
                value="published"
                className="bg-[#b5ff42] hover:opacity-90 text-black font-black px-5 py-2 rounded-xl text-xs uppercase tracking-wider transition shadow-[0_0_15px_rgba(181,255,66,0.3)] cursor-pointer"
              >
                Publish Draft for Review
              </button>
            </div>

          </form>
        )}
      </main>

      {/* Right Metadata Panel */}
      <aside className="w-full lg:w-64 bg-[#0e0e0e] border-l border-zinc-900/80 p-4 space-y-4 shrink-0 overflow-y-auto hidden xl:block">
        <div className="bg-[#141414] border border-zinc-800/80 rounded-2xl p-3.5 space-y-2">
          <h4 className="text-[10px] font-black tracking-widest text-[#b5ff42] uppercase">Popular Submissions</h4>
          <ul className="space-y-1.5 text-xs text-zinc-400">
            <li className="hover:text-white transition cursor-pointer truncate">1. Secret Wars Easter Eggs Breakdown</li>
            <li className="hover:text-white transition cursor-pointer truncate">2. Why Eren Yeager's Arc Defined Shonen</li>
            <li className="hover:text-white transition cursor-pointer truncate">3. Superman Legacy Timeline Analysis</li>
          </ul>
        </div>
      </aside>

    </div>
  );
}