import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/lib/data";
import { getProductFallbackImage } from "@/lib/product-images";

function mapDbProduct(row: any): Product {
  const specs = row.specs || {};
  const specsArray: string[] = Array.isArray(specs.list) ? specs.list : [];
  const fallback = getProductFallbackImage(row.name, row.category);
  const images: string[] = (row.images && row.images.length > 0) ? row.images : [fallback];
  return {
    id: row.id,
    name: row.name,
    category: row.category?.toLowerCase().replace(/\s+/g, "-") || "other",
    price: Number(row.price) || 0,
    originalPrice: row.original_price ? Number(row.original_price) : (specs.originalPrice ? Number(specs.originalPrice) : undefined),
    image: images[0],
    images,
    brand: row.brand || "",
    sku: row.sku || undefined,
    material: row.material || undefined,
    dimensions: row.dimensions || undefined,
    variants: Array.isArray(row.variants) ? row.variants : [],
    specs: specsArray,
    description: row.description || "",
    rating: specs.rating ? Number(specs.rating) : 4.5,
    reviews: specs.reviews ? Number(specs.reviews) : 0,
    badge: specs.badge || undefined,
  };
}

export function useProducts() {
  return useQuery({
    queryKey: ["public-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crm_products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(mapDbProduct);
    },
    staleTime: 5 * 60 * 1000,
  });
}
