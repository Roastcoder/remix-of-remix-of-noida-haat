import { useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

interface ServiceCard {
  image: string;
  label: string;
  link: string;
}

interface Props {
  cards: ServiceCard[];
}

export function InfiniteServiceCarousel({ cards }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>();
  const speed = 0.5; // px per frame
  const isPaused = useRef(false);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Duplicate cards 3x for seamless looping
  const tripled = [...cards, ...cards, ...cards];

  const resetScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const singleWidth = el.scrollWidth / 3;
    if (el.scrollLeft >= singleWidth * 2) {
      el.scrollLeft -= singleWidth;
    } else if (el.scrollLeft <= 0) {
      el.scrollLeft += singleWidth;
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Start at the middle set
    el.scrollLeft = el.scrollWidth / 3;

    const animate = () => {
      if (!isPaused.current && !isDown.current && el) {
        el.scrollLeft += speed;
        resetScroll();
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [resetScroll]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDown.current = true;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeft.current = scrollRef.current?.scrollLeft || 0;
  };

  const handleMouseUp = () => {
    isDown.current = false;
    resetScroll();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDown.current = true;
    startX.current = e.touches[0].pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeft.current = scrollRef.current?.scrollLeft || 0;
  };

  const handleTouchEnd = () => {
    isDown.current = false;
    resetScroll();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDown.current || !scrollRef.current) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div
      ref={scrollRef}
      className="flex gap-3 sm:gap-4 overflow-x-hidden cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onMouseEnter={() => { isPaused.current = true; }}
      onMouseOut={() => { if (!isDown.current) isPaused.current = false; }}
    >
      {tripled.map((s, i) => (
        <div key={`${s.label}-${i}`} className="shrink-0 w-[140px] sm:w-[170px]">
          <Link
            to={s.link}
            onClick={(e) => { if (isDown.current) e.preventDefault(); }}
            draggable={false}
            className="block rounded-xl bg-card border border-border hover:shadow-lg hover:border-primary/20 transition-all group overflow-hidden"
          >
            <div className="h-24 sm:h-28 overflow-hidden">
              <img src={s.image} alt={s.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" draggable={false} />
            </div>
            <div className="p-2.5 sm:p-3 text-center">
              <span className="text-xs sm:text-sm font-semibold text-foreground">{s.label}</span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
