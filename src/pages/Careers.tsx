import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Briefcase, MapPin } from "lucide-react";

const openings = [
  { title: "Artisan Coordinator", location: "Noida / Field", type: "Full-time", description: "Connect with rural artisans, manage quality and timely delivery of handcrafted products." },
  { title: "Social Media Manager", location: "Remote", type: "Full-time", description: "Create engaging content showcasing our artisans and their craft stories across platforms." },
  { title: "Warehouse Operations", location: "Noida", type: "Full-time", description: "Manage inventory, quality checks, and packaging of delicate handcrafted items." },
  { title: "Customer Experience Executive", location: "Noida", type: "Full-time", description: "Help customers find the perfect handicraft products and handle enquiries with care." },
];

export default function Careers() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-24 md:py-32 bg-foreground text-background">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="max-w-[1440px] mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6">Join NoidaHaat</h1>
          <p className="text-lg opacity-60 max-w-2xl mx-auto">Help us preserve India's craft heritage and empower artisan communities.</p>
        </motion.div>
      </section>

      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <AnimatedSection><h2 className="text-2xl font-semibold tracking-tight text-foreground mb-8">Open Positions</h2></AnimatedSection>
          <div className="space-y-4">
            {openings.map((job, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="bg-surface rounded-2xl p-6 hover:shadow-elevated transition-shadow duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-primary" /> {job.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                        <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">{job.type}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{job.description}</p>
                    </div>
                    <a href="/contact" className="shrink-0 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-opacity">Apply</a>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
