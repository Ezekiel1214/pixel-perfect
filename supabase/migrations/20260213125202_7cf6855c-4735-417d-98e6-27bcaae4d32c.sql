-- Remove the overly permissive public read policy on project-assets bucket
DROP POLICY IF EXISTS "Public can view project assets" ON storage.objects;