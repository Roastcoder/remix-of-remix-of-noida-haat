import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const demoUsers = [
      { email: "admin@chauhaan.com", password: "admin123", full_name: "Admin User", role: "admin" },
      { email: "telecaller@chauhaan.com", password: "tele123", full_name: "Telecaller User", role: "telecaller" },
      { email: "customer@chauhaan.com", password: "cust123", full_name: "Customer User", role: "customer" },
    ];

    const results = [];

    for (const demo of demoUsers) {
      // Check if user already exists
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existing = existingUsers?.users?.find((u: any) => u.email === demo.email);
      
      if (existing) {
        results.push({ email: demo.email, status: "already exists" });
        continue;
      }

      // Create user
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email: demo.email,
        password: demo.password,
        email_confirm: true,
        user_metadata: { full_name: demo.full_name },
      });

      if (userError) {
        results.push({ email: demo.email, status: "error", error: userError.message });
        continue;
      }

      const userId = userData.user.id;

      // Insert role
      await supabase.from("user_roles").upsert({
        user_id: userId,
        role: demo.role,
      }, { onConflict: "user_id,role" });

      results.push({ email: demo.email, status: "created", role: demo.role });
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
