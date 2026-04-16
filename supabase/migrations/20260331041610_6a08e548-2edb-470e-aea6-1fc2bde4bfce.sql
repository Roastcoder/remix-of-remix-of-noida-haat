
-- ============================================
-- CHAUHAAN COMPUTERS CRM — Full Database Schema
-- ============================================

-- 1. Role enum & user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'telecaller', 'customer');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- 2. Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  address TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. CRM Products (admin-managed)
CREATE TABLE public.crm_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Laptop',
  brand TEXT DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  description TEXT DEFAULT '',
  images TEXT[] DEFAULT '{}',
  specs JSONB DEFAULT '{}',
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.crm_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products" ON public.crm_products FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can do everything with products" ON public.crm_products FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_crm_products_updated_at BEFORE UPDATE ON public.crm_products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Leads table
CREATE TYPE public.lead_status AS ENUM ('new', 'contacted', 'interested', 'converted', 'not_interested');
CREATE TYPE public.lead_source AS ENUM ('meta', 'google', 'manual', 'website', 'whatsapp');

CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT DEFAULT '',
  source lead_source NOT NULL DEFAULT 'manual',
  product_interest TEXT DEFAULT '',
  status lead_status NOT NULL DEFAULT 'new',
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT DEFAULT '',
  follow_up_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can do everything with leads" ON public.leads FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Telecallers can view assigned leads" ON public.leads FOR SELECT USING (assigned_to = auth.uid());
CREATE POLICY "Telecallers can update assigned leads" ON public.leads FOR UPDATE USING (assigned_to = auth.uid());
CREATE POLICY "Customers can view own leads" ON public.leads FOR SELECT USING (customer_user_id = auth.uid());
CREATE POLICY "Authenticated can insert leads" ON public.leads FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_source ON public.leads(source);
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX idx_leads_follow_up ON public.leads(follow_up_at) WHERE follow_up_at IS NOT NULL;

-- 6. Lead remarks / activity timeline
CREATE TABLE public.lead_remarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  remark TEXT NOT NULL,
  remark_type TEXT DEFAULT 'note',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.lead_remarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can do everything with remarks" ON public.lead_remarks FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Telecallers can view remarks on assigned leads" ON public.lead_remarks FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.leads WHERE leads.id = lead_remarks.lead_id AND leads.assigned_to = auth.uid()));
CREATE POLICY "Telecallers can insert remarks on assigned leads" ON public.lead_remarks FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.leads WHERE leads.id = lead_remarks.lead_id AND leads.assigned_to = auth.uid()));

CREATE INDEX idx_lead_remarks_lead_id ON public.lead_remarks(lead_id);

-- 7. Call history
CREATE TYPE public.call_outcome AS ENUM ('answered', 'not_answered', 'busy', 'wrong_number', 'callback');

CREATE TABLE public.call_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  telecaller_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  outcome call_outcome NOT NULL,
  remarks TEXT DEFAULT '',
  duration_seconds INTEGER DEFAULT 0,
  follow_up_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.call_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can do everything with call history" ON public.call_history FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Telecallers can view own calls" ON public.call_history FOR SELECT USING (telecaller_id = auth.uid());
CREATE POLICY "Telecallers can insert own calls" ON public.call_history FOR INSERT WITH CHECK (telecaller_id = auth.uid());

CREATE INDEX idx_call_history_lead_id ON public.call_history(lead_id);
CREATE INDEX idx_call_history_telecaller ON public.call_history(telecaller_id);

-- 8. CRM Settings
CREATE TABLE public.crm_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.crm_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage settings" ON public.crm_settings FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can read settings" ON public.crm_settings FOR SELECT USING (true);

-- Insert default settings
INSERT INTO public.crm_settings (key, value) VALUES
  ('auto_assign', '{"enabled": false}'::jsonb),
  ('store_info', '{"name": "Chauhaan Computers", "address": "Shop No B-5, Girdhar Marg, near Indian Bank, Ashok Vihar, Sector 11, Malviya Nagar, Jaipur, Rajasthan 302017", "phone": "098297 21157", "hours": "Open daily, closes 9 PM", "whatsapp": "919829721157"}'::jsonb);

-- 9. Storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

CREATE POLICY "Anyone can view product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admins can upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update product images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete product images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
