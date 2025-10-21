import { act, renderHook } from '@testing-library/react';
import { useStore } from '../index';
import { userApi } from '../../services/api';

// Mock the API service
jest.mock('../../services/api', () => ({
  getUser: jest.fn(),
  getWallet: jest.fn(),
  getTransactions: jest.fn(),
}));

describe('Store', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the store state before each test
    act(() => {
      useStore.setState({
        user: null,
        wallet: null,
        transactions: [],
        isLoadingUser: false,
        isLoadingWallet: false,
        isLoadingTransactions: false,
        userError: null,
        walletError: null,
        transactionsError: null,
      });
    });
  });

  describe('fetchUser', () => {
    it('should set loading state and fetch user data successfully', async () => {
      // Mock successful API response
      const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };
      (userApi.getUser as jest.Mock).mockResolvedValue({ data: mockUser });

      // Get the store hook
      const { result } = renderHook(() => useStore());

      // Initial state should have null user and no loading/error
      expect(result.current.user).toBeNull();
      expect(result.current.isLoadingUser).toBe(false);
      expect(result.current.userError).toBeNull();

      // Call fetchUser
      await act(async () => {
        await result.current.fetchUser();
      });

      // API should have been called
      expect(userApi.getUser).toHaveBeenCalledTimes(1);

      // State should be updated with user data and loading set to false
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isLoadingUser).toBe(false);
      expect(result.current.userError).toBeNull();
    });

    it('should handle errors when fetching user data', async () => {
      // Mock API error
      const mockError = new Error('Failed to fetch user');
      (userApi.getUser as jest.Mock).mockRejectedValue(mockError);

      // Get the store hook
      const { result } = renderHook(() => useStore());

      // Call fetchUser
      await act(async () => {
        await result.current.fetchUser();
      });

      // API should have been called
      expect(userApi.getUser).toHaveBeenCalledTimes(1);

      // State should reflect the error
      expect(result.current.user).toBeNull();
      expect(result.current.isLoadingUser).toBe(false);
      expect(result.current.userError).toEqual(mockError);
    });
  });

  describe('fetchWallet', () => {
    it('should set loading state and fetch wallet data successfully', async () => {
      // Mock successful API response
      const mockWallet = { id: '1', balance: 1000, currency: 'USD' };
      (userApi.getWallet as jest.Mock).mockResolvedValue({ data: mockWallet });

      // Get the store hook
      const { result } = renderHook(() => useStore());

      // Call fetchWallet
      await act(async () => {
        await result.current.fetchWallet();
      });

      // API should have been called
      expect(userApi.getWallet).toHaveBeenCalledTimes(1);

      // State should be updated with wallet data
      expect(result.current.wallet).toEqual(mockWallet);
      expect(result.current.isLoadingWallet).toBe(false);
      expect(result.current.walletError).toBeNull();
    });
  });

  describe('fetchTransactions', () => {
    it('should set loading state and fetch transactions data successfully', async () => {
      // Mock successful API response
      const mockTransactions = [
        { id: '1', amount: 100, type: 'deposit', status: 'successful', date: '2023-01-01' },
        { id: '2', amount: 50, type: 'withdrawal', status: 'pending', date: '2023-01-02' },
      ];
      (userApi.getTransactions as jest.Mock).mockResolvedValue({ data: mockTransactions });

      // Get the store hook
      const { result } = renderHook(() => useStore());

      // Call fetchTransactions
      await act(async () => {
        await result.current.fetchTransactions();
      });

      // API should have been called
      expect(userApi.getTransactions).toHaveBeenCalledTimes(1);

      // State should be updated with transactions data
      expect(result.current.transactions).toEqual(mockTransactions);
      expect(result.current.isLoadingTransactions).toBe(false);
      expect(result.current.transactionsError).toBeNull();
    });
  });
});
