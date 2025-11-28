/*
  # Rota & Timesheets Schema

  ## 1. New Tables
    - `staff`
      - `id` (uuid, primary key)
      - `business_id` (text) - identifier for the business
      - `name` (text)
      - `role` (text)
      - `hourly_rate` (decimal)
      - `color` (text) - for visual representation
      - `preferred_hours` (integer)
      - `created_at` (timestamptz)
    
    - `shifts`
      - `id` (uuid, primary key)
      - `staff_id` (uuid, foreign key to staff)
      - `business_id` (text)
      - `role` (text)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `unpaid_break_minutes` (integer)
      - `status` (text) - draft, published, cancelled
      - `week_start` (date)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `timesheets`
      - `id` (uuid, primary key)
      - `shift_id` (uuid, foreign key to shifts)
      - `staff_id` (uuid, foreign key to staff)
      - `business_id` (text)
      - `scheduled_hours` (decimal)
      - `actual_hours` (decimal)
      - `clock_in` (timestamptz)
      - `clock_out` (timestamptz)
      - `variance_minutes` (integer)
      - `status` (text) - pending, approved, requires_review, rejected
      - `submitted_at` (timestamptz)
      - `reviewed_at` (timestamptz)
      - `created_at` (timestamptz)

  ## 2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage data
*/

-- Create staff table
CREATE TABLE IF NOT EXISTS staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id text NOT NULL,
  name text NOT NULL,
  role text NOT NULL,
  hourly_rate decimal(10,2) NOT NULL DEFAULT 0,
  color text NOT NULL DEFAULT '#4CAF50',
  preferred_hours integer DEFAULT 40,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view staff"
  ON staff FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert staff"
  ON staff FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update staff"
  ON staff FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete staff"
  ON staff FOR DELETE
  TO authenticated
  USING (true);

-- Create shifts table
CREATE TABLE IF NOT EXISTS shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id uuid REFERENCES staff(id) ON DELETE CASCADE NOT NULL,
  business_id text NOT NULL,
  role text NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  unpaid_break_minutes integer DEFAULT 0,
  status text DEFAULT 'draft',
  week_start date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view shifts"
  ON shifts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert shifts"
  ON shifts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update shifts"
  ON shifts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete shifts"
  ON shifts FOR DELETE
  TO authenticated
  USING (true);

-- Create timesheets table
CREATE TABLE IF NOT EXISTS timesheets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_id uuid REFERENCES shifts(id) ON DELETE CASCADE NOT NULL,
  staff_id uuid REFERENCES staff(id) ON DELETE CASCADE NOT NULL,
  business_id text NOT NULL,
  scheduled_hours decimal(5,2) NOT NULL,
  actual_hours decimal(5,2) NOT NULL,
  clock_in timestamptz,
  clock_out timestamptz,
  variance_minutes integer DEFAULT 0,
  status text DEFAULT 'pending',
  submitted_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE timesheets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view timesheets"
  ON timesheets FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert timesheets"
  ON timesheets FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update timesheets"
  ON timesheets FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_staff_business_id ON staff(business_id);
CREATE INDEX IF NOT EXISTS idx_shifts_business_id ON shifts(business_id);
CREATE INDEX IF NOT EXISTS idx_shifts_week_start ON shifts(week_start);
CREATE INDEX IF NOT EXISTS idx_shifts_staff_id ON shifts(staff_id);
CREATE INDEX IF NOT EXISTS idx_timesheets_business_id ON timesheets(business_id);
CREATE INDEX IF NOT EXISTS idx_timesheets_shift_id ON timesheets(shift_id);
CREATE INDEX IF NOT EXISTS idx_timesheets_status ON timesheets(status);