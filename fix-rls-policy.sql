-- Fix RLS policy for messages table
BEGIN;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Public can insert messages" ON messages;

-- Create new policy with explicit public access
CREATE POLICY "Public can insert messages"
  ON messages
  FOR INSERT
  TO public
  WITH CHECK (true);

COMMIT;

-- Verify the policy
SELECT * FROM pg_policies WHERE tablename = 'messages';