-- Create a new table to store the full ball-by-ball dataset
CREATE TABLE public.all_ipl_data (
    mid INT,
    date DATE,
    venue TEXT,
    batting_team TEXT,
    bowling_team TEXT,
    batsman TEXT,
    bowler TEXT,
    runs INT,
    wickets INT,
    overs NUMERIC,
    runs_last_5 INT,
    wickets_last_5 INT,
    striker INT,
    non-striker INT,
    total INT
);

-- Enable Row-Level Security for public read access
ALTER TABLE public.all_ipl_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.all_ipl_data FOR
SELECT
  USING (TRUE);