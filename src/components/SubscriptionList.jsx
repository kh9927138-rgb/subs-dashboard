import { motion, AnimatePresence } from 'framer-motion';
import SubscriptionCard from './SubscriptionCard.jsx';

export default function SubscriptionList({ subs, selected, prices, onToggle, onPriceChange, onRemove, query }) {
  if (subs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-1 rounded-2xl border border-dashed border-ink/12 py-16 text-center dark:border-ink-dark/12"
      >
        <p className="text-sm font-medium text-ink dark:text-ink-dark">
          {query ? `"${query}"에 맞는 구독을 찾지 못했어요` : '해당하는 구독이 없어요'}
        </p>
        <p className="text-xs text-ink-faint dark:text-ink-dark-faint">
          검색어를 바꾸거나 다른 카테고리를 선택해보세요.
        </p>
      </motion.div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
      <AnimatePresence initial={false}>
        {subs.map((sub, index) => (
          <SubscriptionCard
            key={sub.id}
            sub={sub}
            index={index}
            checked={selected.includes(sub.id)}
            price={prices[sub.id]}
            onToggle={onToggle}
            onPriceChange={onPriceChange}
            onRemove={sub.custom ? onRemove : undefined}
          />
        ))}
      </AnimatePresence>
    </ul>
  );
}
