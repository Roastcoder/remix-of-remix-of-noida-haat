import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { blogPosts } from "@/lib/data";
import { ArrowRight, Clock } from "lucide-react";

export default function Blog() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-24 md:py-32 bg-foreground text-background">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-[1440px] mx-auto px-6 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6">Blog</h1>
          <p className="text-lg opacity-60 max-w-2xl mx-auto">
            Insights, guides, and news from the world of technology.
          </p>
        </motion.div>
      </section>

      <section className="py-24">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, i) => (
              <AnimatedSection key={post.id} delay={i * 0.1}>
                <article className="bg-surface rounded-3xl p-8 flex flex-col h-full hover:shadow-elevated transition-shadow duration-300 group">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full self-start mb-4">
                    {post.category}
                  </span>
                  <h2 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-6">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.readTime}</span>
                      <span>·</span>
                      <span>{post.date}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
