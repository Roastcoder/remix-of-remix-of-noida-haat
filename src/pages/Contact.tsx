import { AnimatedSection } from "@/components/AnimatedSection";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const contactInfo = [
  { icon: Phone, label: "Phone", value: "98765 43210", href: "tel:09876543210" },
  { icon: Mail, label: "Email", value: "hello@noidahaat.com", href: "mailto:hello@noidahaat.com" },
  { icon: MapPin, label: "Address", value: "Sector 62, Noida, Uttar Pradesh 201301", href: "#" },
  { icon: Clock, label: "Hours", value: "Mon – Sat: 10 AM – 8 PM", href: "#" },
];

export default function Contact() {
  return (
    <div className="bg-background">
      <section className="py-8 sm:py-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1">Contact Us</h1>
          <p className="text-sm text-muted-foreground">Have a question about our handicrafts? We'd love to hear from you.</p>
        </div>
      </section>

      <section className="pb-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-6">
            <AnimatedSection>
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Send us a Message</h2>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input type="text" placeholder="Your Name" className="px-4 py-2.5 bg-background rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 border border-border w-full" />
                    <input type="email" placeholder="Email Address" className="px-4 py-2.5 bg-background rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 border border-border w-full" />
                  </div>
                  <input type="text" placeholder="Subject" className="px-4 py-2.5 bg-background rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 border border-border w-full" />
                  <textarea rows={4} placeholder="Your Message" className="px-4 py-2.5 bg-background rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 border border-border w-full resize-none" />
                  <button type="submit" className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity">Send Message</button>
                </form>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Get in Touch</h2>
                <div className="space-y-4">
                  {contactInfo.map((info, i) => (
                    <a key={i} href={info.href} className="flex items-start gap-3 group">
                      <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <info.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-medium tracking-wide uppercase text-muted-foreground">{info.label}</p>
                        <p className="text-sm text-foreground font-medium group-hover:text-primary transition-colors">{info.value}</p>
                      </div>
                    </a>
                  ))}
                </div>
                <div className="mt-5 rounded-lg overflow-hidden h-48">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.0!2d77.37!3d28.62!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM3JzEyLjAiTiA3N8KwMjInMTIuMCJF!5e0!3m2!1sen!2sin!4v1"
                    width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="NoidaHaat Location" />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
