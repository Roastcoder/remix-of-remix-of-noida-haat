import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  image: string;
  title: string;
  subtitle?: string;
  cta?: string;
  ctaLink?: string;
}

interface HeroCarouselProps {
  slides: Slide[];
  autoPlay?: number;
}

export function HeroCarousel({ slides, autoPlay = 5000 }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((p) => (p + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(next, autoPlay);
    return () => clearInterval(timer);
  }, [next, autoPlay]);

  const slide = slides[current];

  return (
    <section className="relative w-full overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 py-4">
        <div className="relative rounded-2xl overflow-hidden aspect-[5/1]">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                width={1920}
                height={512}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12">
                {slide.subtitle && (
                  <p className="text-xs md:text-sm font-semibold tracking-widest uppercase text-primary-foreground/80 mb-2">
                    {slide.subtitle}
                  </p>
                )}
                <h2 className="text-xl sm:text-3xl md:text-5xl font-bold text-primary-foreground leading-tight max-w-lg">
                  {slide.title}
                </h2>
                {slide.cta && slide.ctaLink && (
                  <Link
                    to={slide.ctaLink}
                    className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-xs md:text-sm font-semibold hover:opacity-90 transition-opacity w-fit"
                  >
                    {slide.cta}
                  </Link>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav arrows */}
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-background/50 backdrop-blur flex items-center justify-center text-foreground hover:bg-background/70 transition-colors z-10"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-background/50 backdrop-blur flex items-center justify-center text-foreground hover:bg-background/70 transition-colors z-10"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > current ? 1 : -1);
                  setCurrent(i);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? "w-6 bg-primary" : "w-1.5 bg-primary-foreground/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
