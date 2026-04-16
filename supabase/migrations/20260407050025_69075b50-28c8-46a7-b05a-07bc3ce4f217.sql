
CREATE TABLE public.social_media_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.social_media_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage social media links"
ON public.social_media_links
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active social media links"
ON public.social_media_links
FOR SELECT
USING (is_active = true);

CREATE TRIGGER update_social_media_links_updated_at
BEFORE UPDATE ON public.social_media_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
