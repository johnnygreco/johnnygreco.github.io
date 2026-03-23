import { Command } from 'cmdk';
import { useState, useEffect, useCallback, useRef } from 'react';

interface PageItem {
  label: string;
  href: string;
}

const pages: PageItem[] = [
  { label: 'Home', href: '/' },
  { label: "Agent's Log", href: '/log/' },
  { label: 'Notes', href: '/notes/' },
  { label: 'Projects', href: '/projects/' },
  { label: 'About', href: '/about/' },
  { label: 'Tags', href: '/tags/' },
  { label: 'RSS Feed', href: '/rss.xml' },
];

const actions = [
  { label: 'Toggle theme', action: 'toggle-theme' },
  { label: 'Copy email', action: 'copy-email' },
  { label: 'GitHub', action: 'open-github' },
  { label: 'LinkedIn', action: 'open-linkedin' },
  { label: 'Google Scholar', action: 'open-scholar' },
];

interface SearchResult {
  url: string;
  title: string;
  excerpt: string;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const pagefindRef = useRef<any>(null);

  // Load Pagefind at runtime (not bundled — it's generated post-build)
  useEffect(() => {
    async function loadPagefind() {
      try {
        const pagefindPath = '/pagefind/pagefind.js';
        const mod = await import(/* @vite-ignore */ pagefindPath);
        await mod.init();
        pagefindRef.current = mod;
      } catch {
        // Pagefind not available (dev mode) — search will just show static items
      }
    }
    loadPagefind();
  }, []);

  // Search with Pagefind when query changes
  useEffect(() => {
    if (!query || query.length < 2 || !pagefindRef.current) {
      setSearchResults([]);
      return;
    }

    let cancelled = false;
    const doSearch = async () => {
      try {
        const search = await pagefindRef.current.search(query);
        const results: SearchResult[] = [];
        for (const result of search.results.slice(0, 5)) {
          const data = await result.data();
          results.push({
            url: data.url,
            title: data.meta?.title || data.url,
            excerpt: data.excerpt?.replace(/<[^>]*>/g, '') || '',
          });
        }
        if (!cancelled) setSearchResults(results);
      } catch {
        if (!cancelled) setSearchResults([]);
      }
    };
    doSearch();
    return () => { cancelled = true; };
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    const trigger = document.getElementById('cmd-palette-trigger');
    const handler = () => setOpen(true);
    trigger?.addEventListener('click', handler);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      trigger?.removeEventListener('click', handler);
    };
  }, []);

  const handleSelect = useCallback((value: string) => {
    setOpen(false);
    setQuery('');

    const action = actions.find((a) => a.action === value);
    if (action) {
      switch (action.action) {
        case 'toggle-theme': {
          const current = document.documentElement.getAttribute('data-theme');
          const next = current === 'light' ? 'dark' : 'light';
          document.documentElement.setAttribute('data-theme', next);
          localStorage.setItem('theme', next);
          break;
        }
        case 'copy-email':
          navigator.clipboard.writeText('jgreco.ai@gmail.com');
          break;
        case 'open-github':
          window.open('https://github.com/johnnygreco', '_blank');
          break;
        case 'open-linkedin':
          window.open('https://linkedin.com/in/johnnygreco', '_blank');
          break;
        case 'open-scholar':
          window.open('https://scholar.google.com/citations?user=CDWpgoAAAAAJ', '_blank');
          break;
      }
      return;
    }

    // Navigate — could be a page or a search result URL
    if (value.startsWith('/') || value.startsWith('http')) {
      window.location.href = value;
    }
  }, []);

  if (!open) return null;

  const showSearch = searchResults.length > 0;
  const showPages = !query || query.length < 2;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '20vh',
      }}
    >
      <div
        onClick={() => { setOpen(false); setQuery(''); }}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
        }}
      />

      <Command
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 520,
          margin: '0 16px',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        }}
        label="Command palette"
        shouldFilter={!showSearch}
      >
        <Command.Input
          placeholder="Search pages, posts, actions..."
          autoFocus
          value={query}
          onValueChange={setQuery}
          style={{
            width: '100%',
            padding: '14px 16px',
            fontSize: 15,
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: '1px solid var(--border)',
            color: 'var(--text)',
            outline: 'none',
            fontFamily: 'var(--font-sans)',
          }}
        />
        <Command.List
          style={{
            maxHeight: 320,
            overflowY: 'auto',
            padding: '8px',
          }}
        >
          <Command.Empty
            style={{
              padding: '24px 16px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: 14,
            }}
          >
            No results found.
          </Command.Empty>

          {showSearch && (
            <Command.Group heading="Search results" style={{ marginBottom: 4 }}>
              {searchResults.map((result) => (
                <Command.Item
                  key={result.url}
                  value={result.url}
                  onSelect={handleSelect}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: 14,
                    color: 'var(--text)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                  className="cmd-item"
                >
                  <span style={{ fontWeight: 500 }}>{result.title}</span>
                  {result.excerpt && (
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      {result.excerpt.slice(0, 120)}...
                    </span>
                  )}
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {showPages && (
            <Command.Group heading="Pages" style={{ marginBottom: 4 }}>
              {pages.map((page) => (
                <Command.Item
                  key={page.href}
                  value={page.label}
                  onSelect={() => { setOpen(false); setQuery(''); window.location.href = page.href; }}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: 14,
                    color: 'var(--text)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                  className="cmd-item"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                    <polyline points="13 2 13 9 20 9" />
                  </svg>
                  {page.label}
                </Command.Item>
              ))}
            </Command.Group>
          )}

          <Command.Group heading="Actions" style={{ marginBottom: 4 }}>
            {actions.map((action) => (
              <Command.Item
                key={action.action}
                value={action.label}
                onSelect={() => { handleSelect(action.action); }}
                style={{
                  padding: '10px 12px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 14,
                  color: 'var(--text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
                className="cmd-item"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                  <polyline points="4 17 10 11 4 5" />
                  <line x1="12" y1="19" x2="20" y2="19" />
                </svg>
                {action.label}
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </Command>

      <style>{`
        [cmdk-group-heading] {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          padding: 8px 12px 4px;
        }
        .cmd-item[data-selected="true"],
        .cmd-item[aria-selected="true"] {
          background-color: var(--accent-subtle) !important;
          color: var(--accent) !important;
        }
      `}</style>
    </div>
  );
}
