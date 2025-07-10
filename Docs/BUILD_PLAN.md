# PharmaGo App: Detailed Step-by-Step Build Plan

## 1. Project Setup ✅ COMPLETED

### 1.1 Repository Initialization ✅
- [x] **Create Git Repository**
  - Initialize git repository: `git init`
  - Set up `.gitignore` for Node.js, Expo, and environment files
  - Create initial commit with project structure

### 1.2 Expo Project Setup ✅
- [x] **Create Expo App**
  - Run: `npx create-expo-app pharmago --template`
  - Configure TypeScript support
  - Set up project structure with optimal folder organization

### 1.3 Dependencies Installation ✅
- [x] **Core Dependencies**
  - Install Supabase: `npm install @supabase/supabase-js`
  - Install Zustand: `npm install zustand`
  - Install Expo Router: `npm install expo-router`
  - Install environment support: `npm install react-native-dotenv dotenv`

### 1.4 Configuration Files ✅
- [x] **Environment Setup**
  - Create `.env` file with Supabase credentials
  - Configure `app.config.js` for environment variables
  - Set up `babel.config.js` for dotenv support
  - Create `env.d.ts` for TypeScript declarations

---

## 2. Authentication & User Management ✅ COMPLETED

### 2.1 Supabase Project Setup ✅

#### 2.1.1 Create Supabase Project ✅
- [x] **Project Creation**
  - Go to [https://app.supabase.com/](https://app.supabase.com/)
  - Click "New project"
  - Enter project name: "pharmago"
  - Set database password
  - Select region (closest to target users)
  - Wait for project initialization (2-3 minutes)

#### 2.1.2 Get API Credentials ✅
- [x] **Retrieve Credentials**
  - Navigate to Project Settings > API
  - Copy Project URL
  - Copy anon public key
  - Add to `.env` file:
    ```
    SUPABASE_URL=your-project-url
    SUPABASE_ANON_KEY=your-anon-key
    ```

### 2.2 Database Schema Implementation ✅

#### 2.2.1 Create Database Tables ✅
- [x] **Admins Table**
  ```sql
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
  ```

- [x] **Users Table**
  ```sql
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
    must_change_password BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  ```

- [x] **Pharmacies Table**
  ```sql
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
  ```

#### 2.2.2 Configure Row Level Security ✅
- [x] **Enable RLS**
  ```sql
  ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
  ALTER TABLE users ENABLE ROW LEVEL SECURITY;
  ALTER TABLE pharmacies ENABLE ROW LEVEL SECURITY;
  ```

- [x] **Create RLS Policies**
  ```sql
  -- Admin policies
  CREATE POLICY "Admins can read all admin data" ON admins FOR SELECT USING (true);
  CREATE POLICY "Admins can insert" ON admins FOR INSERT WITH CHECK (true);
  CREATE POLICY "Admins can update own data" ON admins FOR UPDATE USING (true);
  
  -- User policies
  CREATE POLICY "Users can read all user data" ON users FOR SELECT USING (true);
  CREATE POLICY "Users can insert" ON users FOR INSERT WITH CHECK (true);
  CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (true);
  
  -- Pharmacy policies
  CREATE POLICY "Pharmacies can be read by all" ON pharmacies FOR SELECT USING (true);
  CREATE POLICY "Pharmacies can be inserted by pharmacy users" ON pharmacies FOR INSERT WITH CHECK (true);
  CREATE POLICY "Pharmacies can be updated by pharmacy users" ON pharmacies FOR UPDATE USING (true);
  ```

#### 2.2.3 Create Indexes and Triggers ✅
- [x] **Performance Indexes**
  ```sql
  CREATE INDEX idx_admins_username ON admins(username);
  CREATE INDEX idx_admins_active ON admins(is_active);
  CREATE INDEX idx_users_phone ON users(phone);
  CREATE INDEX idx_users_role ON users(role);
  CREATE INDEX idx_users_active ON users(is_active);
  CREATE INDEX idx_pharmacies_user_id ON pharmacies(user_id);
  CREATE INDEX idx_pharmacies_active ON pharmacies(is_active);
  ```

- [x] **Auto-update Triggers**
  ```sql
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
  END;
  $$ language 'plpgsql';
  
  CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  CREATE TRIGGER update_pharmacies_updated_at BEFORE UPDATE ON pharmacies
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  ```

#### 2.2.4 Seed Initial Data ✅
- [x] **Create Test Users**
  ```sql
  -- Admin user
  INSERT INTO admins (username, password_hash, must_change_password, is_active)
  VALUES ('admin', 'superadmin123', true, true);
  
  -- Test users
  INSERT INTO users (name, phone, address, password_hash, role, must_change_password, is_active)
  VALUES 
    ('Pharmacy Test', '77824710', 'Djibouti Ville', 'pharmacy', 'pharmacy', true, true),
    ('Delivery Test', '77824087', 'Djibouti Ville', 'delivery', 'delivery', true, true),
    ('Customer Test', '77746161', 'Djibouti Ville', 'customer123', 'customer', false, true);
  ```

### 2.3 Authentication System Implementation ✅

#### 2.3.1 Supabase Client Setup ✅
- [x] **Create Supabase Service**
  - File: `services/supabase.ts`
  - Configure client with environment variables
  - Add TypeScript types for all tables
  - Handle environment variable loading

#### 2.3.2 Authentication Service ✅
- [x] **Create Auth Service**
  - File: `services/auth.ts`
  - Implement multi-table login (admin + users)
  - Add password change functionality
  - Handle role-based authentication
  - Add proper error handling and logging

#### 2.3.3 State Management ✅
- [x] **Create Auth Store**
  - File: `store/authStore.ts`
  - Implement Zustand store for auth state
  - Add login, logout, and password change actions
  - Handle loading states and error management

#### 2.3.4 UI Components ✅
- [x] **Login Screen**
  - File: `components/LoginScreen.tsx`
  - Phone number input for users
  - Username input for admins
  - Password input with secure text entry
  - Loading states and error display
  - Form validation

- [x] **Password Change Screen**
  - File: `components/ChangePasswordScreen.tsx`
  - New password and confirm password inputs
  - Password strength validation
  - Success/error feedback
  - Automatic navigation after success

#### 2.3.5 Navigation Setup ✅
- [x] **App Router Configuration**
  - File: `app/_layout.tsx`
  - Conditional routing based on auth state
  - Auth group for login/password change screens
  - Main app group for authenticated users

- [x] **Auth Flow Pages**
  - File: `app/(auth)/login.tsx`
  - File: `app/(auth)/change-password.tsx`
  - Handle role-based navigation after login
  - Redirect logic for password changes

**Available Login Credentials:**
- **Admin**: username=`admin`, password=`superadmin123`
- **Pharmacy**: phone=`77824710`, password=`pharmacy`
- **Delivery**: phone=`77824087`, password=`delivery`
- **Customer**: phone=`77746161`, password=`customer123`

---

## 3. Admin Dashboard 🔄 IN PROGRESS

### 3.1 Admin Login & Password Change ✅ COMPLETED
- [x] **Admin Login Screen** ✅
  - Username/password form
  - Error handling and validation
  - Loading states

- [x] **Password Change Flow** ✅
  - First-time password change prompt
  - Password strength validation
  - Success feedback and navigation

### 3.2 Admin Dashboard Home Screen 🔄 NEXT STEP

#### 3.2.1 Dashboard Layout
- [ ] **Create Dashboard Structure**
  - File: `app/(tabs)/admin.tsx`
  - Header with admin info and logout
  - Statistics cards (total users, pharmacies, orders)
  - Quick action buttons
  - Recent activity section

#### 3.2.2 Dashboard Components
- [ ] **Statistics Cards**
  - Total pharmacies count
  - Total delivery users count
  - Total customers count
  - Pending orders count
  - Real-time data from Supabase

- [ ] **Quick Actions**
  - "Add New Pharmacy" button
  - "Add New Delivery User" button
  - "View All Users" button
  - "View Reports" button

- [ ] **Recent Activity Feed**
  - Latest user registrations
  - Recent orders
  - System notifications
  - Activity timestamps

#### 3.2.3 Dashboard Navigation
- [ ] **Tab Navigation**
  - Dashboard (home)
  - User Management
  - Reports
  - Settings

### 3.3 Pharmacy & Delivery User Management 🔄 READY TO START

#### 3.3.1 User Management Screen
- [ ] **Create User List Screen**
  - File: `app/(tabs)/admin/users.tsx`
  - Filterable list of all users
  - Search by name, phone, or role
  - Status indicators (active/inactive)
  - Pagination for large lists

#### 3.3.2 Add User Forms
- [ ] **Add Pharmacy User**
  - File: `components/admin/AddPharmacyForm.tsx`
  - Form fields: name, phone, email, address, coordinates
  - Pharmacy-specific fields: business name, license number
  - Validation for required fields
  - Success/error feedback

- [ ] **Add Delivery User**
  - File: `components/admin/AddDeliveryForm.tsx`
  - Form fields: name, phone, email, address, coordinates
  - Delivery-specific fields: vehicle info, availability
  - Validation for required fields
  - Success/error feedback

#### 3.3.3 User Management Actions
- [ ] **Edit User**
  - Modal or separate screen for editing
  - Update user information
  - Change user status (active/inactive)
  - Reset password functionality

- [ ] **Delete/Suspend User**
  - Confirmation dialogs
  - Soft delete (mark as inactive)
  - Cascade updates to related data

### 3.4 User List & Edit 🔄 READY TO START

#### 3.4.1 User List Implementation
- [ ] **User List Component**
  - File: `components/admin/UserList.tsx`
  - Sortable columns (name, role, status, created date)
  - Filter by role (pharmacy, delivery, customer)
  - Bulk actions (activate/deactivate multiple users)
  - Export functionality

#### 3.4.2 User Details Modal
- [ ] **User Details Component**
  - File: `components/admin/UserDetails.tsx`
  - Display user information
  - Edit user details inline
  - View user activity history
  - Manage user permissions

#### 3.4.3 User Actions
- [ ] **Password Reset**
  - Generate temporary password
  - Send reset notification
  - Force password change on next login

- [ ] **Status Management**
  - Activate/deactivate users
  - Bulk status updates
  - Status change notifications

---

## 4. Pharmacy & Delivery Onboarding 🔄 READY TO START

### 4.1 Pharmacy Login & First-Time Password Change ✅ COMPLETED
- [x] **Pharmacy Login** ✅
  - Phone number authentication
  - Password validation
  - Role-based routing

- [x] **Password Change Flow** ✅
  - First-time password change
  - Password strength requirements
  - Success navigation

### 4.2 Pharmacy Dashboard 🔄 READY TO START

#### 4.2.1 Pharmacy Dashboard Layout
- [ ] **Create Pharmacy Dashboard**
  - File: `app/(tabs)/pharmacy.tsx`
  - Header with pharmacy info
  - Order management section
  - Inventory overview
  - Quick stats

#### 4.2.2 Order Management
- [ ] **Order List Component**
  - File: `components/pharmacy/OrderList.tsx`
  - Filter by status (new, preparing, ready, delivered)
  - Order details (customer, items, total)
  - Accept/reject order actions
  - Update order status

#### 4.2.3 Inventory Management
- [ ] **Inventory List**
  - File: `components/pharmacy/InventoryList.tsx`
  - List all medications in stock
  - Stock level indicators
  - Add/edit medication forms
  - Low stock alerts

#### 4.2.4 Pharmacy Profile
- [ ] **Profile Management**
  - File: `components/pharmacy/PharmacyProfile.tsx`
  - Edit pharmacy information
  - Update business hours
  - Manage pharmacy location
  - Upload pharmacy logo

### 4.3 Delivery Dashboard 🔄 READY TO START

#### 4.3.1 Delivery Dashboard Layout
- [ ] **Create Delivery Dashboard**
  - File: `app/(tabs)/delivery.tsx`
  - Header with delivery user info
  - Available orders queue
  - Current delivery status
  - Earnings summary

#### 4.3.2 Order Queue Management
- [ ] **Order Queue Component**
  - File: `components/delivery/OrderQueue.tsx`
  - List available orders
  - Order details and pickup location
  - Accept/reject order actions
  - Route optimization

#### 4.3.3 Delivery Tracking
- [ ] **Delivery Tracking**
  - File: `components/delivery/DeliveryTracking.tsx`
  - Real-time location tracking
  - Order status updates
  - Customer notifications
  - Delivery confirmation

#### 4.3.4 Delivery Profile
- [ ] **Profile Management**
  - File: `components/delivery/DeliveryProfile.tsx`
  - Update personal information
  - Set availability status
  - View earnings history
  - Manage delivery zones

---

## 5. Customer Flows 🔄 READY TO START

### 5.1 Customer Signup & Login ✅ COMPLETED
- [x] **Customer Authentication** ✅
  - Phone number registration
  - Address management
  - Password setup

### 5.2 Customer Dashboard 🔄 READY TO START

#### 5.2.1 Customer Dashboard Layout
- [ ] **Create Customer Dashboard**
  - File: `app/(tabs)/customer.tsx`
  - Header with customer info
  - Order history
  - Prescription upload
  - Pharmacy search

#### 5.2.2 Order History
- [ ] **Order History Component**
  - File: `components/customer/OrderHistory.tsx`
  - List all past orders
  - Order status tracking
  - Reorder functionality
  - Order details view

#### 5.2.3 Profile Management
- [ ] **Customer Profile**
  - File: `components/customer/CustomerProfile.tsx`
  - Edit personal information
  - Manage delivery addresses
  - View saved payment methods
  - Notification preferences

### 5.3 Prescription Scan 🔄 READY TO START

#### 5.3.1 Camera Integration
- [ ] **Camera Setup**
  - File: `components/customer/PrescriptionScanner.tsx`
  - Install expo-camera
  - Camera permissions handling
  - Photo capture functionality
  - Image preview and retake

#### 5.3.2 OCR Implementation
- [ ] **Text Recognition**
  - File: `services/ocr.ts`
  - Integrate Google ML Kit or Tesseract
  - Extract medication names
  - Extract dosages and instructions
  - Validate extracted data

#### 5.3.3 Prescription Processing
- [ ] **Data Processing**
  - File: `components/customer/PrescriptionProcessor.tsx`
  - Display extracted medications
  - Allow manual corrections
  - Confirm prescription details
  - Save to customer profile

### 5.4 Pharmacy Matching 🔄 READY TO START

#### 5.4.1 Pharmacy Search
- [ ] **Search Component**
  - File: `components/customer/PharmacySearch.tsx`
  - Location-based search
  - Filter by medication availability
  - Sort by distance, rating, price
  - Search history

#### 5.4.2 Pharmacy Cards
- [ ] **Pharmacy Card Component**
  - File: `components/customer/PharmacyCard.tsx`
  - Pharmacy logo and name
  - Address and distance
  - Available medications list
  - Price estimates
  - Select pharmacy button

#### 5.4.3 Location Services
- [ ] **Location Integration**
  - File: `services/location.ts`
  - Get user's current location
  - Calculate distances to pharmacies
  - Geofencing for delivery areas
  - Location permissions handling

---

## 6. Pharmacy Dashboard 🔄 READY TO START

### 6.1 Order Management 🔄 READY TO START

#### 6.1.1 Order Processing
- [ ] **Order Queue**
  - File: `components/pharmacy/OrderQueue.tsx`
  - Real-time order notifications
  - Order status updates
  - Customer communication
  - Order timeline tracking

#### 6.1.2 Order Actions
- [ ] **Order Actions**
  - Accept/reject orders with reasons
  - Update preparation status
  - Notify customers of changes
  - Handle order modifications

#### 6.1.3 Order Details
- [ ] **Order Details View**
  - File: `components/pharmacy/OrderDetails.tsx`
  - Customer information
  - Medication list and quantities
  - Pricing breakdown
  - Delivery instructions

### 6.2 Inventory Management 🔄 READY TO START

#### 6.2.1 Inventory Overview
- [ ] **Inventory Dashboard**
  - File: `components/pharmacy/InventoryDashboard.tsx`
  - Stock level overview
  - Low stock alerts
  - Expiry date tracking
  - Inventory value calculation

#### 6.2.2 Medication Management
- [ ] **Add/Edit Medications**
  - File: `components/pharmacy/MedicationForm.tsx`
  - Medication name and description
  - Dosage forms and strengths
  - Pricing information
  - Stock quantity management

#### 6.2.3 Stock Management
- [ ] **Stock Operations**
  - File: `components/pharmacy/StockManagement.tsx`
  - Add new stock
  - Update quantities
  - Track expiry dates
  - Generate stock reports

---

## 7. Delivery Dashboard 🔄 READY TO START

### 7.1 Order Queue 🔄 READY TO START

#### 7.1.1 Available Orders
- [ ] **Order Queue Component**
  - File: `components/delivery/OrderQueue.tsx`
  - List available orders
  - Order details and locations
  - Distance and time estimates
  - Accept/reject functionality

#### 7.1.2 Order Assignment
- [ ] **Order Assignment**
  - Accept order assignments
  - Route optimization
  - Pickup confirmation
  - Delivery confirmation

### 7.2 Navigation & Status 🔄 READY TO START

#### 7.2.1 Map Integration
- [ ] **Map Component**
  - File: `components/delivery/DeliveryMap.tsx`
  - Real-time location tracking
  - Route visualization
  - Pickup and delivery markers
  - Turn-by-turn navigation

#### 7.2.2 QR Code Scanning
- [ ] **QR Code Scanner**
  - File: `components/delivery/QRScanner.tsx`
  - Scan QR codes at pickup
  - Scan QR codes at delivery
  - Verify order completion
  - Generate delivery receipts

#### 7.2.3 Status Updates
- [ ] **Status Management**
  - File: `components/delivery/StatusUpdates.tsx`
  - Update delivery status
  - Notify customers
  - Record delivery time
  - Handle delivery issues

---

## 8. Order & Price Flows 🔄 READY TO START

### 8.1 Order Placement 🔄 READY TO START

#### 8.1.1 Order Creation
- [ ] **Order Form**
  - File: `components/customer/OrderForm.tsx`
  - Select medications and quantities
  - Choose delivery address
  - Select delivery time
  - Review order details

#### 8.1.2 Price Calculation
- [ ] **Pricing Engine**
  - File: `services/pricing.ts`
  - Base medication prices
  - 10% markup calculation
  - Delivery fee calculation
  - Tax calculations

#### 8.1.3 Order Confirmation
- [ ] **Order Confirmation**
  - File: `components/customer/OrderConfirmation.tsx`
  - Display final price
  - Payment method selection
  - Order summary
  - Confirmation email/SMS

### 8.2 Order Status Tracking 🔄 READY TO START

#### 8.2.1 Real-time Updates
- [ ] **Status Tracking**
  - File: `components/shared/OrderTracker.tsx`
  - Real-time status updates
  - Progress bar visualization
  - Status change notifications
  - Estimated delivery time

#### 8.2.2 Notifications
- [ ] **Notification System**
  - File: `services/notifications.ts`
  - Push notifications
  - SMS notifications
  - Email notifications
  - In-app notifications

### 8.3 Price Update Handling 🔄 READY TO START

#### 8.3.1 Price Changes
- [ ] **Price Update Flow**
  - File: `components/pharmacy/PriceUpdate.tsx`
  - Update medication prices
  - Notify customers of changes
  - Recalculate order totals
  - Handle price disputes

---

## 9. UI/UX & Validation 🔄 READY TO START

### 9.1 Pharmacy Card UI 🔄 READY TO START

#### 9.1.1 Card Design
- [ ] **Pharmacy Card Component**
  - File: `components/shared/PharmacyCard.tsx`
  - Modern card design
  - Pharmacy logo display
  - Rating and reviews
  - Distance and delivery time
  - Price range indicators

#### 9.1.2 Card Interactions
- [ ] **Card Actions**
  - Tap to view details
  - Quick order placement
  - Save to favorites
  - Share pharmacy info

### 9.2 Validation & Edge Cases 🔄 READY TO START

#### 9.2.1 Form Validation
- [ ] **Validation System**
  - File: `utils/validation.ts`
  - Phone number validation
  - Email validation
  - Address validation
  - Password strength validation

#### 9.2.2 Error Handling
- [ ] **Error Management**
  - File: `utils/errorHandling.ts`
  - Network error handling
  - Validation error display
  - User-friendly error messages
  - Retry mechanisms

#### 9.2.3 Edge Cases
- [ ] **Edge Case Handling**
  - Out-of-stock scenarios
  - Delivery area restrictions
  - Payment failures
  - Order cancellations

---

## 10. Testing & Launch 🔄 READY TO START

### 10.1 Testing 🔄 READY TO START

#### 10.1.1 Unit Testing
- [ ] **Test Setup**
  - File: `__tests__/setup.ts`
  - Jest configuration
  - React Native Testing Library
  - Mock Supabase client
  - Test utilities

#### 10.1.2 Component Testing
- [ ] **Component Tests**
  - File: `__tests__/components/`
  - Login screen tests
  - Form validation tests
  - Navigation tests
  - Error handling tests

#### 10.1.3 Integration Testing
- [ ] **Integration Tests**
  - File: `__tests__/integration/`
  - Authentication flow tests
  - Order placement tests
  - Payment flow tests
  - API integration tests

### 10.2 Beta & Launch 🔄 READY TO START

#### 10.2.1 Beta Testing
- [ ] **Beta Program**
  - Internal testing with team
  - User acceptance testing
  - Performance testing
  - Security testing

#### 10.2.2 App Store Preparation
- [ ] **Store Preparation**
  - App store screenshots
  - App descriptions
  - Privacy policy
  - Terms of service

#### 10.2.3 Launch
- [ ] **Launch Process**
  - App store submission
  - Play store submission
  - Marketing materials
  - User onboarding

---

## 📊 **PROJECT STATUS SUMMARY**

### ✅ **COMPLETED (2/10 Sections)**
- **Section 1: Project Setup** - 100% Complete
- **Section 2: Authentication & User Management** - 100% Complete

### 🔄 **IN PROGRESS (1/10 Sections)**
- **Section 3: Admin Dashboard** - 25% Complete (login done, dashboard UI needed)

### 🔄 **READY TO START (7/10 Sections)**
- Sections 4-10: All foundation work complete, ready to build features

### 🎯 **NEXT PRIORITY: Section 3 - Admin Dashboard**
Focus on building the admin dashboard UI and user management features.

---

**Work on one section at a time. Mark each as complete before moving to the next. If you need detailed steps for any section, just ask!** 