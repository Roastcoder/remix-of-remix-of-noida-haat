import catPottery from "@/assets/cat-pottery.jpg";
import catJewelry from "@/assets/cat-jewelry.jpg";
import catTextiles from "@/assets/cat-textiles.jpg";
import catWoodcraft from "@/assets/cat-woodcraft.jpg";
import catArt from "@/assets/cat-art.jpg";
import catHomedecor from "@/assets/cat-homedecor.jpg";
import catGifts from "@/assets/cat-gifts.jpg";

import bannerArtisan from "@/assets/banner-artisan.jpg";
import bannerEco from "@/assets/banner-eco.jpg";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  brand: string;
  ram?: string;
  storage?: string;
  specs: string[];
  description: string;
  rating: number;
  reviews: number;
  badge?: string;
}

export const categories = [
  { name: "Pottery & Clay", slug: "pottery", image: catPottery },
  { name: "Jewelry", slug: "jewelry", image: catJewelry },
  { name: "Textiles", slug: "textiles", image: catTextiles },
  { name: "Woodcraft", slug: "woodcraft", image: catWoodcraft },
  { name: "Art & Paintings", slug: "art", image: catArt },
  { name: "Home Decor", slug: "homedecor", image: catHomedecor },
  { name: "Gifts", slug: "gifts", image: catGifts },
];

export interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
  icon: string;
}

export const services: Service[] = [
  {
    id: "custom-pottery",
    name: "Custom Pottery",
    description: "Get personalized clay items made by master potters. Custom diyas, vases, and decorative pieces for your home or events.",
    image: catPottery,
    icon: "palette",
  },
  {
    id: "jewelry-workshop",
    name: "Jewelry Workshops",
    description: "Learn the art of handmade jewelry making. Weekend workshops for oxidised, beaded, and resin jewelry techniques.",
    image: catJewelry,
    icon: "gem",
  },
  {
    id: "custom-textiles",
    name: "Custom Textiles",
    description: "Order block-printed fabrics, custom dupattas, and personalized textile pieces in your preferred colors and patterns.",
    image: catTextiles,
    icon: "scissors",
  },
  {
    id: "corporate-gifting",
    name: "Corporate Gifting",
    description: "Bulk orders for handcrafted corporate gifts, festival hampers, and customized gift boxes for businesses.",
    image: catGifts,
    icon: "gift",
  },
];

export const products: Product[] = [];

export const testimonials = [
  {
    name: "Priya Sharma",
    role: "Interior Designer",
    text: "NoidaHaat has the most authentic handcrafted pieces I've found online. The Madhubani paintings are museum-quality!",
    rating: 5,
  },
  {
    name: "Rahul Gupta",
    role: "Gift Shop Owner",
    text: "I source all my festival hampers from NoidaHaat. The quality is consistent and customers love the artisan touch.",
    rating: 5,
  },
  {
    name: "Sneha Patel",
    role: "Craft Enthusiast",
    text: "From jewelry to home decor, every piece tells a story. Supporting Indian artisans has never been easier!",
    rating: 5,
  },
];

export const blogPosts = [
  {
    id: "1",
    title: "The Art of Madhubani Painting: A Complete Guide",
    excerpt: "Discover the ancient art form from Bihar that's captivating the world with its intricate patterns and vibrant colors.",
    date: "March 15, 2026",
    category: "Art",
    readTime: "5 min read",
  },
  {
    id: "2",
    title: "5 Ways to Style Handloom Sarees for Modern Occasions",
    excerpt: "Handloom sarees are timeless. Here's how to wear them for both casual outings and formal events.",
    date: "March 10, 2026",
    category: "Fashion",
    readTime: "4 min read",
  },
  {
    id: "3",
    title: "Why Handmade Pottery is Making a Comeback",
    excerpt: "From eco-consciousness to aesthetic appeal, learn why handmade pottery is trending in Indian homes.",
    date: "March 5, 2026",
    category: "Home Decor",
    readTime: "3 min read",
  },
  {
    id: "4",
    title: "Supporting Indian Artisans: The Impact of Your Purchase",
    excerpt: "Every handcrafted product you buy sustains a family and preserves centuries-old traditions.",
    date: "February 28, 2026",
    category: "Impact",
    readTime: "6 min read",
  },
];
