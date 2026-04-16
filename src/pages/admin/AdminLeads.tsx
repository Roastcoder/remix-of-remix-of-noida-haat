import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Upload, Search, Filter, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Lead = Tables<"leads">;

const STATUS_OPTIONS = ["new", "contacted", "interested", "converted", "not_interested"] as const;
const SOURCE_OPTIONS = ["meta", "google", "manual", "website", "whatsapp"] as const;

export default function AdminLeads() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<Lead | null>(null);
  const [showCsvModal, setShowCsvModal] = useState(false);

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["admin-leads-list"],
    queryFn: async () => {
      const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: telecallers = [] } = useQuery({
    queryKey: ["telecallers-list"],
    queryFn: async () => {
      const { data } = await supabase.from("user_roles").select("user_id").eq("role", "telecaller");
      if (!data) return [];
      const ids = data.map(d => d.user_id);
      const { data: profiles } = await supabase.from("profiles").select("*").in("user_id", ids);
      return profiles || [];
    },
  });

  const { data: remarks = [] } = useQuery({
    queryKey: ["lead-remarks", showDetailModal?.id],
    enabled: !!showDetailModal,
    queryFn: async () => {
      const { data } = await supabase.from("lead_remarks").select("*").eq("lead_id", showDetailModal!.id).order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: callHistory = [] } = useQuery({
    queryKey: ["lead-calls", showDetailModal?.id],
    enabled: !!showDetailModal,
    queryFn: async () => {
      const { data } = await supabase.from("call_history").select("*").eq("lead_id", showDetailModal!.id).order("created_at", { ascending: false });
      return data || [];
    },
  });

  const assignMutation = useMutation({
    mutationFn: async ({ leadId, userId }: { leadId: string; userId: string }) => {
      await supabase.from("leads").update({ assigned_to: userId }).eq("id", leadId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-leads-list"] });
      toast.success("Lead assigned");
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ leadId, status }: { leadId: string; status: string }) => {
      await supabase.from("leads").update({ status: status as any }).eq("id", leadId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-leads-list"] });
      toast.success("Status updated");
    },
  });

  const filtered = leads.filter(l => {
    if (statusFilter !== "all" && l.status !== statusFilter) return false;
    if (sourceFilter !== "all" && l.source !== sourceFilter) return false;
    if (search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.phone.includes(search)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Leads Management</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowCsvModal(true)} className="flex items-center gap-2 px-4 py-2 bg-background text-foreground rounded-xl text-xs font-semibold hover:bg-muted transition-colors">
            <Upload className="w-3.5 h-3.5" /> CSV Upload
          </button>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity">
            <Plus className="w-3.5 h-3.5" /> Add Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or phone..." className="w-full pl-9 pr-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none">
          <option value="all">All Status</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
        </select>
        <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} className="px-3 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none">
          <option value="all">All Sources</option>
          {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Webhook Info */}
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-xs text-muted-foreground mb-1">📡 Webhook URL for Meta/Google Ads:</p>
        <code className="text-xs text-primary bg-background px-3 py-1.5 rounded-lg block overflow-x-auto">
          {`${import.meta.env.VITE_SUPABASE_URL || "https://your-project.supabase.co"}/functions/v1/lead-webhook`}
        </code>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Source</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Product</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Assigned To</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr>}
              {!isLoading && filtered.length === 0 && <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">No leads found</td></tr>}
              {filtered.map(lead => (
                <tr key={lead.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{lead.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{lead.phone}</td>
                  <td className="px-4 py-3"><span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary uppercase">{lead.source}</span></td>
                  <td className="px-4 py-3 text-muted-foreground">{lead.product_interest || "—"}</td>
                  <td className="px-4 py-3">
                    <select
                      value={lead.status}
                      onChange={e => statusMutation.mutate({ leadId: lead.id, status: e.target.value })}
                      className="text-[10px] font-semibold px-2 py-1 rounded-full bg-background border border-border text-foreground outline-none"
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={lead.assigned_to || ""}
                      onChange={e => assignMutation.mutate({ leadId: lead.id, userId: e.target.value })}
                      className="text-xs px-2 py-1 bg-background rounded-lg border border-border text-foreground outline-none"
                    >
                      <option value="">Unassigned</option>
                      {telecallers.map(t => <option key={t.user_id} value={t.user_id}>{t.full_name || t.email}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(lead.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setShowDetailModal(lead)} className="text-primary hover:text-primary/80 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lead Modal */}
      <AnimatePresence>
        {showAddModal && <AddLeadModal onClose={() => setShowAddModal(false)} />}
      </AnimatePresence>

      {/* CSV Upload Modal */}
      <AnimatePresence>
        {showCsvModal && <CsvUploadModal onClose={() => setShowCsvModal(false)} />}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && (
          <LeadDetailModal
            lead={showDetailModal}
            remarks={remarks}
            callHistory={callHistory}
            onClose={() => setShowDetailModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AddLeadModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: "", phone: "", email: "", product_interest: "", source: "manual" as const, notes: "" });

  const mutation = useMutation({
    mutationFn: async () => {
      // Duplicate check
      const { data: existing } = await supabase.from("leads").select("id").eq("phone", form.phone).limit(1);
      if (existing && existing.length > 0) {
        if (!confirm("A lead with this phone number already exists. Add anyway?")) throw new Error("Cancelled");
      }
      await supabase.from("leads").insert(form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-leads-list"] });
      toast.success("Lead added");
      onClose();
    },
    onError: (e: any) => { if (e.message !== "Cancelled") toast.error("Error adding lead"); },
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-card border border-border rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-foreground mb-4">Add New Lead</h2>
        <div className="space-y-3">
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Name *" className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" required />
          <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="Phone *" className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" required />
          <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email" className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />
          <input value={form.product_interest} onChange={e => setForm(f => ({ ...f, product_interest: e.target.value }))} placeholder="Product Interest" className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />
          <select value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value as any }))} className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none">
            {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Notes" rows={3} className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none resize-none" />
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={onClose} className="flex-1 py-2.5 bg-background text-foreground rounded-xl text-sm font-medium">Cancel</button>
          <button onClick={() => mutation.mutate()} disabled={!form.name || !form.phone} className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold disabled:opacity-50">Save Lead</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CsvUploadModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [rows, setRows] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split("\n").filter(l => l.trim());
      if (lines.length < 2) return;
      const h = lines[0].split(",").map(s => s.trim().replace(/"/g, ""));
      setHeaders(h);
      const data = lines.slice(1).map(line => {
        const vals = line.split(",").map(s => s.trim().replace(/"/g, ""));
        return h.reduce((acc, key, i) => ({ ...acc, [key]: vals[i] || "" }), {} as any);
      });
      setRows(data);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    const mapped = rows.map(r => ({
      name: r.name || r.Name || "",
      phone: r.phone || r.Phone || "",
      email: r.email || r.Email || "",
      product_interest: r.product_interest || r.Product || "",
      source: "manual" as const,
    })).filter(r => r.name && r.phone);
    if (mapped.length === 0) { toast.error("No valid rows"); return; }
    await supabase.from("leads").insert(mapped);
    queryClient.invalidateQueries({ queryKey: ["admin-leads-list"] });
    toast.success(`${mapped.length} leads imported`);
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-foreground mb-4">CSV Upload</h2>
        <input type="file" accept=".csv" onChange={handleFile} className="text-sm text-foreground mb-4" />
        {rows.length > 0 && (
          <>
            <p className="text-xs text-muted-foreground mb-2">{rows.length} rows found. Columns: {headers.join(", ")}</p>
            <div className="max-h-40 overflow-y-auto bg-background rounded-xl p-3 mb-4">
              {rows.slice(0, 5).map((r, i) => <p key={i} className="text-xs text-foreground truncate">{JSON.stringify(r)}</p>)}
            </div>
            <button onClick={handleImport} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold">Import {rows.length} Leads</button>
          </>
        )}
        <button onClick={onClose} className="w-full mt-2 py-2.5 bg-background text-foreground rounded-xl text-sm">Cancel</button>
      </motion.div>
    </motion.div>
  );
}

function LeadDetailModal({ lead, remarks, callHistory, onClose }: { lead: Lead; remarks: any[]; callHistory: any[]; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-foreground mb-4">{lead.name}</h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div><p className="text-[10px] text-muted-foreground">Phone</p><p className="text-sm text-foreground">{lead.phone}</p></div>
          <div><p className="text-[10px] text-muted-foreground">Email</p><p className="text-sm text-foreground">{lead.email || "—"}</p></div>
          <div><p className="text-[10px] text-muted-foreground">Source</p><p className="text-sm text-primary uppercase font-semibold">{lead.source}</p></div>
          <div><p className="text-[10px] text-muted-foreground">Status</p><p className="text-sm text-foreground capitalize">{lead.status.replace("_", " ")}</p></div>
          <div><p className="text-[10px] text-muted-foreground">Product</p><p className="text-sm text-foreground">{lead.product_interest || "—"}</p></div>
          <div><p className="text-[10px] text-muted-foreground">Created</p><p className="text-sm text-foreground">{new Date(lead.created_at).toLocaleDateString()}</p></div>
        </div>

        <h3 className="text-sm font-semibold text-foreground mb-2">Call History</h3>
        <div className="space-y-2 mb-4">
          {callHistory.length === 0 && <p className="text-xs text-muted-foreground">No calls recorded</p>}
          {callHistory.map(c => (
            <div key={c.id} className="bg-background rounded-lg p-3">
              <div className="flex justify-between">
                <span className="text-xs font-semibold text-foreground capitalize">{c.outcome.replace("_", " ")}</span>
                <span className="text-[10px] text-muted-foreground">{new Date(c.created_at).toLocaleString()}</span>
              </div>
              {c.remarks && <p className="text-xs text-muted-foreground mt-1">{c.remarks}</p>}
            </div>
          ))}
        </div>

        <h3 className="text-sm font-semibold text-foreground mb-2">Remarks Timeline</h3>
        <div className="space-y-2 mb-4">
          {remarks.length === 0 && <p className="text-xs text-muted-foreground">No remarks</p>}
          {remarks.map(r => (
            <div key={r.id} className="bg-background rounded-lg p-3">
              <p className="text-xs text-foreground">{r.remark}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{new Date(r.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>

        <button onClick={onClose} className="w-full py-2.5 bg-background text-foreground rounded-xl text-sm">Close</button>
      </motion.div>
    </motion.div>
  );
}
