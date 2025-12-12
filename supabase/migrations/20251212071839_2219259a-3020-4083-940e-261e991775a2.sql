-- Add publishing fields to projects table
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects (slug) WHERE slug IS NOT NULL;

-- Create index on public projects
CREATE INDEX IF NOT EXISTS idx_projects_public ON public.projects (is_public) WHERE is_public = true;

-- Allow public read access to published projects
CREATE POLICY "Anyone can view public projects"
ON public.projects
FOR SELECT
TO public
USING (is_public = true);