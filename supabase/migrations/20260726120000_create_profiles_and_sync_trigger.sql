/*
  # Create profiles table + auto-sync trigger from auth.users

  ## Why
  `auth.users` is in a protected schema and is awkward to browse/query directly
  from the SQL editor or from client code. This migration adds a normal
  `public.profiles` table that mirrors the useful bits (email, full name,
  phone) for every signed-up user, kept in sync automatically.

  After this migration, you can simply run:
    select * from profiles order by created_at desc;
  in the Supabase SQL editor to see exactly which users have registered,
  when, and with what contact details - no auth-schema digging required.

  ## What this does
  1. Creates `public.profiles` (id references auth.users, email, full_name, phone, created_at, updated_at)
  2. Creates a trigger function that inserts/updates a profile row whenever
     a user signs up or updates their metadata (full_name/phone come from the
     signUp() call's `options.data` in the app's AuthView)
  3. Enables RLS: a user can only read/update their own profile row
  4. Backfills profiles for any users who already exist in auth.users
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Runs as the table owner (bypasses RLS) so it can write profile rows
-- for any newly created auth user.
CREATE OR REPLACE FUNCTION public.handle_new_or_updated_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', ''),
    now()
  )
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), profiles.full_name),
        phone = COALESCE(NULLIF(EXCLUDED.phone, ''), profiles.phone),
        updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_or_updated_user();

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE OF raw_user_meta_data, email ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_or_updated_user();

-- Backfill any existing users so nobody who already signed up is missing.
INSERT INTO public.profiles (id, email, full_name, phone, created_at, updated_at)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data ->> 'full_name', ''),
  COALESCE(u.raw_user_meta_data ->> 'phone', ''),
  u.created_at,
  now()
FROM auth.users u
ON CONFLICT (id) DO NOTHING;
