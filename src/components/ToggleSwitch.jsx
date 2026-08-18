import { motion } from 'framer-motion';

export default function ToggleSwitch({ checked, onChange, label }) {
  return (
    <span className="-m-2.5 flex flex-none items-center p-2.5">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onChange}
        className={`relative h-7 w-[50px] flex-none rounded-full transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:focus-visible:outline-accent-dark ${
          checked ? 'bg-accent dark:bg-accent-dark' : 'bg-ink/15 dark:bg-ink-dark/15'
        }`}
      >
        <motion.span
          className="absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-sm"
          animate={{ x: checked ? 22 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        />
      </button>
    </span>
  );
}
