import { useState } from "react";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, LogIn, UserPlus, Mail, Phone } from "lucide-react";
import { useAuth } from "@/lib/auth";
import loginHero from "@/assets/login-hero-haat.jpg";
import logoIcon from "@/assets/logo-textiletwist.png";

const DEMO_ACCOUNTS = [
  { label: "Admin", email: "admin@textiletwist.com", password: "admin123" },
  { label: "Telecaller", email: "telecaller@textiletwist.com", password: "tele123" },
  { label: "Customer", email: "customer@textiletwist.com", password: "cust123" },
];

export default function Login() {
  const { signIn, signUp, user, role, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user && role) {
    if (role === "admin") return <Navigate to="/admin" replace />;
    if (role === "telecaller") return <Navigate to="/telecaller" replace />;
    return <Navigate to="/customer" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(""); setSubmitting(true);
    const { error: err } = await signIn(email, password);
    if (err) setError(err.message);
    setSubmitting(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setSubmitting(true);
    const { error: err } = await signUp(email, password, fullName, "customer");
    if (err) { setError(err.message); } else {
      setSuccess("Account created! Please check your email to verify, then sign in.");
      setMode("login");
    }
    setSubmitting(false);
  };

  const fillDemo = (demo: typeof DEMO_ACCOUNTS[0]) => { setEmail(demo.email); setPassword(demo.password); setError(""); setSuccess(""); setMode("login"); };
  const switchMode = (m: "login" | "signup") => { setMode(m); setError(""); setSuccess(""); };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={loginHero} alt="Textile Twist luxury showroom" className="absolute inset-0 w-full h-full object-cover" width={960} height={1280} />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/30 to-transparent" />
        <div className="relative z-10 flex flex-col justify-end p-10 text-white">
          <div className="flex items-center gap-3 mb-4">
            <img src={logoIcon} alt="Textile Twist" className="w-10 h-10" />
            <span className="text-2xl font-bold tracking-tight text-white">Textile Twist</span>
          </div>
          <p className="text-lg text-white/80 mb-6 max-w-md">Luxury Home Textiles — Premium Bed Linen, Towels, Rugs & Cushions</p>
          <div className="flex flex-col gap-2 text-sm text-white/60">
            <div className="flex items-center gap-2"><Mail className="w-4 h-4" /><span>hello@textiletwist.com</span></div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4" /><span>+91 95093 17543</span></div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <img src={logoIcon} alt="Textile Twist" className="w-8 h-8" />
            <span className="text-xl font-bold text-foreground">Textile Twist</span>
          </div>

          <div className="flex gap-1 mb-8 bg-surface rounded-xl p-1">
            <button onClick={() => switchMode("login")} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === "login" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>Sign In</button>
            <button onClick={() => switchMode("signup")} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === "signup" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>Sign Up</button>
          </div>

          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.div key="login" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <h1 className="text-2xl font-bold text-foreground mb-1">Welcome back</h1>
                <p className="text-sm text-muted-foreground mb-6">Sign in to your Textile Twist account</p>

                <div className="mb-6">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Quick Demo Login</p>
                  <div className="grid grid-cols-3 gap-2">
                    {DEMO_ACCOUNTS.map((demo) => (
                      <button key={demo.label} type="button" onClick={() => fillDemo(demo)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${email === demo.email ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/30"}`}>
                        {demo.label}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-card rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 border border-border" placeholder="you@example.com" required />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Password</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-card rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 border border-border pr-10" placeholder="••••••••" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  {error && <p className="text-xs text-destructive">{error}</p>}
                  {success && <p className="text-xs text-primary">{success}</p>}
                  <button type="submit" disabled={submitting} className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                    <LogIn className="w-4 h-4" /> {submitting ? "Signing in..." : "Sign In"}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="signup" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <h1 className="text-2xl font-bold text-foreground mb-1">Create an account</h1>
                <p className="text-sm text-muted-foreground mb-6">Join Textile Twist for luxury textile shopping</p>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Full Name</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 bg-card rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 border border-border" placeholder="Your Name" required />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-card rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 border border-border" placeholder="you@example.com" required />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Password</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-card rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 border border-border pr-10" placeholder="Min. 6 characters" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  {error && <p className="text-xs text-destructive">{error}</p>}
                  <button type="submit" disabled={submitting} className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                    <UserPlus className="w-4 h-4" /> {submitting ? "Creating account..." : "Create Account"}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
          <p className="text-xs text-muted-foreground text-center mt-6">By continuing, you agree to our Terms of Service</p>
        </motion.div>
      </div>
    </div>
  );
}