/*
  # Allow anonymous users to insert contact messages

  1. Security Changes
    - Add INSERT policy on `contact_messages` table for anon role
    - The policy allows unauthenticated users to submit contact messages
    - user_id is nullable, so anon submissions are stored with user_id = NULL
    - SELECT remains restricted to authenticated users reading their own messages
*/

CREATE POLICY "Anonymous users can insert contact messages"
  ON contact_messages
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);
