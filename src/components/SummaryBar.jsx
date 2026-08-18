import { motion } from 'framer-motion';
import AnimatedNumber from './AnimatedNumber.jsx';

export default function SummaryBar({ count, monthlyTotal }) {
  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/8 bg-canvas/90 backdrop-blur-md sm:sticky dark:border-ink-dark/8 dark:bg-canvas-dark/90"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-6 py-4">
        <p className="text-xs text-ink-soft dark:text-ink-dark-soft">
          선택 {count}개 · 월 합계
        </p>
        <AnimatedNumber
          value={monthlyTotal}
          suffix="원"
          className="font-mono text-xl font-semibold tabular-nums text-accent dark:text-accent-dark"
        />
      </div>
    </motion.div>
  );
}
