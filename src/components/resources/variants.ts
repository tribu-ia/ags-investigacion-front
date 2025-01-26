import { type Variants } from "framer-motion";

export const cardVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  hover: {
    background: "linear-gradient(45deg, rgba(74,222,222,0.1) 0%, rgba(124,124,255,0.1) 50%, rgba(255,124,222,0.1) 100%)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.2)",
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};