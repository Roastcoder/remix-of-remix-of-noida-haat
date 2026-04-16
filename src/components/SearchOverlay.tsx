import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "@/hooks/use-products";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SearchOverlay({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const { data: products = [] } = useProducts();

  const filtered = query.length > 1
    ? products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase()))
    : [];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) onClose();
      }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-foreground/20 backdrop-blur-md flex items-start justify-center pt-[20vh]" onClick={onClose}>
          <motion.div initial={{ opacity: 0, y: -20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }} transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="bg-background rounded-2xl shadow-xl w-full max-w-xl mx-4 overflow-hidden border border-border"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..." className="flex-1 bg-transparent outline-none text-foreground text-lg placeholder:text-muted-foreground" />
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            {filtered.length > 0 && (
              <div className="max-h-80 overflow-y-auto p-2">
                {filtered.map((product) => (
                  <Link key={product.id} to={`/product/${product.id}`} onClick={onClose}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted transition-colors">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      {product.image ? <img src={product.image} alt={product.name} className="w-10 h-10 object-contain" /> : <Search className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{product.category.replace(/-/g, ' ')} · ₹{product.price.toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {query.length > 1 && filtered.length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-sm">No products found for "{query}"</div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
