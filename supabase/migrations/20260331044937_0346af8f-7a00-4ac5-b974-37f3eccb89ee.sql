CREATE TABLE public.banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  subtitle text DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  cta_text text DEFAULT 'Shop Now',
  cta_link text DEFAULT '/',
  page text NOT NULL DEFAULT 'home',
  position integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  banner_type text NOT NULL DEFAULT 'hero',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active banners" ON public.banners
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage banners" ON public.banners
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_banners_updated_at
  BEFORE UPDATE ON public.banners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();