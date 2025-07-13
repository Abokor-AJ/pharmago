-- PharmaGo New Database Schema
-- Run this in your Supabase SQL Editor

-- 1. Drop existing tables if they exist (be careful with this in production!)
DROP TABLE IF EXISTS pharmacies CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. Create admins table (separate from users)
CREATE TABLE admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255),
  password_hash VARCHAR(255) NOT NULL,
  must_change_password BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create users table (only for customers, pharmacy, delivery)
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255),
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('pharmacy', 'delivery', 'customer')),
  must_change_password BOOLEAN DEFAULT false, -- Default false, will be set based on role
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create pharmacies table
CREATE TABLE pharmacies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(50) NOT NULL,
  logo_url TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacies ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for admins table
CREATE POLICY "Admins can read all admin data" ON admins
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert" ON admins
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update own data" ON admins
  FOR UPDATE USING (true);

-- 7. Create RLS policies for users table
CREATE POLICY "Users can read all user data" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (true);

-- 8. Create RLS policies for pharmacies table
CREATE POLICY "Pharmacies can be read by all" ON pharmacies
  FOR SELECT USING (true);

CREATE POLICY "Pharmacies can be inserted by pharmacy users" ON pharmacies
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Pharmacies can be updated by pharmacy users" ON pharmacies
  FOR UPDATE USING (true);

-- 9. Insert default admin user
INSERT INTO admins (username, password_hash, must_change_password, is_active)
VALUES ('admin', 'admin123', true, true)
ON CONFLICT (username) DO NOTHING;

-- 10. Insert sample users for testing
-- Pharmacy user (must change password)
INSERT INTO users (name, phone, address, password_hash, role, must_change_password, is_active)
VALUES ('pharmacy1', '77824710', 'djibouti ville', 'pharmacy123', 'pharmacy', true, true)
ON CONFLICT (phone) DO NOTHING;

-- Delivery user (must change password)
INSERT INTO users (name, phone, address, password_hash, role, must_change_password, is_active)
VALUES ('delivery1', '77824087', 'djibouti ville', 'delivery123', 'delivery', true, true)
ON CONFLICT (phone) DO NOTHING;

-- Customer user (no password change required)
INSERT INTO users (name, phone, address, password_hash, role, must_change_password, is_active)
VALUES ('abokor', '77746161', 'djibouti ville', 'customer123', 'customer', false, true)
ON CONFLICT (phone) DO NOTHING;

-- 11. Create indexes for better performance
CREATE INDEX idx_admins_username ON admins(username);
CREATE INDEX idx_admins_active ON admins(is_active);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_pharmacies_user_id ON pharmacies(user_id);
CREATE INDEX idx_pharmacies_active ON pharmacies(is_active);

-- 12. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 13. Create triggers to automatically update updated_at
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pharmacies_updated_at BEFORE UPDATE ON pharmacies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 14. Verify the setup
SELECT 'Admins:' as table_name, count(*) as count FROM admins
UNION ALL
SELECT 'Users:' as table_name, count(*) as count FROM users
UNION ALL
SELECT 'Pharmacies:' as table_name, count(*) as count FROM pharmacies;

-- 15. Create prescription_scans table
CREATE TABLE prescription_scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES users(id),
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  scan_type VARCHAR(50) NOT NULL, -- e.g., 'prescription', 'other'
  scan_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. Index for fast lookup by customer
CREATE INDEX idx_prescription_scans_customer_id ON prescription_scans(customer_id);