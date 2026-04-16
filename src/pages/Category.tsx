import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";
import { categories } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";

const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Newest"];
const priceRanges = ["All", "Under ₹500", "₹500 – ₹1,500", "₹1,500 – ₹5,000", "Over ₹5,000"];

export default function Category() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { data: products = [], isLoading } = useProducts();
  const [sort, setSort] = useState("Featured");
  const [priceFilter, setPriceFilter] = useState("All");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = categories.find((c) => c.slug === slug);
  const categoryName = category?.name || (slug === "all" ? "All Products" : slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : "All Products");

  const filtered = useMemo(() => {
    let result = slug && slug !== "all" ? products.filter((p) => p.category === slug) : [...products];
    if (priceFilter !== "All") {
      result = result.filter((p) => {
        if (priceFilter === "Under ₹500") return p.price < 500;
        if (priceFilter === "₹500 – ₹1,500") return p.price >= 500 && p.price <= 1500;
        if (priceFilter === "₹1,500 – ₹5,000") return p.price >= 1500 && p.price <= 5000;
        if (priceFilter === "Over ₹5,000") return p.price > 5000;
        return true;
      });
    }
    if (sort === "Price: Low to High") result.sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low") result.sort((a, b) => b.price - a.price);
    return result;
  }, [slug, products, sort, priceFilter]);

  return (
    <div className="bg-background">
      <section className="py-6 sm:py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground">{t("home")}</Link>
            <span>/</span>
            <span className="text-foreground">{categoryName}</span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">{categoryName}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">{filtered.length} {t("products").toLowerCase()}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setFiltersOpen(!filtersOpen)}
                className="flex items-center gap-1.5 text-xs font-medium text-foreground px-3 py-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors">
                <SlidersHorizontal className="w-3.5 h-3.5" /> {t("filters")}
              </button>
              <div className="relative">
                <select value={sort} onChange={(e) => setSort(e.target.value)}
                  className="appearance-none text-xs font-medium text-foreground px-3 py-2 pr-7 bg-card border border-border rounded-lg outline-none cursor-pointer">
                  {sortOptions.map((o) => <option key={o}>{o}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          <AnimatePresence>
            {filtersOpen && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-4">
                <div className="bg-card rounded-xl p-4 border border-border">
                  <FilterGroup label={t("price")} options={priceRanges} value={priceFilter} onChange={setPriceFilter} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-card rounded-xl border border-border p-3 sm:p-4">
                  <Skeleton className="w-full aspect-square rounded-lg mb-3" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2 mb-2" />
                  <Skeleton className="h-5 w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground text-sm">{t("noProducts")}</div>
          )}
        </div>
      </section>
    </div>
  );
}

function FilterGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="text-[10px] font-medium tracking-wide uppercase text-muted-foreground mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button key={opt} onClick={() => onChange(opt)}
            className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors ${
              value === opt ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
