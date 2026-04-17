import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useBanners } from "@/hooks/use-banners";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const fallbackSlides = [
  { image: hero1, title: "Premium Bed Linen Collection", subtitle: "Egyptian cotton bedsheets with luxurious gold embroidery", cta: "Shop Now", ctaLink: "/category/bedlinen" },
  { image: hero2, title: "Luxury Towel Collection", subtitle: "Plush Egyptian cotton towels for the ultimate spa experience", cta: "Explore Towels", ctaLink: "/category/towels" },
  { image: hero3, title: "Designer Cushion Collection", subtitle: "Handcrafted velvet cushions with intricate gold embroidery", cta: "Shop Cushions", ctaLink: "/category/cushions" },
];

export function PremiumHeroBanner() {
  const [current, setCurrent] = useState(0);
  const { t } = useTranslation();
  const { data: dbBanners } = useBanners("home", "hero");

  const slides = dbBanners && dbBanners.length > 0
    ? dbBanners.map(b => ({ image: b.image_url, title: b.title, subtitle: b.subtitle, cta: b.cta_text, ctaLink: b.cta_link }))
    : fallbackSlides;

  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => { const timer = setInterval(next, 5500); return () => clearInterval(timer); }, [next]);
  useEffect(() => { if (current >= slides.length) setCurrent(0); }, [slides.length, current]);

  const slide = slides[current] || slides[0];
  if (!slide) return null;

  return (
    <section className="relative w-full h-[100svh] min-h-[560px] overflow-hidden bg-foreground">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative h-full max-w-[1400px] mx-auto px-6 sm:px-10 md:px-16 flex items-center">
        <motion.div
          key={`text-${current}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl"
        >
          <p className="text-primary-foreground/70 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.3em] mb-4">
            {t("tagline")}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-5 sm:mb-7 drop-shadow-lg">
            {slide.title}
          </h1>
          <p className="text-white/80 text-sm sm:text-base md:text-lg mb-8 max-w-lg leading-relaxed">
            {slide.subtitle}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to={slide.ctaLink}
              className="inline-block px-8 sm:px-10 py-3.5 bg-primary text-primary-foreground rounded-full font-semibold text-sm hover:opacity-90 transition-all shadow-2xl hover:scale-[1.02]"
            >
              {slide.cta}
            </Link>
            <Link
              to="/about"
              className="inline-block px-8 sm:px-10 py-3.5 border border-white/30 text-white rounded-full font-semibold text-sm hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              Our Story
            </Link>
          </div>
        </motion.div>
      </div>

      <button onClick={prev} className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10 border border-white/20">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={next} className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10 border border-white/20">
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${i === current ? "bg-primary w-10" : "bg-white/40 w-2 hover:bg-white/60"}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
