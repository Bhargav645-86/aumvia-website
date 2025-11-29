/*
  # Staff Swap Marketplace Schema

  ## New Tables
  
  ### `marketplace_workers`
  - Complete worker profiles for job seekers
  - Stores skills, availability, location, verification status
  - Includes rating system and profile completion tracking
  
  ### `marketplace_shifts`
  - Open shifts posted by businesses for marketplace workers
  - Supports urgency flags, bundles, and skill requirements
  - Tracks applicant count and shift status
  
  ### `marketplace_applications`
  - Worker applications to open shifts
  - Tracks application status and timestamps
  
  ### `marketplace_bookings`
  - Confirmed shift assignments
  - Links workers to shifts with completion tracking
  
  ### `marketplace_ratings`
  - Two-way rating system (business rates worker, worker rates business)
  - Stores star ratings and optional feedback

  ## Security
  - RLS enabled on all tables
  - Authenticated users can view/manage their own data
  - Workers can view open shifts and apply
  - Businesses can view workers and manage their shifts
*/

-- Marketplace Workers (Job Seekers)
CREATE TABLE IF NOT EXISTS marketplace_workers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  photo_url text,
  postcode text NOT NULL,
  latitude numeric,
  longitude numeric,
  radius_miles integer DEFAULT 5,
  skills text[] DEFAULT '{}',
  availability jsonb DEFAULT '{"monday": false, "tuesday": false, "wednesday": false, "thursday": false, "friday": false, "saturday": false, "sunday": false}',
  hourly_rate_min numeric DEFAULT 0,
  hourly_rate_max numeric DEFAULT 0,
  id_verified boolean DEFAULT false,
  background_checked boolean DEFAULT false,
  right_to_work_verified boolean DEFAULT false,
  profile_completion integer DEFAULT 0,
  average_rating numeric DEFAULT 0,
  total_ratings integer DEFAULT 0,
  total_shifts_completed integer DEFAULT 0,
  total_hours_worked numeric DEFAULT 0,
  total_earnings numeric DEFAULT 0,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Marketplace Shifts (Open Opportunities)
CREATE TABLE IF NOT EXISTS marketplace_shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id text NOT NULL,
  business_name text NOT NULL,
  business_rating numeric DEFAULT 0,
  business_postcode text,
  business_latitude numeric,
  business_longitude numeric,
  role text NOT NULL,
  required_skills text[] DEFAULT '{}',
  shift_date date NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  pay_rate numeric NOT NULL,
  unpaid_break_minutes integer DEFAULT 0,
  is_emergency boolean DEFAULT false,
  is_bundle boolean DEFAULT false,
  bundle_dates date[] DEFAULT '{}',
  description text,
  status text DEFAULT 'open',
  applicant_count integer DEFAULT 0,
  filled_by uuid,
  posted_at timestamptz DEFAULT now(),
  filled_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Marketplace Applications
CREATE TABLE IF NOT EXISTS marketplace_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_id uuid NOT NULL REFERENCES marketplace_shifts(id) ON DELETE CASCADE,
  worker_id uuid NOT NULL REFERENCES marketplace_workers(id) ON DELETE CASCADE,
  status text DEFAULT 'pending',
  applied_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Marketplace Bookings (Confirmed Assignments)
CREATE TABLE IF NOT EXISTS marketplace_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_id uuid NOT NULL REFERENCES marketplace_shifts(id) ON DELETE CASCADE,
  worker_id uuid NOT NULL REFERENCES marketplace_workers(id) ON DELETE CASCADE,
  business_id text NOT NULL,
  status text DEFAULT 'confirmed',
  clock_in timestamptz,
  clock_out timestamptz,
  actual_hours numeric,
  amount_paid numeric,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Marketplace Ratings (Two-Way Trust System)
CREATE TABLE IF NOT EXISTS marketplace_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES marketplace_bookings(id) ON DELETE CASCADE,
  shift_id uuid NOT NULL REFERENCES marketplace_shifts(id) ON DELETE CASCADE,
  rater_type text NOT NULL,
  rater_id text NOT NULL,
  ratee_type text NOT NULL,
  ratee_id text NOT NULL,
  stars integer NOT NULL CHECK (stars >= 1 AND stars <= 5),
  feedback text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE marketplace_workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for marketplace_workers
CREATE POLICY "Workers can view own profile"
  ON marketplace_workers FOR SELECT
  TO authenticated
  USING (user_id = current_user);

CREATE POLICY "Workers can update own profile"
  ON marketplace_workers FOR UPDATE
  TO authenticated
  USING (user_id = current_user)
  WITH CHECK (user_id = current_user);

CREATE POLICY "Businesses can view active workers"
  ON marketplace_workers FOR SELECT
  TO authenticated
  USING (status = 'active');

-- RLS Policies for marketplace_shifts
CREATE POLICY "Businesses can manage own shifts"
  ON marketplace_shifts FOR ALL
  TO authenticated
  USING (business_id = current_user)
  WITH CHECK (business_id = current_user);

CREATE POLICY "Workers can view open shifts"
  ON marketplace_shifts FOR SELECT
  TO authenticated
  USING (status IN ('open', 'filled'));

-- RLS Policies for marketplace_applications
CREATE POLICY "Workers can manage own applications"
  ON marketplace_applications FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM marketplace_workers
    WHERE marketplace_workers.id = marketplace_applications.worker_id
    AND marketplace_workers.user_id = current_user
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM marketplace_workers
    WHERE marketplace_workers.id = marketplace_applications.worker_id
    AND marketplace_workers.user_id = current_user
  ));

CREATE POLICY "Businesses can view applications for own shifts"
  ON marketplace_applications FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM marketplace_shifts
    WHERE marketplace_shifts.id = marketplace_applications.shift_id
    AND marketplace_shifts.business_id = current_user
  ));

-- RLS Policies for marketplace_bookings
CREATE POLICY "Users can view own bookings"
  ON marketplace_bookings FOR SELECT
  TO authenticated
  USING (
    business_id = current_user OR
    EXISTS (
      SELECT 1 FROM marketplace_workers
      WHERE marketplace_workers.id = marketplace_bookings.worker_id
      AND marketplace_workers.user_id = current_user
    )
  );

CREATE POLICY "Businesses can manage bookings"
  ON marketplace_bookings FOR ALL
  TO authenticated
  USING (business_id = current_user)
  WITH CHECK (business_id = current_user);

-- RLS Policies for marketplace_ratings
CREATE POLICY "Users can view ratings"
  ON marketplace_ratings FOR SELECT
  TO authenticated
  USING (rater_id = current_user OR ratee_id = current_user);

CREATE POLICY "Users can create ratings"
  ON marketplace_ratings FOR INSERT
  TO authenticated
  WITH CHECK (rater_id = current_user);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_marketplace_workers_location ON marketplace_workers(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_marketplace_workers_skills ON marketplace_workers USING gin(skills);
CREATE INDEX IF NOT EXISTS idx_marketplace_workers_user_id ON marketplace_workers(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_shifts_business ON marketplace_shifts(business_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_shifts_status ON marketplace_shifts(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_shifts_date ON marketplace_shifts(shift_date);
CREATE INDEX IF NOT EXISTS idx_marketplace_applications_shift ON marketplace_applications(shift_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_applications_worker ON marketplace_applications(worker_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_bookings_worker ON marketplace_bookings(worker_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_bookings_business ON marketplace_bookings(business_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_ratings_booking ON marketplace_ratings(booking_id);
