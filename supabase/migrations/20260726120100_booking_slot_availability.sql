/*
  # Slot availability: prevent double-booking + let anyone check taken times

  ## Why
  Two problems today:
  1. Nothing stops two different clients from booking the same date+time.
  2. There's no safe way for the booking page to know which slots on a given
     date are already taken, because `bookings` RLS (correctly) only lets a
     user see their own rows - so a naive SELECT would return nothing useful.

  ## What this does
  1. Adds a UNIQUE index on (date, time) for Confirmed bookings, so a second
     insert for the same slot fails at the database level (error code 23505),
     even if two people click "Pay" at almost the same moment.
  2. Adds a SECURITY DEFINER function `get_booked_times(p_date)` that returns
     ONLY the list of times already booked on that date - no names, phones,
     or any other personal data - so the booking form can grey out taken
     slots for any visitor, logged in or not.
*/

-- 1. Prevent two Confirmed bookings from sharing the same date + time.
CREATE UNIQUE INDEX IF NOT EXISTS bookings_date_time_confirmed_unique
  ON bookings (date, time)
  WHERE status = 'Confirmed';

-- 2. Safe, minimal-data lookup of taken slots for a given date.
CREATE OR REPLACE FUNCTION public.get_booked_times(p_date date)
RETURNS TABLE (time text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT b.time
  FROM bookings b
  WHERE b.date = p_date
    AND b.status = 'Confirmed';
$$;

-- Anyone (including anonymous visitors browsing before they log in) can call
-- this to see which slots are free - it never exposes booking details.
GRANT EXECUTE ON FUNCTION public.get_booked_times(date) TO anon, authenticated;
