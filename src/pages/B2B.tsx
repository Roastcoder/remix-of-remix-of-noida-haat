import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, User, Mail, Phone, FileText, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function B2BOrders() {
  const [form, setForm] = useState({ company_name: "", contact_name: "", email: "", phone: "", requirements: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company_name || !form.contact_name || !form.email) {
      toast.error("Please fill all required fields");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("b2b_inquiries").insert(form);
    if (error) {
      toast.error("Failed to submit inquiry. Please try again.");
    } else {
      toast.success("Inquiry submitted! Our team will contact you soon.");
      setForm({ company_name: "", contact_name: "", email: "", phone: "", requirements: "" });
    }
    setSubmitting(false);
  };

  return (
    <div className="bg-background min-h-screen">
      <section className="py-16 sm:py-24 bg-primary/5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-5xl font-bold text-foreground mb-4">B2B & Bulk Orders</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Premium home textiles for hotels, resorts, corporate gifting, and large-scale interior projects. Get exclusive pricing on bulk orders.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-card rounded-2xl border border-border p-6 sm:p-10">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Submit Your Inquiry</h2>
            <p className="text-sm text-muted-foreground mb-8">Fill out the form below and our B2B team will get back to you within 24 hours.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Company Name *</label>
                  <input value={form.company_name} onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))} className="w-full px-4 py-3 bg-background rounded-xl text-sm text-foreground border border-border outline-none focus:ring-2 focus:ring-primary/30" placeholder="Your Company" required />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Contact Person *</label>
                  <input value={form.contact_name} onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))} className="w-full px-4 py-3 bg-background rounded-xl text-sm text-foreground border border-border outline-none focus:ring-2 focus:ring-primary/30" placeholder="Your Name" required />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full px-4 py-3 bg-background rounded-xl text-sm text-foreground border border-border outline-none focus:ring-2 focus:ring-primary/30" placeholder="email@company.com" required />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-4 py-3 bg-background rounded-xl text-sm text-foreground border border-border outline-none focus:ring-2 focus:ring-primary/30" placeholder="+91 98765 43210" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Requirements</label>
                <textarea value={form.requirements} onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))} rows={5} className="w-full px-4 py-3 bg-background rounded-xl text-sm text-foreground border border-border outline-none focus:ring-2 focus:ring-primary/30 resize-none" placeholder="Describe your requirements — product types, quantities, timelines..." />
              </div>
              <button type="submit" disabled={submitting} className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> {submitting ? "Submitting..." : "Submit Inquiry"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}