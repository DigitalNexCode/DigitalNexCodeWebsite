/*
# Create Storage Bucket and Grant Admin Role

This migration creates a new storage bucket for post images and sets the necessary RLS policies. It also grants the 'admin' role to a specific user to enable post creation.

## Query Description:
- **Create Storage Bucket:** This script creates a new storage bucket named `post-images` for storing blog post images.
- **Set RLS Policies:** It sets policies to allow public access for viewing images and restricted access for authenticated users to upload, update, and delete their own images.
- **Grant Admin Role:** The script updates the `profiles` table to grant the 'admin' role to the user with the specified ID. 

## Metadata:
- Schema-Category: "Mixed"
- Impact-Level: "Medium"
- Requires-Backup: false
- Reversible: true 

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Yes, new policies for the `post-images` bucket are created.
- Auth Requirements: The policies depend on the user being authenticated.

## Performance Impact:
- Indexes: No new indexes are created.
- Triggers: No new triggers are created.
- Estimated Impact: Low.
*/

-- 1. CREATE STORAGE BUCKET
INSERT INTO storage.buckets (id, name, public) 
VALUES ('post-images', 'post-images', true);

-- 2. SET RLS POLICIES FOR STORAGE
-- Allow public read access to all images
CREATE POLICY "Public read access for post images" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'post-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'post-images');

-- Allow users to update their own images
CREATE POLICY "Users can update their own images" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (auth.uid() = owner_id);

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own images" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (auth.uid() = owner_id);

-- 3. GRANT ADMIN ROLE TO USER
-- Replace 'YOUR_USER_ID' with the actual user ID
UPDATE public.profiles
SET role = 'admin'
WHERE id = '094674b2-a73c-433b-8255-a22a6132f849'::uuid;
