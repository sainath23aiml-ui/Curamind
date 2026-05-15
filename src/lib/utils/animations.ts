/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const fadeIn: any = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

export const slideUp: any = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5, 
      ease: "easeOut" 
    }
  }
};

export const scrollReveal: any = {
  hidden: { opacity: 0, y: 60, filter: 'blur(12px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { 
      duration: 0.7, 
      ease: "easeOut" 
    }
  }
};

export const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

export const scaleIn: any = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

export const glowPulse: any = {
  animate: {
    boxShadow: [
      "0 0 0 0 rgba(124, 111, 255, 0)",
      "0 0 20px 4px rgba(124, 111, 255, 0.3)",
      "0 0 0 0 rgba(124, 111, 255, 0)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};
