import axios from 'axios';
import api from '../axios';

// Define the type for mockAxios to avoid implicit any
type MockAxiosType = {
  create: jest.Mock;
  interceptors: {
    request: { use: jest.Mock };
    response: { use: jest.Mock };
  };
  defaults: Record<string, unknown>;
};

// Mock axios
jest.mock('axios', () => {
  // Create the mock object
  const mockAxios: MockAxiosType = {
    create: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    defaults: {},
  };
  
  // Set up the circular reference after the object is created
  mockAxios.create.mockReturnValue(mockAxios);
  
  return mockAxios;
});

describe('Axios Instance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an axios instance with the correct configuration', () => {
    // Check if axios.create was called with the correct configuration
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: expect.any(String),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('should set up request interceptors', () => {
    // Check if request interceptors are set up
    expect(api.interceptors.request.use).toHaveBeenCalled();
  });

  it('should set up response interceptors', () => {
    // Check if response interceptors are set up
    expect(api.interceptors.response.use).toHaveBeenCalled();
  });

  // Test the request interceptor
  it('should pass through the config in the request interceptor', () => {
    // Get the request interceptor function
    const requestInterceptor = (api.interceptors.request.use as jest.Mock).mock.calls[0][0];
    
    // Create a mock config
    const mockConfig = { headers: {} };
    
    // Call the interceptor
    const result = requestInterceptor(mockConfig);
    
    // The interceptor should return the config unchanged
    expect(result).toBe(mockConfig);
  });

  // Test the request interceptor error handler
  it('should reject the promise in the request interceptor error handler', () => {
    // Get the request interceptor error handler
    const requestErrorHandler = (api.interceptors.request.use as jest.Mock).mock.calls[0][1];
    
    // Create a mock error
    const mockError = new Error('Request error');
    
    // Call the error handler
    expect(() => requestErrorHandler(mockError)).rejects.toThrow('Request error');
  });

  // Test the response interceptor
  it('should pass through the response in the response interceptor', () => {
    // Get the response interceptor function
    const responseInterceptor = (api.interceptors.response.use as jest.Mock).mock.calls[0][0];
    
    // Create a mock response
    const mockResponse = { data: { success: true } };
    
    // Call the interceptor
    const result = responseInterceptor(mockResponse);
    
    // The interceptor should return the response unchanged
    expect(result).toBe(mockResponse);
  });

  // Test the response interceptor error handler
  it('should handle response errors correctly', () => {
    // Get the response interceptor error handler
    const responseErrorHandler = (api.interceptors.response.use as jest.Mock).mock.calls[0][1];
    
    // Mock console.error
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    // Create mock errors for different scenarios
    const responseError = {
      response: { data: 'Response error data' },
    };
    
    const requestError = {
      request: 'Request error object',
      response: undefined,
    };
    
    const genericError = {
      message: 'Generic error message',
      request: undefined,
      response: undefined,
    };
    
    // Test response error handling
    expect(() => responseErrorHandler(responseError)).rejects.toEqual(responseError);
    expect(console.error).toHaveBeenCalledWith('API Error:', 'Response error data');
    
    // Reset mock
    (console.error as jest.Mock).mockClear();
    
    // Test request error handling
    expect(() => responseErrorHandler(requestError)).rejects.toEqual(requestError);
    expect(console.error).toHaveBeenCalledWith('Network Error:', 'Request error object');
    
    // Reset mock
    (console.error as jest.Mock).mockClear();
    
    // Test generic error handling
    expect(() => responseErrorHandler(genericError)).rejects.toEqual(genericError);
    expect(console.error).toHaveBeenCalledWith('Error:', 'Generic error message');
    
    // Restore console.error
    console.error = originalConsoleError;
  });
});