/*
  # Initial Schema Setup

  1. Tables
    - `users` table for storing user profiles
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `subscription_tier` (text, default: 'free')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `resumes` table for storing resumes
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users.id)
      - `title` (text)
      - `content` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `cover_letters` table for storing cover letters
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users.id)
      - `title` (text)
      - `content` (jsonb)
      - `company` (text)
      - `position` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Functions
    - `update_updated_at()` for automatically updating timestamps
    - `handle_new_user()` for creating user profiles on signup

  3. Security
    - Enable RLS on all tables
    - Add policies for user data access
*/

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  subscription_tier text NOT NULL DEFAULT 'free',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create resumes table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id),
  title text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cover_letters table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.cover_letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id),
  title text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  company text,
  position text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DO $$ 
BEGIN
  -- Users policies
  DROP POLICY IF EXISTS "Users can read own data" ON users;
  DROP POLICY IF EXISTS "Users can update own data" ON users;
  
  CREATE POLICY "Users can read own data"
    ON users
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

  CREATE POLICY "Users can update own data"
    ON users
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

  -- Resumes policies
  DROP POLICY IF EXISTS "Users can create resumes" ON resumes;
  DROP POLICY IF EXISTS "Users can read own resumes" ON resumes;
  DROP POLICY IF EXISTS "Users can update own resumes" ON resumes;
  DROP POLICY IF EXISTS "Users can delete own resumes" ON resumes;

  CREATE POLICY "Users can create resumes"
    ON resumes
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can read own resumes"
    ON resumes
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can update own resumes"
    ON resumes
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can delete own resumes"
    ON resumes
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

  -- Cover Letters policies
  DROP POLICY IF EXISTS "Users can create cover letters" ON cover_letters;
  DROP POLICY IF EXISTS "Users can read own cover letters" ON cover_letters;
  DROP POLICY IF EXISTS "Users can update own cover letters" ON cover_letters;
  DROP POLICY IF EXISTS "Users can delete own cover letters" ON cover_letters;

  CREATE POLICY "Users can create cover letters"
    ON cover_letters
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can read own cover letters"
    ON cover_letters
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can update own cover letters"
    ON cover_letters
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can delete own cover letters"
    ON cover_letters
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
END $$;

-- Create triggers for updated_at
DO $$
BEGIN
  -- Users trigger
  DROP TRIGGER IF EXISTS users_updated_at ON users;
  CREATE TRIGGER users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

  -- Resumes trigger
  DROP TRIGGER IF EXISTS resumes_updated_at ON resumes;
  CREATE TRIGGER resumes_updated_at
    BEFORE UPDATE ON resumes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

  -- Cover Letters trigger
  DROP TRIGGER IF EXISTS cover_letters_updated_at ON cover_letters;
  CREATE TRIGGER cover_letters_updated_at
    BEFORE UPDATE ON cover_letters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
END $$;

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, subscription_tier)
  VALUES (NEW.id, NEW.email, 'free')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new user creation
DO $$
BEGIN
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();
END $$;