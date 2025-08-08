-- Improve opportunities performance and data freshness
-- 1) Indexes for common filters and joins
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON public.opportunities (status);
CREATE INDEX IF NOT EXISTS idx_opportunities_stage ON public.opportunities (stage);
CREATE INDEX IF NOT EXISTS idx_opportunities_customer_id ON public.opportunities (customer_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_expected_close_date ON public.opportunities (expected_close_date);

-- 2) Ensure updated_at is maintained automatically
DROP TRIGGER IF EXISTS trg_opportunities_updated_at ON public.opportunities;
CREATE TRIGGER trg_opportunities_updated_at
BEFORE UPDATE ON public.opportunities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 3) Optional: add publication to realtime if not already included (harmless if exists)
-- Note: Supabase manages this automatically, but these guards ensure inclusion
DO $$
BEGIN
  -- Add table to publication if not present
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'opportunities'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.opportunities';
  END IF;
END $$;