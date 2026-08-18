import { motion } from 'framer-motion';

export default function Header({ theme, onToggleTheme }) {
  const isDark = theme === 'dark';

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-20 border-b border-ink/8 bg-canvas/80 backdrop-blur-md dark:border-ink-dark/8 dark:bg-canvas-dark/80"
    >
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-dark text-sm font-semibold text-white">
            S
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-ink dark:text-ink-dark">
            Subs
          </span>
        </div>

        <span className="-m-2 flex flex-none items-center p-2">
          <button
            type="button"
            role="switch"
            aria-checked={isDark}
            aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
            onClick={onToggleTheme}
            className="relative flex h-9 w-[68px] flex-none items-center rounded-full border border-ink/10 bg-surface px-1 transition-colors dark:border-ink-dark/10 dark:bg-surface-dark"
          >
            <motion.span
              className="absolute flex h-7 w-7 items-center justify-center rounded-full bg-ink text-canvas dark:bg-ink-dark dark:text-canvas-dark"
              animate={{ x: isDark ? 32 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 32 }}
            >
              {isDark ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                  <path d="M20.4 14.7A8.4 8.4 0 0 1 9.3 3.6a8.9 8.9 0 1 0 11.1 11.1Z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                  <circle cx="12" cy="12" r="4" />
                  <path strokeLinecap="round" d="M12 3v1.5M12 19.5V21M4.9 4.9l1 1M18 18l1 1M3 12h1.5M19.5 12H21M4.9 19.1l1-1M18 6l1-1" />
                </svg>
              )}
            </motion.span>
          </button>
        </span>
      </div>
    </motion.header>
  );
}
