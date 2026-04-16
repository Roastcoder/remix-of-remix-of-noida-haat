
-- Loyalty points balance per customer
CREATE TABLE public.loyalty_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  points INTEGER NOT NULL DEFAULT 0,
  lifetime_earned INTEGER NOT NULL DEFAULT 0,
  lifetime_redeemed INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own points" ON public.loyalty_points
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all points" ON public.loyalty_points
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Loyalty transaction log
CREATE TABLE public.loyalty_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL DEFAULT 'earn',
  points INTEGER NOT NULL,
  description TEXT DEFAULT '',
  order_reference TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own transactions" ON public.loyalty_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all transactions" ON public.loyalty_transactions
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_loyalty_points_updated_at
  BEFORE UPDATE ON public.loyalty_points
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default loyalty settings
INSERT INTO public.crm_settings (key, value) VALUES (
  'loyalty_config',
  '{"points_per_100_rupees": 1, "point_value_rupees": 1, "enabled": true}'::jsonb
) ON CONFLICT DO NOTHING;
