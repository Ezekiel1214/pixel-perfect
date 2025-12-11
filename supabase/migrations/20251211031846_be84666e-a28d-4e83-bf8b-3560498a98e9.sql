-- Add content and messages columns to projects table for AI editor
ALTER TABLE public.projects 
ADD COLUMN content TEXT DEFAULT '',
ADD COLUMN messages JSONB DEFAULT '[]'::jsonb;