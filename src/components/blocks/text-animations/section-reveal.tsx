"use client";

import { motion, Variants } from "motion/react";
import { ReactNode } from "react";

interface SectionAnimationProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "fade" | "slide" | "scale";
  duration?: number;
  once?: boolean;
}

const appleEasing = [0.165, 0.84, 0.44, 1] as const;

export const SectionAnimation = ({
  children,
  className = "",
  delay = 0,
  variant = "slide",
  duration = 0.3,
  once = true,
}: SectionAnimationProps) => {
  const fadeVariants: Variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration,
        delay,
        ease: appleEasing,
      },
    },
  };

  const slideVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        delay,
        ease: appleEasing,
      },
    },
  };

  const scaleVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.98,
      filter: "blur(1px)",
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration,
        delay,
        ease: appleEasing,
      },
    },
  };

  const getVariants = () => {
    switch (variant) {
      case "fade":
        return fadeVariants;
      case "slide":
        return slideVariants;
      case "scale":
        return scaleVariants;
      default:
        return slideVariants;
    }
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once,
        margin: "-10px 0px",
      }}
      variants={getVariants()}
    >
      {children}
    </motion.div>
  );
};