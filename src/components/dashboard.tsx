import { NavigationMenu } from '@/components/navigation-menu';
import { TransactionGrid } from '@/components/TransactionGrid';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store';
import { Info } from 'lucide-react';
import { RevenueChart } from './revenue-chart';
import { FilterModal, type FilterState } from './filter-modal';
import { useEffect, useState } from 'react';
import SheetDemo from './sheet-animation-test';

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
  }, [fetchUser, fetchWallet, fetchTransactions]);

  useEffect(() => {
    // Update filtered transactions when transactions change
    setFilteredTransactions(transactions);
  }, [transactions]);

  const handleFilter = (filters: FilterState) => {
    // Apply filters to transactions
    let filtered = [...transactions];

    // Filter by transaction types if any are selected
    if (filters.transactionTypes.length > 0) {
      filtered = filtered.filter(t => filters.transactionTypes.includes(t.type));
    }

    // Filter by status if selected
    if (filters.status) {
      filtered = filtered.filter(t => t.status === filters.status);
    }

    // Filter by amount range
    if (filters.amount.min) {
      filtered = filtered.filter(t => t.amount >= parseFloat(filters.amount.min));
    }
    if (filters.amount.max) {
      filtered = filtered.filter(t => t.amount <= parseFloat(filters.amount.max));
    }

    setFilteredTransactions(filtered);
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
      <SheetDemo />
      {/* Main Content */}
      <main className=" max-w-7xl mx-auto  sm:my-16">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
          <div className="col-span-4">
            <div className="flex gap-2">
              <div className="">
                <div>Available Balance</div>
                <div className="text-4xl font-bold text-gray-900">
                  USD {wallet?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <Button variant="default" className="bg-black hover:bg-black/90 text-white">
                Withdraw
              </Button>
            </div>
            <RevenueChart
              data={transactions?.map(t => ({ name: t.date, value: t.amount })) || []}
            />
          </div>
          <div className="col-span-2 space-y-6">
            {/* Available Balance */}
            <div className="">
              <div className="flex items-center justify-between mb-4">
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
            <button className="bg-blue-500 text-white px-4 py-2 rounded animate-pulse">
              Click Me
            </button>
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
