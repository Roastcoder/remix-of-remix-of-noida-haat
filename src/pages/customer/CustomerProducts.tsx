import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Search, Send } from "lucide-react";
import { toast } from "sonner";

export default function CustomerProducts() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const { data: products = [] } = useQuery({
    queryKey: ["customer-products"],
    queryFn: async () => {
      const { data } = await supabase.from("crm_products").select("*").eq("is_active", true);
      return data || [];
    },
  });

  const enquireMutation = useMutation({
    mutationFn: async (product: any) => {
      const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", user!.id).single();
      await supabase.from("leads").insert({
        name: profile?.full_name || "Customer",
        phone: profile?.phone || "",
        email: profile?.email || "",
        source: "website" as const,
        product_interest: product.name,
        customer_user_id: user!.id,
      });
    },
    onSuccess: () => {
      toast.success("Enquiry submitted!");
      queryClient.invalidateQueries({ queryKey: ["customer-enquiries"] });
    },
  });

  const filtered = products.filter(p => {
    if (category !== "all" && p.category !== category) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const cats = [...new Set(products.map(p => p.category))];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Products</h1>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-9 pr-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} className="px-3 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none">
          <option value="all">All Categories</option>
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(product => (
          <div key={product.id} className="bg-card border border-border rounded-xl p-5">
            {product.images?.[0] && <img src={product.images[0]} alt={product.name} className="w-full h-32 object-cover rounded-lg mb-3" />}
            <h3 className="text-sm font-semibold text-foreground">{product.name}</h3>
            <p className="text-xs text-muted-foreground mb-2">{product.brand} · {product.category}</p>
            <p className="text-lg font-bold text-primary mb-3">₹{Number(product.price).toLocaleString()}</p>
            <button
              onClick={() => enquireMutation.mutate(product)}
              className="w-full flex items-center justify-center gap-2 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <Send className="w-3 h-3" /> Enquire Now
            </button>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-muted-foreground col-span-3">No products found</p>}
      </div>
    </div>
  );
}
