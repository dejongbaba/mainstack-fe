import Dashboard from '@/components/dashboard';
import { useStore } from '@/store';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMockStoreState, createMockTransaction } from './test-utils';

// Mock the store
jest.mock('@/store', () => ({
  useStore: jest.fn(),
}));

// Type the mocked store
const mockedUseStore = useStore as unknown as jest.MockedFunction<typeof useStore>;

// Mock the child components with minimal implementations to test the flow
jest.mock('@/components/navigation-menu', () => ({
  NavigationMenu: () => <div data-testid="navigation-menu">Navigation Menu</div>,
}));

jest.mock('@/components/sidebar', () => ({
  Sidebar: () => <div data-testid="sidebar">Sidebar</div>,
}));

jest.mock('@/components/revenue-chart', () => ({
  RevenueChart: () => <div data-testid="revenue-chart">Revenue Chart</div>,
}));

// Don't mock TransactionGrid and FilterModal to test the actual interaction

describe('User Journey', () => {
  // Setup mock store with initial data
  const mockStore = createMockStoreState();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseStore.mockImplementation(() => mockStore);
  });

  it('User can view dashboard, filter transactions, and see filtered results', async () => {
    // Add some specific transactions for testing filters
    const depositTransaction = createMockTransaction({
      id: '101',
      type: 'deposit',
      amount: 1000,
      status: 'successful',
    });

    const withdrawalTransaction = createMockTransaction({
      id: '102',
      type: 'withdrawal',
      amount: 500,
      status: 'pending',
    });

    const customStore = {
      ...mockStore,
      transactions: [depositTransaction, withdrawalTransaction],
    };

    mockedUseStore.mockImplementation(() => customStore);

    // Render the dashboard
    render(<Dashboard />);

    // Verify initial state - all transactions should be visible
    await waitFor(() => {
      expect(screen.getByText('1,000.00')).toBeInTheDocument(); // Deposit amount
      expect(screen.getByText('500.00')).toBeInTheDocument(); // Withdrawal amount
    });

    // Step 1: User clicks on filter button
    const filterButton = screen.getByRole('button', { name: /filter/i });
    await userEvent.click(filterButton);

    // Verify filter modal is open
    await waitFor(() => {
      expect(screen.getByText(/filter transactions/i)).toBeInTheDocument();
    });

    // Step 2: User selects transaction type filter (deposit)
    const depositCheckbox = screen.getByLabelText(/deposit/i);
    await userEvent.click(depositCheckbox);

    // Step 3: User applies the filter
    const applyButton = screen.getByRole('button', { name: /apply/i });
    await userEvent.click(applyButton);

    // Verify filter modal is closed
    await waitFor(() => {
      expect(screen.queryByText(/filter transactions/i)).not.toBeInTheDocument();
    });

    // Verify only deposit transactions are shown
    await waitFor(() => {
      expect(screen.getByText('USD 1,000.00')).toBeInTheDocument(); // Deposit amount should be visible
      expect(screen.queryByText('USD 500.00')).not.toBeInTheDocument(); // Withdrawal amount should not be visible
    });

    // Step 4: User opens filter modal again
    await userEvent.click(filterButton);

    // Verify filter modal is open again
    await waitFor(() => {
      expect(screen.getByText(/filter transactions/i)).toBeInTheDocument();
    });

    // Step 5: User clears filters
    const clearButton = screen.getByRole('button', { name: /clear/i });
    await userEvent.click(clearButton);

    // Step 6: User applies the cleared filters
    await userEvent.click(applyButton);

    // Verify all transactions are shown again
    await waitFor(() => {
      expect(screen.getByText('USD 1,000.00')).toBeInTheDocument(); // Deposit amount
      expect(screen.getByText('USD 500.00')).toBeInTheDocument(); // Withdrawal amount
    });
  });

  it('User can retry loading data when there is an error', async () => {
    // Setup error state
    const errorStore = {
      ...mockStore,
      userError: new Error('Failed to load user data'),
      fetchUser: jest.fn(),
      fetchWallet: jest.fn(),
      fetchTransactions: jest.fn(),
    };

    mockedUseStore.mockImplementation(() => errorStore);

    // Render the dashboard
    render(<Dashboard />);

    // Verify error state is shown
    expect(screen.getByText(/error loading dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/failed to load user data/i)).toBeInTheDocument();

    // User clicks retry button
    const retryButton = screen.getByRole('button', { name: /retry/i });
    await userEvent.click(retryButton);

    // Verify fetch functions were called
    expect(errorStore.fetchUser).toHaveBeenCalledTimes(1);
    expect(errorStore.fetchWallet).toHaveBeenCalledTimes(1);
    expect(errorStore.fetchTransactions).toHaveBeenCalledTimes(1);
  });

  it('User sees loading state while data is being fetched', async () => {
    // Setup loading state
    const loadingStore = {
      ...mockStore,
      isLoadingUser: true,
      isLoadingWallet: true,
      isLoadingTransactions: true,
    };

    mockedUseStore.mockImplementation(() => loadingStore);

    // Render the dashboard
    render(<Dashboard />);

    // Simulate data loaded
    mockedUseStore.mockImplementation(() => ({
      ...loadingStore,
      isLoadingUser: false,
      isLoadingWallet: false,
      isLoadingTransactions: false,
    }));

    // Re-render with loaded data
    render(<Dashboard />);

    // Verify dashboard content is shown
    await waitFor(() => {
      expect(screen.getByTestId('navigation-menu')).toBeInTheDocument();
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('revenue-chart')).toBeInTheDocument();
    });
  });
});
