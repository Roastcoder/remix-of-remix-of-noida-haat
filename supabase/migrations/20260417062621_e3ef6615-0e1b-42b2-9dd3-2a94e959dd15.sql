
-- Add SKU and variants columns to crm_products for advanced product management
ALTER TABLE public.crm_products
  ADD COLUMN IF NOT EXISTS sku TEXT,
  ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS material TEXT,
  ADD COLUMN IF NOT EXISTS dimensions TEXT,
  ADD COLUMN IF NOT EXISTS original_price NUMERIC;

CREATE INDEX IF NOT EXISTS idx_crm_products_sku ON public.crm_products(sku);
