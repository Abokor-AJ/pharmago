-- Quick fix for RLS issues - Run this in Supabase SQL Editor

-- Temporarily disable RLS for testing
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacies DISABLE ROW LEVEL SECURITY;

-- Insert admin user if it doesn't exist
INSERT INTO users (username, password_hash, role, must_change_password, is_active)
VALUES ('admin', 'admin123', 'admin', true, true)
ON CONFLICT (username) DO NOTHING;

-- Verify the user was created
SELECT id, username, role, is_active, must_change_password 
FROM users 
WHERE username = 'admin'; 