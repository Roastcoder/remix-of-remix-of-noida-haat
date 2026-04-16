import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "ta", label: "தமிழ்", flag: "🇮🇳" },
  { code: "bn", label: "বাংলা", flag: "🇮🇳" },
  { code: "mr", label: "मराठी", flag: "🇮🇳" },
  { code: "te", label: "తెలుగు", flag: "🇮🇳" },
  { code: "gu", label: "ગુજરાતી", flag: "🇮🇳" },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const current = languages.find((l) => l.code === i18n.language) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <Globe className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{current.label}</span>
        <ChevronDown className="w-3 h-3" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-lg p-1 min-w-[140px]"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { i18n.changeLanguage(lang.code); setOpen(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                    i18n.language === lang.code ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted"
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
