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

- [ ] **Supabase Project & Tables**
  - Create Supabase project.
  - Implement all tables from the database schema (users, pharmacies, etc.).

- [ ] **Admin Default Account**
  - Seed the database with the default admin (username: admin, password: admin123, must_change_password: true).

- [ ] **Authentication Flows**
  - Implement login, signup, and password change screens.
  - Enforce password change on first login for admin and admin-created users.

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