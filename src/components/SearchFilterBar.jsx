import { motion } from 'framer-motion';

export default function SearchFilterBar({
  query,
  onQueryChange,
  categories,
  activeCategory,
  onCategoryChange,
  categoryCounts,
  totalCount,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-4xl px-6 pb-5"
    >
      <div className="flex items-center gap-2.5 rounded-xl border border-ink/10 bg-surface px-4 py-3.5 transition-colors focus-within:border-accent/50 dark:border-ink-dark/10 dark:bg-surface-dark dark:focus-within:border-accent-dark/50">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 flex-none text-ink-faint dark:text-ink-dark-faint">
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          placeholder="구독 서비스 검색 (예: 넷플릭스)"
          className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none dark:text-ink-dark dark:placeholder:text-ink-dark-faint"
        />
        {query && (
          <span className="-m-2 flex flex-none items-center p-2">
            <button
              type="button"
              onClick={() => onQueryChange('')}
              aria-label="검색어 지우기"
              className="flex h-5 w-5 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-ink/8 hover:text-ink dark:text-ink-dark-faint dark:hover:bg-ink-dark/10 dark:hover:text-ink-dark"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </span>
        )}
      </div>

      <div className="-mx-6 mt-3 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map(cat => {
          const active = cat === activeCategory;
          const count = cat === '전체' ? totalCount : categoryCounts[cat] || 0;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              className={`relative flex-none whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'text-canvas dark:text-canvas-dark'
                  : 'text-ink-soft hover:text-ink dark:text-ink-dark-soft dark:hover:text-ink-dark'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="activeCategoryPill"
                  className="absolute inset-0 rounded-full bg-ink dark:bg-ink-dark"
                  transition={{ type: 'spring', stiffness: 500, damping: 34 }}
                />
              )}
              <span className="relative">
                {cat} <span className="opacity-60">{count}</span>
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
