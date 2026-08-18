import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AddCustomForm({ onAdd }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const canAdd = name.trim().length > 0 && Number(price) > 0;

  const handleSubmit = e => {
    e.preventDefault();
    if (!canAdd) return;
    onAdd({ name: name.trim(), price: Number(price) });
    setName('');
    setPrice('');
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto flex max-w-4xl flex-col gap-3 px-6 pb-6 sm:flex-row sm:items-center"
    >
      <div className="flex flex-1 items-center gap-2 rounded-xl border border-dashed border-ink/15 bg-surface px-4 py-3.5 transition-colors focus-within:border-accent/50 dark:border-ink-dark/15 dark:bg-surface-dark dark:focus-within:border-accent-dark/50">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 flex-none text-ink-faint dark:text-ink-dark-faint">
          <path strokeLinecap="round" d="M12 5v14M5 12h14" />
        </svg>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="구독 이름 (예: 헬스장, 개인 넷플릭스)"
          className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none dark:text-ink-dark dark:placeholder:text-ink-dark-faint"
        />
        <div className="h-4 w-px flex-none bg-ink/10 dark:bg-ink-dark/10" />
        <span className="flex-none text-sm text-ink-faint dark:text-ink-dark-faint">₩</span>
        <input
          type="number"
          min="0"
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder="월 요금"
          className="w-20 flex-none bg-transparent font-mono text-sm text-ink placeholder:text-ink-faint focus:outline-none dark:text-ink-dark dark:placeholder:text-ink-dark-faint"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        />
      </div>

      <motion.button
        type="submit"
        disabled={!canAdd}
        whileTap={canAdd ? { scale: 0.96 } : {}}
        className="flex-none rounded-xl bg-ink px-5 py-3.5 text-sm font-medium text-canvas transition-opacity disabled:opacity-40 dark:bg-ink-dark dark:text-canvas-dark"
      >
        추가
      </motion.button>
    </motion.form>
  );
}
