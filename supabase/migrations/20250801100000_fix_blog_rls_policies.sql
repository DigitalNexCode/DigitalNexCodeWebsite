/*
# [Fix Blog RLS Policies]
This migration enables Row Level Security (RLS) on the `posts` table and creates policies to control access. It allows public read access for all users (anonymous and authenticated) and grants full permissions (SELECT, INSERT, UPDATE, DELETE) to users with the 'admin' role.

## Query Description: This operation is critical for the blog's functionality. It secures the `posts` table by ensuring only authorized users can modify data, while making blog posts visible to the public. There is no risk to existing data.

## Metadata:
- Schema-Category: "Security"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true (by disabling RLS or dropping policies)

## Structure Details:
- Table: `posts`
- Operations: `ALTER TABLE`, `CREATE POLICY`

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Yes, new policies for SELECT, INSERT, UPDATE, DELETE are created.
- Auth Requirements: Policies reference `auth.uid()` and a custom `get_user_role()` function.

## Performance Impact:
- Indexes: None
- Triggers: None
- Estimated Impact: Negligible. RLS adds a small overhead to queries, which is acceptable for this use case.
*/

-- Step 1: Ensure a function exists to get the user's role from their profile.
-- This function is crucial for creating role-based RLS policies.
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = auth.uid();
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Step 2: Enable Row Level Security on the 'posts' table.
-- This is a necessary step before any policies can be applied.
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;


-- Step 3: Create a policy to allow public read access to all posts.
-- This allows anyone, including logged-out users, to view blog posts.
CREATE POLICY "Allow public read access to all posts"
ON public.posts
FOR SELECT
USING (true);


-- Step 4: Create a policy to allow admins to insert new posts.
-- This restricts post creation to users with the 'admin' role.
CREATE POLICY "Allow admins to insert new posts"
ON public.posts
FOR INSERT
WITH CHECK (get_user_role() = 'admin');


-- Step 5: Create a policy to allow admins to update any post.
-- This gives full edit capabilities to administrators.
CREATE POLICY "Allow admins to update any post"
ON public.posts
FOR UPDATE
USING (get_user_role() = 'admin');


-- Step 6: Create a policy to allow admins to delete any post.
-- This gives full deletion capabilities to administrators.
CREATE POLICY "Allow admins to delete any post"
ON public.posts
FOR DELETE
USING (get_user_role() = 'admin');
