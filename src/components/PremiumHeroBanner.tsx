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

  useEffect(() => { const timer = setInterval(next, 5000); return () => clearInterval(timer); }, [next]);
  useEffect(() => { if (current >= slides.length) setCurrent(0); }, [slides.length, current]);

  const slide = slides[current] || slides[0];
  if (!slide) return null;

  return (
    <section className="w-full bg-muted/20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3">
        <div className="relative rounded-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="relative">
              <img src={slide.image} alt={slide.title} className="w-full h-[220px] sm:h-[320px] md:h-[400px] lg:h-[460px] object-cover" width={1920} height={640} />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="px-6 sm:px-10 md:px-16 max-w-xl">
                  <p className="text-white/60 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-2">{t("tagline")}</p>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-2 sm:mb-4 drop-shadow-md">{slide.title}</h1>
                  <p className="text-white/80 text-xs sm:text-sm md:text-base mb-4 sm:mb-6 drop-shadow max-w-md">{slide.subtitle}</p>
                  <Link to={slide.ctaLink} className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-xs sm:text-sm hover:opacity-90 transition-colors shadow-lg">{slide.cta}</Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button onClick={prev} className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors z-10">
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button onClick={next} className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors z-10">
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`h-2 rounded-full transition-all ${i === current ? "bg-white w-6" : "bg-white/40 w-2"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}