/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export const SparklesBg: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate star coordinates for stardust effect
    const tempParticles: Particle[] = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 6 + 4,
    }));
    setParticles(tempParticles);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#050505]">
      {/* Premium Elegant Dark theme background gradients */}
      <div 
        className="absolute w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] rounded-full blur-[120px] opacity-20 -top-[10%] -right-[10%]"
        style={{
          background: 'radial-gradient(circle, rgba(26, 115, 232, 0.9) 0%, rgba(26, 115, 232, 0) 70%)'
        }}
      />
      <div 
        className="absolute w-[90vw] h-[90vw] md:w-[60vw] md:h-[60vw] rounded-full blur-[140px] opacity-15 -bottom-[10%] -left-[10%]"
        style={{
          background: 'radial-gradient(circle, rgba(147, 52, 230, 0.8) 0%, rgba(147, 52, 230, 0) 75%)'
        }}
      />

      {/* Floating Sparkles/Particles using Framer Motion */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white opacity-45"
          style={{
            top: `${p.y}%`,
            left: `${p.x}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            boxShadow: p.size > 2 ? '0 0 10px rgba(255, 255, 255, 0.8)' : 'none',
          }}
          animate={{
            opacity: [0.1, 0.8, 0.1],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Animated Subtle Ambient Ribbon Wave */}
      <motion.div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 50%, #ec4899 100%)',
          maskImage: 'radial-gradient(ellipse at center, transparent 30%, black 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 30%, black 70%)',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
};
