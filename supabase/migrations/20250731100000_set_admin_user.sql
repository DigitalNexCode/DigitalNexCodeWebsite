/*
# [Operation: Set Admin User]
This script assigns the 'admin' role to a specific user in the `profiles` table, granting them administrative privileges within the application.

## Query Description:
This operation updates a single row in the `profiles` table. It identifies the user based on their email address in the `auth.users` table and sets their `role` to 'admin'. This is a safe, non-destructive operation that only affects the specified user. It assumes the user has already signed up through the application's standard registration process.

## Metadata:
- Schema-Category: "Data"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true (The role can be manually changed back to 'user' or another role.)

## Structure Details:
- Table Affected: `public.profiles`
- Column Affected: `role`

## Security Implications:
- RLS Status: Enabled
- Policy Changes: No
- Auth Requirements: This grants the user permissions managed by RLS policies that check for the 'admin' role.

## Performance Impact:
- Indexes: Uses primary key index on `auth.users` and `profiles` for efficient lookup.
- Triggers: None
- Estimated Impact: Negligible performance impact.
*/

UPDATE public.profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'osetshedi1900@gmail.com'
);
