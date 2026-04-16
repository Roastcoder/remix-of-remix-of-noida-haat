import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Users, Award, MapPin, Clock } from "lucide-react";
import bannerArtisan from "@/assets/banner-artisan.jpg";

const stats = [
  { icon: Users, label: "Happy Customers", value: "10,000+" },
  { icon: Award, label: "Artisans Supported", value: "200+" },
  { icon: MapPin, label: "States Covered", value: "15+" },
  { icon: Clock, label: "Products", value: "500+" },
];

const team = [
  { name: "Ritu Verma", role: "Founder & CEO", bio: "Passionate about preserving Indian handicraft traditions, Ritu started NoidaHaat to connect artisans directly with conscious consumers." },
  { name: "Amit Kumar", role: "Head of Artisan Relations", bio: "Amit travels across rural India identifying talented artisans and ensuring fair-trade practices in every partnership." },
  { name: "Sneha Patel", role: "Creative Director", bio: "With a background in textile design, Sneha curates the collection and works with artisans to create contemporary designs." },
];

export default function About() {
  return (
    <div className="bg-background">
      <section className="w-full">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3">
          <div className="relative rounded-2xl overflow-hidden">
            <img src={bannerArtisan} alt="About NoidaHaat" className="w-full h-[200px] sm:h-[280px] md:h-[320px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex items-center">
              <div className="px-6 sm:px-10 md:px-12">
                <p className="text-white/60 text-xs uppercase tracking-widest mb-2">Our Story</p>
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white leading-tight mb-3">Preserving India's Craft Heritage</h1>
                <p className="text-white/80 text-sm sm:text-base max-w-lg">Connecting skilled artisans with conscious consumers, one handcrafted piece at a time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((stat, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="bg-card rounded-xl p-5 text-center border border-border">
                  <stat.icon className="w-7 h-7 text-primary mx-auto mb-2" strokeWidth={1.5} />
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-10 bg-muted/30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <AnimatedSection>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                At NoidaHaat, we believe every handcrafted product carries a story — of the artisan's skill, their cultural heritage, and centuries of tradition. We're on a mission to bring these stories to your home.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                By connecting artisans directly with customers, we ensure fair wages, sustainable practices, and the preservation of dying art forms. Every purchase you make supports a family and keeps a tradition alive.
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="bg-card rounded-xl p-8 text-center border border-border">
                <p className="text-5xl font-bold text-primary mb-2">200+</p>
                <p className="text-lg font-medium text-foreground">Artisans Empowered</p>
                <p className="text-sm text-muted-foreground mt-1">Across 15+ states of India</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {team.map((member, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="bg-card rounded-xl p-6 border border-border text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">{member.name[0]}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">{member.name}</h3>
                  <p className="text-xs text-primary mb-2">{member.role}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{member.bio}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
