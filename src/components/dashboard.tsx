import { NavigationMenu } from '@/components/navigation-menu';
import { TransactionGrid } from '@/components/TransactionGrid';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store';
import { Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FilterModal, type FilterFormType } from './filter-modal';

import { RevenueChart } from './revenue-chart';
import { Sidebar } from './sidebar';

function Dashboard() {
  const {
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

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);

  // Combine loading states
  const isLoading = isLoadingUser || isLoadingWallet || isLoadingTransactions;

  // Combine error states
  const error = userError || walletError || transactionsError;

  useEffect(() => {
    // Fetch all data when the component mounts
    fetchUser();
    fetchWallet();
    fetchTransactions();
  }, []);

  useEffect(() => {
    // Update filtered transactions when transactions change
    setFilteredTransactions(transactions);
  }, [transactions]);

  const handleFilter = (filters: FilterFormType) => {
    // Apply filters to transactions
    let filteredTransactions = [...transactions];

    // Filter by transaction type
    if (filters.transactionTypes && filters.transactionTypes.length > 0) {
      filteredTransactions = filteredTransactions.filter(transaction =>
        filters.transactionTypes?.includes(transaction.type)
      );
    }

    // Filter by status
    if (filters.status && filters.status.length > 0) {
      filteredTransactions = filteredTransactions.filter(transaction =>
        filters.status?.includes(transaction.status)
      );
    }

    // Filter by date range
    if (filters.dateRange?.from || filters.dateRange?.to) {
      filteredTransactions = filteredTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        const fromDate = filters.dateRange?.from;
        const toDate = filters.dateRange?.to;

        if (fromDate && toDate) {
          return transactionDate >= fromDate && transactionDate <= toDate;
        } else if (fromDate) {
          return transactionDate >= fromDate;
        } else if (toDate) {
          return transactionDate <= toDate;
        }

        return true;
      });
    }

    setFilteredTransactions(filteredTransactions);
    setIsFilterModalOpen(false);
  };

  const retry = () => {
    fetchUser();
    fetchWallet();
    fetchTransactions();
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <Button onClick={retry}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      {/* Header */}
      <NavigationMenu />
      {/* sidebar */}
      <Sidebar />
      {/* Main Content */}
      <main className=" max-w-7xl mx-auto  sm:my-16">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
          <div className="col-span-4">
            <div className="mt-8 md:mt-0 flex flex-col md:flex-row items-center gap-6">
              <div className="">
                <div>Available Balance</div>
                <div className="text-4xl font-bold text-gray-900">
                  USD {wallet?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <Button variant="default" className=" px-20 font-semibold text-md py-6">
                Withdraw
              </Button>
            </div>
            <RevenueChart
              data={transactions?.map(t => ({ name: t.date, value: t.amount })) || []}
            />
          </div>
          <div className="flex flex-col col-span-2 space-y-4 md:space-y-6 px-4 md:px-0">
            {/* Available Balance */}
            <div className="">
              <div className="flex  items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">Available Balance</h3>
                <Info className="w-4 h-4 text-gray-400" />
              </div>
              <div className="space-y-1">
                {isLoading ? (
                  <div className="h-7 w-32 bg-gray-200 rounded animate-pulse" />
                ) : (
                  <p className="text-4xl font-bold text-gray-900">
                    USD {wallet?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                )}
              </div>
            </div>
            {/* Total Payout */}
            <div className="">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">Total Payout</h3>
                <Info className="w-4 h-4 text-gray-400" />
              </div>
              <div className="space-y-1">
                {isLoading ? (
                  <div className="h-7 w-32 bg-gray-200 rounded animate-pulse" />
                ) : (
                  <p className="text-4xl font-bold text-gray-900">
                    USD{' '}
                    {wallet?.total_payout?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                )}
              </div>
            </div>

            {/* Total Revenue */}
            <div className="">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
                <Info className="w-4 h-4 text-gray-400" />
              </div>
              <div className="space-y-1">
                {isLoading ? (
                  <div className="h-7 w-32 bg-gray-200 rounded animate-pulse" />
                ) : (
                  <p className="text-4xl font-bold text-gray-900">
                    USD{' '}
                    {wallet?.total_revenue?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                )}
              </div>
            </div>

            {/* Pending Payout */}
            <div className="">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">Pending Payout</h3>
                <Info className="w-4 h-4 text-gray-400" />
              </div>
              <div className="space-y-1">
                {isLoading ? (
                  <div className="h-7 w-32 bg-gray-200 rounded animate-pulse" />
                ) : (
                  <p className="text-4xl font-bold text-gray-900">
                    USD{' '}
                    {wallet?.pending_payout?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <TransactionGrid
          title={`${filteredTransactions?.length || 0} Transactions`}
          description="Your transactions for the last 7 days"
          data={filteredTransactions || []}
          onFilter={() => setIsFilterModalOpen(true)}
          isLoading={isLoading}
        />
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApplyFilters={handleFilter}
        />
      </main>
    </div>
  );
}

export default Dashboard;
