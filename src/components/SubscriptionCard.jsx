import { useId, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToggleSwitch from './ToggleSwitch.jsx';

export default function SubscriptionCard({ sub, checked, price, onToggle, onPriceChange, onRemove, index }) {
  const [showGuide, setShowGuide] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const guideId = useId();
  const tipId = useId();
  const hasGuide = sub.steps && sub.steps.length > 0;
  const hasTip = Boolean(sub.tip);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4), ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      className={`list-none rounded-2xl border p-5 transition-colors duration-200 ${
        checked
          ? 'border-accent/30 bg-surface shadow-glow dark:border-accent-dark/30 dark:bg-surface-dark dark:shadow-glow-dark'
          : 'border-ink/8 bg-surface hover:border-ink/14 dark:border-ink-dark/8 dark:bg-surface-dark dark:hover:border-ink-dark/14'
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className="flex h-9 w-9 flex-none items-center justify-center rounded-xl text-sm font-semibold text-white"
          style={{ backgroundColor: sub.color }}
        >
          {sub.name.slice(0, 1)}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[15px] font-medium text-ink dark:text-ink-dark">{sub.name}</p>
              <p className="text-xs text-ink-faint dark:text-ink-dark-faint">
                {sub.plan ? `${sub.plan} · ${sub.category}` : sub.category}
              </p>
            </div>
            <div className="flex flex-none items-center gap-3">
              {onRemove && (
                <span className="-m-1.5 flex items-center p-1.5">
                  <button
                    type="button"
                    onClick={() => onRemove(sub.id)}
                    aria-label={`${sub.name} 삭제`}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-ink/8 hover:text-ink dark:text-ink-dark-faint dark:hover:bg-ink-dark/10 dark:hover:text-ink-dark"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                      <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
                    </svg>
                  </button>
                </span>
              )}
              <ToggleSwitch checked={checked} onChange={() => onToggle(sub.id)} label={`${sub.name} 선택`} />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1 font-mono text-sm text-ink-soft dark:text-ink-dark-soft" style={{ fontVariantNumeric: 'tabular-nums' }}>
            <span className="text-ink-faint dark:text-ink-dark-faint">₩</span>
            <input
              type="number"
              min="0"
              value={price}
              onChange={e => onPriceChange(sub.id, Number(e.target.value))}
              aria-label={`${sub.name} 월 요금`}
              className="w-20 rounded-md border border-transparent bg-transparent px-1.5 py-2 text-ink transition-colors hover:border-ink/12 focus:border-accent/40 focus:outline-none dark:text-ink-dark dark:hover:border-ink-dark/16 dark:focus:border-accent-dark/40"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            />
            <span className="text-ink-faint dark:text-ink-dark-faint">/ 월</span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
            {hasGuide && (
              <button
                type="button"
                onClick={() => setShowGuide(v => !v)}
                aria-expanded={showGuide}
                aria-controls={guideId}
                className="-my-2 py-2 font-medium text-accent transition-colors hover:text-accent/80 dark:text-accent-dark dark:hover:text-accent-dark/80"
              >
                {showGuide ? '해지 가이드 접기' : '해지 가이드 보기'}
              </button>
            )}
            {hasTip && (
              <button
                type="button"
                onClick={() => setShowTip(v => !v)}
                aria-expanded={showTip}
                aria-controls={tipId}
                className="-my-2 py-2 font-medium text-amber-600 transition-colors hover:text-amber-600/80 dark:text-amber-400 dark:hover:text-amber-400/80"
              >
                {showTip ? '해지 꿀팁 접기' : '해지 꿀팁 보기'}
              </button>
            )}
            {sub.url && (
              <a
                href={sub.url}
                target="_blank"
                rel="noreferrer"
                className="-my-2 py-2 text-ink-faint transition-colors hover:text-ink-soft dark:text-ink-dark-faint dark:hover:text-ink-dark-soft"
              >
                공식 사이트 ↗
              </a>
            )}
          </div>

          <AnimatePresence initial={false}>
            {showGuide && (
              <motion.ol
                id={guideId}
                key="guide"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-1.5 border-t border-ink/8 pt-3 text-sm text-ink-soft dark:border-ink-dark/8 dark:text-ink-dark-soft">
                  {sub.steps.map((step, i) => (
                    <div key={i} className="flex gap-2">
                      <span
                        className="font-mono text-xs text-ink-faint dark:text-ink-dark-faint"
                        style={{ fontVariantNumeric: 'tabular-nums' }}
                      >
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </motion.ol>
            )}
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {showTip && (
              <motion.div
                id={tipId}
                key="tip"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-3 flex gap-2 rounded-lg border border-amber-500/20 bg-amber-500/[0.08] p-3 text-sm leading-relaxed text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/[0.08] dark:text-amber-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 h-4 w-4 flex-none">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a1.5 1.5 0 0 0 1.3 2.25h17.76a1.5 1.5 0 0 0 1.3-2.25L13.71 3.86a1.5 1.5 0 0 0-2.42 0Z" />
                  </svg>
                  <span>{sub.tip}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.li>
  );
}
