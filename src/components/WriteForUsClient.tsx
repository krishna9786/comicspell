// src/components/WriteForUsClient.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';

interface WriteForUsPortalProps {
  initialPost?: any;
  onSubmitAction?: (formData: FormData) => Promise<void>;
}

type CustomBulletEmoji = '❤️' | '💀' | '🦇' | '★';

const ENDING_TAG = '#behappy ✌️';

function hasEndingTag(htmlOrText: string): boolean {
  const plain = htmlOrText
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .trim();
  return /#behappy\s*✌️\s*$/i.test(plain);
}

function appendEndingHtmlOnce(html: string): string {
  const cleaned = html.trimEnd();
  const endingBlock = `<p data-ending-tag="true" style="color:#b5ff42;font-weight:700;margin-top:1.5rem;">${ENDING_TAG}</p>`;
  if (!cleaned) {
    return endingBlock;
  }
  if (hasEndingTag(cleaned)) {
    return cleaned;
  }
  return `${cleaned}${endingBlock}`;
}

function stripEndingTagFromEditorHtml(html: string): string {
  return html
    .replace(/<p[^>]*data-ending-tag="true"[\s\S]*?<\/p>/gi, '')
    .replace(/<p[^>]*>\s*#behappy\s*✌️\s*<\/p>/gi, '')
    .trim();
}

export function getEmbedVideoUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  );
  if (ytMatch?.[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }

  const vimeoMatch = trimmed.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch?.[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return null;
}

function placeCaretAtEnd(el: HTMLElement) {
  const sel = window.getSelection();
  if (!sel) return;
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
}

export default function WriteForUsPortal({ initialPost, onSubmitAction }: WriteForUsPortalProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const collageInputRef = useRef<HTMLInputElement | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);

  const seedContent = initialPost?.content || '';

  const initialHtml = (() => {
    const raw = /<[a-z][\s\S]*>/i.test(seedContent)
      ? seedContent
      : seedContent
          .split(/\n{2,}/)
          .map((block) => block.trim())
          .filter(Boolean)
          .map((block) => `<p>${block.replace(/\n/g, '<br />')}</p>`)
          .join('');
    return stripEndingTagFromEditorHtml(raw);
  })();

  const [postTitle, setPostTitle] = useState<string>(initialPost?.title || '');
  const [postContent, setPostContent] = useState<string>(initialHtml);
  const [wordCount, setWordCount] = useState<number>(() => {
    const plain = seedContent.replace(/<[^>]+>/g, ' ').trim();
    return plain ? plain.split(/\s+/).length : 0;
  });
  const [selectedCategory, setSelectedCategory] = useState<string>(initialPost?.category || 'Marvel');
  const [imageCredit, setImageCredit] = useState<string>(
    initialPost?.image_credit || 'Image Credit: Marvel Studios / Sony Pictures'
  );

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialPost?.image_url || '');
  const [uploadedUrl, setUploadedUrl] = useState<string>(initialPost?.image_url || '');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Trailer / Video link
  const [videoUrl, setVideoUrl] = useState<string>(initialPost?.video_url || '');
  const [showVideoInput, setShowVideoInput] = useState<boolean>(Boolean(initialPost?.video_url));

  // Collage images (up to 7)
  const [collageImages, setCollageImages] = useState<string[]>([]);
  const [isUploadingCollage, setIsUploadingCollage] = useState<boolean>(false);

  // Link insertion state ("Link - reddit")
  const [showLinkBox, setShowLinkBox] = useState<boolean>(false);
  const [linkUrlInput, setLinkUrlInput] = useState<string>('https://');
  const [linkLabel, setLinkLabel] = useState<string>('reddit');

  // Table builder state
  const [showTableBar, setShowTableBar] = useState<boolean>(false);
  const [tableRows, setTableRows] = useState<number>(3);
  const [tableCols, setTableCols] = useState<number>(3);
  const [hasTableHeader, setHasTableHeader] = useState<boolean>(true);

  // Dropdown menus
  const [styleMenuOpen, setStyleMenuOpen] = useState<boolean>(false);
  const [bulletMenuOpen, setBulletMenuOpen] = useState<boolean>(false);
  const [customBulletPickerOpen, setCustomBulletPickerOpen] = useState<boolean>(false);
  const [insertMenuOpen, setInsertMenuOpen] = useState<boolean>(false);

  const [activeTool, setActiveTool] = useState<string>('text');
  const [activeCustomEmoji, setActiveCustomEmoji] = useState<CustomBulletEmoji>('❤️');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState<boolean>(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState<string>('');

  const [activeQuote, setActiveQuote] = useState({
    quote:
      'With great power comes great responsibility, and with great writing comes the power to shape universes.',
    author: 'Stan Lee',
  });
  const [animateQuote, setAnimateQuote] = useState<boolean>(false);

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isEditorExpanded, setIsEditorExpanded] = useState<boolean>(false);

  const categoryQuotes: Record<string, { quote: string; author: string }> = {
    Marvel: {
      quote: "That is America's ass—and this is your universe to write. Make every panel legendary.",
      author: 'MCU Editorial',
    },
    'DC Comics': {
      quote:
        "It's not who you are underneath, but what you do that defines you. Write your masterpiece.",
      author: 'Batman Begins',
    },
    'Anime & Manga': {
      quote:
        "If you don't take risks, you can't create a future! Push your storytelling beyond its limits.",
      author: 'Monkey D. Luffy',
    },
    'Movies / Series': {
      quote:
        'Great movies and stories are legends that keep walking in our hearts. Tell yours brilliantly.',
      author: 'Cinema Lore',
    },
    'K-Drama': {
      quote:
        'Every heart-wrenching twist and emotional peak starts with a single passionate sentence.',
      author: 'K-Drama Scriptwriter',
    },
  };

  const availableCategories = [
    { name: 'Marvel', icon: '🔴', desc: 'Marvel Cinematic Universe & Comics' },
    { name: 'DC Comics', icon: '🔵', desc: 'DC Extended Universe & Graphic Novels' },
    { name: 'Anime & Manga', icon: '⚡', desc: 'Japanese Animation & Serialization' },
    { name: 'Movies / Series', icon: '🎬', desc: 'General Cinema & Television' },
    { name: 'K-Drama', icon: '☕', desc: 'Korean Drama Series & Specials' },
  ];

  const filteredCategories = availableCategories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(categorySearchQuery.toLowerCase()) ||
      cat.desc.toLowerCase().includes(categorySearchQuery.toLowerCase())
  );

  const closeAllDropdowns = () => {
    setStyleMenuOpen(false);
    setBulletMenuOpen(false);
    setCustomBulletPickerOpen(false);
    setInsertMenuOpen(false);
  };

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== initialHtml) {
      editorRef.current.innerHTML = initialHtml;
    }
  }, [initialHtml]);

  useEffect(() => {
    const handleOutsideMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (toolbarRef.current && !toolbarRef.current.contains(target)) {
        closeAllDropdowns();
      }
    };
    document.addEventListener('mousedown', handleOutsideMouseDown);
    return () => document.removeEventListener('mousedown', handleOutsideMouseDown);
  }, []);

  const triggerQuoteAnimation = (catName: string) => {
    setAnimateQuote(false);
    if (categoryQuotes[catName]) {
      setActiveQuote(categoryQuotes[catName]);
    } else {
      setActiveQuote({
        quote: 'Every great story starts with a writer who believed in the impossible.',
        author: 'Comicspell Creators',
      });
    }
    setTimeout(() => {
      setAnimateQuote(true);
    }, 50);
  };

  useEffect(() => {
    triggerQuoteAnimation(selectedCategory || 'Marvel');
  }, [selectedCategory]);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    const range = savedRangeRef.current;
    if (!range) return;
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const syncEditorState = () => {
    if (!editorRef.current) return;
    const html = stripEndingTagFromEditorHtml(editorRef.current.innerHTML);
    const plain = (editorRef.current.innerText || '').trim();
    setPostContent(html);
    setWordCount(plain ? plain.split(/\s+/).length : 0);
  };

  const getClosestBlockElement = (): HTMLElement | null => {
    const sel = window.getSelection();
    const node = sel && sel.rangeCount > 0 ? sel.anchorNode : savedRangeRef.current?.startContainer;
    if (!node || !editorRef.current) return null;
    const baseEl = node.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node.parentElement;
    if (!baseEl || !editorRef.current.contains(baseEl)) return null;
    return baseEl.closest('p, h1, h2, h3, h4, blockquote, div, li') as HTMLElement | null;
  };

  const getCurrentCustomBulletLi = (): HTMLLIElement | null => {
    const sel = window.getSelection();
    const node = sel && sel.rangeCount > 0 ? sel.anchorNode : null;
    if (!node || !editorRef.current) return null;
    const baseEl = node.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node.parentElement;
    if (!baseEl || !editorRef.current.contains(baseEl)) return null;
    const li = baseEl.closest('li') as HTMLLIElement | null;
    if (!li) return null;
    const ul = li.parentElement;
    if (ul && ul.getAttribute('data-custom-bullet') === 'true') {
      return li;
    }
    return null;
  };

  const applyHeadingOrText = (mode: 'heading' | 'text') => {
    setActiveTool(mode);
    closeAllDropdowns();
    editorRef.current?.focus();
    restoreSelection();

    const sel = window.getSelection();
    const block = getClosestBlockElement();

    if (sel && sel.rangeCount > 0 && !sel.isCollapsed && block && block !== editorRef.current) {
      const range = sel.getRangeAt(0);
      const selectedText = range.toString().trim();
      if (selectedText && selectedText !== block.textContent?.trim()) {
        const replacement = document.createElement(mode === 'heading' ? 'h2' : 'p');
        replacement.textContent = selectedText;
        range.deleteContents();
        range.insertNode(replacement);
        saveSelection();
        syncEditorState();
        return;
      }
    }

    document.execCommand('formatBlock', false, mode === 'heading' ? 'H2' : 'P');
    saveSelection();
    syncEditorState();
  };

  const applyInlineCommand = (command: 'bold' | 'italic' | 'underline', toolName: string) => {
    setActiveTool(toolName);
    closeAllDropdowns();
    editorRef.current?.focus();
    restoreSelection();
    document.execCommand(command, false);
    saveSelection();
    syncEditorState();
  };

  const applyAlignment = (align: 'left' | 'center' | 'right') => {
    setActiveTool(`align-${align}`);
    closeAllDropdowns();
    editorRef.current?.focus();
    restoreSelection();

    const block = getClosestBlockElement();
    if (block && block !== editorRef.current) {
      block.style.textAlign = align;
    } else {
      document.execCommand(
        align === 'center' ? 'justifyCenter' : align === 'right' ? 'justifyRight' : 'justifyLeft',
        false
      );
    }

    saveSelection();
    syncEditorState();
  };

  const applyBulletStyle = (
    styleType: 'disc' | 'decimal' | 'sub' | 'alpha',
    customEmoji?: CustomBulletEmoji
  ) => {
    setActiveTool(`list-${styleType}`);
    closeAllDropdowns();
    editorRef.current?.focus();
    restoreSelection();

    const sel = window.getSelection();
    const selectedText = sel && !sel.isCollapsed ? sel.toString().trim() : '';

    if (styleType === 'sub') {
      const chosenEmoji = customEmoji || activeCustomEmoji;
      setActiveCustomEmoji(chosenEmoji);

      const listEl = document.createElement('ul');
      listEl.setAttribute('data-custom-bullet', 'true');
      listEl.setAttribute('data-bullet-emoji', chosenEmoji);
      listEl.style.listStyleType = 'none';
      listEl.style.marginLeft = '1rem';
      listEl.style.paddingLeft = '0.25rem';
      listEl.style.marginTop = '0.75rem';
      listEl.style.marginBottom = '0.75rem';

      const lines = selectedText
        ? selectedText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
        : [''];

      let lastLi: HTMLLIElement | null = null;
      lines.forEach((lineText) => {
        const li = document.createElement('li');
        li.style.marginBottom = '0.35rem';
        li.textContent = lineText ? `${chosenEmoji} ${lineText}` : `${chosenEmoji} `;
        listEl.appendChild(li);
        lastLi = li;
      });

      if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        range.insertNode(listEl);

        const afterP = document.createElement('p');
        afterP.innerHTML = '<br />';
        listEl.after(afterP);
      } else if (editorRef.current) {
        editorRef.current.appendChild(listEl);
      }

      if (lastLi) {
        placeCaretAtEnd(lastLi);
      }

      saveSelection();
      syncEditorState();
      return;
    }

    const items = selectedText
      ? selectedText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
      : [''];

    const isOrdered = styleType === 'decimal' || styleType === 'alpha';
    const listEl = document.createElement(isOrdered ? 'ol' : 'ul');

    if (styleType === 'decimal') {
      listEl.style.listStyleType = 'decimal';
    } else if (styleType === 'alpha') {
      listEl.style.listStyleType = 'lower-alpha';
    } else {
      listEl.style.listStyleType = 'disc';
    }

    listEl.style.paddingLeft = '1.5rem';
    listEl.style.margin = '0.75rem 0';

    let lastLi: HTMLLIElement | null = null;
    items.forEach((itemText) => {
      const li = document.createElement('li');
      li.style.marginBottom = '0.35rem';
      li.textContent = itemText;
      listEl.appendChild(li);
      lastLi = li;
    });

    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(listEl);

      const afterP = document.createElement('p');
      afterP.innerHTML = '<br />';
      listEl.after(afterP);
    } else if (editorRef.current) {
      editorRef.current.appendChild(listEl);
    }

    if (lastLi) {
      placeCaretAtEnd(lastLi);
    }

    saveSelection();
    syncEditorState();
  };

  const applyNeonQuoteBlock = () => {
    setActiveTool('quote');
    closeAllDropdowns();
    editorRef.current?.focus();
    restoreSelection();

    const sel = window.getSelection();
    const selectedText =
      sel && !sel.isCollapsed
        ? sel.toString().trim()
        : '“Hard work is worthless for those that don’t believe in themselves.” — Naruto Uzumaki';

    const quoteBox = document.createElement('div');
    quoteBox.setAttribute('data-neon-quote', 'true');
    quoteBox.style.borderLeft = '4px solid #b5ff42';
    quoteBox.style.borderRight = '4px solid #b5ff42';
    quoteBox.style.background =
      'linear-gradient(90deg, rgba(181,255,66,0.08), rgba(20,20,20,0.95), rgba(181,255,66,0.08))';
    quoteBox.style.padding = '1rem 1.25rem';
    quoteBox.style.margin = '1.25rem 0';
    quoteBox.style.borderRadius = '0.75rem';
    quoteBox.style.color = '#f4f4f5';
    quoteBox.style.fontStyle = 'italic';
    quoteBox.style.fontWeight = '600';
    quoteBox.textContent = selectedText;

    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(quoteBox);

      const afterP = document.createElement('p');
      afterP.innerHTML = '<br />';
      quoteBox.after(afterP);
    } else if (editorRef.current) {
      editorRef.current.appendChild(quoteBox);
    }

    saveSelection();
    syncEditorState();
  };

  const applySpoilerWarningBlock = () => {
    setActiveTool('spoiler');
    closeAllDropdowns();
    editorRef.current?.focus();
    restoreSelection();

    const sel = window.getSelection();
    const spoilerText =
      sel && !sel.isCollapsed
        ? sel.toString().trim()
        : 'Major plot details from the latest episode/chapter follow below. Proceed at your own risk!';

    const spoilerBox = document.createElement('div');
    spoilerBox.setAttribute('data-spoiler-box', 'true');
    spoilerBox.style.border = '1px solid rgba(251, 146, 60, 0.45)';
    spoilerBox.style.borderLeft = '4px solid #fb923c';
    spoilerBox.style.background = 'rgba(251, 146, 60, 0.08)';
    spoilerBox.style.padding = '0.9rem 1.15rem';
    spoilerBox.style.margin = '1.25rem 0';
    spoilerBox.style.borderRadius = '0.75rem';

    const headerDiv = document.createElement('div');
    headerDiv.style.color = '#fb923c';
    headerDiv.style.fontSize = '0.75rem';
    headerDiv.style.fontWeight = '800';
    headerDiv.style.letterSpacing = '0.08em';
    headerDiv.style.textTransform = 'uppercase';
    headerDiv.style.marginBottom = '0.35rem';
    headerDiv.textContent = '⚠️ SPOILER WARNING';

    const bodyDiv = document.createElement('div');
    bodyDiv.style.color = '#e4e4e7';
    bodyDiv.style.fontSize = '0.875rem';
    bodyDiv.textContent = spoilerText;

    spoilerBox.appendChild(headerDiv);
    spoilerBox.appendChild(bodyDiv);

    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(spoilerBox);

      const afterP = document.createElement('p');
      afterP.innerHTML = '<br />';
      spoilerBox.after(afterP);
    } else if (editorRef.current) {
      editorRef.current.appendChild(spoilerBox);
    }

    saveSelection();
    syncEditorState();
  };

  const openLinkModalForSelection = () => {
    setActiveTool('link');
    closeAllDropdowns();
    saveSelection();
    const sel = window.getSelection();
    const selected = sel && !sel.isCollapsed ? sel.toString().trim() : '';
    setLinkLabel(selected || 'reddit');
    setLinkUrlInput('https://');
    setShowLinkBox(true);
  };

  const confirmLinkInsert = () => {
    const cleanUrl = linkUrlInput.trim();
    const labelText = linkLabel.trim() || 'reddit';
    if (!cleanUrl || cleanUrl === 'https://') {
      setShowLinkBox(false);
      return;
    }

    const formattedUrl = /^https?:\/\//i.test(cleanUrl) ? cleanUrl : `https://${cleanUrl}`;
    setShowLinkBox(false);
    editorRef.current?.focus();
    restoreSelection();

    const container = document.createElement('span');

    const prefixSpan = document.createElement('span');
    prefixSpan.style.color = '#ffffff';
    prefixSpan.style.fontStyle = 'normal';
    prefixSpan.textContent = 'Link - ';

    const anchor = document.createElement('a');
    anchor.href = formattedUrl;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.style.color = '#fb923c';
    anchor.style.fontStyle = 'italic';
    anchor.style.textDecoration = 'underline';
    anchor.style.fontWeight = '600';
    anchor.textContent = labelText;

    container.appendChild(prefixSpan);
    container.appendChild(anchor);

    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(container);

      const afterSpace = document.createTextNode(' ');
      container.after(afterSpace);
      range.setStartAfter(afterSpace);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (editorRef.current) {
      editorRef.current.appendChild(container);
    }

    saveSelection();
    syncEditorState();
  };

  const insertTableAtCursor = () => {
    const rows = Math.max(1, Math.min(12, tableRows));
    const cols = Math.max(1, Math.min(8, tableCols));

    const table = document.createElement('table');
    table.className =
      'my-4 w-full border-collapse border border-zinc-700 text-xs text-zinc-200 bg-[#141414] rounded-xl overflow-hidden';

    let startRowIdx = 0;

    if (hasTableHeader) {
      const thead = document.createElement('thead');
      const tr = document.createElement('tr');
      tr.className = 'bg-[#1f2912] text-[#b5ff42] font-bold';
      for (let c = 0; c < cols; c++) {
        const th = document.createElement('th');
        th.className = 'border border-zinc-700 px-3 py-2 text-left font-bold';
        th.textContent = `Header ${c + 1}`;
        tr.appendChild(th);
      }
      thead.appendChild(tr);
      table.appendChild(thead);
      startRowIdx = 1;
    }

    const tbody = document.createElement('tbody');
    for (let r = startRowIdx; r < rows; r++) {
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-zinc-900/70 transition';
      for (let c = 0; c < cols; c++) {
        const td = document.createElement('td');
        td.className = 'border border-zinc-800 px-3 py-2 text-zinc-200';
        td.textContent = `Row ${r + 1}, Col ${c + 1}`;
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);

    setActiveTool('table');
    setShowTableBar(false);
    closeAllDropdowns();
    editorRef.current?.focus();
    restoreSelection();

    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(table);

      const trailingP = document.createElement('p');
      trailingP.innerHTML = '<br />';
      table.after(trailingP);

      const nextRange = document.createRange();
      nextRange.setStart(trailingP, 0);
      nextRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(nextRange);
    } else if (editorRef.current) {
      editorRef.current.appendChild(table);
      const trailingP = document.createElement('p');
      trailingP.innerHTML = '<br />';
      editorRef.current.appendChild(trailingP);
    }

    saveSelection();
    syncEditorState();
  };

  const getActiveTable = (): HTMLTableElement | null => {
    const sel = window.getSelection();
    const anchor = sel && sel.rangeCount > 0 ? sel.anchorNode : savedRangeRef.current?.startContainer;
    if (!anchor) return null;
    const el = anchor.nodeType === Node.ELEMENT_NODE ? (anchor as Element) : anchor.parentElement;
    return el ? el.closest('table') : null;
  };

  const addTableRow = () => {
    const table = getActiveTable() || editorRef.current?.querySelector('table');
    if (!table) return;

    const colCount = table.rows[0]?.cells.length || Math.max(1, tableCols);
    const tbody = table.tBodies[0] || table.createTBody();
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-zinc-900/70 transition';

    for (let c = 0; c < colCount; c++) {
      const td = document.createElement('td');
      td.className = 'border border-zinc-800 px-3 py-2 text-zinc-200';
      td.textContent = `Cell ${c + 1}`;
      tr.appendChild(td);
    }

    tbody.appendChild(tr);
    syncEditorState();
  };

  const addTableColumn = () => {
    const table = getActiveTable() || editorRef.current?.querySelector('table');
    if (!table) return;

    Array.from(table.rows).forEach((row, rIdx) => {
      const isHeaderRow = row.parentElement?.tagName === 'THEAD';
      const cell = document.createElement(isHeaderRow ? 'th' : 'td');
      cell.className = isHeaderRow
        ? 'border border-zinc-700 px-3 py-2 text-left font-bold'
        : 'border border-zinc-800 px-3 py-2 text-zinc-200';
      cell.textContent = isHeaderRow
        ? `Header ${row.cells.length + 1}`
        : `Row ${rIdx + 1}, Col ${row.cells.length + 1}`;
      row.appendChild(cell);
    });

    syncEditorState();
  };

  const deleteLastTableRow = () => {
    const table = getActiveTable() || editorRef.current?.querySelector('table');
    if (!table || !table.tBodies[0] || table.tBodies[0].rows.length === 0) return;
    table.tBodies[0].deleteRow(table.tBodies[0].rows.length - 1);
    syncEditorState();
  };

  const deleteLastTableColumn = () => {
    const table = getActiveTable() || editorRef.current?.querySelector('table');
    if (!table) return;
    Array.from(table.rows).forEach((row) => {
      if (row.cells.length > 1) {
        row.deleteCell(row.cells.length - 1);
      }
    });
    syncEditorState();
  };

  const uploadSingleFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();

    if (data.success && data.url) {
      return data.url;
    }
    alert(data.error || 'Upload failed');
    return null;
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    try {
      const url = await uploadSingleFile(file);
      if (url) {
        setUploadedUrl(url);
        setImagePreview(url);
        return url;
      }
      return null;
    } catch (err) {
      console.error(err);
      alert('Error uploading image');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const localUrl = URL.createObjectURL(file);
      setImagePreview(localUrl);
      setUploadedUrl('');
      await uploadFile(file);
    }
  };

  const handleUploadClick = async () => {
    if (!imageFile) return;
    const url = await uploadFile(imageFile);
    if (url) {
      alert('Image uploaded and attached!');
    }
  };

  const handleCollageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setActiveTool('image');
    closeAllDropdowns();
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remaining = 7 - collageImages.length;
    if (remaining <= 0) {
      alert('You can add up to 7 images in a collage.');
      e.target.value = '';
      return;
    }

    const selectedFiles = files.slice(0, remaining);
    setIsUploadingCollage(true);
    try {
      const added: string[] = [];
      for (const file of selectedFiles) {
        const uploaded = await uploadSingleFile(file);
        added.push(uploaded || URL.createObjectURL(file));
      }
      setCollageImages((prev) => [...prev, ...added]);
    } finally {
      setIsUploadingCollage(false);
      e.target.value = '';
    }
  };

  const removeCollageImage = (idx: number) => {
    setCollageImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      const customLi = getCurrentCustomBulletLi();
      if (customLi) {
        e.preventDefault();
        const ul = customLi.parentElement as HTMLUListElement;
        const emoji =
          (ul?.getAttribute('data-bullet-emoji') as CustomBulletEmoji) || activeCustomEmoji;
        const rawText = (customLi.textContent || '').replace(/\u00a0/g, ' ').trim();
        const textWithoutEmoji = rawText.replace(
          new RegExp(`^(?:${emoji}|❤️|💀|🦇|★)\\s*`),
          ''
        ).trim();

        // Second Enter on an empty bullet exits the custom bullet list
        if (!textWithoutEmoji) {
          const nextSibling = customLi.nextElementSibling;
          customLi.remove();

          const exitP = document.createElement('p');
          exitP.innerHTML = '<br />';

          if (ul && ul.children.length === 0) {
            ul.replaceWith(exitP);
          } else if (ul) {
            if (nextSibling) {
              ul.parentElement?.insertBefore(exitP, nextSibling);
            } else {
              ul.after(exitP);
            }
          }

          placeCaretAtEnd(exitP);
          saveSelection();
          syncEditorState();
          return;
        }

        const newLi = document.createElement('li');
        newLi.style.marginBottom = '0.35rem';
        newLi.textContent = `${emoji} `;
        customLi.after(newLi);
        placeCaretAtEnd(newLi);
        saveSelection();
        syncEditorState();
        return;
      }
    }

    const mod = e.metaKey || e.ctrlKey;
    if (!mod) return;

    const k = e.key.toLowerCase();
    if (k === 'b') {
      e.preventDefault();
      applyInlineCommand('bold', 'bold');
    } else if (k === 'i') {
      e.preventDefault();
      applyInlineCommand('italic', 'italic');
    } else if (k === 'u') {
      e.preventDefault();
      applyInlineCommand('underline', 'underline');
    } else if (k === 'k') {
      e.preventDefault();
      openLinkModalForSelection();
    }
  };

  const buildFinalHtml = (): string => {
    const currentHtml = stripEndingTagFromEditorHtml(
      editorRef.current ? editorRef.current.innerHTML : postContent
    );
    return appendEndingHtmlOnce(currentHtml);
  };

  const handleOpenFullPreview = () => {
    const finalizedHtml = buildFinalHtml();

    const payload = {
      title: postTitle || 'Untitled Article',
      content: finalizedHtml,
      category: selectedCategory || 'General',
      imageUrl: uploadedUrl || imagePreview || '',
      imageCredit,
      videoUrl,
      collageImages,
      createdAt: new Date().toISOString(),
    };

    const raw = JSON.stringify(payload);
    try {
      sessionStorage.setItem('comicspell_preview_post', raw);
      localStorage.setItem('comicspell_preview_post', raw);
    } catch {
      // ignore storage quota errors
    }

    const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(raw))));
    window.open(`/write-for-us/preview#data=${encoded}`, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!postTitle.trim()) {
      alert('Please enter a post title before submitting.');
      return;
    }

    const finalHtml = buildFinalHtml();
    const plainText = (editorRef.current?.innerText || finalHtml.replace(/<[^>]+>/g, ' ')).trim();

    let finalImageUrl = uploadedUrl || initialPost?.image_url || '';
    if (!finalImageUrl && imageFile) {
      const uploaded = await uploadFile(imageFile);
      if (uploaded) finalImageUrl = uploaded;
    }

    if (onSubmitAction) {
      const formData = new FormData(e.currentTarget);
      if (initialPost?.id) formData.append('postId', String(initialPost.id));
      formData.append('title', postTitle);
      formData.append('content', finalHtml);
      formData.append('short_description', plainText.substring(0, 150));
      formData.append('category', selectedCategory);
      formData.append('image_url', finalImageUrl);
      formData.append('image_credit', imageCredit);
      formData.append('video_url', videoUrl);
      formData.append('collage_images', JSON.stringify(collageImages));

      await onSubmitAction(formData);
    }
  };

  const getCollageLayoutClass = (count: number) => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count === 4) return 'grid-cols-2';
    return 'grid-cols-2 sm:grid-cols-3';
  };

  const embedSrc = getEmbedVideoUrl(videoUrl);

  return (
    <div className="flex-1 flex flex-row overflow-hidden bg-[#0a0a0a]">
      {/* Center / Main Editor Workspace */}
      <main className="flex-1 p-5 lg:p-6 max-w-4xl mx-auto w-full overflow-hidden flex flex-col justify-between">
        {isSubmitted ? (
          <div className="bg-[#141d0c] border border-[#b5ff42] p-8 rounded-2xl text-center space-y-4 my-auto">
            <div className="text-4xl">📤</div>
            <h2 className="text-2xl font-black text-[#b5ff42]">Submitted to Admin Panel for Review</h2>
            <p className="text-sm text-zinc-300 max-w-md mx-auto">
              Your submission has been successfully queued in the admin review database. Once inspected
              for original writing and policy compliance, the editorial team will review it.
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
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Post Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="Add your title here..."
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full bg-[#141414] border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#b5ff42] font-semibold transition"
                />
              </div>

              {/* Editor Box Only */}
              <div
                className={
                  isEditorExpanded
                    ? 'fixed inset-4 z-50 border border-zinc-700 rounded-2xl bg-[#121212] text-white overflow-visible shadow-2xl flex flex-col'
                    : 'border border-zinc-800 rounded-2xl bg-[#121212] text-white overflow-visible shadow-2xl flex flex-col min-h-[360px] flex-1 relative'
                }
              >
                {/* Top Toolbar */}
                <div
                  ref={toolbarRef}
                  className="bg-[#181818] border-b border-zinc-800 px-3 py-2 flex flex-wrap items-center gap-1.5 text-zinc-300 text-xs shrink-0 select-none rounded-t-2xl"
                >
                  {/* Heading / Text Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        saveSelection();
                        setStyleMenuOpen((prev) => !prev);
                        setBulletMenuOpen(false);
                        setCustomBulletPickerOpen(false);
                        setInsertMenuOpen(false);
                      }}
                      className="px-2.5 py-1 rounded text-[11px] font-bold bg-[#222222] text-[#b5ff42] hover:bg-zinc-700 transition cursor-pointer flex items-center gap-1"
                    >
                      <span>{activeTool === 'heading' ? 'Heading' : 'Text'}</span>
                      <span>⌄</span>
                    </button>

                    {styleMenuOpen && (
                      <div className="absolute left-0 mt-1 w-36 bg-[#1b1b1b] border border-zinc-700 rounded-xl shadow-xl py-1 z-30">
                        <button
                          type="button"
                          onClick={() => applyHeadingOrText('heading')}
                          className="w-full text-left px-3 py-1.5 text-xs font-extrabold text-white hover:bg-zinc-800 cursor-pointer"
                        >
                          Heading (H2)
                        </button>
                        <button
                          type="button"
                          onClick={() => applyHeadingOrText('text')}
                          className="w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 cursor-pointer"
                        >
                          Text
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="h-4 w-[1px] bg-zinc-800 mx-0.5" />

                  <button
                    type="button"
                    title="Bold (Ctrl/Cmd + B)"
                    onClick={() => applyInlineCommand('bold', 'bold')}
                    className={`px-2 py-1 rounded font-bold transition cursor-pointer ${
                      activeTool === 'bold' ? 'bg-zinc-700 text-[#b5ff42]' : 'hover:bg-zinc-800'
                    }`}
                  >
                    B
                  </button>

                  <button
                    type="button"
                    title="Italic (Ctrl/Cmd + I)"
                    onClick={() => applyInlineCommand('italic', 'italic')}
                    className={`px-2 py-1 rounded italic transition cursor-pointer ${
                      activeTool === 'italic' ? 'bg-zinc-700 text-[#b5ff42]' : 'hover:bg-zinc-800'
                    }`}
                  >
                    I
                  </button>

                  <button
                    type="button"
                    title="Underline (Ctrl/Cmd + U)"
                    onClick={() => applyInlineCommand('underline', 'underline')}
                    className={`px-2 py-1 rounded underline transition cursor-pointer ${
                      activeTool === 'underline'
                        ? 'bg-zinc-700 text-[#b5ff42]'
                        : 'hover:bg-zinc-800'
                    }`}
                  >
                    U
                  </button>

                  <div className="h-4 w-[1px] bg-zinc-800 mx-0.5" />

                  {/* Left / Center / Right Alignment */}
                  <button
                    type="button"
                    title="Align Left"
                    onClick={() => applyAlignment('left')}
                    className={`px-2 py-1 rounded text-[11px] transition cursor-pointer ${
                      activeTool === 'align-left'
                        ? 'bg-zinc-700 text-[#b5ff42] font-bold'
                        : 'hover:bg-zinc-800'
                    }`}
                  >
                    Left
                  </button>
                  <button
                    type="button"
                    title="Align Center"
                    onClick={() => applyAlignment('center')}
                    className={`px-2 py-1 rounded text-[11px] transition cursor-pointer ${
                      activeTool === 'align-center'
                        ? 'bg-zinc-700 text-[#b5ff42] font-bold'
                        : 'hover:bg-zinc-800'
                    }`}
                  >
                    Center
                  </button>
                  <button
                    type="button"
                    title="Align Right"
                    onClick={() => applyAlignment('right')}
                    className={`px-2 py-1 rounded text-[11px] transition cursor-pointer ${
                      activeTool === 'align-right'
                        ? 'bg-zinc-700 text-[#b5ff42] font-bold'
                        : 'hover:bg-zinc-800'
                    }`}
                  >
                    Right
                  </button>

                  <div className="h-4 w-[1px] bg-zinc-800 mx-0.5" />

                  {/* Bullets Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        saveSelection();
                        setBulletMenuOpen((prev) => !prev);
                        setCustomBulletPickerOpen(false);
                        setStyleMenuOpen(false);
                        setInsertMenuOpen(false);
                      }}
                      className="px-2.5 py-1 rounded text-[11px] font-semibold bg-[#222222] text-zinc-200 hover:bg-zinc-700 transition cursor-pointer flex items-center gap-1"
                    >
                      <span>Bullets</span>
                      <span>⌄</span>
                    </button>

                    {bulletMenuOpen && (
                      <div className="absolute left-0 mt-1 w-48 bg-[#1b1b1b] border border-zinc-700 rounded-xl shadow-xl py-1 z-30">
                        <button
                          type="button"
                          onClick={() => applyBulletStyle('disc')}
                          className="w-full text-left px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-800 cursor-pointer"
                        >
                          • Bullet List
                        </button>
                        <button
                          type="button"
                          onClick={() => applyBulletStyle('decimal')}
                          className="w-full text-left px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-800 cursor-pointer"
                        >
                          1. Numbered List
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setBulletMenuOpen(false);
                            setCustomBulletPickerOpen(true);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-[#b5ff42] font-semibold hover:bg-zinc-800 cursor-pointer flex items-center justify-between"
                        >
                          <span>{activeCustomEmoji} Custom Bullets</span>
                          <span>›</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => applyBulletStyle('alpha')}
                          className="w-full text-left px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-800 cursor-pointer"
                        >
                          a. Alphabet List
                        </button>
                      </div>
                    )}

                    {customBulletPickerOpen && (
                      <div className="absolute left-0 mt-1 w-52 bg-[#1b1b1b] border border-[#b5ff42]/40 rounded-xl shadow-xl p-2 z-30 space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-2 py-0.5">
                          Choose Custom Bullet
                        </div>
                        {(
                          [
                            { emoji: '❤️', label: 'Heart Point' },
                            { emoji: '💀', label: 'Skull Point' },
                            { emoji: '🦇', label: 'Batman Emoji Point' },
                            { emoji: '★', label: 'Star Point' },
                          ] as const
                        ).map((item) => (
                          <button
                            key={item.emoji}
                            type="button"
                            onClick={() => {
                              setActiveCustomEmoji(item.emoji);
                              applyBulletStyle('sub', item.emoji);
                            }}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-zinc-200 hover:bg-zinc-800 cursor-pointer flex items-center gap-2"
                          >
                            <span className="text-sm">{item.emoji}</span>
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Link Button */}
                  <button
                    type="button"
                    title="Add Link (Ctrl/Cmd + K)"
                    onClick={openLinkModalForSelection}
                    className={`px-2.5 py-1 rounded font-semibold text-orange-400 transition cursor-pointer ${
                      activeTool === 'link' ? 'bg-zinc-700' : 'hover:bg-zinc-800'
                    }`}
                  >
                    Link
                  </button>

                  {/* Insert Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      disabled={isUploadingCollage}
                      onClick={() => {
                        saveSelection();
                        setInsertMenuOpen((prev) => !prev);
                        setStyleMenuOpen(false);
                        setBulletMenuOpen(false);
                        setCustomBulletPickerOpen(false);
                      }}
                      className="px-2.5 py-1 rounded bg-[#b5ff42]/15 text-[#b5ff42] border border-[#b5ff42]/40 hover:bg-[#b5ff42]/25 font-semibold transition cursor-pointer flex items-center gap-1"
                    >
                      <span>{isUploadingCollage ? 'Uploading...' : 'Insert'}</span>
                      <span>⌄</span>
                    </button>

                    {insertMenuOpen && (
                      <div className="absolute left-0 mt-1 w-48 bg-[#1b1b1b] border border-zinc-700 rounded-xl shadow-xl py-1 z-30">
                        <button
                          type="button"
                          onClick={() => {
                            closeAllDropdowns();
                            collageInputRef.current?.click();
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-800 cursor-pointer"
                        >
                          Add Image
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            closeAllDropdowns();
                            setShowTableBar(true);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-800 cursor-pointer"
                        >
                          Table
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            closeAllDropdowns();
                            setShowVideoInput(true);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-800 cursor-pointer"
                        >
                          Video
                        </button>
                        <button
                          type="button"
                          onClick={applyNeonQuoteBlock}
                          className="w-full text-left px-3 py-1.5 text-xs text-[#b5ff42] hover:bg-zinc-800 cursor-pointer"
                        >
                          Neon Quote
                        </button>
                        <button
                          type="button"
                          onClick={applySpoilerWarningBlock}
                          className="w-full text-left px-3 py-1.5 text-xs text-orange-400 hover:bg-zinc-800 cursor-pointer"
                        >
                          Spoiler Warning
                        </button>
                      </div>
                    )}
                  </div>

                  <input
                    ref={collageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleCollageUpload}
                    className="hidden"
                  />

                  {/* Full-Page Preview in New Tab + Expand Editor Only */}
                  <div className="ml-auto flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleOpenFullPreview}
                      className="text-[11px] bg-[#b5ff42] text-black font-bold px-2.5 py-1 rounded-lg hover:bg-[#a2ef2d] transition cursor-pointer"
                    >
                      Preview ↗
                    </button>

                    <button
                      type="button"
                      title={isEditorExpanded ? 'Collapse Editor' : 'Expand Editor'}
                      onClick={() => {
                        closeAllDropdowns();
                        setIsEditorExpanded(!isEditorExpanded);
                      }}
                      className="flex items-center gap-1 text-[11px] text-zinc-300 hover:text-white px-2 py-1 rounded hover:bg-zinc-800 transition cursor-pointer font-medium"
                      aria-label="Toggle Editor Expand"
                    >
                      {isEditorExpanded ? (
                        <svg className="w-4 h-4 fill-current text-[#b5ff42]" viewBox="0 0 24 24">
                          <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 fill-current text-[#b5ff42]" viewBox="0 0 24 24">
                          <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Link Bar ("Link - reddit") */}
                {showLinkBox && (
                  <div className="bg-[#1b1b1b] border-b border-orange-500/40 px-4 py-2.5 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-white font-semibold">Link -</span>
                    <input
                      type="text"
                      value={linkLabel}
                      onChange={(e) => setLinkLabel(e.target.value)}
                      placeholder="Label (e.g., reddit)"
                      className="w-32 bg-black border border-zinc-700 focus:border-orange-400 rounded-lg px-2.5 py-1 text-xs italic text-orange-400 focus:outline-none"
                    />
                    <input
                      type="url"
                      autoFocus
                      value={linkUrlInput}
                      onChange={(e) => setLinkUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          confirmLinkInsert();
                        }
                      }}
                      placeholder="Paste URL (e.g., https://reddit.com/...)"
                      className="flex-1 min-w-[200px] bg-black border border-zinc-700 focus:border-orange-400 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={confirmLinkInsert}
                      className="bg-orange-400 text-black font-bold px-3 py-1 rounded-lg hover:bg-orange-300 transition cursor-pointer"
                    >
                      Insert
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowLinkBox(false)}
                      className="text-zinc-400 hover:text-white px-2 py-1 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* Table Builder & Row/Column Bar */}
                {showTableBar && (
                  <div className="bg-[#1b1b1b] border-b border-[#b5ff42]/30 px-4 py-2.5 flex flex-wrap items-center gap-3 text-xs">
                    <label className="flex items-center gap-1.5 text-zinc-300">
                      <span>Rows:</span>
                      <input
                        type="number"
                        min={1}
                        max={12}
                        value={tableRows}
                        onChange={(e) => setTableRows(Number(e.target.value) || 1)}
                        className="w-14 bg-black border border-zinc-700 rounded-lg px-2 py-1 text-white focus:outline-none focus:border-[#b5ff42]"
                      />
                    </label>

                    <label className="flex items-center gap-1.5 text-zinc-300">
                      <span>Columns:</span>
                      <input
                        type="number"
                        min={1}
                        max={8}
                        value={tableCols}
                        onChange={(e) => setTableCols(Number(e.target.value) || 1)}
                        className="w-14 bg-black border border-zinc-700 rounded-lg px-2 py-1 text-white focus:outline-none focus:border-[#b5ff42]"
                      />
                    </label>

                    <label className="flex items-center gap-1.5 text-zinc-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={hasTableHeader}
                        onChange={(e) => setHasTableHeader(e.target.checked)}
                        className="accent-[#b5ff42]"
                      />
                      <span>Header Row</span>
                    </label>

                    <button
                      type="button"
                      onClick={insertTableAtCursor}
                      className="bg-[#b5ff42] text-black font-bold px-3 py-1 rounded-lg hover:bg-[#a2ef2d] transition cursor-pointer"
                    >
                      Insert Table
                    </button>

                    <div className="h-4 w-[1px] bg-zinc-800" />

                    <button
                      type="button"
                      onClick={addTableRow}
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1 rounded-lg transition cursor-pointer"
                    >
                      + Row
                    </button>
                    <button
                      type="button"
                      onClick={addTableColumn}
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1 rounded-lg transition cursor-pointer"
                    >
                      + Column
                    </button>
                    <button
                      type="button"
                      onClick={deleteLastTableRow}
                      className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-red-400 px-2 py-1 rounded-lg transition cursor-pointer"
                    >
                      - Row
                    </button>
                    <button
                      type="button"
                      onClick={deleteLastTableColumn}
                      className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-red-400 px-2 py-1 rounded-lg transition cursor-pointer"
                    >
                      - Col
                    </button>
                  </div>
                )}

                {/* Visual Rich Text Editor Surface */}
                <div
                  onMouseDown={closeAllDropdowns}
                  className="p-5 flex-1 flex flex-col min-h-[250px] bg-[#121212] overflow-y-auto"
                >
                  <div
                    ref={editorRef}
                    id="main-editor-editor"
                    contentEditable
                    suppressContentEditableWarning
                    onFocus={closeAllDropdowns}
                    onMouseDown={closeAllDropdowns}
                    onInput={syncEditorState}
                    onKeyUp={saveSelection}
                    onMouseUp={saveSelection}
                    onKeyDown={handleEditorKeyDown}
                    className="w-full h-full flex-1 bg-transparent text-zinc-200 text-sm focus:outline-none leading-relaxed font-sans [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-white [&_h2]:mt-3 [&_h2]:mb-1.5 [&_p]:mb-2 [&_a]:text-orange-400 [&_a]:underline [&_a]:italic [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_table]:border [&_table]:border-zinc-700 [&_th]:border [&_th]:border-zinc-700 [&_th]:bg-[#1f2912] [&_th]:text-[#b5ff42] [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-bold [&_td]:border [&_td]:border-zinc-800 [&_td]:px-3 [&_td]:py-2"
                  />
                </div>

                {/* Collage Preview */}
                {collageImages.length > 0 && (
                  <div className="bg-[#151515] border-t border-zinc-800 px-4 py-3 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-white">
                        Collage ({collageImages.length} images)
                      </span>
                      <span className="text-orange-400 font-semibold">
                        Thread & Screenshot Grid
                      </span>
                    </div>
                    <div className={`grid ${getCollageLayoutClass(collageImages.length)} gap-2.5`}>
                      {collageImages.map((src, i) => (
                        <div
                          key={i}
                          className="relative group rounded-xl overflow-hidden border border-zinc-800 bg-black aspect-video shadow-md"
                        >
                          <img
                            src={src}
                            alt={`Collage image ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeCollageImage(i)}
                            title="Remove image"
                            className="absolute top-1.5 right-1.5 bg-black/80 text-white hover:text-red-400 text-[10px] px-1.5 py-0.5 rounded cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Video / Trailer Section */}
                {showVideoInput && (
                  <div className="bg-[#151515] border-t border-zinc-800 px-4 py-3 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#b5ff42]">
                        Trailer / Video Link
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowVideoInput(false);
                          setVideoUrl('');
                        }}
                        className="text-[11px] text-zinc-400 hover:text-white cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="Paste YouTube or Vimeo trailer link (e.g., https://youtube.com/watch?v=...)"
                      className="w-full bg-[#101010] border border-zinc-800 focus:border-[#b5ff42] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                    {embedSrc && (
                      <div className="aspect-video w-full max-w-lg rounded-xl overflow-hidden border border-zinc-800 bg-black">
                        <iframe
                          src={embedSrc}
                          title="Trailer preview"
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Clean Bottom Bar */}
                <div className="bg-[#161616] border-t border-zinc-800 px-4 py-2 flex items-center justify-between text-zinc-400 text-xs shrink-0 rounded-b-2xl">
                  <span className="text-[11px] text-[#b5ff42] font-semibold">{ENDING_TAG}</span>
                  <span className="text-[11px] text-zinc-500 font-mono">Words: {wordCount}</span>
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

                  <div className="flex flex-wrap items-center gap-2">
                    {selectedCategory ? (
                      <div className="bg-[#1a1a1a] border border-zinc-700/80 rounded-xl px-3 py-1.5 flex items-center gap-2.5 text-xs text-white shadow-sm">
                        <span className="w-5 h-5 rounded-full bg-red-950 flex items-center justify-center text-[10px]">
                          🔴
                        </span>
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
                    <div
                      className={`transition-all duration-700 transform ${
                        animateQuote
                          ? 'opacity-100 translate-y-0 scale-100'
                          : 'opacity-0 translate-y-2 scale-98'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#b5ff42] uppercase tracking-wider mb-1">
                        <span>✨ Writer&apos;s Inspiration Boost</span>
                      </div>
                      <p className="text-xs text-zinc-200 italic font-medium leading-relaxed">
                        &ldquo;{activeQuote.quote}&rdquo;
                      </p>
                      <p className="text-[10px] text-zinc-400 mt-1 font-mono text-right">
                        — {activeQuote.author}
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Type of media such as Anime, DC Comics, Marvel Movies, K-Drama, Manga
                  </p>

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
                            className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition ${
                              selectedCategory === cat.name
                                ? 'bg-[#b5ff42]/15 text-[#b5ff42] border border-[#b5ff42]/30 font-semibold'
                                : 'hover:bg-zinc-800 text-zinc-300'
                            }`}
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
                    {isUploading ? (
                      <span className="text-[11px] font-semibold text-zinc-400">Uploading...</span>
                    ) : uploadedUrl ? (
                      <span className="text-[11px] font-semibold text-[#b5ff42]">✓ Uploaded</span>
                    ) : null}
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
                      <img
                        src={imagePreview}
                        alt="Featured preview"
                        className="object-cover w-full h-full"
                      />
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
    </div>
  );
}