// src/app/write-for-us/page.tsx
'use client';

import React, { useState, useRef } from 'react';

const categoryQuotes: Record<string, string> = {
  Marvel: "I can do this all day. — Steve Rogers",
  "DC Comics": "Why do we fall, Bruce? So we can learn to pick ourselves up. — Thomas Wayne",
  Anime: "If you don't take risks, you can't create a future! — Monkey D. Luffy",
  "Movies/Series": "May the Force be with you. — Star Wars",
  "K-Drama": "It's okay not to be okay. — Ko Moon-young",
};

export default function WriteForUsPage() {
  const [category, setCategory] = useState('Marvel');
  const [title, setTitle] = useState('');
  const [contentBlocks, setContentBlocks] = useState<
    Array<{ type: 'paragraph' | 'quote'; text: string; color: string; imageFile?: File | null; imagePreview?: string; imageCredit?: string }>
  >([
    { type: 'paragraph', text: '', color: '#d4d4d8' },
  ]);

  const [submitted, setSubmitted] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const editableRefs = useRef<Array<HTMLDivElement | null>>([]);

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
  };

  const handleBlockColorChange = (index: number, color: string) => {
    const updated = [...contentBlocks];
    updated[index].color = color;
    setContentBlocks(updated);
  };

  const handleInputHTMLChange = (index: number, e: React.FormEvent<HTMLDivElement>) => {
    const html = e.currentTarget.innerHTML;
    const updated = [...contentBlocks];
    updated[index].text = html;
    setContentBlocks(updated);
  };

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const updated = [...contentBlocks];
      updated[index].imageFile = file;
      updated[index].imagePreview = URL.createObjectURL(file);
      setContentBlocks(updated);
    }
  };

  const handleImageCreditChange = (index: number, credit: string) => {
    const updated = [...contentBlocks];
    updated[index].imageCredit = credit;
    setContentBlocks(updated);
  };

  const addBlock = (type: 'paragraph' | 'quote') => {
    setContentBlocks([...contentBlocks, { type, text: '', color: '#d4d4d8' }]);
  };

  const removeBlock = (index: number) => {
    setContentBlocks(contentBlocks.filter((_, i) => i !== index));
  };

  const applyInlineFormatting = (index: number, command: 'bold' | 'italic' | 'underline' | 'header' | 'para' | 'quote' | 'link') => {
    const editorEl = editableRefs.current[index];
    if (!editorEl) return;
    editorEl.focus();

    if (command === 'header' || command === 'para' || command === 'quote') {
      const updated = [...contentBlocks];
      if (command === 'header') {
        const isHeader = editorEl.style.fontSize === '1.25rem';
        editorEl.style.fontSize = isHeader ? '' : '1.25rem';
        editorEl.style.fontWeight = isHeader ? '' : 'bold';
      } else if (command === 'quote') {
        const isAlreadyQuote = updated[index].type === 'quote';
        updated[index].type = isAlreadyQuote ? 'paragraph' : 'quote';
      } else if (command === 'para') {
        updated[index].type = 'paragraph';
        editorEl.style.fontSize = '';
        editorEl.style.fontWeight = '';
      }
      setContentBlocks(updated);
      return;
    }

    if (command === 'link') {
      const url = prompt("Enter the URL:", "https://");
      if (url) document.execCommand('createLink', false, url);
    } else {
      document.execCommand(command, false);
    }

    const updated = [...contentBlocks];
    updated[index].text = editorEl.innerHTML;
    setContentBlocks(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
      
      {/* DYNAMIC CATEGORY INSPIRATION QUOTE BANNER */}
      <div className="bg-[#12151c] border border-zinc-800/80 p-4 rounded-2xl flex items-center justify-between gap-4">
        <div className="text-xs text-zinc-300 italic">
          💬 &ldquo;{categoryQuotes[category] || 'Create magic!'}&rdquo;
        </div>
        <span className="text-[10px] bg-zinc-800 text-[#b5ff42] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider shrink-0">
          {category} Theme
        </span>
      </div>

      {submitted ? (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-10 rounded-2xl text-center space-y-3">
          <div className="text-4xl">🚀✨</div>
          <h3 className="text-white font-bold text-lg">Draft Published & Deployed!</h3>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-[#b5ff42] text-black font-bold text-xs uppercase px-6 py-3 rounded-xl hover:bg-white transition cursor-pointer"
          >
            Create New Article
          </button>
        </div>
      ) : previewMode ? (
        <div className="bg-black border border-zinc-800 p-8 rounded-2xl space-y-6 text-white shadow-2xl">
          <h1 className="text-3xl font-black">{title || 'Untitled Article Title'}</h1>
          <div className="space-y-4">
            {contentBlocks.map((block, i) => (
              <div key={i} className="space-y-2">
                {block.imagePreview && (
                  <div className="space-y-1">
                    <img src={block.imagePreview} alt="Upload Preview" className="w-full max-h-96 object-cover rounded-xl" />
                    {block.imageCredit && <p className="text-[10px] text-zinc-500">Source: {block.imageCredit}</p>}
                  </div>
                )}
                {block.type === 'quote' ? (
                  <blockquote className="border-l-4 border-[#b5ff42] pl-4 italic text-zinc-300" style={{ color: block.color }} dangerouslySetInnerHTML={{ __html: block.text }} />
                ) : (
                  <div style={{ color: block.color }} dangerouslySetInnerHTML={{ __html: block.text }} />
                )}
              </div>
            ))}
          </div>
          <button onClick={() => setPreviewMode(false)} className="text-zinc-400 underline text-xs cursor-pointer">
            Back to Editor
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-[#12151c] border border-zinc-800/80 p-6 rounded-2xl space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-white font-bold text-sm">Write For Us Editor</h2>
            <button
              type="button"
              onClick={() => setPreviewMode(true)}
              className="text-xs text-[#b5ff42] border border-[#b5ff42]/30 px-3 py-1.5 rounded-lg hover:bg-[#b5ff42]/10 transition cursor-pointer"
            >
              Preview Article
            </button>
          </div>

          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-3 text-xs text-white"
          >
            <option value="Marvel">Marvel</option>
            <option value="DC Comics">DC Comics</option>
            <option value="Anime">Anime</option>
            <option value="Movies/Series">Movies/Series</option>
            <option value="K-Drama">K-Drama</option>
          </select>

          <input
            required
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter article title..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white"
          />

          {contentBlocks.map((block, index) => (
            <div key={index} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-900 pb-2">
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => applyInlineFormatting(index, 'bold')} className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 rounded text-xs font-bold text-zinc-300">B</button>
                  <button type="button" onClick={() => applyInlineFormatting(index, 'italic')} className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 rounded text-xs italic text-zinc-300">I</button>
                  <button type="button" onClick={() => applyInlineFormatting(index, 'underline')} className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 rounded text-xs underline text-zinc-300">U</button>
                  <button type="button" onClick={() => applyInlineFormatting(index, 'header')} className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 rounded text-xs font-bold text-zinc-300">H</button>
                  <button type="button" onClick={() => applyInlineFormatting(index, 'quote')} className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 rounded text-xs text-zinc-300">&ldquo;&rdquo;</button>
                  <button type="button" onClick={() => applyInlineFormatting(index, 'link')} className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 rounded text-xs text-zinc-300">🔗</button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={block.color}
                    onChange={(e) => handleBlockColorChange(index, e.target.value)}
                    className="w-6 h-6 bg-transparent cursor-pointer rounded border-0"
                    title="Text Color"
                  />
                  {contentBlocks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBlock(index)}
                      className="text-red-400 hover:text-red-300 text-xs px-2 py-1"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div
                ref={(el) => { editableRefs.current[index] = el; }}
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => handleInputHTMLChange(index, e)}
                style={{ color: block.color }}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs min-h-[90px] outline-none"
              />

              <div className="space-y-2 pt-2 border-t border-zinc-900">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(index, e)}
                  className="text-[11px] text-zinc-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-[#b5ff42] hover:file:bg-zinc-700 cursor-pointer"
                />
                {block.imagePreview && (
                  <div className="relative mt-2">
                    <img src={block.imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg border border-zinc-800" />
                    <input
                      type="text"
                      placeholder="Image source or credit link..."
                      value={block.imageCredit || ''}
                      onChange={(e) => handleImageCreditChange(index, e.target.value)}
                      className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => addBlock('paragraph')}
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
            >
              + Add Paragraph Block
            </button>
            <button
              type="button"
              onClick={() => addBlock('quote')}
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
            >
              + Add Quote Block
            </button>
          </div>

          <button type="submit" className="w-full bg-[#b5ff42] text-black font-bold text-xs py-3 rounded-xl hover:opacity-90 transition cursor-pointer">
            Publish Draft
          </button>
        </form>
      )}
    </div>
  );
}