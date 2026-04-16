import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, Star, Palette, Ruler, Package } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { useCart } from "@/lib/cart";
import { ProductCard } from "@/components/ProductCard";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const specIcons: Record<string, any> = {
  0: Palette, 1: Ruler, 2: Package, 3: Star,
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { data: products = [], isLoading } = useProducts();

  const product = products.find((p) => p.id === id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-[1440px] mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-3xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Product not found.</div>;
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAdd = () => { addItem(product); toast.success(`${product.name} added to cart`); };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          {" / "}
          <Link to={`/category/${product.category}`} className="hover:text-foreground transition-colors capitalize">{product.category.replace(/-/g, ' ')}</Link>
          {" / "}
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="bg-muted/30 rounded-3xl p-8 md:p-12 flex items-center justify-center aspect-square">
            {product.image ? (
              <motion.img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-2xl" whileHover={{ scale: 1.03 }} transition={{ duration: 0.4 }} />
            ) : (
              <div className="w-48 h-48 md:w-64 md:h-64 bg-muted rounded-3xl" />
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:sticky lg:top-24 lg:self-start">
            {product.badge && (
              <span className="text-xs font-medium tracking-wide uppercase text-primary bg-primary/10 px-3 py-1 rounded-full mb-4 inline-block">{product.badge}</span>
            )}
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-2">{product.name}</h1>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1"><Star className="w-4 h-4 fill-primary text-primary" /><span className="text-sm font-medium text-foreground">{product.rating}</span></div>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
              <span className="text-sm text-muted-foreground">· {product.brand}</span>
            </div>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-semibold text-foreground tabular-nums">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && <span className="text-lg text-muted-foreground line-through tabular-nums">₹{product.originalPrice.toLocaleString()}</span>}
            </div>
            <p className="text-muted-foreground text-[17px] leading-relaxed mb-8">{product.description}</p>

            {product.specs.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-8">
                {product.specs.map((spec, i) => {
                  const Icon = specIcons[i] || Palette;
                  return (
                    <div key={i} className="bg-muted/30 rounded-2xl p-4 flex items-center gap-3">
                      <Icon className="w-5 h-5 text-muted-foreground shrink-0" strokeWidth={1.5} />
                      <span className="text-sm font-medium text-foreground">{spec}</span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={handleAdd} className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity">
                <ShoppingBag className="w-5 h-5" /> Add to Cart
              </button>
              <button className="w-14 h-14 flex items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>

        {related.length > 0 && (
          <section className="mt-24">
            <AnimatedSection><h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-8">You Might Also Like</h2></AnimatedSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
