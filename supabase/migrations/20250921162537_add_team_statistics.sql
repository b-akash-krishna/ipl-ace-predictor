-- Add statistical columns to the 'teams' table
ALTER TABLE public.teams
ADD COLUMN matches INT,
ADD COLUMN wins INT,
ADD COLUMN win_rate DECIMAL(5, 2),
ADD COLUMN avg_score INT;