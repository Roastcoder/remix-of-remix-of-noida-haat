import catPottery from "@/assets/cat-pottery.jpg";
import catJewelry from "@/assets/cat-jewelry.jpg";
import catTextiles from "@/assets/cat-textiles.jpg";
import catWoodcraft from "@/assets/cat-woodcraft.jpg";
import catArt from "@/assets/cat-art.jpg";
import catHomedecor from "@/assets/cat-homedecor.jpg";
import catGifts from "@/assets/cat-gifts.jpg";

// Map keywords to images for partial matching
const keywordImageMap: [string[], string][] = [
  // Pottery
  [["diya", "diyas", "clay", "kulhad", "matka", "terracotta", "planter", "pot", "vase", "incense holder"], catPottery],
  // Jewelry
  [["jhumka", "earring", "necklace", "bangle", "anklet", "pendant", "dokra", "jewelry", "oxidised", "resin", "beaded", "tribal"], catJewelry],
  // Textiles
  [["saree", "dupatta", "kurta", "shawl", "pashmina", "cushion", "kalamkari", "textile", "fabric", "block print", "khadi", "handloom", "scarf"], catTextiles],
  // Woodcraft
  [["wooden", "wood", "sheesham", "sandalwood", "toy train", "key holder", "pooja", "mandir", "carved"], catWoodcraft],
  // Art
  [["madhubani", "warli", "pichwai", "miniature", "gond", "painting", "canvas", "art print", "sketch"], catArt],
  // Home Decor
  [["lantern", "macrame", "dream catcher", "diya stand", "jute rug", "candle holder", "wall hanging", "decor"], catHomedecor],
  // Gifts
  [["gift", "hamper", "calendar", "corporate", "name plate", "coaster", "rakhi", "festival", "eco-friendly", "plantable"], catGifts],
];

// Category-based fallback
const categoryImageMap: Record<string, string> = {
  pottery: catPottery,
  jewelry: catJewelry,
  textiles: catTextiles,
  woodcraft: catWoodcraft,
  art: catArt,
  homedecor: catHomedecor,
  gifts: catGifts,
};

export function getProductFallbackImage(productName: string, category?: string): string {
  const lower = productName.toLowerCase();
  
  for (const [keywords, image] of keywordImageMap) {
    if (keywords.some(kw => lower.includes(kw))) {
      return image;
    }
  }
  
  // Fallback to category image
  if (category) {
    const catLower = category.toLowerCase();
    if (categoryImageMap[catLower]) return categoryImageMap[catLower];
  }
  
  return catPottery;
}
