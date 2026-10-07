"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

type Quality = { word: string; reveal: string; isFinal?: boolean };

export default function Timeline({
  qualities,
  onLightClick,
  allRevealed,
}: {
  qualities: Quality[];
  onLightClick: (i: number) => void;
  allRevealed: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);

  const scrollY = useMotionValue(0);
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 40,
    damping: 20,
    mass: 0.8,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let ticking = false;

    const update = () => {
      const scrollTop = container.scrollTop;
      scrollY.set(scrollTop);

      const viewportCenter = scrollTop + container.clientHeight / 2;
      let closest = 0;
      let closestDist = Infinity;
      nodesRef.current.forEach((node, i) => {
        if (!node) return;
        const nodeCenter = node.offsetTop + node.clientHeight / 2;
        const dist = Math.abs(nodeCenter - viewportCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      if (closest !== visibleIndex) {
        setVisibleIndex(closest);
        if (closest >= 1 && closest <= qualities.length) {
          onLightClick(closest - 1);
        }
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [visibleIndex, qualities.length, onLightClick, scrollY]);

  const smoothProgress = (visibleIndex / (qualities.length + 1)) * 100;

  const stars = useMemoStars();

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        overflowY: "scroll",
        overflowX: "hidden",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        background: "#060202",
      }}
    >
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* ═══════════════ FIXED BACKGROUND ═══════════════ */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 35%, #1F0C08 0%, #130705 40%, #0A0505 75%, #050202 100%)",
          }}
        />

        <motion.div
          animate={{ opacity: [0.35, 0.48, 0.35] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "-25%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            height: "80%",
            background:
              "radial-gradient(ellipse at 50% 30%, rgba(255, 140, 26, 0.16) 0%, rgba(200, 90, 40, 0.06) 45%, transparent 72%)",
            filter: "blur(100px)",
          }}
        />

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 900, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            top: "-35%",
            left: "-30%",
            width: "160%",
            height: "100%",
            background:
              "radial-gradient(ellipse at 40% 50%, rgba(200, 90, 40, 0.09) 0%, transparent 55%)",
            filter: "blur(100px)",
          }}
        />

        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1000, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            bottom: "-35%",
            right: "-30%",
            width: "140%",
            height: "100%",
            background:
              "radial-gradient(ellipse at 60% 50%, rgba(255, 140, 26, 0.07) 0%, transparent 55%)",
            filter: "blur(110px)",
          }}
        />

        <motion.div
          animate={{
            opacity: [0.25, 0.42, 0.25],
            scale: [1, 1.04, 1],
          }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "80%",
            height: "50%",
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(255, 179, 71, 0.2) 0%, rgba(255, 140, 26, 0.06) 45%, transparent 75%)",
            filter: "blur(80px)",
          }}
        />

        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            y: useTransformHelper(smoothScrollY, (v) => -v * 0.05),
          }}
        >
          {stars.far.map((s) => (
            <motion.div
              key={`far-${s.id}`}
              animate={{ opacity: [0.08, 0.42, 0.08] }}
              transition={{
                duration: s.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: s.delay,
              }}
              style={{
                position: "absolute",
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.size,
                height: s.size,
                borderRadius: "50%",
                background: "#FFF4E6",
              }}
            />
          ))}

          {stars.mid.map((s) => (
            <motion.div
              key={`mid-${s.id}`}
              animate={{
                opacity: [0.3, 0.85, 0.3],
                scale: [1, 1.08, 1],
              }}
              transition={{
                duration: s.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: s.delay,
              }}
              style={{
                position: "absolute",
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.size,
                height: s.size,
                borderRadius: "50%",
                background: "#FFF4E6",
                boxShadow:
                  "0 0 5px rgba(255, 244, 230, 0.85), 0 0 12px rgba(255, 228, 181, 0.5)",
              }}
            />
          ))}

          {stars.bright.map((s, i) => (
            <motion.div
              key={`bright-${i}`}
              animate={{
                opacity: [0.5, 1, 0.5],
                rotate: [0, 360],
              }}
              transition={{
                opacity: {
                  duration: 7 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                rotate: {
                  duration: 120 + i * 20,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
              style={{
                position: "absolute",
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: "16px",
                height: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "0.8px",
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255, 244, 230, 0.7) 50%, transparent 100%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: "0.8px",
                  height: "100%",
                  background:
                    "linear-gradient(180deg, transparent 0%, rgba(255, 244, 230, 0.7) 50%, transparent 100%)",
                }}
              />
              <div
                style={{
                  width: "2px",
                  height: "2px",
                  borderRadius: "50%",
                  background: "#FFF4E6",
                  boxShadow:
                    "0 0 6px rgba(255, 244, 230, 1), 0 0 14px rgba(255, 216, 155, 0.7)",
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {stars.dust.map((s) => (
          <motion.div
            key={`dust-${s.id}`}
            animate={{
              x: [0, 40, -30, 24, 0],
              y: [0, -34, 26, -20, 0],
              opacity: [0, 0.28, 0.48, 0.28, 0],
            }}
            transition={{
              duration: s.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: s.delay,
              times: [0, 0.25, 0.5, 0.75, 1],
            }}
            style={{
              position: "absolute",
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: "#FFE4B5",
              filter: "blur(0.8px)",
            }}
          />
        ))}

        {[0, 1, 2, 3].map((i) => {
          const startX = 18 + i * 22;
          const startY = 22 + (i % 2) * 58;
          return (
            <motion.div
              key={`orb-${i}`}
              animate={{
                x: [0, 65, -40, 50, 0],
                y: [0, -55, 32, -28, 0],
                opacity: [0.12, 0.32, 0.12],
              }}
              transition={{
                duration: 44 + i * 14,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 6,
              }}
              style={{
                position: "absolute",
                left: `${startX}%`,
                top: `${startY}%`,
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(255, 216, 155, 0.35) 0%, rgba(255, 140, 26, 0.08) 45%, transparent 72%)",
                filter: "blur(28px)",
              }}
            />
          );
        })}

        <motion.div
          animate={{
            x: ["-25%", "125%"],
            y: ["18%", "32%"],
            opacity: [0, 0, 0.9, 0.9, 0, 0],
          }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            repeatDelay: 24,
            ease: "easeInOut",
            delay: 6,
          }}
          style={{
            position: "absolute",
            width: "160px",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255, 244, 230, 0.3) 55%, #FFF4E6 100%)",
            boxShadow: "0 0 16px rgba(255, 244, 230, 0.8)",
            transform: "rotate(-10deg)",
            transformOrigin: "right center",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 45%, transparent 30%, rgba(8, 3, 3, 0.4) 65%, rgba(5, 2, 2, 0.85) 88%, rgba(3, 1, 1, 0.98) 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.14'/%3E%3C/svg%3E\")",
            opacity: 0.25,
            mixBlendMode: "overlay",
          }}
        />
      </div>

      {/* ═══════════════ SCROLLING CONTENT ═══════════════ */}
      <div
        style={{
          position: "relative",
          maxWidth: "32rem",
          margin: "0 auto",
          padding: "60vh 1.5rem 60vh",
          zIndex: 5,
        }}
      >
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "0% 200%", "0% 0%"],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: "50%",
            top: "10vh",
            bottom: "10vh",
            width: "1px",
            transform: "translateX(-50%)",
            background:
              "linear-gradient(180deg, transparent 0%, rgba(255, 179, 71, 0.3) 22%, rgba(255, 216, 155, 0.8) 50%, rgba(255, 179, 71, 0.3) 78%, transparent 100%)",
            backgroundSize: "100% 200%",
            boxShadow: "0 0 24px rgba(255, 179, 71, 0.25)",
            pointerEvents: "none",
          }}
        />

        <motion.div
          animate={{ top: `${smoothProgress}%` }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "absolute",
            left: "50%",
            width: "10px",
            height: "160px",
            transform: "translateX(-50%)",
            background:
              "linear-gradient(180deg, transparent 0%, rgba(255, 216, 155, 0.85) 50%, transparent 100%)",
            filter: "blur(12px)",
            pointerEvents: "none",
            opacity: 0.85,
          }}
        />

        {/* INTRO NODE */}
        <div
          ref={(el) => {
            nodesRef.current[0] = el;
          }}
          style={{
            position: "relative",
            padding: "3rem 0",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TimelineDot active={visibleIndex === 0} />
          <h1
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: "clamp(2.4rem, 9.5vw, 3.75rem)",
              fontWeight: 700,
              color: "#FFF4E6",
              margin: "2rem 0 1rem",
              lineHeight: 1.05,
              letterSpacing: "0.005em",
              textShadow:
                "0 0 45px rgba(255, 179, 71, 0.6), 0 0 90px rgba(255, 140, 26, 0.35)",
            }}
          >
            For Sakshii
          </h1>
          <p
            style={{
              fontFamily: "'Crimson Pro', serif",
              fontStyle: "italic",
              fontSize: "clamp(0.95rem, 3.5vw, 1.1rem)",
              color: "#E8B877",
              margin: 0,
              maxWidth: "22rem",
              lineHeight: 1.7,
              letterSpacing: "0.02em",
              opacity: 0.8,
            }}
          >
            scroll — walk through a few things
          </p>
        </div>

        {/* QUALITY NODES */}
        {qualities.map((q, i) => {
          const isActive = visibleIndex === i + 1;
          return (
            <div
              key={`node-${i}`}
              ref={(el) => {
                nodesRef.current[i + 1] = el;
              }}
              style={{
                position: "relative",
                padding: "5rem 0",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: "70vh",
                justifyContent: "center",
              }}
            >
              <TimelineDot active={isActive} />

              <motion.div
                animate={{
                  opacity: isActive ? 0.75 : 0.35,
                  y: isActive ? 0 : 4,
                }}
                transition={{
                  duration: 1.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "clamp(0.62rem, 2.1vw, 0.72rem)",
                  color: "#E8B877",
                  letterSpacing: "0.4em",
                  marginTop: "2rem",
                }}
              >
                {String(i + 1).padStart(2, "0")}
                <span style={{ opacity: 0.4, margin: "0 0.4em" }}>/</span>08
              </motion.div>

              {q.word && (
                <motion.h2
                  animate={{
                    textShadow: isActive
                      ? [
                          "0 0 32px rgba(255, 179, 71, 0.85), 0 0 64px rgba(255, 140, 26, 0.55)",
                          "0 0 52px rgba(255, 216, 155, 1), 0 0 104px rgba(255, 179, 71, 0.85)",
                          "0 0 32px rgba(255, 179, 71, 0.85), 0 0 64px rgba(255, 140, 26, 0.55)",
                        ]
                      : "0 0 28px rgba(255, 179, 71, 0.5), 0 0 56px rgba(255, 140, 26, 0.28)",
                    scale: isActive ? 1.02 : 1,
                    letterSpacing: isActive ? "0.01em" : "0em",
                  }}
                  transition={{
                    textShadow: {
                      duration: 6,
                      repeat: isActive ? Infinity : 0,
                      ease: "easeInOut",
                    },
                    scale: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
                    letterSpacing: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
                  }}
                  style={{
                    fontFamily: "'Caveat', cursive",
                    fontSize: "clamp(2.4rem, 11vw, 3.75rem)",
                    fontWeight: 700,
                    color: "#FFF4E6",
                    margin: "1.4rem 0 1.4rem",
                    lineHeight: 1,
                  }}
                >
                  {q.word}
                </motion.h2>
              )}

              <motion.div
                animate={{
                  opacity: isActive ? 0.9 : 0.4,
                  width: isActive ? "64px" : "44px",
                }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  height: "1px",
                  margin: q.word ? "0 0 1.8rem" : "1.5rem 0 1.8rem",
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255, 179, 71, 0.85) 50%, transparent 100%)",
                }}
              />

              <motion.p
                animate={{ opacity: isActive ? 1 : 0.65 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: "'Crimson Pro', serif",
                  fontStyle: "italic",
                  fontSize: q.isFinal
                    ? "clamp(0.9rem, 3.2vw, 1.05rem)"
                    : "clamp(1rem, 3.6vw, 1.18rem)",
                  lineHeight: 1.8,
                  color: "#FFF4E6",
                  margin: 0,
                  maxWidth: "26rem",
                  letterSpacing: "0.008em",
                  fontWeight: 300,
                }}
              >
                {q.reveal}
              </motion.p>
            </div>
          );
        })}

        {/* FINAL NODE */}
        <div
          ref={(el) => {
            nodesRef.current[qualities.length + 1] = el;
          }}
          style={{
            position: "relative",
            padding: "5rem 0",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "70vh",
            justifyContent: "center",
          }}
        >
          <TimelineDot active={visibleIndex === qualities.length + 1} />

          <motion.h1
            animate={{
              textShadow: [
                "0 0 45px rgba(255, 216, 155, 0.8), 0 0 90px rgba(255, 179, 71, 0.55)",
                "0 0 75px rgba(255, 216, 155, 1), 0 0 160px rgba(255, 179, 71, 0.95)",
                "0 0 45px rgba(255, 216, 155, 0.8), 0 0 90px rgba(255, 179, 71, 0.55)",
              ],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: "clamp(3.4rem, 15vw, 6.5rem)",
              fontWeight: 700,
              color: "#FFF4E6",
              margin: "2rem 0 0",
              lineHeight: 1,
              letterSpacing: "0.02em",
            }}
          >
            Sakchii
          </motion.h1>

          <p
            style={{
              fontFamily: "'Crimson Pro', serif",
              fontStyle: "italic",
              fontSize: "clamp(0.95rem, 3.3vw, 1.12rem)",
              lineHeight: 1.85,
              color: "#FFF4E6",
              marginTop: "2.5rem",
              marginBottom: 0,
              maxWidth: "26rem",
              opacity: 0.9,
              letterSpacing: "0.008em",
              fontWeight: 300,
            }}
          >
            You can achieve anything you want. You already have the fire. Just
            keep turning toward the light.
          </p>

          <p
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: "clamp(1.3rem, 5.5vw, 1.95rem)",
              color: "#E8B877",
              marginTop: "2.75rem",
              marginBottom: 0,
              textShadow: "0 0 28px rgba(255, 179, 71, 0.6)",
              letterSpacing: "0.01em",
            }}
          >
            — Neech
          </p>
        </div>
      </div>
    </div>
  );
}

function TimelineDot({ active }: { active: boolean }) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "44px",
        height: "44px",
      }}
    >
      <motion.div
        animate={{
          opacity: active ? [0.4, 0.75, 0.4] : 0,
          scale: active ? [1, 1.5, 1] : 1,
        }}
        transition={{
          duration: 5,
          repeat: active ? Infinity : 0,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255, 216, 155, 0.55) 0%, rgba(255, 179, 71, 0.2) 45%, transparent 78%)",
          filter: "blur(10px)",
          pointerEvents: "none",
        }}
      />
      <motion.div
        animate={{
          opacity: active ? [0.6, 1, 0.6] : 0,
          scale: active ? [0.9, 1.15, 0.9] : 0.9,
        }}
        transition={{
          duration: 5,
          repeat: active ? Infinity : 0,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          width: "22px",
          height: "22px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255, 244, 230, 0.9) 0%, transparent 70%)",
          filter: "blur(6px)",
          pointerEvents: "none",
        }}
      />
      <motion.div
        animate={{
          boxShadow: active
            ? "0 0 16px rgba(255, 216, 155, 1), 0 0 32px rgba(255, 179, 71, 0.7)"
            : "0 0 6px rgba(194, 98, 52, 0.35)",
          scale: active ? 1.1 : 1,
        }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: "clamp(12px, 3.2vw, 15px)",
          height: "clamp(12px, 3.2vw, 15px)",
          borderRadius: "50%",
          background: active
            ? "radial-gradient(circle at 40% 35%, #FFF4E6 0%, #FFD89B 40%, #FFB347 75%, #FF8C1A 100%)"
            : "radial-gradient(circle at 40% 35%, #4A1F10 0%, #2D1410 70%, #1A0A05 100%)",
          zIndex: 2,
        }}
      />
    </div>
  );
}

function useTransformHelper(
  motionValue: any,
  transform: (v: number) => number
) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const unsub = motionValue.on("change", (v: number) => {
      setValue(transform(v));
    });
    return unsub;
  }, [motionValue, transform]);

  return value;
}

function useMemoStars() {
  return {
    far: Array.from({ length: 55 }).map((_, i) => ({
      id: i,
      x: ((i * 137.508) % 100) + ((i * 7.3) % 3) - 1.5,
      y: ((i * 89.317) % 100) + ((i * 3.7) % 4) - 2,
      size: 0.5 + ((i * 13) % 4) * 0.25,
      delay: (i * 0.21) % 8,
      duration: 7 + (i % 5),
    })),
    mid: Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      x: ((i * 173.717) % 100) + ((i * 5.1) % 4) - 2,
      y: ((i * 71.213) % 100) + ((i * 2.9) % 3) - 1.5,
      size: 1.4 + ((i * 17) % 3) * 0.3,
      delay: (i * 0.42) % 6,
      duration: 6 + (i % 4),
    })),
    bright: [
      { x: 15, y: 22 },
      { x: 78, y: 18 },
      { x: 42, y: 65 },
      { x: 88, y: 58 },
      { x: 22, y: 82 },
    ],
    dust: Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: (i * 137.5) % 100,
      y: (i * 89.3) % 100,
      size: 0.9 + (i % 4) * 0.5,
      delay: (i * 0.6) % 8,
      duration: 28 + (i % 6) * 5,
    })),
  };
}