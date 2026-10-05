import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface DiniNekoProps {
  mood?: 'calm' | 'thinking' | 'sleeping' | 'happy';
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

const QUOTES = [
  { text: 'Catat dulu. Pikirkan nanti.', jpn: 'まず書いて、後で考えよう。' },
  { text: 'Ide yang belum selesai juga boleh disimpan kok.', jpn: '未完成のアイデアも大切に。' },
  { text: 'Napas dulu sebentar... ide terbaik datang waktu pikiran lapang.', jpn: '深呼吸して、心を落ち着かせて。' },
  { text: 'Problem yang jelas adalah separuh dari solusi.', jpn: '明確な課題は解決への第一歩。' },
  { text: 'Jangan buru-buru, proses berpikir itu bukan perlombaan.', jpn: '焦らなくていい、自分のペースで。' },
];

export const DiniNeko: React.FC<DiniNekoProps> = ({
  mood = 'calm',
  size = 'md',
  interactive = true,
}) => {
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);

  const handleClick = () => {
    if (!interactive) return;
    setQuoteIdx((prev) => (prev + 1) % QUOTES.length);
    setBubbleOpen(true);
    setTimeout(() => {
      setBubbleOpen(false);
    }, 4500);
  };

  const scale = size === 'sm' ? 0.75 : size === 'lg' ? 1.25 : 1;

  // Easing curve for natural biological breathing
  const breathingEase = [0.42, 0, 0.58, 1] as const;

  return (
    <motion.div
      // Fluid breathing cycle: smooth continuous expansion and translation without stepped frames
      animate={{
        y: mood === 'sleeping' ? [0, -1.8, 0] : [0, -2.4, 0],
        scaleY: mood === 'sleeping' ? [1, 1.015, 1] : [1, 1.02, 1],
      }}
      transition={{
        repeat: Infinity,
        duration: mood === 'sleeping' ? 4.2 : 3.5,
        ease: breathingEase,
      }}
      className="relative inline-flex items-center justify-center select-none"
    >
      {/* Speech bubble */}
      <AnimatePresence>
        {bubbleOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-30 w-56 p-3 bg-white/95 backdrop-blur border border-[#E8E6DF] rounded-xl shadow-sm text-left pointer-events-none"
          >
            <p className="text-xs text-[#2D312E] leading-relaxed font-medium">
              "{QUOTES[quoteIdx].text}"
            </p>
            <p className="text-[10px] text-[#8C9089] mt-1 font-serif">
              {QUOTES[quoteIdx].jpn}
            </p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] w-2 h-2 bg-white border-b border-r border-[#E8E6DF] rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* SVG Japanese Neko */}
      <motion.button
        type="button"
        onClick={handleClick}
        whileHover={interactive ? { scale: 1.06, rotate: [-1, 1, 0] } : undefined}
        whileTap={interactive ? { scale: 0.95 } : undefined}
        className={`focus:outline-none transition-transform cursor-${interactive ? 'pointer' : 'default'} p-1 relative`}
        style={{ transform: `scale(${scale})` }}
        title="Dini-neko — Kucing penjaga ide"
        aria-label="Dini-neko mascot"
      >
        <svg
          width="52"
          height="44"
          viewBox="0 0 52 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible drop-shadow-[0_2px_4px_rgba(0,0,0,0.04)]"
        >
          {/* Subtle Little Tail: Continuous fluid sway */}
          <motion.path
            d="M40 27C44 26 47 28 47 31C47 34 43 36 39 34"
            stroke="#D47355"
            strokeWidth="2.5"
            strokeLinecap="round"
            animate={{
              d: [
                'M40 27C44 26 47 28 47 31C47 34 43 36 39 34',
                'M40 25.5C45 24 48 26.5 48 29.5C48 32.5 44 35 39 34',
                'M40 27C44 26 47 28 47 31C47 34 43 36 39 34',
              ],
            }}
            transition={{
              repeat: Infinity,
              duration: 3.2,
              ease: 'easeInOut',
            }}
          />

          {/* Calico Ear Left with gentle periodic twitch */}
          <motion.g
            animate={{
              rotate: [0, 0, -3.5, 0.8, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 5.8,
              times: [0, 0.65, 0.7, 0.76, 1],
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '14px 17px' }}
          >
            <path
              d="M10 17L14 5C14 5 19 8 20 12L16 19C14 19 11 18 10 17Z"
              fill="#D47355"
            />
            {/* Inner Ear Left */}
            <path d="M13 15L15 8C15 8 17 10 18 13L15 16C14 16 13 15.5 13 15Z" fill="#F8C7BA" />
          </motion.g>

          {/* Ear Right with gentle offset twitch */}
          <motion.g
            animate={{
              rotate: [0, 0, 3.5, -0.8, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 7.2,
              times: [0, 0.35, 0.4, 0.46, 1],
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '38px 17px' }}
          >
            <path
              d="M42 17L38 5C38 5 33 8 32 12L36 19C38 19 41 18 42 17Z"
              fill="#454844"
            />
            {/* Inner Ear Right */}
            <path d="M39 15L37 8C37 8 35 10 34 13L37 16C38 16 39 15.5 39 15Z" fill="#F8C7BA" />
          </motion.g>

          {/* Head Body */}
          <path
            d="M12 22C12 14 18 11 26 11C34 11 40 14 40 22C40 30 34 36 26 36C18 36 12 30 12 22Z"
            fill="#FAF8F5"
            stroke="#4A4E4B"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Calico Spot on forehead */}
          <path
            d="M23 11C25 11 28 14 27 17C26 20 22 20 21 17C20 14 21 11 23 11Z"
            fill="#E28766"
            opacity="0.8"
          />

          {/* Eyes: Fluid framer-motion blink cycle without absolute frame stepping */}
          {mood === 'sleeping' ? (
            <motion.g
              animate={{
                opacity: [0.75, 1, 0.75],
              }}
              transition={{
                repeat: Infinity,
                duration: 4.2,
                ease: 'easeInOut',
              }}
            >
              {/* Sleeping gentle curves */}
              <path d="M18 22C19.5 24 21.5 24 23 22" stroke="#4A4E4B" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M29 22C30.5 24 32.5 24 34 22" stroke="#4A4E4B" strokeWidth="1.6" strokeLinecap="round" />
            </motion.g>
          ) : (
            <g>
              {/* Left Eye: Fluid vector squash & open blink transition */}
              <motion.ellipse
                cx="20"
                cy="22"
                rx={2.2}
                animate={{
                  ry: [2.2, 2.2, 0.25, 2.2, 2.2],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4.2,
                  times: [0, 0.88, 0.92, 0.96, 1],
                  ease: 'easeInOut',
                }}
                fill="#383C39"
              />
              {/* Left Eye Specular Highlight */}
              <motion.circle
                cx="19.3"
                cy="21.3"
                r={0.75}
                fill="#FFFFFF"
                animate={{
                  opacity: [1, 1, 0, 1, 1],
                  scale: [1, 1, 0.1, 1, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4.2,
                  times: [0, 0.88, 0.92, 0.96, 1],
                  ease: 'easeInOut',
                }}
                style={{ transformOrigin: '19.3px 21.3px' }}
              />

              {/* Right Eye: Synchronous fluid vector blink */}
              <motion.ellipse
                cx="32"
                cy="22"
                rx={2.2}
                animate={{
                  ry: [2.2, 2.2, 0.25, 2.2, 2.2],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4.2,
                  times: [0, 0.88, 0.92, 0.96, 1],
                  ease: 'easeInOut',
                }}
                fill="#383C39"
              />
              {/* Right Eye Specular Highlight */}
              <motion.circle
                cx="31.3"
                cy="21.3"
                r={0.75}
                fill="#FFFFFF"
                animate={{
                  opacity: [1, 1, 0, 1, 1],
                  scale: [1, 1, 0.1, 1, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4.2,
                  times: [0, 0.88, 0.92, 0.96, 1],
                  ease: 'easeInOut',
                }}
                style={{ transformOrigin: '31.3px 21.3px' }}
              />
            </g>
          )}

          {/* Soft Blush Cheeks */}
          <ellipse cx="17" cy="25.5" rx="2.2" ry="1.3" fill="#F3A595" opacity="0.65" />
          <ellipse cx="35" cy="25.5" rx="2.2" ry="1.3" fill="#F3A595" opacity="0.65" />

          {/* Tiny Nose & Mouth */}
          <path d="M26 24L26.8 25H25.2L26 24Z" fill="#D47355" />
          <path
            d="M24 26.2C24.8 27.2 26 27.2 26 27.2M26 27.2C26 27.2 27.2 27.2 28 26.2"
            stroke="#4A4E4B"
            strokeWidth="1.35"
            strokeLinecap="round"
          />

          {/* Whiskers with gentle organic wave */}
          <motion.g
            animate={{
              rotate: [0, 1.2, 0, -1.2, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 3.6,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '26px 25px' }}
          >
            <path d="M13 24L8 23M13 26L9 27" stroke="#7A7E7B" strokeWidth="1" strokeLinecap="round" />
            <path d="M39 24L44 23M39 26L43 27" stroke="#7A7E7B" strokeWidth="1" strokeLinecap="round" />
          </motion.g>

          {/* Paws resting at bottom edge */}
          <path
            d="M19 35C19 33 21 33 22 34C23 35 23 37 22 38C21 39 19 37 19 35Z"
            fill="#FAF8F5"
            stroke="#4A4E4B"
            strokeWidth="1.25"
          />
          <path
            d="M33 35C33 33 31 33 30 34C29 35 29 37 30 38C31 39 33 37 33 35Z"
            fill="#FAF8F5"
            stroke="#4A4E4B"
            strokeWidth="1.25"
          />
        </svg>

        {/* Sleeping Zzz indicator if in sleeping mood */}
        {mood === 'sleeping' && (
          <motion.span
            animate={{
              opacity: [0, 0.85, 0],
              y: [-1, -8],
              x: [0, 4],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              ease: 'easeInOut',
            }}
            className="absolute -top-1.5 right-0.5 text-[9px] font-mono text-[#73806C] font-bold pointer-events-none select-none"
          >
            zZ
          </motion.span>
        )}
      </motion.button>
    </motion.div>
  );
};
