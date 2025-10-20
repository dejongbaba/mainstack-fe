import api from '@/lib/axios';
import type { AxiosResponse } from 'axios';

export interface User {
  first_name: string;
  last_name: string;
  email: string;
}

export interface Wallet {
  balance: number;
  total_payout: number;
  total_revenue: number;
  pending_payout: number;
  total_orders: number;
}

export interface Transaction {
  id: string;
  title: string;
  author: string;
  amount: number;
  date: string;
  status: 'successful' | 'pending';
  type: 'purchase' | 'withdrawal';
  description: string;
}

export const userApi = {
  getUser: (): Promise<User> => api.get<User>('/user').then(res => res.data),
  getWallet: (): Promise<Wallet> => api.get<Wallet>('/wallet').then(res => res.data),
  getTransactions: (): Promise<Transaction[]> =>
    api.get<Transaction[]>('/transactions').then(res => res.data),
};
