import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Phone, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Lead = Tables<"leads">;
const STATUS_OPTIONS = ["new", "contacted", "interested", "converted", "not_interested"] as const;
const OUTCOME_OPTIONS = ["answered", "not_answered", "busy", "wrong_number", "callback"] as const;

export default function TelecallerLeads() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<string>("all");
  const [callingLead, setCallingLead] = useState<Lead | null>(null);

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["tc-leads", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("leads").select("*").eq("assigned_to", user!.id).order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const filtered = leads.filter(l => {
    if (filter === "all") return true;
    if (filter === "new") return l.status === "new";
    if (filter === "followup") return l.follow_up_at && new Date(l.follow_up_at).toDateString() === new Date().toDateString();
    if (filter === "not_called") return l.status === "new";
    return true;
  });

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-2xl font-bold text-foreground">My Leads</h1>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { key: "all", label: "All" },
          { key: "new", label: "New" },
          { key: "followup", label: "Follow-up" },
          { key: "not_called", label: "Not Called" },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3 md:px-4 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${filter === f.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Phone</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Product</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Follow-up</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr>}
            {filtered.map(lead => (
              <tr key={lead.id} className="border-b border-border/50 hover:bg-muted/50">
                <td className="px-4 py-3 font-medium text-foreground">{lead.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{lead.phone}</td>
                <td className="px-4 py-3 text-muted-foreground">{lead.product_interest || "—"}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                    lead.status === "new" ? "bg-primary/20 text-primary" :
                    lead.status === "contacted" ? "bg-yellow-500/20 text-yellow-500" :
                    lead.status === "interested" ? "bg-purple-500/20 text-purple-500" :
                    lead.status === "converted" ? "bg-green-500/20 text-green-500" :
                    "bg-destructive/20 text-destructive"
                  }`}>{lead.status.replace("_", " ")}</span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{lead.follow_up_at ? new Date(lead.follow_up_at).toLocaleDateString() : "—"}</td>
                <td className="px-4 py-3">
                  <button onClick={() => setCallingLead(lead)} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition-colors">
                    <Phone className="w-3 h-3" /> Call Now
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2">
        {isLoading && <p className="text-center text-muted-foreground py-8">Loading...</p>}
        {filtered.map(lead => (
          <div key={lead.id} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-semibold text-foreground">{lead.name}</p>
                <p className="text-xs text-muted-foreground">{lead.phone}</p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                lead.status === "new" ? "bg-primary/20 text-primary" :
                lead.status === "contacted" ? "bg-yellow-500/20 text-yellow-500" :
                lead.status === "interested" ? "bg-purple-500/20 text-purple-500" :
                lead.status === "converted" ? "bg-green-500/20 text-green-500" :
                "bg-destructive/20 text-destructive"
              }`}>{lead.status.replace("_", " ")}</span>
            </div>
            {lead.product_interest && (
              <p className="text-[10px] text-muted-foreground mb-2">Interest: {lead.product_interest}</p>
            )}
            {lead.follow_up_at && (
              <p className="text-[10px] text-muted-foreground mb-2">Follow-up: {new Date(lead.follow_up_at).toLocaleDateString()}</p>
            )}
            <button onClick={() => setCallingLead(lead)} className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition-colors">
              <Phone className="w-3 h-3" /> Call Now
            </button>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {callingLead && <CallingModal lead={callingLead} onClose={() => setCallingLead(null)} />}
      </AnimatePresence>
    </div>
  );
}

function CallingModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [outcome, setOutcome] = useState<string>("answered");
  const [remarks, setRemarks] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [status, setStatus] = useState(lead.status);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await supabase.from("call_history").insert({
      lead_id: lead.id,
      telecaller_id: user!.id,
      outcome: outcome as any,
      remarks,
      follow_up_at: followUp || null,
    });

    if (remarks) {
      await supabase.from("lead_remarks").insert({
        lead_id: lead.id,
        user_id: user!.id,
        remark: remarks,
        remark_type: "call",
      });
    }

    const updates: any = { status: status as any };
    if (followUp) updates.follow_up_at = followUp;
    await supabase.from("leads").update(updates).eq("id", lead.id);

    queryClient.invalidateQueries({ queryKey: ["tc-leads"] });
    queryClient.invalidateQueries({ queryKey: ["tc-calls"] });
    toast.success("Call saved");
    setSaving(false);
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 flex items-end md:items-center justify-center p-0 md:p-6" onClick={onClose}>
      <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="bg-card border border-border rounded-t-2xl md:rounded-2xl p-5 md:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4 md:hidden" />
        <h2 className="text-lg font-bold text-foreground mb-1">{lead.name}</h2>
        <p className="text-2xl font-bold text-primary mb-4">{lead.phone}</p>

        <div className="flex gap-3 mb-6">
          <a href={`tel:${lead.phone}`} className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition-colors">
            <Phone className="w-4 h-4" /> Call
          </a>
          <a href={`https://wa.me/91${lead.phone.replace(/\D/g, "")}?text=${encodeURIComponent("Hi, I'm calling from Chauhaan Computers")}`} target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-semibold text-sm hover:bg-green-600 transition-colors">
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Call Outcome</label>
            <select value={outcome} onChange={e => setOutcome(e.target.value)} className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none">
              {OUTCOME_OPTIONS.map(o => <option key={o} value={o}>{o.replace("_", " ")}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Remarks</label>
            <textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={3} className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none resize-none" placeholder="Notes from the call..." />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Follow-up Date</label>
            <input type="datetime-local" value={followUp} onChange={e => setFollowUp(e.target.value)} className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Update Status</label>
            <select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none">
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button onClick={onClose} className="flex-1 py-2.5 bg-muted text-foreground rounded-xl text-sm">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold disabled:opacity-50">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
