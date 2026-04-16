import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/lib/data";
import { getProductFallbackImage } from "@/lib/product-images";

function mapDbProduct(row: any): Product {
  const specs = row.specs || {};
  const specsArray: string[] = Array.isArray(specs.list) ? specs.list : [];
  return {
    id: row.id,
    name: row.name,
    category: row.category?.toLowerCase().replace(/\s+/g, "-") || "other",
    price: Number(row.price) || 0,
    originalPrice: specs.originalPrice ? Number(specs.originalPrice) : undefined,
    image: row.images?.[0] || getProductFallbackImage(row.name, row.category),
    brand: row.brand || "",
    ram: specs.ram || undefined,
    storage: specs.storage || undefined,
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
