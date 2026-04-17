import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Upload, X, Image as ImageIcon, Tag } from "lucide-react";
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
    mutationFn: async (id: string) => { await supabase.from("crm_products").delete().eq("id", id); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-products"] });
      queryClient.invalidateQueries({ queryKey: ["public-products"] });
      toast.success("Product deleted");
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Products</h1>
          <p className="text-xs text-muted-foreground mt-1">{products.length} items · Manage SKU, variants, pricing & images</p>
        </div>
        <button onClick={() => { setEditProduct(null); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:opacity-90">
          <Plus className="w-3.5 h-3.5" /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && <p className="text-muted-foreground col-span-3">Loading...</p>}
        {products.map(product => (
          <motion.div key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors">
            {product.images?.[0] ? (
              <div className="relative">
                <img src={product.images[0]} alt={product.name} className="w-full h-44 object-cover" />
                {product.images.length > 1 && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 text-white text-[10px] rounded-full backdrop-blur-sm">
                    +{product.images.length - 1} more
                  </span>
                )}
              </div>
            ) : (
              <div className="w-full h-44 bg-muted flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
              </div>
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2 gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground truncate">{product.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{product.brand} · {product.category}</p>
                  {product.sku && (
                    <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1"><Tag className="w-2.5 h-2.5" />{product.sku}</p>
                  )}
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${(product.stock_quantity || 0) > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                  {product.stock_quantity || 0} stock
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <p className="text-lg font-bold text-primary">₹{Number(product.price).toLocaleString()}</p>
                {product.original_price && Number(product.original_price) > Number(product.price) && (
                  <p className="text-xs text-muted-foreground line-through">₹{Number(product.original_price).toLocaleString()}</p>
                )}
              </div>
              {Array.isArray(product.variants) && product.variants.length > 0 && (
                <p className="text-[10px] text-muted-foreground mb-2">{product.variants.length} variant{product.variants.length > 1 ? "s" : ""}</p>
              )}
              <div className="flex gap-2">
                <button onClick={() => { setEditProduct(product); setShowModal(true); }} className="flex-1 flex items-center justify-center gap-1 py-2 bg-background rounded-lg text-xs text-foreground hover:bg-muted transition-colors border border-border">
                  <Pencil className="w-3 h-3" /> Edit
                </button>
                <button onClick={() => { if (confirm("Delete this product?")) deleteMutation.mutate(product.id); }} className="flex items-center justify-center gap-1 py-2 px-3 bg-destructive/10 rounded-lg text-xs text-destructive hover:bg-destructive/20 transition-colors">
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

interface Variant {
  color?: string;
  size?: string;
  stock?: number;
  price?: number;
  sku?: string;
}

function ProductModal({ product, onClose }: { product: any; onClose: () => void }) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(product?.images || []);
  const [variants, setVariants] = useState<Variant[]>(Array.isArray(product?.variants) ? product.variants : []);
  const [form, setForm] = useState({
    name: product?.name || "",
    category: product?.category || "Bed Linen",
    brand: product?.brand || "",
    sku: product?.sku || "",
    material: product?.material || "",
    dimensions: product?.dimensions || "",
    price: product?.price || 0,
    original_price: product?.original_price || 0,
    description: product?.description || "",
    stock_quantity: product?.stock_quantity || 0,
    is_active: product?.is_active !== false,
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
      if (error) { toast.error(`Failed to upload ${file.name}`); continue; }
      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(fileName);
      newUrls.push(urlData.publicUrl);
    }
    setImageUrls(prev => [...prev, ...newUrls]);
    setUploading(false);
    if (newUrls.length > 0) toast.success(`${newUrls.length} image(s) uploaded`);
  };

  const removeImage = (index: number) => setImageUrls(prev => prev.filter((_, i) => i !== index));
  const addVariant = () => setVariants(v => [...v, { color: "", size: "", stock: 0, price: form.price, sku: "" }]);
  const updateVariant = (i: number, field: keyof Variant, val: any) => {
    setVariants(v => v.map((x, idx) => idx === i ? { ...x, [field]: val } : x));
  };
  const removeVariant = (i: number) => setVariants(v => v.filter((_, idx) => idx !== i));

  const mutation = useMutation({
    mutationFn: async () => {
      const payload: any = {
        name: form.name,
        category: form.category,
        brand: form.brand,
        sku: form.sku || null,
        material: form.material || null,
        dimensions: form.dimensions || null,
        price: form.price,
        original_price: form.original_price > 0 ? form.original_price : null,
        description: form.description,
        stock_quantity: form.stock_quantity,
        is_active: form.is_active,
        specs: form.specs,
        images: imageUrls,
        variants,
      };
      if (product) {
        const { error } = await supabase.from("crm_products").update(payload).eq("id", product.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("crm_products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-products"] });
      queryClient.invalidateQueries({ queryKey: ["public-products"] });
      toast.success(product ? "Product updated" : "Product added");
      onClose();
    },
    onError: (e: any) => toast.error(e?.message || "Failed to save product"),
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-card border border-border rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <h2 className="font-serif text-xl font-bold text-foreground mb-5">{product ? "Edit Product" : "Add Product"}</h2>
        <div className="space-y-3">
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Product Name *" className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none focus:border-primary" />
          <div className="grid grid-cols-2 gap-3">
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none focus:border-primary">
              <option value="Bed Linen">Premium Bed Linen</option>
              <option value="Towels">Luxury Towels</option>
              <option value="Rugs">Artisanal Rugs</option>
              <option value="Cushions">Designer Cushions</option>
              <option value="Table Linen">Table Linen</option>
              <option value="Curtains">Curtains & Drapes</option>
              <option value="Blankets">Blankets & Throws</option>
            </select>
            <input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="Brand" className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none focus:border-primary" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} placeholder="SKU (e.g. TT-BL-EGY-K01)" className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none focus:border-primary" />
            <input value={form.dimensions} onChange={e => setForm(f => ({ ...f, dimensions: e.target.value }))} placeholder="Dimensions (e.g. King 108x108)" className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none focus:border-primary" />
          </div>
          <input value={form.material} onChange={e => setForm(f => ({ ...f, material: e.target.value }))} placeholder="Material / Fabric (e.g. 100% Egyptian Cotton, 800 TC)" className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none focus:border-primary" />
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] uppercase font-semibold text-muted-foreground mb-1 block">Sale Price ₹</label>
              <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} className="w-full px-3 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-[10px] uppercase font-semibold text-muted-foreground mb-1 block">MRP ₹</label>
              <input type="number" value={form.original_price} onChange={e => setForm(f => ({ ...f, original_price: Number(e.target.value) }))} className="w-full px-3 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-[10px] uppercase font-semibold text-muted-foreground mb-1 block">Stock</label>
              <input type="number" value={form.stock_quantity} onChange={e => setForm(f => ({ ...f, stock_quantity: Number(e.target.value) }))} className="w-full px-3 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none focus:border-primary" />
            </div>
          </div>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" rows={3} className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none focus:border-primary resize-none" />

          {/* Images */}
          <div>
            <label className="text-xs font-semibold text-foreground mb-2 block">Product Images <span className="text-muted-foreground font-normal">({imageUrls.length})</span></label>
            <div className="flex flex-wrap gap-2 mb-2">
              {imageUrls.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  {i === 0 && <span className="absolute bottom-0.5 left-0.5 bg-primary text-primary-foreground text-[8px] px-1.5 py-0.5 rounded">Main</span>}
                  <button onClick={() => removeImage(i)} className="absolute top-0.5 right-0.5 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="w-20 h-20 rounded-lg border-2 border-dashed border-border hover:border-primary/40 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                <Upload className="w-4 h-4" />
                <span className="text-[10px]">{uploading ? "..." : "Upload"}</span>
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
          </div>

          {/* Variants */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-foreground">Variants <span className="text-muted-foreground font-normal">({variants.length})</span></label>
              <button onClick={addVariant} className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
                <Plus className="w-3 h-3" /> Add Variant
              </button>
            </div>
            {variants.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {variants.map((v, i) => (
                  <div key={i} className="grid grid-cols-12 gap-1.5 items-center bg-background rounded-lg p-2 border border-border">
                    <input value={v.color || ""} onChange={e => updateVariant(i, "color", e.target.value)} placeholder="Color" className="col-span-3 px-2 py-1.5 bg-card rounded text-xs border border-border outline-none" />
                    <input value={v.size || ""} onChange={e => updateVariant(i, "size", e.target.value)} placeholder="Size" className="col-span-2 px-2 py-1.5 bg-card rounded text-xs border border-border outline-none" />
                    <input type="number" value={v.price ?? ""} onChange={e => updateVariant(i, "price", Number(e.target.value))} placeholder="Price" className="col-span-2 px-2 py-1.5 bg-card rounded text-xs border border-border outline-none" />
                    <input type="number" value={v.stock ?? ""} onChange={e => updateVariant(i, "stock", Number(e.target.value))} placeholder="Stock" className="col-span-2 px-2 py-1.5 bg-card rounded text-xs border border-border outline-none" />
                    <input value={v.sku || ""} onChange={e => updateVariant(i, "sku", e.target.value)} placeholder="SKU" className="col-span-2 px-2 py-1.5 bg-card rounded text-xs border border-border outline-none" />
                    <button onClick={() => removeVariant(i)} className="col-span-1 text-destructive hover:bg-destructive/10 rounded p-1 flex justify-center">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 accent-primary" />
            Active (visible on storefront)
          </label>
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 bg-background text-foreground rounded-xl text-sm border border-border hover:bg-muted">Cancel</button>
          <button onClick={() => mutation.mutate()} disabled={!form.name || mutation.isPending} className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold disabled:opacity-50 hover:opacity-90">
            {mutation.isPending ? "Saving..." : "Save Product"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
