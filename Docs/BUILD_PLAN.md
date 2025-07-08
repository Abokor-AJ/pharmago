# PharmaGo App: Step-by-Step Build Plan

## 1. Project Setup

- [ ] **Initialize the Repository**
  - Create a new git repository.
  - Set up a `.gitignore` for Node, Expo, and environment files.

- [ ] **Initialize Expo Project**
  - Run `npx create-expo-app pharmago --template` (TypeScript).
  - Set up project structure as per the optimal folder structure.

- [ ] **Install Core Dependencies**
  - React Native Paper, Expo Router, Supabase JS, Zustand/Redux, etc.
  - Set up `app.json`, `.env`, and other config files.

---

## 2. Authentication & User Management

### 2.1 Supabase Project & Tables

**Tasks:**
- Create a Supabase project (if you haven’t already).
- Set up all tables from your database schema (users, pharmacies, medications, pharmacy inventory, orders, order items, delivery, audit logs).

---

### Step-by-step Instructions

#### 1. Create a Supabase Project
- Go to [https://app.supabase.com/](https://app.supabase.com/) and sign in.
- Click “New project”.
- Fill in your project name, password, and select a region.
- Wait for the project to initialize.

#### 2. Get Your Supabase Credentials
- In your Supabase project dashboard, go to “Project Settings” > “API”.
- Copy your `Project URL` and `anon` public API key.
- Add these to your `.env` file:
  ```
  SUPABASE_URL=your-project-url
  SUPABASE_ANON_KEY=your-anon-key
  ```

#### 3. Set Up Database Tables
- In the Supabase dashboard, go to the “Table Editor”.
- For each table in your schema (users, pharmacies, medications, etc.), create a new table and add the required columns and relationships.
- Use the schema from your `CONTEXT.md` as a reference for field names and types.

#### 4. (Optional) Seed the Admin Account
- Insert a default admin user (username: admin, password: admin123, must_change_password: true) into the `users` table.

#### 5. (Optional) Enable Row Level Security (RLS)
- For production, enable RLS and set up policies for each table to control access by user role.

---

**Once you’ve set up your Supabase project, credentials, and tables, let me know! I’ll guide you through connecting your Expo app to Supabase and building the authentication flows.**

---

## 3. Admin Dashboard

- [ ] **Admin Login & Password Change**
  - Build admin login screen.
  - Prompt for password change on first login.

- [ ] **Pharmacy & Delivery User Management**
  - Build screens for admin to add pharmacies and delivery users.
  - Implement forms for required fields.
  - On creation, set `must_change_password: true` for new users.

- [ ] **User List & Edit**
  - List all pharmacies and delivery users.
  - Allow admin to suspend, edit, or reset passwords.

---

## 4. Pharmacy & Delivery Onboarding

- [ ] **Pharmacy Login & First-Time Password Change**
  - Build pharmacy login screen.
  - Prompt for password change if `must_change_password` is true.

- [ ] **Delivery Login & First-Time Password Change**
  - Build delivery login screen.
  - Prompt for password change if `must_change_password` is true.

---

## 5. Customer Flows

- [ ] **Customer Signup & Login**
  - Build customer signup and login screens.
  - Implement address management.

- [ ] **Prescription Scan**
  - Integrate camera and OCR (Google ML Kit/Tesseract).
  - Extract medication names and dosages.

- [ ] **Pharmacy Matching**
  - Query pharmacies by stock and proximity.
  - Display available pharmacies as cards.

---

## 6. Pharmacy Dashboard

- [ ] **Order Management**
  - List new, preparing, and ready orders.
  - Accept/reject orders with reason.
  - Update preparation status.

- [ ] **Inventory Management**
  - Add/edit medications, update stock.
  - Show low-stock alerts.

---

## 7. Delivery Dashboard

- [ ] **Order Queue**
  - List available and assigned orders.
  - Accept/reject orders.

- [ ] **Navigation & Status**
  - Map view for navigation.
  - QR code scan at pickup and delivery.
  - Update order status.

---

## 8. Order & Price Flows

- [ ] **Order Placement**
  - Customer places order with selected pharmacy.
  - Calculate and display price (actual + 10%).

- [ ] **Order Status Tracking**
  - Real-time updates for all roles.
  - Progress bar and notifications.

- [ ] **Price Update Handling**
  - If pharmacy updates price, recalculate and notify customer.

---

## 9. UI/UX & Validation

- [ ] **Pharmacy Card UI**
  - Implement card with logo, name, address, medication list, and select button.

- [ ] **Validation & Edge Cases**
  - Out-of-stock handling.
  - Price validation before order placement.
  - Geofenced delivery completion.

---

## 10. Testing & Launch

- [ ] **Testing**
  - Unit and integration tests for all flows.
  - Usability testing for onboarding and order flows.

- [ ] **Beta & Launch**
  - Internal beta with real users.
  - App Store/Play Store submission.

---

**Work on one section at a time. Mark each as complete before moving to the next. If you need detailed steps for any section, just ask!** 