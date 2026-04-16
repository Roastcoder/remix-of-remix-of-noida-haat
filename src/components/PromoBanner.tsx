import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface PromoBannerProps {
  image: string;
  title: string;
  subtitle?: string;
  cta?: string;
  ctaLink?: string;
  overlay?: "dark" | "light" | "gradient";
  align?: "left" | "center" | "right";
}

export function PromoBanner({
  image,
  title,
  subtitle,
  cta,
  ctaLink = "/",
  overlay = "dark",
  align = "left",
}: PromoBannerProps) {
  const overlayClass =
    overlay === "dark"
      ? "bg-foreground/40"
      : overlay === "gradient"
      ? "bg-gradient-to-r from-foreground/60 via-foreground/20 to-transparent"
      : "bg-background/30";

  const alignClass =
    align === "center"
      ? "items-center text-center"
      : align === "right"
      ? "items-end text-right"
      : "items-start text-left";

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="relative rounded-2xl overflow-hidden group">
          <img
            src={image}
            alt={title}
            className="w-full h-auto object-cover aspect-[5/1] transition-transform duration-700 group-hover:scale-[1.02]"
            loading="lazy"
            width={1920}
            height={512}
          />
          <div className={`absolute inset-0 ${overlayClass}`} />
          <div className={`absolute inset-0 flex flex-col justify-center px-8 md:px-12 ${alignClass}`}>
            {subtitle && (
              <p className="text-xs md:text-sm font-semibold tracking-widest uppercase text-primary-foreground/80 mb-2">
                {subtitle}
              </p>
            )}
            <h3 className="text-xl sm:text-2xl md:text-4xl font-bold text-primary-foreground leading-tight max-w-lg">
              {title}
            </h3>
            {cta && ctaLink && (
              <Link
                to={ctaLink}
                className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-xs md:text-sm font-semibold hover:opacity-90 transition-opacity w-fit"
              >
                {cta}
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
