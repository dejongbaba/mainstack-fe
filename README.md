# Mainstack Frontend

A modern React dashboard application built with TypeScript, Vite, TanStack Router, and Zustand for state management. The application features a responsive dashboard with transaction management, data visualization, and filtering capabilities.


## Features

- **Dashboard Overview**: Visualize key metrics and transaction data
- **Transaction Management**: View, filter, and manage transactions
- **Data Visualization**: Charts and graphs for revenue analysis
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **State Management**: Centralized state with Zustand
- **Type Safety**: Full TypeScript integration
- **Comprehensive Testing**: Unit and integration tests


### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Unstyled, accessible UI components
- **Lucide React**: Beautiful, consistent icons
- **Recharts**: Composable charting library

### Testing
- **Jest**: JavaScript testing framework
- **React Testing Library**: Testing utilities for React
- **User Event**: Simulate user interactions in tests

## Project Structure

```
src/
├── __tests__/            # Global test utilities and user journey tests
├── assets/               # Static assets (images, icons)
├── components/           # UI components
│   ├── __tests__/        # Component tests
│   └── ui/               # Reusable UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
│   └── __tests__/        # Library tests
├── routes/               # Application routes
├── services/             # API services
│   └── __tests__/        # Service tests
├── store/                # State management
│   └── __tests__/        # Store tests
├── index.css             # Global styles
├── main.tsx              # Application entry point
└── routeTree.gen.ts      # Generated route tree
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd mainstack-fe
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint to check for code issues
- `npm run preview` - Preview the production build locally
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report


## UI Components

The application uses a combination of custom components and Radix UI primitives:

- **Dashboard**: Main dashboard layout
- **Sidebar**: Navigation sidebar
- **NavigationMenu**: Top navigation bar
- **TransactionGrid**: Data grid for transactions
- **RevenueChart**: Chart for revenue visualization
- **FilterModal**: Modal for filtering transactions

## API Integration

The application uses Axios for API requests. API services are organized in the `src/services` directory:

- **User API**: Fetch user information
- **Wallet API**: Fetch wallet details
- **Transactions API**: Fetch and filter transactions

The Axios instance is configured with interceptors for request/response handling and error management.

## Testing

The application has a comprehensive testing strategy covering:

- **Component Tests**: Verify UI components render correctly
- **Store Tests**: Verify state management logic
- **API Tests**: Verify API service functions
- **Integration Tests**: Verify component interactions
- **User Journey Tests**: Verify complete user flows

For more details, see the [Testing Strategy](./TESTING.md) document.



