-- This script adds only the new tables and columns needed for the updated features
-- It should run without errors even if some objects already exist

-- Add email_scan_permission to profiles table if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_scan_permission BOOLEAN DEFAULT FALSE;

-- Create detected_bills table if it doesn't exist
CREATE TABLE IF NOT EXISTS detected_bills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  title TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  category TEXT NOT NULL,
  confidence DECIMAL NOT NULL,
  source TEXT NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users NOT NULL
);

-- Create email_auth table for storing OAuth tokens
CREATE TABLE IF NOT EXISTS email_auth (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  provider TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, provider)
);

-- Add payment_id to expenses table if it doesn't exist
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS payment_id UUID REFERENCES payments(id) NULL;

-- Enable RLS on detected_bills and email_auth
ALTER TABLE detected_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_auth ENABLE ROW LEVEL SECURITY;

-- The following section attempts to create policies for the detected_bills table
-- If you get errors about policies already existing, you can safely ignore them
-- or comment out the policies that already exist

DO $$
BEGIN
  -- Create policies for detected_bills
  BEGIN
    EXECUTE 'CREATE POLICY "Users can view their own detected bills" ON detected_bills FOR SELECT USING (auth.uid() = user_id)';
  EXCEPTION
    WHEN duplicate_object THEN
      RAISE NOTICE 'Policy "Users can view their own detected bills" already exists, skipping';
  END;

  BEGIN
    EXECUTE 'CREATE POLICY "Users can create their own detected bills" ON detected_bills FOR INSERT WITH CHECK (auth.uid() = user_id)';
  EXCEPTION
    WHEN duplicate_object THEN
      RAISE NOTICE 'Policy "Users can create their own detected bills" already exists, skipping';
  END;

  BEGIN
    EXECUTE 'CREATE POLICY "Users can update their own detected bills" ON detected_bills FOR UPDATE USING (auth.uid() = user_id)';
  EXCEPTION
    WHEN duplicate_object THEN
      RAISE NOTICE 'Policy "Users can update their own detected bills" already exists, skipping';
  END;

  BEGIN
    EXECUTE 'CREATE POLICY "Users can delete their own detected bills" ON detected_bills FOR DELETE USING (auth.uid() = user_id)';
  EXCEPTION
    WHEN duplicate_object THEN
      RAISE NOTICE 'Policy "Users can delete their own detected bills" already exists, skipping';
  END;

  -- Create policies for email_auth
  BEGIN
    EXECUTE 'CREATE POLICY "Users can view their own email auth" ON email_auth FOR SELECT USING (auth.uid() = user_id)';
  EXCEPTION
    WHEN duplicate_object THEN
      RAISE NOTICE 'Policy "Users can view their own email auth" already exists, skipping';
  END;

  BEGIN
    EXECUTE 'CREATE POLICY "Users can create their own email auth" ON email_auth FOR INSERT WITH CHECK (auth.uid() = user_id)';
  EXCEPTION
    WHEN duplicate_object THEN
      RAISE NOTICE 'Policy "Users can create their own email auth" already exists, skipping';
  END;

  BEGIN
    EXECUTE 'CREATE POLICY "Users can update their own email auth" ON email_auth FOR UPDATE USING (auth.uid() = user_id)';
  EXCEPTION
    WHEN duplicate_object THEN
      RAISE NOTICE 'Policy "Users can update their own email auth" already exists, skipping';
  END;

  BEGIN
    EXECUTE 'CREATE POLICY "Users can delete their own email auth" ON email_auth FOR DELETE USING (auth.uid() = user_id)';
  EXCEPTION
    WHEN duplicate_object THEN
      RAISE NOTICE 'Policy "Users can delete their own email auth" already exists, skipping';
  END;
END
$$;
