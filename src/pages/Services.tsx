import { Link } from "react-router-dom";
import { AnimatedSection } from "@/components/AnimatedSection";
import { services } from "@/lib/data";
import { Palette, Gem, Scissors, Gift } from "lucide-react";
import bannerEco from "@/assets/banner-eco.jpg";

const iconMap: Record<string, any> = { palette: Palette, gem: Gem, scissors: Scissors, gift: Gift };

export default function Services() {
  return (
    <div className="bg-background">
      <section className="w-full">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3">
          <div className="relative rounded-2xl overflow-hidden">
            <img src={bannerEco} alt="Our Services" className="w-full h-[200px] sm:h-[280px] md:h-[320px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex items-center">
              <div className="px-6 sm:px-10 md:px-12">
                <p className="text-white/60 text-xs uppercase tracking-widest mb-2">Artisan Services</p>
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white leading-tight mb-3">Our Services</h1>
                <p className="text-white/80 text-sm sm:text-base max-w-lg">Custom crafts, workshops & corporate gifting solutions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">All Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {services.map((service, i) => {
              const Icon = iconMap[service.icon] || Palette;
              return (
                <AnimatedSection key={service.id} delay={i * 0.1}>
                  <div className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-md hover:border-primary/20 transition-all flex flex-col sm:flex-row">
                    <div className="sm:w-48 h-40 sm:h-auto overflow-hidden shrink-0">
                      <img src={service.image} alt={service.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="p-5 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground">{service.name}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{service.description}</p>
                      <Link to="/contact" className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity">
                        Enquire Now
                      </Link>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-10 bg-muted/30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">Need Custom Handicrafts?</h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-5">
              We offer bulk orders, custom designs, and personalized handicraft solutions for events, weddings, and corporate gifts.
            </p>
            <Link to="/contact" className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity">
              Contact Us
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
