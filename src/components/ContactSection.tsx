import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";

export function ContactSection() {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-[1440px] mx-auto px-6">
        <AnimatedSection>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground text-center mb-4">Visit Textile Twist</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">Experience our luxury textile collection in person at our flagship showroom.</p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-8">
          <AnimatedSection>
            <div className="glass-card rounded-2xl p-8 space-y-6 h-full">
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">Email</h3>
                  <a href="mailto:hello@textiletwist.com" className="text-sm text-primary hover:underline">hello@textiletwist.com</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">Phone</h3>
                  <a href="tel:+919509317543" className="text-sm text-primary hover:underline block">+91 95093 17543</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">Hours</h3>
                  <p className="text-sm text-muted-foreground">Mon–Sat: 10 AM – 8 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">Shipping</h3>
                  <p className="text-sm text-muted-foreground">Free delivery across India on orders above ₹2,999</p>
                </div>
              </div>
              <a href="https://wa.me/919509317543?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20luxury%20textiles"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full text-sm font-semibold hover:bg-green-700 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp Us
              </a>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="glass-card rounded-2xl p-8 h-full flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Flagship Showroom</h3>
                <p className="text-sm text-muted-foreground">Coming Soon — New Delhi</p>
                <p className="text-xs text-muted-foreground mt-2">Currently serving online across India</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}