import { Truck, Shield, CreditCard, Wrench } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Truck, label: "Fast Delivery", desc: "Free across Jaipur" },
  { icon: Shield, label: "1-Year Warranty", desc: "On all products" },
  { icon: CreditCard, label: "EMI Available", desc: "0% interest plans" },
  { icon: Wrench, label: "Free Setup", desc: "Expert installation" },
];

export function FeatureBanner() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-card rounded-2xl p-6 text-center group hover:border-primary/30 transition-all duration-300 cursor-default"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{f.label}</h3>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
