import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionGrid } from '../TransactionGrid';

// Mock the lucide-react icons
jest.mock('lucide-react', () => ({
  ArrowDownLeft: () => <span data-testid="arrow-down-left-icon">ArrowDownLeft</span>,
  Download: () => <span data-testid="download-icon">Download</span>,
  Filter: () => <span data-testid="filter-icon">Filter</span>,
}));

describe('TransactionGrid Component', () => {
  // Sample transaction data for testing
  const mockTransactions = [
    {
      amount: 1000,
      metadata: {
        name: 'John Doe',
        type: 'customer',
        email: 'john@example.com',
        quantity: 1,
        country: 'US',
        product_name: 'Product A',
      },
      payment_reference: 'REF123',
      status: 'successful',
      type: 'deposit',
      date: '2023-01-01T12:00:00Z',
    },
    {
      amount: 500,
      metadata: {
        name: 'Jane Smith',
        type: 'customer',
        email: 'jane@example.com',
        quantity: 2,
        country: 'UK',
        product_name: 'Product B',
      },
      payment_reference: 'REF456',
      status: 'pending',
      type: 'withdrawal',
      date: '2023-01-02T12:00:00Z',
    },
  ];

  // Props for the component
  const defaultProps = {
    title: 'Transactions',
    description: 'Recent transactions',
    isLoading: false,
    data: mockTransactions,
    onFilter: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with title and description', () => {
    render(<TransactionGrid {...defaultProps} />);

    // Check that the title and description are rendered
    expect(screen.getByText('Transactions')).toBeInTheDocument();
    expect(screen.getByText('Recent transactions')).toBeInTheDocument();
  });

  it('renders the filter and download buttons', () => {
    render(<TransactionGrid {...defaultProps} />);

    // Check that the filter button is rendered
    const filterButton = screen.getByRole('button', { name: /filter/i });
    expect(filterButton).toBeInTheDocument();
    expect(within(filterButton).getByTestId('filter-icon')).toBeInTheDocument();

    // Check that the download button is rendered
    const downloadButton = screen.getByRole('button', { name: /export list/i });
    expect(downloadButton).toBeInTheDocument();
    expect(within(downloadButton).getByTestId('download-icon')).toBeInTheDocument();
  });

  it('calls onFilter when the filter button is clicked', async () => {
    render(<TransactionGrid {...defaultProps} />);

    // Click the filter button
    const filterButton = screen.getByRole('button', { name: /filter/i });
    await userEvent.click(filterButton);

    // Check that onFilter was called
    expect(defaultProps.onFilter).toHaveBeenCalledTimes(1);
  });

  it('renders a loading state when isLoading is true', () => {
    render(<TransactionGrid {...defaultProps} isLoading={true} />);

    // Check that the loading indicator is rendered
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders the transaction data in the table', () => {
    render(<TransactionGrid {...defaultProps} />);

    // Check that the table headers are rendered
    expect(screen.getByRole('columnheader', { name: /amount/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /date/i })).toBeInTheDocument();

    // Check that the transaction data is rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    
    // Check that the amounts are formatted correctly
    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
    expect(screen.getByText('$500.00')).toBeInTheDocument();
    
    // Check that the status badges are rendered with the correct classes
    const successfulBadge = screen.getByText('successful');
    expect(successfulBadge).toBeInTheDocument();
    expect(successfulBadge.closest('div')).toHaveClass('text-green-600');
    expect(successfulBadge.closest('div')).toHaveClass('bg-green-50');
    
    const pendingBadge = screen.getByText('pending');
    expect(pendingBadge).toBeInTheDocument();
    expect(pendingBadge.closest('div')).toHaveClass('text-yellow-600');
    expect(pendingBadge.closest('div')).toHaveClass('bg-yellow-50');
  });

  it('renders an empty state when there is no data', () => {
    render(<TransactionGrid {...defaultProps} data={[]} />);

    // Check that the empty state message is rendered
    expect(screen.getByText(/no transactions found/i)).toBeInTheDocument();
  });
});