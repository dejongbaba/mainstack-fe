import { useEffect } from 'react';
import { useStore } from '@/store';

export function useDashboardData() {
  const {
    user,
    wallet,
    transactions,
    isLoadingUser,
    isLoadingWallet,
    isLoadingTransactions,
    userError,
    walletError,
    transactionsError,
    fetchUser,
    fetchWallet,
    fetchTransactions,
  } = useStore();

  useEffect(() => {
    // Fetch all data when the component mounts
    fetchUser();
    fetchWallet();
    fetchTransactions();
  }, [fetchUser, fetchWallet, fetchTransactions]);

  const isLoading = isLoadingUser || isLoadingWallet || isLoadingTransactions;
  const error = userError || walletError || transactionsError;

  return {
    user,
    wallet,
    transactions,
    isLoading,
    error,
    // Individual loading states if needed
    isLoadingUser,
    isLoadingWallet,
    isLoadingTransactions,
    // Individual error states if needed
    userError,
    walletError,
    transactionsError,
    // Refetch functions
    refetch: {
      user: fetchUser,
      wallet: fetchWallet,
      transactions: fetchTransactions,
    },
  };
}
