import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  cta_text: string;
  cta_link: string;
  page: string;
  position: number;
  is_active: boolean;
  banner_type: string;
}

export function useBanners(page: string, type?: string) {
  return useQuery({
    queryKey: ["banners", page, type],
    queryFn: async () => {
      let query = supabase
        .from("banners")
        .select("*")
        .eq("page", page)
        .eq("is_active", true)
        .order("position");
      if (type) query = query.eq("banner_type", type);
      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as Banner[];
    },
    staleTime: 60_000,
  });
}
