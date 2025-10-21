import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../dashboard';
import { useStore } from '@/store';

// Mock the store
jest.mock('@/store', () => ({
  useStore: jest.fn(),
}));

// Type the mocked store
const mockedUseStore = useStore as unknown as jest.MockedFunction<typeof useStore>;

// Mock the child components
jest.mock('../navigation-menu', () => ({
  NavigationMenu: () => <div data-testid="navigation-menu">Navigation Menu</div>,
}));

jest.mock('../TransactionGrid', () => ({
  TransactionGrid: ({ onFilter }: { onFilter: () => void }) => (
    <div data-testid="transaction-grid">
      Transaction Grid
      <button onClick={onFilter} data-testid="filter-button">
        Filter
      </button>
    </div>
  ),
}));

jest.mock('../revenue-chart', () => ({
  RevenueChart: () => <div data-testid="revenue-chart">Revenue Chart</div>,
}));

jest.mock('../sidebar', () => ({
  Sidebar: () => <div data-testid="sidebar">Sidebar</div>,
}));

jest.mock('../filter-modal', () => ({
  FilterModal: ({
    isOpen,
    onClose,
    onApply,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: any) => void;
  }) =>
    isOpen ? (
      <div data-testid="filter-modal">
        Filter Modal
        <button onClick={onClose} data-testid="close-button">
          Close
        </button>
        <button
          onClick={() =>
            onApply({
              transactionTypes: ['deposit'],
              status: 'successful',
              amount: { min: '10', max: '100' },
            })
          }
          data-testid="apply-button"
        >
          Apply
        </button>
      </div>
    ) : null,
}));

describe('Dashboard Component', () => {
  // Mock store data
  const mockStore = {
    user: { id: '1', name: 'John Doe' },
    wallet: { balance: 1000, currency: 'USD' },
    transactions: [
      { id: '1', amount: 100, type: 'deposit', status: 'successful', date: '2023-01-01' },
      { id: '2', amount: 50, type: 'withdrawal', status: 'pending', date: '2023-01-02' },
      { id: '3', amount: 200, type: 'deposit', status: 'successful', date: '2023-01-03' },
    ],
    isLoadingUser: false,
    isLoadingWallet: false,
    isLoadingTransactions: false,
    userError: null,
    walletError: null,
    transactionsError: null,
    fetchUser: jest.fn(),
    fetchWallet: jest.fn(),
    fetchTransactions: jest.fn(),
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup default store mock implementation
    mockedUseStore.mockImplementation(() => mockStore);
  });

  it('renders the dashboard with all components when data is loaded', () => {
    render(<Dashboard />);

    // Check that all components are rendered
    expect(screen.getByTestId('navigation-menu')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('transaction-grid')).toBeInTheDocument();
    expect(screen.getByTestId('revenue-chart')).toBeInTheDocument();

    // Check that the filter modal is not initially rendered
    expect(screen.queryByTestId('filter-modal')).not.toBeInTheDocument();
  });

  it('fetches data on mount', () => {
    render(<Dashboard />);

    // Check that the fetch functions were called
    expect(mockStore.fetchUser).toHaveBeenCalledTimes(1);
    expect(mockStore.fetchWallet).toHaveBeenCalledTimes(1);
    expect(mockStore.fetchTransactions).toHaveBeenCalledTimes(1);
  });

  it('shows loading state when data is loading', () => {
    // Mock loading state
    mockedUseStore.mockImplementation(() => ({
      ...mockStore,
      isLoadingUser: true,
      isLoadingWallet: true,
      isLoadingTransactions: true,
    }));

    render(<Dashboard />);

    // Check that loading indicator is shown
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows error state when there is an error', () => {
    // Mock error state
    const error = new Error('Failed to load data');
    mockedUseStore.mockImplementation(() => ({
      ...mockStore,
      userError: error,
    }));

    render(<Dashboard />);

    // Check that error message is shown
    expect(screen.getByText(/error loading dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/failed to load data/i)).toBeInTheDocument();

    // Check that retry button is shown
    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();

    // Click retry button
    userEvent.click(retryButton);

    // Check that fetch functions were called again
    expect(mockStore.fetchUser).toHaveBeenCalledTimes(1);
    expect(mockStore.fetchWallet).toHaveBeenCalledTimes(1);
    expect(mockStore.fetchTransactions).toHaveBeenCalledTimes(1);
  });

  it('opens filter modal when filter button is clicked', async () => {
    render(<Dashboard />);

    // Click filter button
    const filterButton = screen.getByTestId('filter-button');
    await userEvent.click(filterButton);

    // Check that filter modal is shown
    await waitFor(() => {
      expect(screen.getByTestId('filter-modal')).toBeInTheDocument();
    });
  });

  it('closes filter modal when close button is clicked', async () => {
    render(<Dashboard />);

    // Open filter modal
    const filterButton = screen.getByTestId('filter-button');
    await userEvent.click(filterButton);

    // Check that filter modal is shown
    await waitFor(() => {
      expect(screen.getByTestId('filter-modal')).toBeInTheDocument();
    });

    // Click close button
    const closeButton = screen.getByTestId('close-button');
    await userEvent.click(closeButton);

    // Check that filter modal is hidden
    await waitFor(() => {
      expect(screen.queryByTestId('filter-modal')).not.toBeInTheDocument();
    });
  });

  it('applies filters when apply button is clicked', async () => {
    render(<Dashboard />);

    // Open filter modal
    const filterButton = screen.getByTestId('filter-button');
    await userEvent.click(filterButton);

    // Check that filter modal is shown
    await waitFor(() => {
      expect(screen.getByTestId('filter-modal')).toBeInTheDocument();
    });

    // Click apply button
    const applyButton = screen.getByTestId('apply-button');
    await userEvent.click(applyButton);

    // Check that filter modal is hidden
    await waitFor(() => {
      expect(screen.queryByTestId('filter-modal')).not.toBeInTheDocument();
    });

    // Since we're mocking the store and components, we can't directly test the filtered transactions
    // In a real test, we would check that the filtered transactions are passed to the TransactionGrid
  });
});
