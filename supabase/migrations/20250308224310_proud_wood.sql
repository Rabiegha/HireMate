/*
  # Add Profile Pictures Table

  1. New Tables
    - `profile_pictures`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `url` (text, not null)
      - `is_current` (boolean, default false)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `profile_pictures` table
    - Add policies for authenticated users to manage their pictures
*/

CREATE TABLE IF NOT EXISTS public.profile_pictures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  url text NOT NULL,
  is_current boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profile_pictures ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile pictures"
  ON public.profile_pictures
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create profile pictures"
  ON public.profile_pictures
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile pictures"
  ON public.profile_pictures
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile pictures"
  ON public.profile_pictures
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER profile_pictures_updated_at
  BEFORE UPDATE ON public.profile_pictures
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();