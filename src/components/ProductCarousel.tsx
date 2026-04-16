import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/data";

interface Props {
  products: Product[];
}

export function ProductCarousel({ products }: Props) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % products.length);
  }, [products.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + products.length) % products.length);
  }, [products.length]);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  const product = products[current];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-surface">
      <div className="flex items-center justify-between p-8 md:p-16 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col md:flex-row items-center gap-8 md:gap-16 w-full"
          >
            <div className="flex-1 text-center md:text-left">
              {product.badge && (
                <span className="inline-block text-xs font-medium tracking-wide uppercase text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
                  {product.badge}
                </span>
              )}
              <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-3">
                {product.name}
              </h3>
              <p className="text-muted-foreground mb-4 max-w-md">{product.description}</p>
              <div className="flex items-baseline gap-3 justify-center md:justify-start mb-6">
                <span className="text-2xl font-semibold text-primary tabular-nums">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-muted-foreground line-through tabular-nums">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <Link
                to={`/product/${product.id}`}
                className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
              >
                View Details
              </Link>
            </div>

            <motion.img
              src={product.image}
              alt={product.name}
              className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl"
              initial={{ scale: 0.8, rotateY: -15 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ duration: 0.6 }}
              style={{ perspective: "1000px" }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center text-foreground hover:bg-background transition-colors shadow-ambient"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center text-foreground hover:bg-background transition-colors shadow-ambient"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current ? "bg-primary w-6" : "bg-foreground/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
