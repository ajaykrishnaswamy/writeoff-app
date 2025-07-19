"use client";

import { ReactNode, forwardRef } from "react";
import { motion, Variants } from "motion/react";

interface StaggeredAnimationContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  variant?: "slide" | "fade" | "scale";
  duration?: number;
  once?: boolean;
}

const APPLE_EASING = [0.165, 0.84, 0.44, 1] as const;

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0,
      ease: APPLE_EASING,
    },
  },
};

const slideVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: APPLE_EASING,
    },
  },
};

const fadeVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: APPLE_EASING,
    },
  },
};

const scaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: APPLE_EASING,
    },
  },
};

export const StaggeredAnimationContainer = forwardRef<
  HTMLDivElement,
  StaggeredAnimationContainerProps
>(({ 
  children, 
  className = "", 
  delay = 0, 
  staggerDelay = 0.05,
  variant = "slide", 
  duration = 0.3,
  once = true 
}, ref) => {
  const getChildVariants = () => {
    switch (variant) {
      case "fade":
        return fadeVariants;
      case "scale":
        return scaleVariants;
      default:
        return slideVariants;
    }
  };

  const customContainerVariants: Variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
        ease: APPLE_EASING,
      },
    },
  };

  const customChildVariants: Variants = {
    hidden: getChildVariants().hidden,
    visible: {
      ...getChildVariants().visible,
      transition: {
        duration: duration,
        ease: APPLE_EASING,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={customContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ 
        once, 
        margin: "-20px 0px",
        amount: 0.1 
      }}
    >
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div key={index} variants={customChildVariants}>
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div variants={customChildVariants}>
          {children}
        </motion.div>
      )}
    </motion.div>
  );
});

StaggeredAnimationContainer.displayName = "StaggeredAnimationContainer";