import catBedlinen from "@/assets/cat-bedlinen.jpg";
import catTowels from "@/assets/cat-towels.jpg";
import catRugs from "@/assets/cat-rugs.jpg";
import catCushions from "@/assets/cat-cushions.jpg";
import catTablelinen from "@/assets/cat-tablelinen.jpg";
import catCurtains from "@/assets/cat-curtains.jpg";
import catBlankets from "@/assets/cat-blankets.jpg";

const keywordImageMap: [string[], string][] = [
  [["bedsheet", "bed linen", "duvet", "pillow", "fitted sheet", "flat sheet", "comforter"], catBedlinen],
  [["towel", "bath towel", "hand towel", "face towel", "bath mat", "bathrobe"], catTowels],
  [["rug", "carpet", "runner", "mat", "area rug", "dhurrie"], catRugs],
  [["cushion", "pillow", "throw pillow", "bolster", "cushion cover"], catCushions],
  [["table", "napkin", "placemat", "table runner", "tablecloth"], catTablelinen],
  [["curtain", "drape", "sheer", "blind", "valance"], catCurtains],
  [["blanket", "throw", "quilt", "comforter", "afghan"], catBlankets],
];

const categoryImageMap: Record<string, string> = {
  bedlinen: catBedlinen,
  towels: catTowels,
  rugs: catRugs,
  cushions: catCushions,
  tablelinen: catTablelinen,
  curtains: catCurtains,
  blankets: catBlankets,
};

export function getProductFallbackImage(productName: string, category?: string): string {
  const lower = productName.toLowerCase();
  
  for (const [keywords, image] of keywordImageMap) {
    if (keywords.some(kw => lower.includes(kw))) {
      return image;
    }
  }
  
  if (category) {
    const catLower = category.toLowerCase();
    if (categoryImageMap[catLower]) return categoryImageMap[catLower];
  }
  
  return catBedlinen;
}