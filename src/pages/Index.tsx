import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Truck, Shield, Gem } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ProductCard } from "@/components/ProductCard";
import { PremiumHeroBanner } from "@/components/PremiumHeroBanner";
import { ContactSection } from "@/components/ContactSection";
import { useBanners } from "@/hooks/use-banners";
import { useProducts } from "@/hooks/use-products";
import { categories } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";

import bannerArtisan from "@/assets/banner-artisan.jpg";
import bannerEco from "@/assets/banner-eco.jpg";

const trustBadges = [
  { icon: Truck, label: "freeDelivery", desc: "acrossIndia" },
  { icon: Shield, label: "premiumQuality", desc: "genuineProducts" },
  { icon: Gem, label: "handcrafted", desc: "genuineProducts" },
];

const fallbackPromos = [
  { image: bannerArtisan, title: "Artisan Fabric Collection", subtitle: "Handwoven by master craftspeople for your home", link: "/about" },
  { image: bannerEco, title: "Sustainable Luxury", subtitle: "Organic cotton & eco-friendly textiles for conscious living", link: "/category/bedlinen" },
];

function PromoBannerCard({ image, title, subtitle, link }: { image: string; title: string; subtitle: string; link: string }) {
  return (
    <section className="py-2">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <Link to={link} className="block rounded-xl overflow-hidden relative group">
          <img src={image} alt={title} className="w-full h-[120px] sm:h-[160px] md:h-[180px] object-cover group-hover:scale-[1.02] transition-transform duration-500" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-6 sm:px-8">
            <div>
              <h3 className="text-white text-sm sm:text-lg md:text-2xl font-bold">{title}</h3>
              <p className="text-white/80 text-xs sm:text-sm mt-1">{subtitle}</p>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card rounded-xl border border-border p-3 sm:p-4">
          <Skeleton className="w-full aspect-square rounded-lg mb-3" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2 mb-2" />
          <Skeleton className="h-5 w-1/3" />
        </div>
      ))}
    </div>
  );
}

const categorySlugToDb: Record<string, string> = {
  bedlinen: "Bed Linen",
  towels: "Towels",
  rugs: "Rugs",
  cushions: "Cushions",
  tablelinen: "Table Linen",
  curtains: "Curtains",
  blankets: "Blankets",
};

export default function Index() {
  const { t } = useTranslation();
  const { data: dbPromos } = useBanners("home", "promo");
  const { data: products = [], isLoading } = useProducts();

  const promos = dbPromos && dbPromos.length > 0
    ? dbPromos.map(b => ({ image: b.image_url, title: b.title, subtitle: b.subtitle || "", link: b.cta_link }))
    : fallbackPromos;

  const getProductsByCategory = (slug: string) => {
    const dbCat = categorySlugToDb[slug] || slug;
    return products.filter(p => p.category.toLowerCase() === dbCat.toLowerCase());
  };

  return (
    <div className="bg-background">
      <PremiumHeroBanner />

      {/* Trust Badges */}
      <section className="py-4 sm:py-6 bg-background">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {trustBadges.map((b, i) => (
              <motion.div key={b.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-card rounded-xl border border-border">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <b.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-foreground">{t(b.label)}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{t(b.desc)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Collection - horizontal scroll on mobile, grid on desktop */}
      <section className="py-6 sm:py-8 bg-background">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-xl sm:text-3xl font-bold text-foreground mb-5">{t("shopByCategory")}</h2>
          {/* Mobile: horizontal scroll */}
          <div className="md:hidden -mx-4 px-4 overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 pb-2" style={{ width: "max-content" }}>
              {categories.map((cat, i) => (
                <motion.div key={cat.slug} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.03 }}>
                  <Link to={`/category/${cat.slug}`}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border border-border hover:shadow-lg hover:border-primary/30 transition-all group w-[100px]">
                    <div className="w-16 h-16 rounded-xl overflow-hidden">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" loading="lazy" />
                    </div>
                    <span className="text-[10px] font-medium text-foreground text-center leading-tight line-clamp-2">{cat.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
          {/* Desktop: grid */}
          <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((cat, i) => (
              <motion.div key={cat.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.03 }}>
                <Link to={`/category/${cat.slug}`}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl bg-card border border-border hover:shadow-lg hover:border-primary/20 transition-all group">
                  <div className="w-20 h-20 rounded-xl overflow-hidden">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" loading="lazy" />
                  </div>
                  <span className="text-xs font-medium text-foreground text-center leading-tight">{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {promos[0] && <PromoBannerCard {...promos[0]} />}

      {/* Category-wise Product Sections */}
      {categories.map((cat, catIndex) => {
        const catProducts = getProductsByCategory(cat.slug);
        if (catProducts.length === 0 && !isLoading) return null;
        return (
          <section key={cat.slug} className={`py-6 sm:py-8 ${catIndex % 2 === 0 ? "bg-background" : "bg-muted/20"}`}>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg sm:text-2xl font-bold text-foreground">{cat.name}</h2>
                <Link to={`/category/${cat.slug}`} className="text-primary text-xs sm:text-sm font-medium hover:underline">{t("viewAll")} →</Link>
              </div>
              {isLoading ? <ProductGridSkeleton /> : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {catProducts.slice(0, 4).map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>
              )}
            </div>
            {catIndex === 1 && promos[1] && <div className="mt-6"><PromoBannerCard {...promos[1]} /></div>}
          </section>
        );
      })}

      <ContactSection />

      {/* Newsletter */}
      <section className="py-8 sm:py-10 bg-muted/30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="max-w-xl mx-auto text-center">
            <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-3" />
            <h2 className="text-lg sm:text-2xl font-bold text-foreground mb-2">{t("stayUpdated")}</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mb-5">{t("newsletterDesc")}</p>
            <form className="flex gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" className="flex-1 px-3 sm:px-4 py-2.5 bg-card rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 border border-border" />
              <button type="submit" className="px-4 sm:px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-xs sm:text-sm hover:opacity-90 transition-opacity">{t("subscribe")}</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}