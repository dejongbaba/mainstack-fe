# Testing Strategy for Mainstack Frontend

## Overview

This document outlines the testing strategy for the Mainstack frontend application. The testing approach focuses on unit tests for components, store, and application flow to ensure the application functions correctly and maintains high quality.

## Testing Tools

- **Jest**: JavaScript testing framework
- **React Testing Library**: Testing utilities for React components
- **User Event**: Library for simulating user interactions
- **Jest DOM**: Custom Jest matchers for DOM testing

## Test Structure

The tests are organized into the following categories:

1. **Component Tests**: Tests for individual UI components
2. **Store Tests**: Tests for Zustand store and state management
3. **API Tests**: Tests for API service functions
4. **Integration Tests**: Tests for component interactions
5. **User Journey Tests**: Tests for complete user flows

## Test Files Organization

Tests are co-located with the code they test:

```
src/
  components/
    __tests__/
      sidebar.test.tsx
      dashboard.test.tsx
      TransactionGrid.test.tsx
  store/
    __tests__/
      store.test.ts
  services/
    __tests__/
      api.test.ts
  lib/
    __tests__/
      axios.test.ts
  __tests__/
    test-utils.tsx
    user-journey.test.tsx
```

## Running Tests

To run the tests, use the following npm scripts:

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Testing Approach

### Component Testing

Component tests verify that UI components render correctly and respond appropriately to user interactions. These tests use React Testing Library to render components in isolation and assert on their behavior.

Example: `sidebar.test.tsx` tests that the Sidebar component renders correctly with all navigation buttons.

### Store Testing

Store tests verify that the Zustand store manages state correctly, including loading states, error handling, and data fetching. These tests mock API calls to isolate the store logic.

Example: `store.test.ts` tests the store's ability to fetch user data, handle loading states, and manage errors.

### API Testing

API tests verify that API service functions make the correct requests and handle responses appropriately. These tests mock axios to isolate the API functions.

Example: `api.test.ts` tests that the API functions call the correct endpoints and handle responses correctly.

### Integration Testing

Integration tests verify that components work together correctly. These tests render multiple components and test their interactions.

Example: `dashboard.test.tsx` tests that the Dashboard component integrates correctly with its child components and the store.

### User Journey Testing

User journey tests verify complete user flows through the application. These tests simulate user interactions and verify that the application responds correctly.

Example: `user-journey.test.tsx` tests a user's journey through the dashboard, including filtering transactions and handling errors.

## Mocking Strategy

The tests use the following mocking strategies:

- **API Calls**: Mocked using Jest's mocking capabilities to avoid actual network requests
- **Store**: Mocked to provide controlled test data and isolate components
- **Child Components**: Selectively mocked to focus tests on specific functionality
- **Browser APIs**: Mocked for environment-specific features like matchMedia and IntersectionObserver

## Test Utilities

The `test-utils.tsx` file provides common testing utilities:

- Custom render function with providers
- Mock data generators for users, wallets, and transactions
- Helper functions for creating test data

## Coverage Goals

The testing strategy aims for the following coverage targets:

- **Lines**: 70%
- **Functions**: 70%
- **Branches**: 70%
- **Statements**: 70%

These targets are enforced in the Jest configuration.

## Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the component does, not how it does it
2. **Use Realistic Data**: Use realistic test data that resembles production data
3. **Isolate Tests**: Each test should be independent and not rely on the state from other tests
4. **Mock External Dependencies**: Mock API calls and other external dependencies
5. **Test Edge Cases**: Include tests for error states, loading states, and edge cases
6. **Keep Tests Simple**: Each test should verify a single behavior
7. **Use Descriptive Test Names**: Test names should describe the behavior being tested