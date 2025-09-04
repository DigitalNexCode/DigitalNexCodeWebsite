/*
# [Operation Name]
Fix All RLS Policies for Blog and Profiles

## Query Description: [This migration script will reset and correctly configure the Row Level Security (RLS) policies for the `posts` and `profiles` tables. It ensures that the blog is publicly readable and that administrators have full control over posts. This operation is safe and will not affect existing data, but it is critical for fixing access control issues.]

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["Medium"]
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Tables affected: `public.posts`, `public.profiles`
- Policies created/updated: 
  - `Public profiles are viewable by everyone.`
  - `Users can insert their own profile.`
  - `Users can update their own profile.`
  - `Public posts are viewable by everyone.`
  - `Admin users can manage posts.`
- Functions created: `check_user_role`

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Yes
- Auth Requirements: Policies use `auth.uid()` and a helper function to check user roles from the `profiles` table.

## Performance Impact:
- Indexes: [None]
- Triggers: [None]
- Estimated Impact: [Low. RLS policy checks are efficient.]
*/

-- This helper function checks if the currently authenticated user has a specific role.
-- It securely queries the profiles table to determine the role.
CREATE OR REPLACE FUNCTION check_user_role(role_to_check TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Select the role of the currently authenticated user from their profile.
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = auth.uid();
  
  -- Return true if the user's role matches the role we're checking for.
  RETURN user_role = role_to_check;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop all existing policies on both tables to ensure a clean slate and prevent conflicts.
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;

DROP POLICY IF EXISTS "Public posts are viewable by everyone." ON public.posts;
DROP POLICY IF EXISTS "Admin users can manage posts." ON public.posts;


-- === PROFILES TABLE RLS CONFIGURATION ===

-- First, ensure RLS is enabled on the profiles table.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow public read access to all profiles.
-- This is necessary for the blog to display author names.
CREATE POLICY "Public profiles are viewable by everyone."
ON public.profiles FOR SELECT
USING (true);

-- Policy 2: Allow users to insert their own profile upon signup.
CREATE POLICY "Users can insert their own profile."
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Policy 3: Allow users to update their own profile.
CREATE POLICY "Users can update their own profile."
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);


-- === POSTS TABLE RLS CONFIGURATION ===

-- First, ensure RLS is enabled on the posts table.
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow public read access to all posts.
-- This makes the blog visible to all visitors.
CREATE POLICY "Public posts are viewable by everyone."
ON public.posts FOR SELECT
USING (true);

-- Policy 2: Allow users with the 'admin' role to perform any action (INSERT, UPDATE, DELETE).
-- This uses the helper function to securely check the user's role.
CREATE POLICY "Admin users can manage posts."
ON public.posts FOR ALL
USING (check_user_role('admin'))
WITH CHECK (check_user_role('admin'));
