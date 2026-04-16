import { Link } from "react-router-dom";
import { Phone, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import logoIcon from "@/assets/logo-noidahaat.png";

const socialIcons: Record<string, React.ReactNode> = {
  instagram: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
  ),
  facebook: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  ),
  youtube: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
  ),
  twitter: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  ),
};

const footerLinks = {
  "Shop": [
    { name: "Pottery & Clay", path: "/category/pottery" },
    { name: "Jewelry", path: "/category/jewelry" },
    { name: "Textiles", path: "/category/textiles" },
    { name: "Art & Paintings", path: "/category/art" },
  ],
  "More": [
    { name: "Woodcraft", path: "/category/woodcraft" },
    { name: "Home Decor", path: "/category/homedecor" },
    { name: "Gifts", path: "/category/gifts" },
    { name: "All Products", path: "/category/all" },
  ],
  "Company": [
    { name: "About Us", path: "/about" },
    { name: "Blog", path: "/blog" },
    { name: "Careers", path: "/careers" },
    { name: "Contact", path: "/contact" },
  ],
};

export function Footer() {
  const { t } = useTranslation();
  const { data: socialLinks = [] } = useQuery({
    queryKey: ["social-media-links"],
    queryFn: async () => {
      const { data } = await supabase
        .from("social_media_links")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      return data || [];
    },
    staleTime: 10 * 60 * 1000,
  });

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={logoIcon} alt="NoidaHaat" className="w-8 h-8" />
              <span className="text-lg font-bold text-foreground">Noida</span>
              <span className="text-lg font-bold text-primary">Haat</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-4">
              {t("tagline")}. Authentic handcrafted products from skilled artisans across India.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <MapPin className="w-3 h-3 text-primary" />
              Sector 62, Noida, UP
            </div>
            <a href="tel:09876543210" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-1">
              <Phone className="w-3 h-3 text-primary" />
              98765 43210
            </a>

            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3 mt-4">
                {socialLinks.map((link) => (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
                    title={link.platform}>
                    {socialIcons[link.icon_name] || <span className="text-xs">{link.platform[0]}</span>}
                  </a>
                ))}
              </div>
            )}
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-foreground/[0.05] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2025 NoidaHaat — Sector 62, Noida, UP 201301</p>
          <div className="flex gap-4">
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
              className="text-xs text-green-500 hover:text-green-400 transition-colors font-medium">WhatsApp</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms</a>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-border text-center">
          <p className="text-[11px] text-muted-foreground">
            Designed by{" "}
            <a href="https://marketvry.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
              marketvry.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
