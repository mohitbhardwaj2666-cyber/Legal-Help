// Supabase Edge Function: booking-notify
//
// Called from the client (see BookingView.handlePaymentAndBook in src/App.tsx)
// right after a booking row is inserted. It:
//   1. Looks up the booking + the client's email (via the service role key,
//      never exposed to the browser)
//   2. Emails the owner (Mohit) that a new slot was booked
//   3. Sends the owner an SMS with the same info
//   4. Emails the client a confirmation of their own booking
//
// Nothing here throws back to the caller in a way that would undo the
// booking - the booking is already saved before this runs. Failures are
// reported in the JSON response and logged, but don't roll anything back.
//
// Required secrets (set with `supabase secrets set NAME=value`):
//   RESEND_API_KEY        - from https://resend.com (email)
//   NOTIFY_FROM_EMAIL      - a verified sender, e.g. "bookings@yourdomain.com"
//   OWNER_EMAIL            - e.g. adv.mohit.bhardwaj1@gmail.com
//
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided automatically to
// every Edge Function - you do not need to set those yourself.

import { createClient } from 'npm:@supabase/supabase-js@2';

interface BookingRow {
  id: string;
  user_id: string;
  service: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  mode: string;
  status: string;
  fee: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  RERA: 'RERA & Real Estate',
  Matrimonial: 'Matrimonial & Family',
  Consumer: 'Consumer Protection',
  Commercial: 'Commercial Dispute',
  Criminal: 'Criminal Case',
  Property: 'Property Related Dispute',
  Railway: 'Railway Claim',
  ArmedForce: 'Armed Force',
  General: 'General Advisory',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

function formatTime(time: string) {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
}

async function sendEmail(apiKey: string, from: string, to: string, subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend email failed (${res.status}): ${body}`);
  }
}

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const results: Record<string, string> = {};

  try {
    const { booking_id } = await req.json();
    if (!booking_id) {
      return new Response(JSON.stringify({ error: 'booking_id is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const admin = createClient(supabaseUrl, serviceRoleKey);

    // 1. Load the booking (service role bypasses RLS - this function is trusted).
    const { data: booking, error: bookingError } = await admin
      .from('bookings')
      .select('id, user_id, service, date, time, name, phone, mode, status, fee')
      .eq('id', booking_id)
      .single<BookingRow>();

    if (bookingError || !booking) {
      throw new Error(`Could not load booking ${booking_id}: ${bookingError?.message ?? 'not found'}`);
    }

    // 2. Look up the client's email from auth (never exposed to the browser).
    const { data: userResult, error: userError } = await admin.auth.admin.getUserById(booking.user_id);
    if (userError) console.error('Could not load client email:', userError.message);
    const clientEmail = userResult?.user?.email ?? null;

    const matterLabel = CATEGORY_LABELS[booking.service] ?? booking.service;
    const dateLabel = formatDate(booking.date);
    const timeLabel = formatTime(booking.time);
    const modeLabel = booking.mode === 'video' ? 'Video Call' : 'In-Chamber';

    const resendKey = Deno.env.get('RESEND_API_KEY');
    const fromEmail = Deno.env.get('NOTIFY_FROM_EMAIL');
    const ownerEmail = Deno.env.get('OWNER_EMAIL');
  

    // 3. Email the owner.
    if (resendKey && fromEmail && ownerEmail) {
      try {
        await sendEmail(
          resendKey,
          fromEmail,
          ownerEmail,
          `New Booking: ${booking.name} - ${dateLabel} at ${timeLabel}`,
          `<h2>New consultation booked</h2>
           <p><strong>Client:</strong> ${booking.name}</p>
           <p><strong>Phone:</strong> ${booking.phone}</p>
           <p><strong>Matter:</strong> ${matterLabel}</p>
           <p><strong>Date &amp; Time:</strong> ${dateLabel} at ${timeLabel}</p>
           <p><strong>Mode:</strong> ${modeLabel}</p>
           <p><strong>Fee Paid:</strong> ₹${booking.fee}</p>`
        );
        results.ownerEmail = 'sent';
      } catch (e) {
        console.error(e);
        results.ownerEmail = `failed: ${(e as Error).message}`;
      }
    } else {
      results.ownerEmail = 'skipped (missing RESEND_API_KEY / NOTIFY_FROM_EMAIL / OWNER_EMAIL secret)';
    }

  
    // 4. Email the client a confirmation.
    if (resendKey && fromEmail && clientEmail) {
      try {
        await sendEmail(
          resendKey,
          fromEmail,
          clientEmail,
          `Your consultation is confirmed - ${dateLabel} at ${timeLabel}`,
          `<h2>Booking Confirmed</h2>
           <p>Hi ${booking.name},</p>
           <p>Your consultation has been confirmed:</p>
           <p><strong>Matter:</strong> ${matterLabel}</p>
           <p><strong>Date &amp; Time:</strong> ${dateLabel} at ${timeLabel}</p>
           <p><strong>Mode:</strong> ${modeLabel}</p>
           <p><strong>Fee Paid:</strong> ₹${booking.fee}</p>
           <p>You can view this booking anytime in your Client Portal.</p>`
        );
        results.clientEmail = 'sent';
      } catch (e) {
        console.error(e);
        results.clientEmail = `failed: ${(e as Error).message}`;
      }
    } else {
      results.clientEmail = 'skipped (missing RESEND_API_KEY / NOTIFY_FROM_EMAIL or client has no email)';
    }

    return new Response(JSON.stringify({ ok: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('booking-notify error:', err);
    return new Response(JSON.stringify({ ok: false, error: (err as Error).message, results }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
