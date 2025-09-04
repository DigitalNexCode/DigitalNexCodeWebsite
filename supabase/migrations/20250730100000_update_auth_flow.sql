/*
# [Auth Flow Update: User Profile Trigger and RLS]
This migration automates user profile creation and secures the `profiles` table with Row Level Security (RLS).

## Query Description:
This script introduces a trigger that automatically creates a corresponding profile in the `public.profiles` table whenever a new user signs up and is added to `auth.users`. It also establishes strict security policies to ensure users can only access and modify their own data, preventing unauthorized data exposure. This is a critical security and functionality enhancement.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Medium"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Creates `handle_new_user` function.
- Creates `on_auth_user_created` trigger on `auth.users`.
- Enables RLS on `public.profiles`.
- Creates `SELECT` and `UPDATE` policies for `public.profiles`.

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Yes
- Auth Requirements: Policies are based on `auth.uid()`, linking profile data to the authenticated user.

## Performance Impact:
- Triggers: Adds a new trigger on `auth.users` table INSERT. The impact is negligible as it's a simple INSERT operation.
- Estimated Impact: Low.
*/

-- 1. Function to create a profile for a new user from the auth event.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'user');
  return new;
end;
$$;

-- 2. Trigger to call the function when a new user signs up.
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Enable Row Level Security (RLS) on the profiles table.
alter table public.profiles enable row level security;

-- 4. Drop existing policies to ensure a clean slate.
drop policy if exists "Users can view their own profile." on public.profiles;
drop policy if exists "Users can update their own profile." on public.profiles;
drop policy if exists "Allow public read access" on public.profiles; -- Removing potentially insecure default

-- 5. Create policies to secure the profiles table.
-- Users can view their own profile.
create policy "Users can view their own profile."
  on public.profiles for select
  using ( auth.uid() = id );

-- Users can update their own profile.
create policy "Users can update their own profile."
  on public.profiles for update
  using ( auth.uid() = id );
