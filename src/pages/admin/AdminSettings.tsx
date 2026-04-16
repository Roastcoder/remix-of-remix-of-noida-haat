import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Gift } from "lucide-react";

export default function AdminSettings() {
  const queryClient = useQueryClient();

  const { data: settings = [] } = useQuery({
    queryKey: ["crm-settings"],
    queryFn: async () => {
      const { data } = await supabase.from("crm_settings").select("*");
      return data || [];
    },
  });

  const autoAssign = settings.find(s => s.key === "auto_assign");
  const storeInfo = settings.find(s => s.key === "store_info");
  const loyaltyConfig = settings.find(s => s.key === "loyalty_config");
  const isAutoAssign = (autoAssign?.value as any)?.enabled || false;

  const loyaltyData = (loyaltyConfig?.value as any) || { points_per_100_rupees: 1, point_value_rupees: 1, enabled: true };
  const [pointsPer100, setPointsPer100] = useState<string>(String(loyaltyData.points_per_100_rupees || 1));
  const [pointValue, setPointValue] = useState<string>(String(loyaltyData.point_value_rupees || 1));
  const [loyaltyEnabled, setLoyaltyEnabled] = useState(loyaltyData.enabled !== false);

  const toggleAutoAssign = useMutation({
    mutationFn: async () => {
      await supabase.from("crm_settings").update({ value: { enabled: !isAutoAssign } }).eq("key", "auto_assign");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-settings"] });
      toast.success("Settings updated");
    },
  });

  const saveLoyalty = useMutation({
    mutationFn: async () => {
      const value = {
        points_per_100_rupees: Number(pointsPer100) || 1,
        point_value_rupees: Number(pointValue) || 1,
        enabled: loyaltyEnabled,
      };
      if (loyaltyConfig) {
        await supabase.from("crm_settings").update({ value }).eq("key", "loyalty_config");
      } else {
        await supabase.from("crm_settings").insert({ key: "loyalty_config", value });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-settings"] });
      toast.success("Loyalty settings saved");
    },
  });

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-2xl font-bold text-foreground">Settings</h1>

      <div className="bg-card border border-border rounded-xl p-4 md:p-6">
        <h3 className="text-xs md:text-sm font-semibold text-foreground mb-4">Lead Assignment</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground">Auto-assign leads (round-robin)</p>
            <p className="text-xs text-muted-foreground">Automatically distribute new leads across telecallers</p>
          </div>
          <button
            onClick={() => toggleAutoAssign.mutate()}
            className={`w-12 h-6 rounded-full transition-colors ${isAutoAssign ? "bg-primary" : "bg-muted"}`}
          >
            <div className={`w-5 h-5 rounded-full bg-card shadow-sm transition-transform ${isAutoAssign ? "translate-x-6" : "translate-x-0.5"}`} />
          </button>
        </div>
      </div>

      {/* Loyalty Points Config */}
      <div className="bg-card border border-border rounded-xl p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Gift className="w-4 h-4 text-primary" />
          <h3 className="text-xs md:text-sm font-semibold text-foreground">Loyalty Points Configuration</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Enable Loyalty Program</p>
              <p className="text-xs text-muted-foreground">Allow customers to earn and redeem points</p>
            </div>
            <button
              onClick={() => setLoyaltyEnabled(!loyaltyEnabled)}
              className={`w-12 h-6 rounded-full transition-colors ${loyaltyEnabled ? "bg-primary" : "bg-muted"}`}
            >
              <div className={`w-5 h-5 rounded-full bg-card shadow-sm transition-transform ${loyaltyEnabled ? "translate-x-6" : "translate-x-0.5"}`} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Points earned per ₹100 spent</label>
              <input
                type="number"
                min="0"
                value={pointsPer100}
                onChange={e => setPointsPer100(e.target.value)}
                className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Point value in ₹ (1 point = ₹?)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={pointValue}
                onChange={e => setPointValue(e.target.value)}
                className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none"
              />
            </div>
          </div>

          <button
            onClick={() => saveLoyalty.mutate()}
            disabled={saveLoyalty.isPending}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold disabled:opacity-50"
          >
            {saveLoyalty.isPending ? "Saving..." : "Save Loyalty Settings"}
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 md:p-6">
        <h3 className="text-xs md:text-sm font-semibold text-foreground mb-4">Store Information</h3>
        {storeInfo && (
          <div className="space-y-3 text-sm">
            <div><span className="text-muted-foreground">Name:</span> <span className="text-foreground">{(storeInfo.value as any)?.name}</span></div>
            <div><span className="text-muted-foreground">Address:</span> <span className="text-foreground">{(storeInfo.value as any)?.address}</span></div>
            <div><span className="text-muted-foreground">Phone:</span> <span className="text-foreground">{(storeInfo.value as any)?.phone}</span></div>
            <div><span className="text-muted-foreground">Hours:</span> <span className="text-foreground">{(storeInfo.value as any)?.hours}</span></div>
          </div>
        )}
      </div>
    </div>
  );
}
