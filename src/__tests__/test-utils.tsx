import { render, type RenderOptions } from '@testing-library/react';
import {type ReactElement } from 'react';

// Add any providers that components need here
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>{children}</>
  );
};

// Custom render function that includes providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Mock data generators
export const createMockUser = (overrides = {}) => ({
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  ...overrides,
});

export const createMockWallet = (overrides = {}) => ({
  id: '1',
  balance: 1000,
  currency: 'USD',
  ...overrides,
});

export const createMockTransaction = (overrides = {}) => ({
  id: '1',
  amount: 100,
  type: 'deposit',
  status: 'successful',
  date: '2023-01-01T12:00:00Z',
  metadata: {
    name: 'John Doe',
    type: 'customer',
    email: 'john@example.com',
    quantity: 1,
    country: 'US',
    product_name: 'Product A',
  },
  payment_reference: 'REF123',
  ...overrides,
});

// Helper to create an array of mock transactions
export const createMockTransactions = (count: number) => {
  return Array.from({ length: count }, (_, index) =>
    createMockTransaction({
      id: `${index + 1}`,
      amount: 100 * (index + 1),
      status: index % 3 === 0 ? 'successful' : index % 3 === 1 ? 'pending' : 'failed',
      date: new Date(2023, 0, index + 1).toISOString(),
      metadata: {
        name: `User ${index + 1}`,
        email: `user${index + 1}@example.com`,
        quantity: index + 1,
        country: index % 2 === 0 ? 'US' : 'UK',
        product_name: `Product ${String.fromCharCode(65 + index)}`,
      },
    })
  );
};

// Mock store state
export const createMockStoreState = (overrides = {}) => ({
  user: createMockUser(),
  wallet: createMockWallet(),
  transactions: createMockTransactions(5),
  isLoadingUser: false,
  isLoadingWallet: false,
  isLoadingTransactions: false,
  userError: null,
  walletError: null,
  transactionsError: null,
  fetchUser: jest.fn(),
  fetchWallet: jest.fn(),
  fetchTransactions: jest.fn(),
  ...overrides,
});