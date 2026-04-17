import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Clock, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Blog() {
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: async () => {
      const { data } = await supabase.from("blog_categories").select("*").order("name");
      return data || [];
    },
  });

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog-posts", activeCat],
    queryFn: async () => {
      let q = supabase.from("blog_posts").select("*, blog_categories(name, slug)").eq("is_published", true).order("published_at", { ascending: false });
      if (activeCat) q = q.eq("category_id", activeCat);
      const { data } = await q;
      return data || [];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/95 to-primary text-primary-foreground">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-[1400px] mx-auto px-6 text-center">
          <BookOpen className="w-10 h-10 mx-auto mb-4 opacity-80" />
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">Textile Journal</h1>
          <p className="text-base md:text-lg opacity-80 max-w-2xl mx-auto">Stories, styling tips, and care guides from the world of luxury textiles.</p>
        </motion.div>
      </section>

      <section className="py-6 border-b border-border bg-background sticky top-16 z-20">
        <div className="max-w-[1400px] mx-auto px-6 flex gap-2 overflow-x-auto scrollbar-hide">
          <button onClick={() => setActiveCat(null)} className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${activeCat === null ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/70"}`}>
            All Posts
          </button>
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setActiveCat(cat.id)} className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${activeCat === cat.id ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/70"}`}>
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-[1400px] mx-auto px-6">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-96 rounded-2xl" />)}
            </div>
          ) : posts.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">No posts in this category yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post: any, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:border-primary/30 transition-all duration-300 group flex flex-col"
                >
                  {post.featured_image && (
                    <Link to={`/blog/${post.slug}`} className="block aspect-[4/3] overflow-hidden bg-muted">
                      <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </Link>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    {post.blog_categories && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full self-start mb-3">
                        {post.blog_categories.name}
                      </span>
                    )}
                    <h2 className="font-serif text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{post.author_name}</span>
                      </div>
                      <Link to={`/blog/${post.slug}`} className="text-xs font-semibold text-primary flex items-center gap-1 hover:gap-2 transition-all">
                        Read <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
