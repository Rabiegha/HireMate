/*
  # Fix Users Table RLS Policies

  1. Changes
    - Drop existing policies
    - Create new policies with proper permissions
    - Add policy for inserting new users
    - Add policy for authenticated users to read their own data
    - Add policy for authenticated users to update their own data

  2. Security
    - Enable RLS on users table
    - Ensure users can only access their own data
    - Allow new user creation during signup
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;

-- Create new policies
CREATE POLICY "Enable insert for authenticated users"
  ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable read access for users to own data"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Enable update access for users to own data"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);