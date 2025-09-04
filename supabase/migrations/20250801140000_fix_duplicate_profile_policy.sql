/*
# [Fix Duplicate Profile RLS Policy]
This migration script ensures the correct Row Level Security (RLS) policy for viewing public profiles is in place. It safely handles cases where the policy might already exist by dropping it before recreating it, preventing migration errors.

## Query Description:
This operation modifies the security policy on the `public.profiles` table. It first removes any existing policy named "Public profiles are viewable by everyone." and then creates it anew. This ensures that all users (including anonymous visitors) can read profile information, which is necessary for features like displaying author names on blog posts. There is no risk to existing data.

## Metadata:
- Schema-Category: "Security"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Table: `public.profiles`
- Policy Affected: "Public profiles are viewable by everyone."

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Yes (Drops and recreates a policy for `SELECT` access)
- Auth Requirements: Allows public read access.

## Performance Impact:
- Indexes: None
- Triggers: None
- Estimated Impact: Negligible performance impact.
*/

-- Drop the policy if it already exists to prevent "already exists" errors on re-run.
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;

-- Create the policy to allow public read access to profiles.
-- This is required for the blog to show author names.
CREATE POLICY "Public profiles are viewable by everyone."
ON public.profiles FOR SELECT
USING (true);
