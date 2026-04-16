import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Download } from "lucide-react";

export default function AdminReports() {
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString().split("T")[0];
  });
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().split("T")[0]);

  const { data: leads = [] } = useQuery({
    queryKey: ["report-leads", dateFrom, dateTo],
    queryFn: async () => {
      const { data } = await supabase.from("leads").select("*")
        .gte("created_at", dateFrom).lte("created_at", dateTo + "T23:59:59");
      return data || [];
    },
  });

  const { data: calls = [] } = useQuery({
    queryKey: ["report-calls", dateFrom, dateTo],
    queryFn: async () => {
      const { data } = await supabase.from("call_history").select("*")
        .gte("created_at", dateFrom).lte("created_at", dateTo + "T23:59:59");
      return data || [];
    },
  });

  const sourceBreakdown = ["meta", "google", "manual", "website", "whatsapp"].map(s => ({
    source: s,
    count: leads.filter(l => l.source === s).length,
  }));

  const conversionRate = leads.length > 0 ? ((leads.filter(l => l.status === "converted").length / leads.length) * 100).toFixed(1) : "0";

  const exportCsv = () => {
    const headers = "Name,Phone,Email,Source,Status,Product,Created\n";
    const rows = leads.map(l => `${l.name},${l.phone},${l.email},${l.source},${l.status},${l.product_interest},${l.created_at}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "leads-report.csv"; a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <button onClick={exportCsv} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold">
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>

      <div className="flex gap-3">
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs text-muted-foreground">Total Leads</p>
          <p className="text-3xl font-bold text-foreground">{leads.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs text-muted-foreground">Total Calls</p>
          <p className="text-3xl font-bold text-foreground">{calls.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs text-muted-foreground">Conversion Rate</p>
          <p className="text-3xl font-bold text-green-400">{conversionRate}%</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Leads by Source</h3>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border"><th className="text-left px-4 py-2 text-xs text-muted-foreground">Source</th><th className="text-left px-4 py-2 text-xs text-muted-foreground">Count</th></tr></thead>
          <tbody>
            {sourceBreakdown.map(s => (
              <tr key={s.source} className="border-b border-border/50">
                <td className="px-4 py-2 text-foreground capitalize">{s.source}</td>
                <td className="px-4 py-2 text-foreground">{s.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
