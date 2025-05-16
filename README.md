# Vamos Expeditions Frontend

## Overview
Vamos Expeditions is a modern web application built with React and TypeScript, designed to manage expeditions, hotels, and reservations. The application features a responsive UI with dark mode support and comprehensive booking management capabilities.

## Tech Stack
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS + CSS Modules
- **State Management**: Redux (with RTK Query)
- **Form Handling**: React Hook Form with Zod validation 
- **UI Components**: PrimeReact
- **Build Tool**: Vite

## Features
- Hotel Management System
  - Hotel registration and editing
  - Category management (3-5 stars, Boutique, Villa, Lodge)
  - District-based location tracking
- Reservation System
  - Status management (Active, Pending, Rejected)
  - Quotation version control
  - Booking workflow management
- Responsive Design
  - Mobile-first approach
  - Dark mode support
- Form Validation
  - Real-time validation
  - Custom error messages
  - Type-safe forms

## Getting Started

### Prerequisites
- Node.js (Latest LTS version recommended)
- pnpm (Package manager)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Copy the environment template:
   ```bash
   cp .env.template .env
   ```
4. Configure environment variables in `.env`

### Development
Start the development server:
```bash
pnpm run dev
```

### Build
Create a production build:
```bash
pnpm run build
```

## Project Structure
```
src/
├── app/           # App configuration and routes
├── core/          # Core utilities and adapters
├── data/          # Data layer and database interactions
├── domain/        # Business logic and entities
├── infrastructure/# External services and store
└── presentation/  # UI components and pages
    ├── components/# Reusable UI components
    ├── guards/    # Route protection
    ├── hooks/     # Custom React hooks
    ├── pages/     # Application pages
    └── routes/    # Route definitions
```

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React best practices and hooks guidelines
- Implement proper error boundaries
- Use CSS Modules for component-specific styles

### Component Structure
- Maintain separation of concerns
- Use proper type definitions
- Implement error handling
- Follow the container/presenter pattern

### State Management
- Use Redux for global state
- Implement RTK Query for API calls
- Handle loading and error states

## Contributing
1. Create a feature branch
2. Implement changes
3. Submit a pull request
4. Ensure all tests pass

## License
Private - All rights reserved