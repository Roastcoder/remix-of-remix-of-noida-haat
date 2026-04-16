import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/lib/data";

interface Props {
  products: Product[];
}

export function HeroProductShowcase({ products }: Props) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % products.length);
  }, [products.length]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const product = products[current];

  return (
    <section className="py-24 bg-surface overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={product.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="relative flex flex-col lg:flex-row items-center gap-12 lg:gap-20 min-h-[450px]"
          >
            {/* Large product image */}
            <motion.div
              className="flex-1 flex justify-center"
              initial={{ scale: 0.85, rotateY: -20 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              style={{ perspective: "1200px" }}
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-72 h-72 lg:w-96 lg:h-96 object-contain drop-shadow-2xl relative z-10"
                />
                {/* Glow effect */}
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-[80px] scale-110" />
              </div>
            </motion.div>

            {/* Product info */}
            <motion.div
              className="flex-1 text-center lg:text-left"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {product.badge && (
                <span className="inline-block text-xs font-medium tracking-widest uppercase text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4">
                  {product.badge}
                </span>
              )}
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4 leading-tight">
                {product.name}
              </h2>
              <p className="text-muted-foreground text-lg mb-6 max-w-md">{product.description}</p>
              <div className="flex flex-wrap gap-2 mb-6 justify-center lg:justify-start">
                {product.specs.slice(0, 3).map((spec) => (
                  <span key={spec} className="text-xs font-medium text-foreground bg-background px-3 py-1.5 rounded-full">
                    {spec}
                  </span>
                ))}
              </div>
              <div className="flex items-baseline gap-3 mb-8 justify-center lg:justify-start">
                <span className="text-3xl font-semibold text-primary tabular-nums">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through tabular-nums">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <div className="flex gap-4 justify-center lg:justify-start">
                <Link
                  to={`/product/${product.id}`}
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity"
                >
                  View Details
                </Link>
                <Link
                  to={`/category/${product.category}`}
                  className="px-8 py-4 text-foreground bg-background rounded-full font-medium hover:bg-surface transition-colors"
                >
                  More Like This
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Product selector */}
        <div className="flex justify-center gap-3 mt-12">
          {products.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setCurrent(i)}
              className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
                i === current
                  ? "ring-2 ring-primary scale-110"
                  : "opacity-50 hover:opacity-80"
              }`}
            >
              <img src={p.image} alt={p.name} className="w-14 h-14 object-contain bg-background p-1 rounded-xl" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
