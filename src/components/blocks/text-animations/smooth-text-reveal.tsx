"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

interface TextRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "hero" | "heading" | "body";
  staggerDelay?: number;
}

export const TextReveal = ({
  children,
  className = "",
  delay = 0,
  variant = "body",
  staggerDelay = 0.01,
}: TextRevealProps) => {
  // Convert children to string and handle different types
  const text = typeof children === 'string' ? children : String(children || '');
  const words = text.split(" ");

  const getVariantStyles = () => {
    switch (variant) {
      case "hero":
        return "text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight";
      case "heading":
        return "text-2xl md:text-3xl lg:text-4xl font-semibold";
      case "body":
        return "text-base md:text-lg font-normal";
      default:
        return "text-base md:text-lg font-normal";
    }
  };

  return (
    <motion.div
      className={`${getVariantStyles()} ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-2 last:mr-0"
          variants={{
            hidden: {
              opacity: 0,
              y: 10,
              scale: 0.99,
              filter: "blur(4px)",
            },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              transition: {
                duration: 0.3,
                delay: delay + (index * staggerDelay),
                ease: [0.165, 0.84, 0.44, 1],
              },
            },
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};