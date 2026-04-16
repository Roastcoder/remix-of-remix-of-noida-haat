import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/lib/cart";
import { AuthProvider } from "@/lib/auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ScrollToTop } from "@/components/ScrollToTop";
import { StoreInfoBar } from "@/components/StoreInfoBar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import Index from "./pages/Index";
import Category from "./pages/Category";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Services from "./pages/Services";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import B2B from "./pages/B2B";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLeads from "./pages/admin/AdminLeads";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminTelecallers from "./pages/admin/AdminTelecallers";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminBanners from "./pages/admin/AdminBanners";
import AdminSocialMedia from "./pages/admin/AdminSocialMedia";
import TelecallerLayout from "./pages/telecaller/TelecallerLayout";
import TelecallerLeads from "./pages/telecaller/TelecallerLeads";
import TelecallerCalls from "./pages/telecaller/TelecallerCalls";
import TelecallerFollowups from "./pages/telecaller/TelecallerFollowups";
import TelecallerPerformance from "./pages/telecaller/TelecallerPerformance";
import CustomerLayout from "./pages/customer/CustomerLayout";
import CustomerHome from "./pages/customer/CustomerHome";
import CustomerProducts from "./pages/customer/CustomerProducts";
import CustomerEnquiries from "./pages/customer/CustomerEnquiries";
import CustomerQuote from "./pages/customer/CustomerQuote";
import CustomerProfile from "./pages/customer/CustomerProfile";

const queryClient = new QueryClient();

function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <StoreInfoBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <ScrollToTop />
            <Routes>
              {/* Public storefront */}
              <Route path="/" element={<StorefrontLayout><Index /></StorefrontLayout>} />
              <Route path="/category/:slug" element={<StorefrontLayout><Category /></StorefrontLayout>} />
              <Route path="/product/:id" element={<StorefrontLayout><ProductDetail /></StorefrontLayout>} />
              <Route path="/cart" element={<StorefrontLayout><Cart /></StorefrontLayout>} />
              <Route path="/about" element={<StorefrontLayout><About /></StorefrontLayout>} />
              <Route path="/services" element={<StorefrontLayout><Services /></StorefrontLayout>} />
              <Route path="/blog" element={<StorefrontLayout><Blog /></StorefrontLayout>} />
              <Route path="/contact" element={<StorefrontLayout><Contact /></StorefrontLayout>} />
              <Route path="/careers" element={<StorefrontLayout><Careers /></StorefrontLayout>} />
              <Route path="/login" element={<Login />} />

              {/* Admin Panel */}
              <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="leads" element={<AdminLeads />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="telecallers" element={<AdminTelecallers />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="banners" element={<AdminBanners />} />
                <Route path="social" element={<AdminSocialMedia />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Telecaller Panel */}
              <Route path="/telecaller" element={<ProtectedRoute allowedRoles={["telecaller"]}><TelecallerLayout /></ProtectedRoute>}>
                <Route index element={<TelecallerLeads />} />
                <Route path="calls" element={<TelecallerCalls />} />
                <Route path="followups" element={<TelecallerFollowups />} />
                <Route path="performance" element={<TelecallerPerformance />} />
              </Route>

              {/* Customer Panel */}
              <Route path="/customer" element={<ProtectedRoute allowedRoles={["customer"]}><CustomerLayout /></ProtectedRoute>}>
                <Route index element={<CustomerHome />} />
                <Route path="products" element={<CustomerProducts />} />
                <Route path="enquiries" element={<CustomerEnquiries />} />
                <Route path="quote" element={<CustomerQuote />} />
                <Route path="profile" element={<CustomerProfile />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
