import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

const statusColors: Record<string, string> = {
  new: "bg-primary/20 text-primary",
  contacted: "bg-yellow-500/20 text-yellow-500",
  interested: "bg-purple-500/20 text-purple-500",
  converted: "bg-green-500/20 text-green-500",
  not_interested: "bg-destructive/20 text-destructive",
};

export default function CustomerEnquiries() {
  const { user } = useAuth();

  const { data: enquiries = [] } = useQuery({
    queryKey: ["customer-enquiries", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("leads").select("*").eq("customer_user_id", user!.id).order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-2xl font-bold text-foreground">My Enquiries</h1>

      {/* Desktop table */}
      <div className="hidden md:block bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Product</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Last Update</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No enquiries yet</td></tr>}
            {enquiries.map(enq => (
              <tr key={enq.id} className="border-b border-border/50">
                <td className="px-4 py-3 font-medium text-foreground">{enq.product_interest || "General"}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(enq.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${statusColors[enq.status] || "bg-muted text-muted-foreground"}`}>
                    {enq.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(enq.updated_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2">
        {enquiries.length === 0 && <p className="text-center text-muted-foreground py-8">No enquiries yet</p>}
        {enquiries.map(enq => (
          <div key={enq.id} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-start justify-between mb-1.5">
              <p className="text-sm font-semibold text-foreground">{enq.product_interest || "General"}</p>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[enq.status] || "bg-muted text-muted-foreground"}`}>
                {enq.status.replace("_", " ")}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">Created: {new Date(enq.created_at).toLocaleDateString()}</p>
            <p className="text-[10px] text-muted-foreground">Updated: {new Date(enq.updated_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
