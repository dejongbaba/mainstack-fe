import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
}

export interface FilterState {
  transactionTypes: string[];
  status: string;
  dateRange: string;
  amount: {
    min: string;
    max: string;
  };
}

export const FilterModal = ({ isOpen, onClose, onApplyFilters }: FilterModalProps) => {
  const [filters, setFilters] = useState<FilterState>({
    transactionTypes: [],
    status: '',
    dateRange: '',
    amount: {
      min: '',
      max: '',
    },
  });

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      transactionTypes: [],
      status: '',
      dateRange: '',
      amount: {
        min: '',
        max: '',
      },
    };
    setFilters(clearedFilters);
    onApplyFilters(clearedFilters);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-bold">Filter</SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* Date Range Tabs */}
          <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 sm:space-x-2">
            <Button
              variant={filters.dateRange === 'today' ? 'default' : 'outline'}
              size="sm"
              className="text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
              onClick={() => setFilters(prev => ({ ...prev, dateRange: 'today' }))}
            >
              Today
            </Button>
            <Button
              variant={filters.dateRange === 'last7days' ? 'default' : 'outline'}
              size="sm"
              className="text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
              onClick={() => setFilters(prev => ({ ...prev, dateRange: 'last7days' }))}
            >
              Last 7 days
            </Button>
            <Button
              variant={filters.dateRange === 'thismonth' ? 'default' : 'outline'}
              size="sm"
              className="text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
              onClick={() => setFilters(prev => ({ ...prev, dateRange: 'thismonth' }))}
            >
              This month
            </Button>
            <Button
              variant={filters.dateRange === 'last3months' ? 'default' : 'outline'}
              size="sm"
              className="text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
              onClick={() => setFilters(prev => ({ ...prev, dateRange: 'last3months' }))}
            >
              Last 3 months
            </Button>
          </div>

          {/* Date Range Picker */}
          <div className="space-y-2">
            <Label className="text-sm">Date Range</Label>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div>
                <Label htmlFor="start-date" className="sr-only">
                  Start Date
                </Label>
                <Select>
                  <SelectTrigger className="text-xs sm:text-sm h-9">
                    <SelectValue placeholder="17 Jul 2023" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023-07-17">17 Jul 2023</SelectItem>
                    <SelectItem value="2023-07-16">16 Jul 2023</SelectItem>
                    <SelectItem value="2023-07-15">15 Jul 2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="end-date" className="sr-only">
                  End Date
                </Label>
                <Select>
                  <SelectTrigger className="text-xs sm:text-sm h-9">
                    <SelectValue placeholder="17 Aug 2023" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023-08-17">17 Aug 2023</SelectItem>
                    <SelectItem value="2023-08-16">16 Aug 2023</SelectItem>
                    <SelectItem value="2023-08-15">15 Aug 2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transaction-type" className="text-sm">Transaction Type</Label>
            <div className="border rounded-md p-2">
              <div className="text-xs sm:text-sm text-gray-500 mb-2">
                {filters.transactionTypes.length === 0 
                  ? 'Select transaction types' 
                  : `${filters.transactionTypes.length} types selected`}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: 'store-transactions', label: 'Store Transactions' },
                  { id: 'get-tipped', label: 'Get Tipped' },
                  { id: 'withdrawals', label: 'Withdrawals' },
                  { id: 'chargebacks', label: 'Chargebacks' },
                  { id: 'cashbacks', label: 'Cashbacks' },
                  { id: 'refer-and-earn', label: 'Refer & Earn' }
                ].map(type => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <div 
                      className={`w-4 h-4 sm:w-5 sm:h-5 rounded border flex items-center justify-center cursor-pointer ${filters.transactionTypes.includes(type.id) ? 'bg-black border-black' : 'border-gray-300'}`}
                      onClick={() => {
                        setFilters(prev => {
                          const newTypes = prev.transactionTypes.includes(type.id)
                            ? prev.transactionTypes.filter(t => t !== type.id)
                            : [...prev.transactionTypes, type.id];
                          return { ...prev, transactionTypes: newTypes };
                        });
                      }}
                    >
                      {filters.transactionTypes.includes(type.id) && <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />}
                    </div>
                    <span className="text-xs sm:text-sm">{type.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm">Status</Label>
            <Select
              value={filters.status}
              onValueChange={value => setFilters(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger className="text-xs sm:text-sm h-9">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="successful">Successful</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm">Amount</Label>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div>
                <Label htmlFor="min-amount" className="sr-only">
                  Min Amount
                </Label>
                <Input
                  id="min-amount"
                  placeholder="Min"
                  className="text-xs sm:text-sm h-9"
                  value={filters.amount.min}
                  onChange={e =>
                    setFilters(prev => ({
                      ...prev,
                      amount: { ...prev.amount, min: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="max-amount" className="sr-only">
                  Max Amount
                </Label>
                <Input
                  id="max-amount"
                  placeholder="Max"
                  className="text-xs sm:text-sm h-9"
                  value={filters.amount.max}
                  onChange={e =>
                    setFilters(prev => ({
                      ...prev,
                      amount: { ...prev.amount, max: e.target.value },
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="mt-6">
          <div className="flex justify-between w-full gap-4">
            <Button variant="outline" onClick={handleClearFilters} className="text-xs sm:text-sm h-9">
              Clear
            </Button>
            <Button onClick={() => onApplyFilters(filters)} className="text-xs sm:text-sm h-9">
              Apply Filter
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
