import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { useProducts } from "@/hooks/use-products";
import { AnimatedSection } from "./AnimatedSection";

function useCountdown() {
  const getEnd = () => {
    const now = new Date();
    const end = new Date(now);
    end.setHours(21, 0, 0, 0);
    if (now >= end) end.setDate(end.getDate() + 1);
    return end;
  };

  const [diff, setDiff] = useState(() => Math.max(0, Math.floor((getEnd().getTime() - Date.now()) / 1000)));

  useEffect(() => {
    const id = setInterval(() => {
      setDiff(Math.max(0, Math.floor((getEnd().getTime() - Date.now()) / 1000)));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const h = String(Math.floor(diff / 3600)).padStart(2, "0");
  const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
  const s = String(diff % 60).padStart(2, "0");
  return { h, m, s };
}

export function DealsSection() {
  const { h, m, s } = useCountdown();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: products = [] } = useProducts();

  const dealProducts = products.filter((p) => p.originalPrice);

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  if (dealProducts.length === 0) return null;

  return (
    <section className="py-24 bg-background">
      <div className="max-w-[1440px] mx-auto px-6">
        <AnimatedSection>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
            <div className="flex items-center gap-3">
              <Flame className="w-6 h-6 text-destructive" />
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Today's Hot Deals</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground uppercase tracking-widest">Ends in</span>
              <div className="flex gap-1.5">
                {[h, m, s].map((v, i) => (
                  <span key={i} className="bg-card border border-border px-3 py-2 rounded-lg text-lg font-bold text-primary tabular-nums">{v}</span>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        <div className="relative">
          <div ref={scrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6 snap-x">
            {dealProducts.map((product, i) => (
              <div key={product.id} className="min-w-[280px] max-w-[280px] snap-start">
                <ProductCard product={product} index={i} />
              </div>
            ))}
          </div>
          <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center text-foreground hover:bg-muted transition-colors z-10">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center text-foreground hover:bg-muted transition-colors z-10">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
