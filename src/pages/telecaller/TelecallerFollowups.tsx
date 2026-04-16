import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { CalendarClock } from "lucide-react";

export default function TelecallerFollowups() {
  const { user } = useAuth();

  const { data: leads = [] } = useQuery({
    queryKey: ["tc-followups", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("leads").select("*")
        .eq("assigned_to", user!.id)
        .not("follow_up_at", "is", null)
        .order("follow_up_at", { ascending: true });
      return data || [];
    },
    enabled: !!user,
  });

  const today = new Date().toDateString();
  const todayFollowups = leads.filter(l => l.follow_up_at && new Date(l.follow_up_at).toDateString() === today);
  const upcoming = leads.filter(l => l.follow_up_at && new Date(l.follow_up_at) > new Date());

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Follow-ups</h1>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <CalendarClock className="w-4 h-4 text-primary" /> Today ({todayFollowups.length})
        </h3>
        {todayFollowups.length === 0 && <p className="text-xs text-muted-foreground">No follow-ups today</p>}
        <div className="space-y-2">
          {todayFollowups.map(lead => (
            <div key={lead.id} className="flex items-center justify-between bg-background rounded-xl p-4">
              <div>
                <p className="text-sm font-medium text-foreground">{lead.name}</p>
                <p className="text-xs text-muted-foreground">{lead.phone} · {lead.product_interest || "No product"}</p>
              </div>
              <a href={`tel:${lead.phone}`} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-semibold">Call</a>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Upcoming</h3>
        {upcoming.length === 0 && <p className="text-xs text-muted-foreground">No upcoming follow-ups</p>}
        <div className="space-y-2">
          {upcoming.map(lead => (
            <div key={lead.id} className="flex items-center justify-between bg-background rounded-xl p-4">
              <div>
                <p className="text-sm font-medium text-foreground">{lead.name}</p>
                <p className="text-xs text-muted-foreground">{lead.phone}</p>
              </div>
              <span className="text-xs text-muted-foreground">{new Date(lead.follow_up_at!).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
