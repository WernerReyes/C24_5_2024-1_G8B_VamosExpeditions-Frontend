# Vamos Expeditions Frontend

A modern web application built with React, TypeScript, and Vite for managing travel expeditions and quotations.

## 🚀 Features

- User Authentication & Authorization
- Quotation Management
- Reservation System
- Hotel Management
- User Management
- Real-time Updates
- Responsive Design

## 🛠️ Tech Stack

- **Framework:** React 18.3
- **Language:** TypeScript
- **Build Tool:** Vite
- **State Management:** Redux Toolkit
- **UI Components:** PrimeReact 10.8
- **Styling:** Tailwind CSS
- **Form Handling:** React Hook Form
- **Data Validation:** Zod
- **Date Handling:** date-fns, luxon
- **Notifications:** react-hot-toast
- **Charts:** Chart.js with react-chartjs-2
- **Other Tools:** Socket.io-client, JWT

## 🏗️ Project Structure

```
src/
├── app/               # App initialization and store setup
├── core/             # Core utilities and adapters
├── domain/           # Business logic and entities
├── infraestructure/  # External services and store
└── presentation/     # UI components and pages
    ├── components/   # Reusable UI components
    ├── hooks/        # Custom React hooks
    └── pages/        # Application pages
```

## 🚦 Getting Started

1. **Installation**
```bash
pnpm install
```

2. **Development**
```bash
pnpm dev
```

3. **Production Build**
```bash
pnpm build
```

4. **Preview Production Build**
```bash
pnpm preview
```

## 🔧 Configuration

- **TypeScript:** Configured with strict mode and module bundler settings
- **ESLint:** Extended configuration with React and TypeScript support
- **Vite:** Configured with React SWC plugin for fast refresh
- **Tailwind:** Custom theme configuration with extended colors

## 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url
```

## 🔐 Authentication

The application uses JWT-based authentication with cookie storage and includes features like:
- Login/Logout
- Password Reset
- Session Management
- Token Refresh

## 🎨 Theming

Custom theme configuration with Tailwind CSS:
- Primary: #01A3BB
- Secondary: #F4F6F6
- Tertiary: #01495D

## 📱 Responsive Design

Breakpoints:
- Mobile: ≤ 640px
- Tablet: ≤ 768px
- Desktop: ≤ 1024px
- Large: ≤ 1920px

## 🛡️ Security Features

- CSRF Protection
- HTTP-Only Cookies
- Time Zone Handling
- Browser Detection

## 📦 Available Scripts

- `pnpm dev`: Start development server
- `pnpm build`: Build for production
- `pnpm lint`: Run ESLint
- `pnpm start`: Build and serve production
- `pnpm preview`: Preview production build

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is private and confidential. All rights reserved.

        