import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, ExternalLink, GripVertical } from "lucide-react";

const platformOptions = [
  { name: "Instagram", icon: "instagram" },
  { name: "Facebook", icon: "facebook" },
  { name: "YouTube", icon: "youtube" },
  { name: "X (Twitter)", icon: "twitter" },
  { name: "LinkedIn", icon: "linkedin" },
];

export default function AdminSocialMedia() {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [newPlatform, setNewPlatform] = useState("Instagram");
  const [newUrl, setNewUrl] = useState("");

  const { data: links = [], isLoading } = useQuery({
    queryKey: ["admin-social-links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_media_links")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data || [];
    },
  });

  const addLink = useMutation({
    mutationFn: async () => {
      const opt = platformOptions.find(p => p.name === newPlatform);
      const { error } = await supabase.from("social_media_links").insert({
        platform: newPlatform,
        url: newUrl,
        icon_name: opt?.icon || "",
        display_order: links.length + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-social-links"] });
      toast.success("Social link added");
      setNewUrl("");
      setShowAdd(false);
    },
    onError: () => toast.error("Failed to add link"),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      await supabase.from("social_media_links").update({ is_active: !is_active }).eq("id", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-social-links"] });
    },
  });

  const deleteLink = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("social_media_links").delete().eq("id", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-social-links"] });
      toast.success("Link deleted");
    },
  });

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Social Media</h1>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold"
        >
          <Plus className="w-4 h-4" /> Add Link
        </button>
      </div>

      {showAdd && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Platform</label>
              <select
                value={newPlatform}
                onChange={e => setNewPlatform(e.target.value)}
                className="w-full px-3 py-2 bg-background rounded-lg text-sm border border-border"
              >
                {platformOptions.map(p => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">URL</label>
              <input
                type="url"
                value={newUrl}
                onChange={e => setNewUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-background rounded-lg text-sm border border-border"
              />
            </div>
          </div>
          <button
            onClick={() => addLink.mutate()}
            disabled={!newUrl || addLink.isPending}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold disabled:opacity-50"
          >
            Save
          </button>
        </div>
      )}

      <div className="space-y-2">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : links.length === 0 ? (
          <p className="text-sm text-muted-foreground">No social media links configured.</p>
        ) : (
          links.map((link) => (
            <div key={link.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
              <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{link.platform}</p>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline truncate block">
                  {link.url}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive.mutate({ id: link.id, is_active: link.is_active })}
                  className={`w-10 h-5 rounded-full transition-colors ${link.is_active ? "bg-primary" : "bg-muted"}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-card shadow-sm transition-transform ${link.is_active ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-muted-foreground hover:text-foreground">
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button onClick={() => deleteLink.mutate(link.id)} className="p-1.5 text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
