# PharmaGo

A React Native app for pharmacy management and delivery services.

## Features

- **Multi-role Authentication**: Admin, Pharmacy, Delivery, and Customer roles
- **Password Management**: First-time password change for new users
- **Real-time Updates**: Live order tracking and status updates
- **Modern UI**: Clean and intuitive user interface

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pharmago
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   SUPABASE_URL=your-supabase-project-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Set up Supabase Database**
   
   - Create a new Supabase project at [https://app.supabase.com/](https://app.supabase.com/)
   - Get your project URL and anon key from Project Settings > API
   - Create the following tables in your Supabase database:

   **Users Table:**
   ```sql
   CREATE TABLE users (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     username VARCHAR(255) UNIQUE NOT NULL,
     email VARCHAR(255),
     password_hash VARCHAR(255) NOT NULL,
     role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'pharmacy', 'delivery', 'customer')),
     must_change_password BOOLEAN DEFAULT true,
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

   **Pharmacies Table:**
   ```sql
   CREATE TABLE pharmacies (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id),
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

5. **Seed the admin user**
   
   Insert a default admin user:
   ```sql
   INSERT INTO users (username, password_hash, role, must_change_password, is_active)
   VALUES ('admin', 'admin123', 'admin', true, true);
   ```

6. **Start the development server**
   ```bash
   npm start
   ```

## Project Structure

```
pharmago/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main app tabs
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
├── services/             # API and external services
├── store/                # Zustand state management
├── constants/            # App constants
└── assets/               # Images, fonts, etc.
```

## Authentication Flow

1. **Login**: Users enter username and password
2. **Password Change**: New users must change their password on first login
3. **Role-based Navigation**: Users are directed to appropriate dashboards based on their role

## Development

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Start on Android device/emulator
- `npm run ios` - Start on iOS device/simulator
- `npm run web` - Start on web browser
- `npm run lint` - Run ESLint

### Adding New Features

1. Create components in the `components/` directory
2. Add services in the `services/` directory
3. Update the store in `store/` for state management
4. Add new pages in the appropriate `app/` subdirectory

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
