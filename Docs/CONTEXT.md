# PharmaGo - Pharmacy Delivery App

**Version:** 1.0  
**Date:** 2025-07-05  
**Author:** [Abokor Djama & Chouaib Djama / Baytech.com]

---

## 1. Introduction

**Vision:**  
Create a seamless React Native Mobile app connecting customers, pharmacies, and delivery personnel for prescription medication ordering and delivery.

**Goals:**
- Enable prescription scanning for automated pharmacy matching.
- Streamline order management for all user roles.
- Provide real-time tracking and admin oversight.

**Target Audience:**  
Patients, pharmacies, delivery personnel, and system administrators.

---

## 2. User Roles & Profiles

| Role         | Key Responsibilities                                 | Access Scope                    |
|--------------|------------------------------------------------------|---------------------------------|
| **Admin**    | Monitor system, manage users, resolve issues         | Full access                     |
| **Customer** | Order meds, scan prescriptions, track deliveries     | Own orders/prescriptions only   |
| **Pharmacy** | Manage inventory, accept/reject orders, prepare meds | Own inventory/orders only       |
| **Delivery** | Accept orders, update delivery status, navigate      | Assigned orders only            |

---

## 3. App User Flow Instructions

### 3.1 Welcome Screen
- Display app logo and name.
- Show a brief tagline (e.g., "Order your prescriptions, delivered fast").
- Present two main buttons: **Sign Up** and **Log In**.
- Add language selection if supporting multiple languages.

### 3.2 Signup Screen
- For the customer role display its tailored signup form:
  - **Customer:** Name, phone, address, password.
- Include terms and privacy policy agreement checkbox.
- Show a "Create Account" button.
- After successful signup, auto-login.

### 3.3 Login Screen
- Provide fields for phone and password.
- Include "Forgot Password?" link.
- Show a "Log In" button.
- Option to switch roles if needed.
- On successful login, redirect user to their main dashboard based on role.

### 3.4 Main Dashboards (Role-Based)

#### A. Customer Dashboard
- Show a welcome message and user profile summary.
- Display a prominent button to **Scan Prescription**.
- List recent orders with status (e.g., Ordered, Preparing, Out for Delivery).
- Provide access to order history, address management, and payment methods.
- Include a help/support section.

#### B. Pharmacy Dashboard
- Show a summary of new, preparing, and ready orders.
- Display inventory status and low-stock alerts.
- Provide tabs or sections for:
  - **Order Management:** Accept/reject orders, update preparation status.
  - **Inventory Management:** Add/edit medications, update stock.
- Show notifications for new orders and low inventory.
- Include access to pharmacy profile and settings.

#### C. Delivery Dashboard
- Show available orders for pickup, with location, name and phone of the customer.
- Display accepted/assigned orders with status (e.g., Picked Up, Delivered).
- Provide navigation tools (map view, route guidance).
- Include buttons for scanning QR codes at pickup and delivery.
- Show daily earnings summary and delivery history.

#### D. Admin Dashboard
- Display system metrics: active orders, user growth, delivery times.
- Show alerts for delayed orders or system issues.
- Provide user management tools: approve/suspend users, view audit logs.
- Include analytics panels (charts, graphs) for orders and user roles.
- View order flow from customer, pharmacy to delivery.
- Access to system settings and support tools.

### 3.5 General Navigation
- Use a bottom tab bar or side menu for main navigation.
- Ensure role-specific tabs (e.g., Orders, Inventory, Profile for Pharmacy).
- Provide a logout option in the profile or settings menu.

### 3.6 Admin Signup and User Management Flows

#### Admin Login
- On first launch, the admin logs in using the default credentials:
  - **Username:** admin
  - **Password:** admin123
- After the first successful login, the admin is immediately prompted to change the password for security.
- The new password is saved and required for all future logins.

#### Pharmacy Signup by Admin
- Admin navigates to the "Pharmacies" section in the dashboard.
- Clicks "Add Pharmacy" or similar action button.
- Fills out the pharmacy signup form with the following fields:
  - Pharmacy name
  - Address
  - License info (optional)
  - Contact phone
  - Email (optional)
  - Logo (optional)
  - Initial password (auto-generated or set by admin)
- Admin submits the form to create the pharmacy account.
- The pharmacy receives login credentials (via email or admin communication).
- Pharmacy can log in and is prompted to update their password on first login.

#### Delivery Signup by Admin
- Admin navigates to the "Delivery Personnel" section in the dashboard.
- Clicks "Add Delivery" or similar action button.
- Fills out the delivery signup form with the following fields:
  - Name
  - Phone
  - Vehicle info (optional)
  - Email (optional)
  - Initial password (auto-generated or set by admin)
- Admin submits the form to create the delivery account.
- The delivery personnel receives login credentials (via email or admin communication).
- Delivery user can log in and is prompted to update their password on first login.

---

## 4. Functional Requirements

### 4.1 Customer Features
- Prescription scanning with device camera and OCR.
- Automated pharmacy matching (stock/proximity prioritized).
- Place/cancel orders, real-time order tracking (map view).
- Manage address and order history.

### 4.2 Pharmacy Features
- Order dashboard to accept/reject orders (with reason).
- Update preparation status.
- Inventory management: add/update stock, low-stock alerts.

### 4.3 Delivery Features
- View/accept/reject available orders.
- In-app navigation and QR code scanning at pickup/delivery.
- Status updates and earnings summary.

### 4.4 Admin Features
- Real-time metrics dashboard.
- View order flow from customer, pharmacy to delivery.
- System health monitoring.
- User management and audit logs.

---

## 5. Non-Functional Requirements
- **Performance:** Prescription scan <3 seconds, order status updates <2 seconds.
- **Security:** HIPAA-compliant encryption, role-based access control.
- **Reliability:** 99.9% uptime, offline support for delivery status.

---

## 6. Technical Specifications
- **UI Framework:** React Native Paper.
- **Frontend:** React Native with TypeScript, Expo, and Expo Router.
- **Backend/Database:** Real-time sync for pharmacy inventory and orders and Supabase.
- **APIs/Integrations:** Google ML Kit/Tesseract (OCR), MapKit, Firebase Cloud Messaging.

---

## 7. Design Guidelines
- Sleek, minimal interface (SF Pro fonts, neutral palette).
- Contextual icons for role-specific workflows.
- Card-based UI for pharmacy and order displays.
- Role-specific color coding: Customer (Blue), Pharmacy (Green), Delivery (Orange), Admin (Purple).
- Consistent card radius (12pt), icon set (SF Symbols), and button hierarchy.

---

## 8. Key Process Rules & Validation
- OCR confidence >85% for auto-match; fallback to manual selection.
- Pharmacy ranking: weighted by stock, proximity and rating.
- Customer can cancel only if status = "Pending Pharmacy".
- Pharmacy rejection requires reason (logged).
- Delivery pickup requires QR scan.
- Notifications are role-specific (sound, banner, vibration, etc.).
- Address and stock are verified in real-time before order confirmation.
- Delivery completion requires geofenced location (±50m radius).

---

## 9. Database Schema

### Users Table
- id (UUID, PK)
- name (string)
- phone (string, unique)
- email (string, unique, optional)
- password_hash (string)
- must_change_password (boolean, default false)  # True if user must change password on next login
- address (string, optional)
- role (enum: customer, pharmacy, delivery, admin)
- avatar_url (string, optional)
- created_by_admin (boolean, default false)  # True if account was created by admin
- created_at (timestamp)
- updated_at (timestamp)

### Pharmacies Table
- id (UUID, PK)
- user_id (UUID, FK to users)
- pharmacy_name (string)
- address (string)
- license_info (string, optional)
- contact_phone (string)
- logo_url (string, optional)
- rating (float, default 0)
- latitude (float, optional)
- longitude (float, optional)
- created_at (timestamp)
- updated_at (timestamp)

### Medications Table
- id (UUID, PK)
- name (string)
- dosage (string)
- description (string, optional)
- created_at (timestamp)
- updated_at (timestamp)

### PharmacyInventory Table
- id (UUID, PK)
- pharmacy_id (UUID, FK to pharmacies)
- medication_id (UUID, FK to medications)
- stock_count (integer)
- price (float)  # Actual price set by pharmacy
- display_price (float)  # Calculated as price * 1.1
- batch_id (string, optional)
- low_stock_alert (boolean, default false)
- updated_at (timestamp)

### Orders Table
- id (UUID, PK)
- customer_id (UUID, FK to users)
- pharmacy_id (UUID, FK to pharmacies)
- delivery_id (UUID, FK to users, nullable)
- status (enum: pending, accepted, preparing, ready, picked_up, delivered, cancelled, rejected)
- total_price (float)
- address (string)
- created_at (timestamp)
- updated_at (timestamp)
- price_updated (boolean, default false)  # Indicates if price was updated after scan

### OrderItems Table
- id (UUID, PK)
- order_id (UUID, FK to orders)
- medication_id (UUID, FK to medications)
- quantity (integer)
- price (float)  # Actual price at time of order
- display_price (float)  # Display price at time of order

### Delivery Table
- id (UUID, PK)
- order_id (UUID, FK to orders)
- delivery_user_id (UUID, FK to users)
- pickup_time (timestamp, nullable)
- delivery_time (timestamp, nullable)
- status (enum: assigned, picked_up, delivered, failed)
- location_tracking (json, optional)

### AuditLogs Table
- id (UUID, PK)
- user_id (UUID, FK to users)
- action (string)
- details (json)
- created_at (timestamp)

---

## 10. Optimal Folder Structure

```
/pharmago-app
│
├── app/                  # Expo Router entry points and screens
│   ├── (auth)/           # Auth stack (login, signup, forgot password)
│   ├── (customer)/       # Customer-specific screens
│   ├── (pharmacy)/       # Pharmacy-specific screens
│   ├── (delivery)/       # Delivery-specific screens
│   ├── (admin)/          # Admin-specific screens
│   └── _layout.tsx       # Main app layout
│
├── components/           # Reusable UI components (buttons, cards, etc.)
├── constants/            # App-wide constants (colors, roles, etc.)
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions, API clients, Supabase client
├── models/               # TypeScript types and interfaces
├── navigation/           # Navigation helpers and config
├── services/             # Business logic, data fetching, notifications
├── store/                # State management (Zustand, Redux, etc.)
├── assets/               # Images, fonts, icons
├── locales/              # Localization files
├── .env                  # Environment variables
├── app.json              # Expo config
├── package.json          # Project dependencies
└── README.md             # Project documentation
```

---

## 11. Medication Price Calculation & User Flow

### Price Calculation Logic
- **Display Price** for each medication is calculated as:
  - Display Price = Actual Pharmacy Price + (Actual Pharmacy Price × 0.10)
  - Example: If Actual Price is $500, Display Price is $550 ($500 + $50 service fee)

### User Flow Instructions
1. **Backend Calculation:**
   - When a pharmacy updates or adds a medication price, the backend automatically calculates the display price by adding a 10% service fee to the actual price.
   - The display price is stored and sent to the frontend for user display.

2. **Pharmacy Card Display:**
   - When a customer searches for medications, each pharmacy card shows:
     - Medication name and dosage
     - Display price (bold, prominent)

3. **Multiple Medications:**
   - For orders with multiple medications, the app displays:
     - Each medication with its display price
     - Grand total (sum of all display prices)

4. **Price Updates:**
   - If a pharmacy changes the actual price after a scan, the display price is recalculated automatically.

5. **Validation:**
   - The system verifies that Display Price = Actual Price × 1.1 (tolerance ±$0.01)
   - If there is a discrepancy, just correct the price before order placement.

6. **Edge Cases:**
   - If a medication is out of stock from every pharmacy inventories in the system, the card is grayed out and marked "Out of stock".

### Key UI Components: Pharmacy Card

**Pharmacy Information (Top Section):**
- Pharmacy logo (left-aligned)
- Pharmacy name in bold (e.g., HealthyLife Pharmacy)
- Full address in smaller font (single line)

**Medication List (Middle Section):**
- Bulleted list (▫) of medications
- Each line shows:
  - Medication name + dosage (left-aligned)
  - Display price (right-aligned)
  - Format: ▫ [Medication] [Dosage] [Price]

**Action Button (Bottom):**
- "SELECT PHARMACY" primary button
- Full-width, contrasting color

---

**End of Document**
