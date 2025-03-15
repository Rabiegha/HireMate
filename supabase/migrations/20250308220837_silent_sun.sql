/*
  # Create cover letters table

  1. New Tables
    - `cover_letters`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `title` (text)
      - `company` (text)
      - `position` (text)
      - `content` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on cover_letters table
    - Add policies for authenticated users to:
      - Create their own cover letters
      - Read their own cover letters
      - Update their own cover letters
      - Delete their own cover letters
*/

-- Create cover letters table
CREATE TABLE IF NOT EXISTS cover_letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  title text NOT NULL,
  company text,
  position text,
  content jsonb DEFAULT '{}'::jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE cover_letters ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
  -- Create policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cover_letters' 
    AND policyname = 'Users can create their own cover letters'
  ) THEN
    CREATE POLICY "Users can create their own cover letters"
      ON cover_letters
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Read policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cover_letters' 
    AND policyname = 'Users can view their own cover letters'
  ) THEN
    CREATE POLICY "Users can view their own cover letters"
      ON cover_letters
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- Update policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cover_letters' 
    AND policyname = 'Users can update their own cover letters'
  ) THEN
    CREATE POLICY "Users can update their own cover letters"
      ON cover_letters
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Delete policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cover_letters' 
    AND policyname = 'Users can delete their own cover letters'
  ) THEN
    CREATE POLICY "Users can delete their own cover letters"
      ON cover_letters
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create trigger for updated_at
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'cover_letters_updated_at'
  ) THEN
    CREATE TRIGGER cover_letters_updated_at
      BEFORE UPDATE ON cover_letters
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;