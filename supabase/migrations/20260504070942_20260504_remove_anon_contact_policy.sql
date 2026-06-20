/*
  # Remove anonymous insert policy from contact_messages

  ## Summary
  Removes the anonymous INSERT policy to restrict contact message submissions to authenticated users only.
  This addresses security advisor lint 0012_auth_allow_anonymous_sign_ins by eliminating anonymous access.

  ## Changes
  - Drop "Anonymous users can insert contact messages" policy
  - Only authenticated users can now submit contact messages
  - This improves security by requiring user accountability for submissions
*/

DROP POLICY IF EXISTS "Anonymous users can insert contact messages" ON contact_messages;
