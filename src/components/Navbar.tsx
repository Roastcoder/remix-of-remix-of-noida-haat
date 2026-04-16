import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingBag, Menu, X, ChevronDown, ChevronRight, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCart } from "@/lib/cart";
import { SearchOverlay } from "./SearchOverlay";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { categories } from "@/lib/data";
import logoIcon from "@/assets/logo-noidahaat.png";

const navLinks = [
  { name: "home", path: "/", dropdown: undefined },
  { name: "categories", path: "#", dropdown: "categories" },
  { name: "about", path: "/about", dropdown: undefined },
  { name: "services", path: "/services", dropdown: undefined },
  { name: "contact", path: "/contact", dropdown: undefined },
];

const mobileMenuLinks = [
  { name: "home", path: "/" },
  { name: "about", path: "/about" },
  { name: "services", path: "/services" },
  { name: "blog", path: "/blog" },
  { name: "contact", path: "/contact" },
];

export function Navbar() {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileSub, setMobileSub] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { items } = useCart();
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileSub(null);
  }, [location.pathname]);

  const renderDropdown = (type: string) => {
    if (type === "categories") {
      return (
        <div className="bg-card rounded-xl p-5 w-[520px] shadow-lg border border-border">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">{t("shopByCategory")}</p>
          <div className="grid grid-cols-2 gap-1">
            {categories.map((cat) => (
              <Link key={cat.slug} to={`/category/${cat.slug}`} onClick={() => setActiveDropdown(null)}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted transition-colors group">
                <img src={cat.image} alt={cat.name} className="w-10 h-10 object-cover rounded-lg" />
                <span className="text-sm font-medium text-foreground">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <nav className={`h-14 sm:h-16 w-full sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-card/95 backdrop-blur-md shadow-sm border-b border-border" : "bg-card border-b border-border"
      }`}>
        <div className="w-full px-4 sm:px-6 lg:px-10 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={logoIcon} alt="NoidaHaat" className="w-8 h-8 sm:w-9 sm:h-9" />
            <div className="hidden sm:block">
              <span className="text-base font-bold text-foreground leading-none">Noida</span>
              <span className="text-base font-bold text-primary leading-none">Haat</span>
            </div>
          </Link>

          <div className="hidden lg:flex flex-1 max-w-md mx-6">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-sm text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              <Search className="w-4 h-4" />
              {t("search")}
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-5">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div key={link.name} className="relative"
                  onMouseEnter={() => setActiveDropdown(link.dropdown!)}
                  onMouseLeave={() => setActiveDropdown(null)}>
                  <button className="text-sm font-medium transition-colors hover:text-foreground text-muted-foreground flex items-center gap-1">
                    {t(link.name)}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === link.dropdown ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {activeDropdown === link.dropdown && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }} className="absolute left-1/2 -translate-x-1/2 pt-3 top-full">
                        {renderDropdown(link.dropdown!)}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link key={link.path + link.name} to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-foreground ${location.pathname === link.path ? "text-foreground" : "text-muted-foreground"}`}>
                  {t(link.name)}
                </Link>
              )
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            <button onClick={() => setSearchOpen(true)} className="lg:hidden text-muted-foreground hover:text-foreground p-1.5">
              <Search className="w-5 h-5" />
            </button>
            <Link to="/cart" className="text-muted-foreground hover:text-foreground relative p-1.5">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/login" className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
              <User className="w-3.5 h-3.5" />
              {t("login")}
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-muted-foreground hover:text-foreground p-1.5">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-card z-50 lg:hidden shadow-xl overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                  <img src={logoIcon} alt="NoidaHaat" className="w-8 h-8" />
                  <span className="text-sm font-bold text-foreground">NoidaHaat</span>
                </Link>
                <button onClick={() => setMobileOpen(false)} className="p-1 text-muted-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 space-y-1">
                <Link to="/login" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-semibold mb-3">
                  <User className="w-4 h-4" /> {t("login")} / {t("signup")}
                </Link>

                {mobileMenuLinks.map(link => (
                  <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === link.path ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                    }`}>
                    {t(link.name)}
                  </Link>
                ))}

                <button onClick={() => setMobileSub(mobileSub === "categories" ? null : "categories")}
                  className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted">
                  {t("categories")}
                  <ChevronRight className={`w-4 h-4 transition-transform ${mobileSub === "categories" ? "rotate-90" : ""}`} />
                </button>
                <AnimatePresence>
                  {mobileSub === "categories" && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pl-4">
                      {categories.map(cat => (
                        <Link key={cat.slug} to={`/category/${cat.slug}`} onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                          <img src={cat.image} alt={cat.name} className="w-6 h-6 object-cover rounded" />
                          {cat.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-4 border-t border-border mt-4">
                  <a href="https://wa.me/919876543210" className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-primary">
                    WhatsApp: 98765 43210
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
