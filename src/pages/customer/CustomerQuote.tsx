import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export default function CustomerQuote() {
  const { user } = useAuth();
  const [form, setForm] = useState({ products: [] as string[], name: "", email: "", phone: "", message: "" });

  const { data: products = [] } = useQuery({
    queryKey: ["quote-products"],
    queryFn: async () => {
      const { data } = await supabase.from("crm_products").select("id, name, price").eq("is_active", true);
      return data || [];
    },
  });

  const { data: profile } = useQuery({
    queryKey: ["quote-profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user!.id).single();
      if (data) {
        setForm(f => ({ ...f, name: data.full_name || "", email: data.email || "", phone: data.phone || "" }));
      }
      return data;
    },
    enabled: !!user,
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      const selectedProducts = products.filter(p => form.products.includes(p.id));
      const productNames = selectedProducts.map(p => p.name).join(", ");
      await supabase.from("leads").insert({
        name: form.name,
        phone: form.phone,
        email: form.email,
        source: "website" as const,
        product_interest: productNames,
        notes: form.message,
        customer_user_id: user!.id,
      });
    },
    onSuccess: () => {
      toast.success("Quote request submitted!");
      setForm(f => ({ ...f, products: [], message: "" }));
    },
  });

  const toggleProduct = (id: string) => {
    setForm(f => ({
      ...f,
      products: f.products.includes(id) ? f.products.filter(p => p !== id) : [...f.products, id],
    }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Get a Quote</h1>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Select Products</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
          {products.map(p => (
            <button
              key={p.id}
              onClick={() => toggleProduct(p.id)}
              className={`text-left p-3 rounded-xl text-xs transition-colors ${
                form.products.includes(p.id)
                  ? "bg-primary/20 border border-primary/30 text-primary"
                  : "bg-background border border-border text-foreground hover:bg-muted"
              }`}
            >
              <p className="font-medium">{p.name}</p>
              <p className="text-muted-foreground">₹{Number(p.price).toLocaleString()}</p>
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Name" className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />
          <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email" className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />
          <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="Phone" className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />
          <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Message / Requirements" rows={3} className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none resize-none" />
        </div>

        <button
          onClick={() => submitMutation.mutate()}
          disabled={!form.name || !form.phone || form.products.length === 0}
          className="mt-4 w-full py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold disabled:opacity-50"
        >
          Submit Quote Request
        </button>
      </div>
    </div>
  );
}
