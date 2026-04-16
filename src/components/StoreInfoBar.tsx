import { MapPin, Clock, Phone, Globe } from "lucide-react";

export function StoreInfoBar() {
  return (
    <div className="hidden sm:block w-full glass border-b border-foreground/[0.04] py-2">
      <div className="w-full px-4 sm:px-6 lg:px-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Globe className="w-3 h-3 text-primary" />
          Free Shipping on Orders Above ₹2,999
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-primary" />
          Mon–Sat: 10 AM – 8 PM
        </span>
        <a href="tel:+919509317543" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
          <Phone className="w-3 h-3 text-primary" />
          +91 95093 17543
        </a>
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3 h-3 text-primary" />
          Shipping Pan-India 🇮🇳
        </span>
      </div>
    </div>
  );
}