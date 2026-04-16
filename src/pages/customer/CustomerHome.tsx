import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { FileText, ShoppingBag, Clock, Star, Gift, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function CustomerHome() {
  const { profile, user } = useAuth();

  const { data: enquiries = [] } = useQuery({
    queryKey: ["customer-enquiries", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("leads").select("*").eq("customer_user_id", user!.id);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: loyaltyPoints } = useQuery({
    queryKey: ["customer-loyalty", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("loyalty_points").select("*").eq("user_id", user!.id).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const { data: recentTransactions = [] } = useQuery({
    queryKey: ["customer-loyalty-txns", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("loyalty_transactions").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(5);
      return data || [];
    },
    enabled: !!user,
  });

  const active = enquiries.filter(e => !["converted", "not_interested"].includes(e.status)).length;
  const converted = enquiries.filter(e => e.status === "converted").length;
  const points = loyaltyPoints?.points || 0;

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Welcome, {profile?.full_name || "Customer"}</h1>
        <p className="text-xs md:text-sm text-muted-foreground">Here's your activity overview</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { icon: FileText, label: "Active Enquiries", value: active, color: "text-primary" },
          { icon: ShoppingBag, label: "Orders", value: converted, color: "text-green-500" },
          { icon: Clock, label: "Total Enquiries", value: enquiries.length, color: "text-cyan-500" },
          { icon: Star, label: "Reward Points", value: points, color: "text-yellow-500" },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-xl p-4 md:p-5"
          >
            <kpi.icon className={`w-4 h-4 md:w-5 md:h-5 ${kpi.color} mb-1.5`} />
            <p className="text-lg md:text-2xl font-bold text-foreground">{kpi.value}</p>
            <p className="text-[10px] md:text-xs text-muted-foreground">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Loyalty Card */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl p-4 md:p-6">
        <div className="flex items-center gap-2 mb-3">
          <Gift className="w-5 h-5 text-primary" />
          <h3 className="text-sm md:text-base font-semibold text-foreground">Loyalty Rewards</h3>
        </div>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-3xl md:text-4xl font-bold text-primary">{points}</span>
          <span className="text-sm text-muted-foreground">points</span>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Earn points on every purchase and redeem as discount on your next order.
        </p>
        {loyaltyPoints && (
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>Earned: <strong className="text-foreground">{loyaltyPoints.lifetime_earned}</strong></span>
            <span>Redeemed: <strong className="text-foreground">{loyaltyPoints.lifetime_redeemed}</strong></span>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      {recentTransactions.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4 md:p-6">
          <h3 className="text-xs md:text-sm font-semibold text-foreground mb-3">Points History</h3>
          <div className="space-y-2">
            {recentTransactions.map((txn: any) => (
              <div key={txn.id} className="flex items-center justify-between bg-background rounded-xl p-3">
                <div>
                  <p className="text-xs font-medium text-foreground">{txn.description || (txn.type === "earn" ? "Points earned" : "Points redeemed")}</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(txn.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`text-sm font-bold ${txn.type === "earn" ? "text-green-500" : "text-destructive"}`}>
                  {txn.type === "earn" ? "+" : "-"}{txn.points}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Link to="/customer/products" className="bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">Browse Products</span>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </Link>
        <Link to="/customer/quote" className="bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">Request a Quote</span>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </Link>
      </div>
    </div>
  );
}
