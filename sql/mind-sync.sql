-- Mind Sync — public.games row
-- Run in Supabase SQL Editor

-- Option A: Insert (only if Mind Sync does not exist yet)
INSERT INTO public.games (
  title,
  description,
  genre,
  url,
  status,
  accent,
  visual,
  sort_order
) VALUES (
  'Mind Sync',
  'A magical sliding-tile puzzle for kids. Slide the tiles into order and earn stars!',
  'Puzzle',
  'https://browserpuzzle.nasiravanza11.workers.dev/',
  'live',
  '#8b5cf6',
  'mind-sync-visual',
  2
);

-- Option B: Update existing row
-- UPDATE public.games
-- SET
--   description = 'A magical sliding-tile puzzle for kids. Slide the tiles into order and earn stars!',
--   genre = 'Puzzle',
--   url = 'https://browserpuzzle.nasiravanza11.workers.dev/',
--   status = 'live',
--   accent = '#8b5cf6',
--   visual = 'mind-sync-visual',
--   sort_order = 2,
--   updated_at = now()
-- WHERE title = 'Mind Sync';
