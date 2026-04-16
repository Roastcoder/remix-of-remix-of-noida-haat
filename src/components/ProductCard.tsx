import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/data";

interface Props {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: Props) {
  const { addItem } = useCart();
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <div className="bg-card rounded-xl border border-border p-3 sm:p-4 flex flex-col relative overflow-hidden group hover:shadow-md hover:border-primary/20 transition-all duration-300">
        {product.badge && (
          <span className={`absolute top-2 left-2 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full z-10 ${
            product.badge === "New" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
          }`}>
            {product.badge}
          </span>
        )}

        <Link to={`/product/${product.id}`} className="w-full">
          <div className="w-full aspect-square flex items-center justify-center mb-3 bg-muted/30 rounded-lg overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-muted rounded-lg" />
            )}
          </div>

          <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-0.5 line-clamp-2 leading-snug">{product.name}</h3>
          <p className="text-[11px] text-muted-foreground mb-1.5">{product.brand}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, j) => (
              <Star key={j} className={`w-3 h-3 ${j < Math.round(product.rating) ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/20"}`} />
            ))}
            <span className="text-[10px] text-muted-foreground ml-0.5">({product.reviews})</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-bold text-foreground tabular-nums">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-[11px] text-muted-foreground line-through tabular-nums">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
            {product.originalPrice && (
              <span className="text-[10px] font-semibold text-emerald-600">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
              </span>
            )}
          </div>
        </Link>

        <button
          onClick={(e) => { e.preventDefault(); addItem(product); }}
          className="mt-3 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {t("addToCart")}
        </button>
      </div>
    </motion.div>
  );
}
