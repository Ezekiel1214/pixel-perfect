-- Create storage bucket for user uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-assets', 'project-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "Users can upload their own assets"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to view their own assets
CREATE POLICY "Users can view their own assets"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'project-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own assets
CREATE POLICY "Users can delete their own assets"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'project-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read access to all project assets (for preview)
CREATE POLICY "Public can view project assets"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'project-assets');