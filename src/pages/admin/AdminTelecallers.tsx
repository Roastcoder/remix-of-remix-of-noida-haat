import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function AdminTelecallers() {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTc, setSelectedTc] = useState<string | null>(null);

  const { data: telecallers = [] } = useQuery({
    queryKey: ["admin-telecallers"],
    queryFn: async () => {
      const { data: roles } = await supabase.from("user_roles").select("user_id").eq("role", "telecaller");
      if (!roles?.length) return [];
      const ids = roles.map(r => r.user_id);
      const { data: profiles } = await supabase.from("profiles").select("*").in("user_id", ids);
      return profiles || [];
    },
  });

  const { data: tcStats = {} } = useQuery({
    queryKey: ["tc-stats"],
    queryFn: async () => {
      const { data: leads } = await supabase.from("leads").select("assigned_to, status");
      const { data: calls } = await supabase.from("call_history").select("telecaller_id, created_at");
      const stats: Record<string, { assigned: number; callsToday: number; converted: number }> = {};
      const today = new Date().toDateString();
      leads?.forEach(l => {
        if (!l.assigned_to) return;
        if (!stats[l.assigned_to]) stats[l.assigned_to] = { assigned: 0, callsToday: 0, converted: 0 };
        stats[l.assigned_to].assigned++;
        if (l.status === "converted") stats[l.assigned_to].converted++;
      });
      calls?.forEach(c => {
        if (!stats[c.telecaller_id]) stats[c.telecaller_id] = { assigned: 0, callsToday: 0, converted: 0 };
        if (new Date(c.created_at).toDateString() === today) stats[c.telecaller_id].callsToday++;
      });
      return stats;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Telecallers</h1>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold">
          <Plus className="w-3.5 h-3.5" /> Add Telecaller
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Leads Assigned</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Calls Today</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Converted</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {telecallers.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No telecallers yet</td></tr>}
            {telecallers.map(tc => {
              const s = tcStats[tc.user_id] || { assigned: 0, callsToday: 0, converted: 0 };
              return (
                <tr key={tc.user_id} className="border-b border-border/50 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setSelectedTc(tc.user_id)}>
                  <td className="px-4 py-3 font-medium text-foreground">{tc.full_name || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{tc.email}</td>
                  <td className="px-4 py-3 text-foreground">{s.assigned}</td>
                  <td className="px-4 py-3 text-foreground">{s.callsToday}</td>
                  <td className="px-4 py-3 text-green-400">{s.converted}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${tc.is_active ? "bg-green-500/20 text-green-400" : "bg-destructive/20 text-destructive"}`}>
                      {tc.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showAddModal && <AddTelecallerModal onClose={() => setShowAddModal(false)} />}
      </AnimatePresence>
    </div>
  );
}

function AddTelecallerModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    // Sign up user, then assign role via admin
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name } },
    });
    if (error) { toast.error(error.message); setLoading(false); return; }
    if (data.user) {
      await supabase.from("user_roles").insert({ user_id: data.user.id, role: "telecaller" as any });
      await supabase.from("profiles").update({ phone: form.phone }).eq("user_id", data.user.id);
    }
    queryClient.invalidateQueries({ queryKey: ["admin-telecallers"] });
    toast.success("Telecaller added");
    setLoading(false);
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-card border border-border rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-foreground mb-4">Add Telecaller</h2>
        <div className="space-y-3">
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full Name" className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />
          <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email" type="email" className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />
          <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="Phone" className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />
          <input value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Password" type="password" className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={onClose} className="flex-1 py-2.5 bg-background text-foreground rounded-xl text-sm">Cancel</button>
          <button onClick={handleSubmit} disabled={loading || !form.name || !form.email || !form.password} className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold disabled:opacity-50">
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
