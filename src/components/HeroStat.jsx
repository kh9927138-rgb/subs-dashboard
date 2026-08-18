import { motion } from 'framer-motion';
import AnimatedNumber from './AnimatedNumber.jsx';

export default function HeroStat({ count, monthlyTotal }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-4xl px-6 pb-8 pt-10"
    >
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-faint dark:text-ink-dark-faint">
        이번 달 새는 돈
      </p>
      <div className="mt-2 flex items-baseline gap-1">
        <AnimatedNumber
          value={monthlyTotal}
          suffix="원"
          className="stat-gradient font-mono text-5xl font-semibold tabular-nums sm:text-6xl"
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-6 border-t border-ink/8 pt-5 dark:border-ink-dark/8">
        <div>
          <p className="text-xs text-ink-faint dark:text-ink-dark-faint">선택한 구독</p>
          <p className="mt-1 font-mono text-lg tabular-nums text-ink dark:text-ink-dark">{count}개</p>
        </div>
        <div>
          <p className="text-xs text-ink-faint dark:text-ink-dark-faint">연간 환산</p>
          <p className="mt-1 font-mono text-lg tabular-nums text-ink dark:text-ink-dark">
            {new Intl.NumberFormat('ko-KR').format(monthlyTotal * 12)}원
          </p>
        </div>
      </div>
    </motion.section>
  );
}
