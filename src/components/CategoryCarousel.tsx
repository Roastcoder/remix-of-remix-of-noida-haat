import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface Category {
  name: string;
  slug: string;
  image: string;
}

interface Props {
  categories: Category[];
}

export function CategoryCarousel({ categories }: Props) {
  const [offset, setOffset] = useState(0);
  const [paused, setPaused] = useState(false);
  const itemsPerView = 4; // visible at a time on desktop
  const total = categories.length;

  const next = useCallback(() => {
    setOffset((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setOffset((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 3000);
    return () => clearInterval(timer);
  }, [next, paused]);

  // Get visible items with wrap-around
  const getVisible = () => {
    const items = [];
    for (let i = 0; i < total; i++) {
      items.push(categories[(offset + i) % total]);
    }
    return items;
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="overflow-hidden">
        <motion.div
          className="flex gap-4 md:gap-6"
          animate={{ x: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        >
          <AnimatePresence mode="popLayout">
            {getVisible().map((cat, i) => (
              <motion.div
                key={`${cat.slug}-${offset}-${i}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="min-w-[calc(50%-8px)] md:min-w-[calc(33.333%-16px)] lg:min-w-[calc(16.666%-20px)] shrink-0"
              >
                <Link
                  to={`/category/${cat.slug}`}
                  className="group bg-background rounded-3xl p-6 flex flex-col items-center text-center shadow-ambient hover:shadow-elevated transition-all duration-500 hover:-translate-y-2 block"
                >
                  <div className="relative w-20 h-20 md:w-24 md:h-24 mb-4">
                    <motion.img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-contain"
                      whileHover={{ scale: 1.15, rotateY: 15 }}
                      transition={{ duration: 0.4 }}
                      style={{ perspective: "600px" }}
                    />
                    <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">{cat.name}</h3>
                  <span className="text-xs text-primary mt-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Browse <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Nav buttons */}
      <button
        onClick={prev}
        className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background shadow-elevated flex items-center justify-center text-foreground hover:bg-surface transition-colors z-10"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background shadow-elevated flex items-center justify-center text-foreground hover:bg-surface transition-colors z-10"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mt-6">
        {categories.map((_, i) => (
          <button
            key={i}
            onClick={() => setOffset(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === offset % total ? "bg-primary w-6" : "bg-foreground/15 w-1.5"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
