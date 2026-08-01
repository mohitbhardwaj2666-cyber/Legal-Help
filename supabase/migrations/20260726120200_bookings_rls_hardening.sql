/*
  # Harden bookings RLS policies

  Ensures Row Level Security is on for `bookings` and that the only policies
  in place are: authenticated users can insert their own booking, and
  authenticated users can select only their own bookings. Safe to run even
  if these policies already exist (drop-then-create).
*/

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert own bookings" ON bookings;
CREATE POLICY "Users can insert own bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
