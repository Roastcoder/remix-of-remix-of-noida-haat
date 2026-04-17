import { Link, useParams, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Calendar, User, ArrowRight, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

function formatDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

function readingMinutes(content: string | null) {
  if (!content) return 1;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*, blog_categories(id, name, slug)")
        .eq("slug", slug!)
        .eq("is_published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: related = [] } = useQuery({
    queryKey: ["blog-related", post?.category_id, post?.id],
    enabled: !!post?.id,
    queryFn: async () => {
      let q = supabase
        .from("blog_posts")
        .select("id, slug, title, excerpt, featured_image, published_at, blog_categories(name)")
        .eq("is_published", true)
        .neq("id", post!.id)
        .order("published_at", { ascending: false })
        .limit(3);
      if (post?.category_id) q = q.eq("category_id", post.category_id);
      const { data } = await q;
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-12 w-full mb-3" />
          <Skeleton className="h-12 w-3/4 mb-6" />
          <Skeleton className="aspect-[16/9] w-full rounded-2xl mb-8" />
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return <Navigate to="/blog" replace />;
  }

  const minutes = readingMinutes(post.content);
  const url = typeof window !== "undefined" ? window.location.href : "";
  const description = post.excerpt || post.title;
  const ogImage = post.featured_image || "";

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, text: description, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast({ title: "Link copied", description: "Article URL copied to clipboard." });
      }
    } catch {/* user cancelled */}
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description,
    image: ogImage ? [ogImage] : undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { "@type": "Person", name: post.author_name || "Textile Twist" },
    publisher: { "@type": "Organization", name: "Textile Twist" },
    mainEntityOfPage: url,
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`${post.title} | Textile Twist Journal`}</title>
        <meta name="description" content={description.slice(0, 160)} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={description.slice(0, 160)} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={description.slice(0, 160)} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Hero */}
      <article>
        <header className="bg-gradient-to-b from-muted/40 to-background pt-10 md:pt-16 pb-8">
          <div className="max-w-3xl mx-auto px-6">
            <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors mb-6">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Journal
            </Link>
            {post.blog_categories && (
              <Link
                to="/blog"
                className="inline-block text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-4"
              >
                {(post.blog_categories as any).name}
              </Link>
            )}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-3xl md:text-5xl font-bold text-foreground leading-tight mb-4"
            >
              {post.title}
            </motion.h1>
            {post.excerpt && (
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">{post.excerpt}</p>
            )}
            <div className="flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-border">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {post.author_name || "Textile Twist"}</span>
                {post.published_at && (
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(post.published_at)}</span>
                )}
                <span>{minutes} min read</span>
              </div>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-card border border-border hover:border-primary/40 hover:text-primary transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
            </div>
          </div>
        </header>

        {post.featured_image && (
          <div className="max-w-4xl mx-auto px-6 -mt-2 mb-10">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full aspect-[16/9] object-cover rounded-2xl shadow-lg"
              loading="eager"
            />
          </div>
        )}

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 pb-16">
          <div className="prose prose-neutral dark:prose-invert max-w-none
              prose-headings:font-serif prose-headings:text-foreground
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-3
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-2
              prose-p:text-foreground/85 prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground
              prose-img:rounded-xl prose-img:shadow-md
              prose-blockquote:border-primary prose-blockquote:text-foreground/80 prose-blockquote:font-serif
              prose-li:text-foreground/85
              prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none">
            {post.content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
            ) : (
              <p className="text-muted-foreground italic">No content yet.</p>
            )}
          </div>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-12 md:py-16 bg-muted/30 border-t border-border">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">You may also enjoy</h2>
                <p className="text-sm text-muted-foreground mt-1">More stories from the Textile Twist Journal.</p>
              </div>
              <Link to="/blog" className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-primary hover:gap-2 transition-all">
                All articles <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((r: any, i) => (
                <motion.article
                  key={r.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:border-primary/30 transition-all duration-300 group flex flex-col"
                >
                  {r.featured_image && (
                    <Link to={`/blog/${r.slug}`} className="block aspect-[4/3] overflow-hidden bg-muted">
                      <img src={r.featured_image} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </Link>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    {r.blog_categories && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full self-start mb-2">
                        {(r.blog_categories as any).name}
                      </span>
                    )}
                    <h3 className="font-serif text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      <Link to={`/blog/${r.slug}`}>{r.title}</Link>
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1">{r.excerpt}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
