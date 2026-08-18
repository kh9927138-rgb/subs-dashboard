import { useEffect, useRef } from 'react';
import { useMotionValue, useTransform, animate, motion } from 'framer-motion';

const fmt = new Intl.NumberFormat('ko-KR');

export default function AnimatedNumber({ value, suffix = '', className }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, latest => fmt.format(Math.round(latest)) + suffix);
  const prev = useRef(0);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    });
    prev.current = value;
    return controls.stop;
  }, [value]);

  return <motion.span className={className}>{rounded}</motion.span>;
}
