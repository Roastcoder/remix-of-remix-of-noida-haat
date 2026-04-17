import catBedlinen from "@/assets/cat-bedlinen.jpg";
import catTowels from "@/assets/cat-towels.jpg";
import catRugs from "@/assets/cat-rugs.jpg";
import catCushions from "@/assets/cat-cushions.jpg";
import catTablelinen from "@/assets/cat-tablelinen.jpg";
import catCurtains from "@/assets/cat-curtains.jpg";
import catBlankets from "@/assets/cat-blankets.jpg";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  brand: string;
  sku?: string;
  material?: string;
  dimensions?: string;
  variants?: any[];
  ram?: string;
  storage?: string;
  specs: string[];
  description: string;
  rating: number;
  reviews: number;
  badge?: string;
}

export const categories = [
  { name: "Premium Bed Linen", slug: "bedlinen", image: catBedlinen },
  { name: "Luxury Towels", slug: "towels", image: catTowels },
  { name: "Artisanal Rugs", slug: "rugs", image: catRugs },
  { name: "Designer Cushions", slug: "cushions", image: catCushions },
  { name: "Table Linen", slug: "tablelinen", image: catTablelinen },
  { name: "Curtains & Drapes", slug: "curtains", image: catCurtains },
  { name: "Blankets & Throws", slug: "blankets", image: catBlankets },
];

export interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
  icon: string;
}

export const services: Service[] = [
  { id: "custom-bedding", name: "Custom Bedding", description: "Get bespoke bed linen sets tailored to your exact specifications — thread count, fabric, size, and embroidery.", image: catBedlinen, icon: "bed" },
  { id: "interior-consultation", name: "Interior Consultation", description: "Our textile experts help you curate the perfect home textile collection matching your interior design vision.", image: catCurtains, icon: "palette" },
  { id: "corporate-gifting", name: "Corporate Gifting", description: "Premium textile gift hampers and bulk orders for corporate events, weddings, and special occasions.", image: catTowels, icon: "gift" },
  { id: "fabric-sourcing", name: "Fabric Sourcing", description: "Access our curated network of master weavers for rare and artisanal fabrics — silk, linen, and organic cotton.", image: catRugs, icon: "scissors" },
];

export const products: Product[] = [];

export const testimonials = [
  { name: "Priya Malhotra", role: "Interior Designer", text: "Textile Twist's bed linen collection is unmatched in quality. The Egyptian cotton sheets are absolutely divine!", rating: 5 },
  { name: "Rajesh Sharma", role: "Hospitality Director", text: "We source all our hotel towels from Textile Twist. The consistency in quality is remarkable across every batch.", rating: 5 },
  { name: "Ananya Patel", role: "Home Decor Enthusiast", text: "From cushions to curtains, every piece from Textile Twist adds a touch of luxury to our home. Absolutely love it!", rating: 5 },
];

export const blogPosts = [];
