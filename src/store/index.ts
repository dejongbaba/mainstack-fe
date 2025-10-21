import { create } from 'zustand';
import { userApi } from '@/services/api';
import type { User, Wallet, Transaction } from '@/services/api';

export interface StoreState {
  // User slice
  user: User | null;
  isLoadingUser: boolean;
  userError: Error | null;
  fetchUser: () => Promise<void>;

  // Wallet slice
  wallet: Wallet | null;
  isLoadingWallet: boolean;
  walletError: Error | null;
  fetchWallet: () => Promise<void>;

  // Transactions slice
  transactions: Transaction[];
  isLoadingTransactions: boolean;
  transactionsError: Error | null;
  fetchTransactions: () => Promise<void>;
}

export const useStore = create<StoreState>(set => ({
  // User initial state and actions
  user: null,
  isLoadingUser: false,
  userError: null,
  fetchUser: async () => {
    set({ isLoadingUser: true, userError: null });
    try {
      const user = await userApi.getUser();
      set({ user, isLoadingUser: false });
    } catch (error) {
      set({ userError: error as Error, isLoadingUser: false });
    }
  },

  // Wallet initial state and actions
  wallet: null,
  isLoadingWallet: false,
  walletError: null,
  fetchWallet: async () => {
    set({ isLoadingWallet: true, walletError: null });
    try {
      const wallet = await userApi.getWallet();
      set({ wallet, isLoadingWallet: false });
    } catch (error) {
      set({ walletError: error as Error, isLoadingWallet: false });
    }
  },

  // Transactions initial state and actions
  transactions: [],
  isLoadingTransactions: false,
  transactionsError: null,
  fetchTransactions: async () => {
    set({ isLoadingTransactions: true, transactionsError: null });
    try {
      const transactions = await userApi.getTransactions();
      set({ transactions, isLoadingTransactions: false });
    } catch (error) {
      set({ transactionsError: error as Error, isLoadingTransactions: false });
    }
  },
}));
