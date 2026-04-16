import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function CustomerProfile() {
  const { profile, user } = useAuth();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
    email: profile?.email || "",
    address: profile?.address || "",
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      await supabase.from("profiles").update(form).eq("user_id", user!.id);
    },
    onSuccess: () => {
      toast.success("Profile updated");
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">My Profile</h1>

      <div className="bg-card border border-border rounded-xl p-6 max-w-md">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Full Name</label>
            <input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Phone</label>
            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Email</label>
            <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Address</label>
            <textarea value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} rows={3} className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none resize-none" />
          </div>
        </div>
        <button onClick={() => updateMutation.mutate()} className="mt-4 w-full py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold">Save Changes</button>
      </div>
    </div>
  );
}
