-- Create the 'teams' table
CREATE TABLE IF NOT EXISTS public.teams (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Create the 'venues' table
CREATE TABLE IF NOT EXISTS public.venues (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Optional: Set up RLS (Row-Level Security) for read-only access
-- For a public-facing predictor, we want to allow anyone to read this data.
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.teams FOR
SELECT
  USING (TRUE);

ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.venues FOR
SELECT
  USING (TRUE);