import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { endOfDay, format, startOfDay, startOfMonth, subDays, subMonths } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: z.infer<typeof FilterFormSchema>) => void;
}

// Define transaction type options
const transactionTypeOptions = [
  { value: 'store-transactions', label: 'Store Transactions' },
  { value: 'get-tipped', label: 'Get Tipped' },
  { value: 'withdrawals', label: 'Withdrawals' },
  { value: 'chargebacks', label: 'Chargebacks' },
  { value: 'cashbacks', label: 'Cashbacks' },
  { value: 'refer-and-earn', label: 'Refer & Earn' },
];

// Define status options
const statusOptions = [
  { value: 'successful', label: 'Successful' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
];

// Define date presets
type DatePreset = 'today' | 'last7days' | 'thismonth' | 'last3months' | 'custom';

// Define the form schema with Zod
const FilterFormSchema = z.object({
  transactionTypes: z.array(z.string()).optional(),
  status: z.array(z.string()).optional(),
  dateRange: z.object({
    preset: z.enum(['today', 'last7days', 'thismonth', 'last3months', 'custom']).optional(),
    from: z.date().optional(),
    to: z.date().optional(),
  }),
});
export type FilterFormType = z.infer<typeof FilterFormSchema>
export const FilterModal = ({ isOpen, onClose, onApplyFilters }: FilterModalProps) => {
  const [activePreset, setActivePreset] = useState<DatePreset | null>(null);

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<FilterFormType>({
    resolver: zodResolver(FilterFormSchema),
    defaultValues: {
      transactionTypes: [],
      status: [],
      dateRange: {
        preset: undefined,
        from: undefined,
        to: undefined,
      },
    },
  });

  // Handle form submission
  const onSubmit = (data: z.infer<typeof FilterFormSchema>) => {
    onApplyFilters(data);
    onClose();
  };

  // Handle clearing filters
  const handleClearFilters = () => {
    form.reset({
      transactionTypes: [],
      status: [],
      dateRange: {
        preset: undefined,
        from: undefined,
        to: undefined,
      },
    });
    setActivePreset(null);
    onApplyFilters(form.getValues());
  };

  // Apply date preset
  const applyDatePreset = (preset: DatePreset) => {
    setActivePreset(preset);

    const today = new Date();
    let fromDate: Date | undefined;
    let toDate: Date | undefined = endOfDay(today);

    switch (preset) {
      case 'today':
        fromDate = startOfDay(today);
        break;
      case 'last7days':
        fromDate = startOfDay(subDays(today, 6));
        break;
      case 'thismonth':
        fromDate = startOfDay(startOfMonth(today));
        break;
      case 'last3months':
        fromDate = startOfDay(subMonths(today, 3));
        break;
      default:
        fromDate = undefined;
        toDate = undefined;
    }

    form.setValue('dateRange', {
      preset,
      from: fromDate,
      to: toDate,
    });
  };

  // Reset active preset when date is manually selected
  useEffect(() => {
    const subscription = form.watch((_, { name }) => {
      if (name?.startsWith('dateRange.') && name !== 'dateRange.preset' && activePreset) {
        setActivePreset(null);
        form.setValue('dateRange.preset', undefined);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, activePreset]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Filter</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Date Range Tabs */}
            <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 sm:space-x-2">
              <Button
                type="button"
                variant={activePreset === 'today' ? 'default' : 'outline'}
                size="sm"
                className="text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
                onClick={() => applyDatePreset('today')}
              >
                Today
              </Button>
              <Button
                type="button"
                variant={activePreset === 'last7days' ? 'default' : 'outline'}
                size="sm"
                className="text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
                onClick={() => applyDatePreset('last7days')}
              >
                Last 7 days
              </Button>
              <Button
                type="button"
                variant={activePreset === 'thismonth' ? 'default' : 'outline'}
                size="sm"
                className="text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
                onClick={() => applyDatePreset('thismonth')}
              >
                This month
              </Button>
              <Button
                type="button"
                variant={activePreset === 'last3months' ? 'default' : 'outline'}
                size="sm"
                className="text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
                onClick={() => applyDatePreset('last3months')}
              >
                Last 3 months
              </Button>
            </div>

            {/* Date Range Picker */}
            <div className="space-y-2">
              <Label className="text-sm">Date Range</Label>
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <FormField
                  control={form.control}
                  name="dateRange.from"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'text-xs sm:text-sm h-9 w-full justify-start text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, 'PPP') : <span>Start date</span>}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateRange.to"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'text-xs sm:text-sm h-9 w-full justify-start text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, 'PPP') : <span>End date</span>}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Transaction Type */}
            <FormField
              control={form.control}
              name="transactionTypes"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm">Transaction Type</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={transactionTypeOptions}
                      value={field.value || []}
                      onValueChange={field.onChange}
                      placeholder="Select transaction types"
                      className="text-xs sm:text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm">Status</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={statusOptions}
                      value={field.value || []}
                      onValueChange={field.onChange}
                      placeholder="Select status"
                      className="text-xs sm:text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="mt-6">
              <div className="flex justify-between w-full gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearFilters}
                  className="text-xs w-full sm:text-sm h-9"
                >
                  Clear
                </Button>
                <Button type="submit" className="text-xs w-full sm:text-sm h-9">
                  Apply Filter
                </Button>
              </div>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
