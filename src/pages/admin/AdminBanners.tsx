import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical, Image } from "lucide-react";

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

const PAGES = ["home", "about", "services", "category", "contact"];
const BANNER_TYPES = ["hero", "promo"];

export default function AdminBanners() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Banner | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterPage, setFilterPage] = useState("all");

  const [form, setForm] = useState({
    title: "", subtitle: "", image_url: "", cta_text: "Shop Now",
    cta_link: "/", page: "home", position: 0, is_active: true, banner_type: "hero",
  });

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ["admin-banners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .order("page")
        .order("position");
      if (error) throw error;
      return (data || []) as Banner[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (banner: Partial<Banner>) => {
      if (editing) {
        const { error } = await supabase.from("banners").update(banner).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("banners").insert(banner as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
      toast.success(editing ? "Banner updated" : "Banner created");
      resetForm();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("banners").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
      toast.success("Banner deleted");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("banners").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
    },
  });

  const resetForm = () => {
    setEditing(null);
    setShowForm(false);
    setForm({ title: "", subtitle: "", image_url: "", cta_text: "Shop Now", cta_link: "/", page: "home", position: 0, is_active: true, banner_type: "hero" });
  };

  const startEdit = (b: Banner) => {
    setEditing(b);
    setForm({
      title: b.title, subtitle: b.subtitle || "", image_url: b.image_url,
      cta_text: b.cta_text || "", cta_link: b.cta_link || "/",
      page: b.page, position: b.position, is_active: b.is_active, banner_type: b.banner_type,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image_url) { toast.error("Image URL is required"); return; }
    saveMutation.mutate(form);
  };

  const filtered = filterPage === "all" ? banners : banners.filter(b => b.page === filterPage);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop();
    const path = `banners/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) { toast.error("Upload failed: " + error.message); return; }
    const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
    setForm(f => ({ ...f, image_url: urlData.publicUrl }));
    toast.success("Image uploaded");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Banners</h1>
          <p className="text-sm text-muted-foreground">Manage hero & promo banners across all pages</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90">
          <Plus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["all", ...PAGES].map(p => (
          <button key={p} onClick={() => setFilterPage(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${filterPage === p ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            {p}
          </button>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editing ? "Edit Banner" : "New Banner"}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Title</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full px-3 py-2 bg-background rounded-lg border border-border text-sm" placeholder="Banner title" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Subtitle</label>
              <input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
                className="w-full px-3 py-2 bg-background rounded-lg border border-border text-sm" placeholder="Subtitle text" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Image</label>
              <div className="flex gap-2">
                <input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                  className="flex-1 px-3 py-2 bg-background rounded-lg border border-border text-sm" placeholder="Image URL or upload" />
                <label className="px-3 py-2 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 flex items-center gap-1 text-xs">
                  <Image className="w-3.5 h-3.5" /> Upload
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
              {form.image_url && (
                <img src={form.image_url} alt="Preview" className="mt-2 h-20 rounded-lg object-cover" />
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">CTA Text</label>
                <input value={form.cta_text} onChange={e => setForm(f => ({ ...f, cta_text: e.target.value }))}
                  className="w-full px-3 py-2 bg-background rounded-lg border border-border text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">CTA Link</label>
                <input value={form.cta_link} onChange={e => setForm(f => ({ ...f, cta_link: e.target.value }))}
                  className="w-full px-3 py-2 bg-background rounded-lg border border-border text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Page</label>
                <select value={form.page} onChange={e => setForm(f => ({ ...f, page: e.target.value }))}
                  className="w-full px-3 py-2 bg-background rounded-lg border border-border text-sm">
                  {PAGES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Type</label>
                <select value={form.banner_type} onChange={e => setForm(f => ({ ...f, banner_type: e.target.value }))}
                  className="w-full px-3 py-2 bg-background rounded-lg border border-border text-sm">
                  {BANNER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Position</label>
                <input type="number" value={form.position} onChange={e => setForm(f => ({ ...f, position: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 bg-background rounded-lg border border-border text-sm" />
              </div>
            </div>
            <div className="md:col-span-2 flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
                Active
              </label>
              <div className="flex-1" />
              <button type="button" onClick={resetForm} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
              <button type="submit" disabled={saveMutation.isPending}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50">
                {saveMutation.isPending ? "Saving..." : editing ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No banners found. Create one to get started.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(b => (
            <div key={b.id} className="flex items-center gap-4 bg-card border border-border rounded-xl p-3">
              <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
              <img src={b.image_url} alt={b.title} className="w-24 h-14 rounded-lg object-cover shrink-0 bg-muted" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{b.title || "(No title)"}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="capitalize bg-muted px-1.5 py-0.5 rounded">{b.page}</span>
                  <span className="capitalize bg-muted px-1.5 py-0.5 rounded">{b.banner_type}</span>
                  <span>Pos: {b.position}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => toggleMutation.mutate({ id: b.id, is_active: !b.is_active })}
                  className={`p-2 rounded-lg ${b.is_active ? "text-primary" : "text-muted-foreground"} hover:bg-muted`}>
                  {b.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => startEdit(b)} className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => { if (confirm("Delete this banner?")) deleteMutation.mutate(b.id); }}
                  className="p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
