-- Email Scanner Database Setup for Supabase
-- Run these SQL commands in your Supabase SQL editor

-- 1. Create email_auth table to store OAuth tokens
CREATE TABLE IF NOT EXISTS email_auth (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'google',
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- 2. Create detected_bills table to store scanned bills
CREATE TABLE IF NOT EXISTS detected_bills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  category TEXT NOT NULL DEFAULT 'Other',
  confidence DECIMAL(3,2) NOT NULL DEFAULT 0,
  source TEXT NOT NULL,
  approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Add email_scan_permission column to profiles table if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS email_scan_permission BOOLEAN DEFAULT FALSE;

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_auth_user_provider ON email_auth(user_id, provider);
CREATE INDEX IF NOT EXISTS idx_detected_bills_user_id ON detected_bills(user_id);
CREATE INDEX IF NOT EXISTS idx_detected_bills_approved ON detected_bills(user_id, approved);
CREATE INDEX IF NOT EXISTS idx_profiles_email_permission ON profiles(id, email_scan_permission);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE email_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE detected_bills ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for email_auth table
CREATE POLICY "Users can view their own email auth" ON email_auth
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own email auth" ON email_auth
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own email auth" ON email_auth
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own email auth" ON email_auth
  FOR DELETE USING (auth.uid() = user_id);

-- 7. Create RLS policies for detected_bills table
CREATE POLICY "Users can view their own detected bills" ON detected_bills
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own detected bills" ON detected_bills
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own detected bills" ON detected_bills
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own detected bills" ON detected_bills
  FOR DELETE USING (auth.uid() = user_id);

-- 8. Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. Create triggers for updated_at columns
CREATE TRIGGER update_email_auth_updated_at 
  BEFORE UPDATE ON email_auth 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_detected_bills_updated_at 
  BEFORE UPDATE ON detected_bills 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
