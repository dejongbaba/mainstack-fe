import axios from 'axios';
import { userApi } from '../api';

// Mock axios
jest.mock('axios', () => ({
  default: {
    create: jest.fn(() => ({
      get: jest.fn(),
    })),
  },
}));

describe('API Service', () => {
  let mockAxiosGet: jest.Mock;

  beforeEach(() => {
    // Get the mocked axios instance
    const mockAxiosInstance = axios.create();
    mockAxiosGet = mockAxiosInstance.get as jest.Mock;

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('getUser', () => {
    it('should call the correct endpoint and return user data', async () => {
      // Mock successful response
      const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };
      mockAxiosGet.mockResolvedValueOnce({ data: mockUser });

      // Call the API function
      const result = await userApi.getUser();

      // Check that axios.get was called with the correct endpoint
      expect(mockAxiosGet).toHaveBeenCalledWith('/user');

      // Check that the function returns the expected data
      expect(result).toEqual(mockUser);
    });

    it('should handle errors', async () => {
      // Mock error response
      const mockError = new Error('Network Error');
      mockAxiosGet.mockRejectedValueOnce(mockError);

      // Call the API function and expect it to throw
      await expect(userApi.getUser()).rejects.toThrow('Network Error');

      // Check that axios.get was called with the correct endpoint
      expect(mockAxiosGet).toHaveBeenCalledWith('/user');
    });
  });

  describe('getWallet', () => {
    it('should call the correct endpoint and return wallet data', async () => {
      // Mock successful response
      const mockWallet = { id: '1', balance: 1000, currency: 'USD' };
      mockAxiosGet.mockResolvedValueOnce({ data: mockWallet });

      // Call the API function
      const result = await userApi.getWallet();

      // Check that axios.get was called with the correct endpoint
      expect(mockAxiosGet).toHaveBeenCalledWith('/wallet');

      // Check that the function returns the expected data
      expect(result).toEqual(mockWallet);
    });
  });

  describe('getTransactions', () => {
    it('should call the correct endpoint and return transactions data', async () => {
      // Mock successful response
      const mockTransactions = [
        { id: '1', amount: 100, type: 'deposit', status: 'successful', date: '2023-01-01' },
        { id: '2', amount: 50, type: 'withdrawal', status: 'pending', date: '2023-01-02' },
      ];
      mockAxiosGet.mockResolvedValueOnce({ data: mockTransactions });

      // Call the API function
      const result = await userApi.getTransactions();

      // Check that axios.get was called with the correct endpoint
      expect(mockAxiosGet).toHaveBeenCalledWith('/transactions');

      // Check that the function returns the expected data
      expect(result).toEqual(mockTransactions);
    });
  });
});
