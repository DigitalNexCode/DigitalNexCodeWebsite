/*
          # [Fix Blog RLS Policy]
          This migration adds a Row Level Security (RLS) policy to the `profiles` table to allow public read access. This is required for the blog pages to successfully fetch and display author names alongside their posts. Without this, queries that join `posts` and `profiles` will fail for anonymous or non-admin users.

          ## Query Description: [This operation grants read-only access to the `profiles` table for all users, including anonymous visitors. This is a safe and necessary change for a public-facing blog and does not expose any sensitive user data.]
          
          ## Metadata:
          - Schema-Category: ["Safe"]
          - Impact-Level: ["Low"]
          - Requires-Backup: [false]
          - Reversible: [true]
          
          ## Structure Details:
          - Affects Table: `public.profiles`
          - Adds Policy: "Public profiles are viewable by everyone."
          
          ## Security Implications:
          - RLS Status: [Enabled]
          - Policy Changes: [Yes]
          - Auth Requirements: [None, applies to all roles]
          
          ## Performance Impact:
          - Indexes: [No change]
          - Triggers: [No change]
          - Estimated Impact: [Negligible. Allows existing queries to execute as intended.]
          */

CREATE POLICY "Public profiles are viewable by everyone."
ON public.profiles FOR SELECT
USING (true);
