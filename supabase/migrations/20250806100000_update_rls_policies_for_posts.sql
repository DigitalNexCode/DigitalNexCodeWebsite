/*
# Update RLS Policies for Posts
This migration updates the Row Level Security (RLS) policies for the `posts` table to use a dedicated helper function, `is_admin()`. This improves security, reliability, and maintainability.

## Query Description:
This script first creates or replaces the `is_admin()` function, which securely checks if the currently authenticated user has the 'admin' role. It then drops the old, verbose RLS policies on the `posts` table and recreates them using the new `is_admin()` function. This change only affects the security policies and does not alter any user data.

## Metadata:
- Schema-Category: "Security"
- Impact-Level: "Medium" (as it alters security policies)
- Requires-Backup: false (as it is easily reversible)
- Reversible: true (by dropping the new policies/function and recreating the old ones)

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Yes, policies for the `posts` table are replaced.
- Auth Requirements: The new policies depend on the `is_admin()` function which checks the `role` in the `profiles` table.

## Performance Impact:
- Indexes: No new indexes are created.
- Triggers: No new triggers are created.
- Estimated Impact: Low. The function call within the RLS policy is highly efficient.
*/

-- 1. CREATE HELPER FUNCTION
-- Creates a reusable function to check if the current user is an admin.
-- This function is defined with `SECURITY DEFINER` to have the necessary permissions to read the `profiles` table.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. UPDATE POSTS RLS POLICIES
-- Drops the old policies and creates new ones that use the is_admin() function.
-- This makes the policies cleaner and less prone to error.

DROP POLICY IF EXISTS "Admin users can insert posts." ON public.posts;
CREATE POLICY "Admin users can insert posts." ON public.posts
  FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin users can update posts." ON public.posts;
CREATE POLICY "Admin users can update posts." ON public.posts
  FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admin users can delete posts." ON public.posts;
CREATE POLICY "Admin users can delete posts." ON public.posts
  FOR DELETE
  USING (public.is_admin());
