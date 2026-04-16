import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Upload, X, Image } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["crm-products"],
    queryFn: async () => {
      const { data } = await supabase.from("crm_products").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("crm_products").delete().eq("id", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-products"] });
      toast.success("Product deleted");
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Products</h1>
        <button onClick={() => { setEditProduct(null); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold">
          <Plus className="w-3.5 h-3.5" /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && <p className="text-muted-foreground col-span-3">Loading...</p>}
        {products.map(product => (
          <motion.div key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border border-border rounded-xl overflow-hidden">
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-40 object-cover" />
            ) : (
              <div className="w-full h-40 bg-muted flex items-center justify-center">
                <Image className="w-8 h-8 text-muted-foreground/40" />
              </div>
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{product.name}</h3>
                  <p className="text-xs text-muted-foreground">{product.brand} · {product.category}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${(product.stock_quantity || 0) > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                  {(product.stock_quantity || 0) > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              <p className="text-lg font-bold text-primary mb-3">₹{Number(product.price).toLocaleString()}</p>
              <div className="flex gap-2">
                <button onClick={() => { setEditProduct(product); setShowModal(true); }} className="flex-1 flex items-center justify-center gap-1 py-2 bg-background rounded-lg text-xs text-foreground hover:bg-muted transition-colors">
                  <Pencil className="w-3 h-3" /> Edit
                </button>
                <button onClick={() => { if (confirm("Delete?")) deleteMutation.mutate(product.id); }} className="flex items-center justify-center gap-1 py-2 px-3 bg-destructive/10 rounded-lg text-xs text-destructive hover:bg-destructive/20 transition-colors">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && <ProductModal product={editProduct} onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </div>
  );
}

function ProductModal({ product, onClose }: { product: any; onClose: () => void }) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(product?.images || []);
  const [form, setForm] = useState({
    name: product?.name || "",
    category: product?.category || "pottery",
    brand: product?.brand || "",
    price: product?.price || 0,
    description: product?.description || "",
    stock_quantity: product?.stock_quantity || 0,
    specs: product?.specs || {},
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(fileName, file);

      if (error) {
        toast.error(`Failed to upload ${file.name}`);
        continue;
      }

      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(fileName);
      newUrls.push(urlData.publicUrl);
    }

    setImageUrls(prev => [...prev, ...newUrls]);
    setUploading(false);
    if (newUrls.length > 0) toast.success(`${newUrls.length} image(s) uploaded`);
  };

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = { ...form, images: imageUrls };
      if (product) {
        await supabase.from("crm_products").update(payload).eq("id", product.id);
      } else {
        await supabase.from("crm_products").insert(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-products"] });
      queryClient.invalidateQueries({ queryKey: ["public-products"] });
      toast.success(product ? "Product updated" : "Product added");
      onClose();
    },
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-foreground mb-4">{product ? "Edit Product" : "Add Product"}</h2>
        <div className="space-y-3">
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Product Name *" className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />

          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none">
            <option value="pottery">Pottery & Clay</option>
            <option value="jewelry">Jewelry</option>
            <option value="textiles">Textiles</option>
            <option value="woodcraft">Woodcraft</option>
            <option value="art">Art & Paintings</option>
            <option value="homedecor">Home Decor</option>
            <option value="gifts">Gifts</option>
          </select>

          <input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="Brand" className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />

          <div className="grid grid-cols-2 gap-3">
            <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} placeholder="Price" className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />
            <input type="number" value={form.stock_quantity} onChange={e => setForm(f => ({ ...f, stock_quantity: Number(e.target.value) }))} placeholder="Stock Qty" className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />
          </div>

          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" rows={3} className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none resize-none" />

          {/* Image Upload */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Product Images</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {imageUrls.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(i)} className="absolute top-0.5 right-0.5 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-20 h-20 rounded-lg border-2 border-dashed border-border hover:border-primary/40 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span className="text-[10px]">{uploading ? "..." : "Upload"}</span>
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={onClose} className="flex-1 py-2.5 bg-background text-foreground rounded-xl text-sm border border-border">Cancel</button>
          <button onClick={() => mutation.mutate()} disabled={!form.name} className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold disabled:opacity-50">Save</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
