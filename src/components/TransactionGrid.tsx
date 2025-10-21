import { Button } from '@/components/ui/button';
import type { ColumnDef, ColumnFiltersState, SortingState } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowDownLeft, Download, Filter } from 'lucide-react';
import { useState } from 'react';

export interface Transaction {
  amount: number;
  metadata?: Metadata;
  payment_reference?: string;
  status: string;
  type: string;
  date: string;
}

export interface Metadata {
  name: string;
  type: string;
  email: string;
  quantity: number;
  country: string;
  product_name?: string;
}
interface TransactionGridProps {
  title: string;
  description: string;
  isLoading: boolean;
  data: Transaction[];
  onFilter: () => void;
}

const statusColors = {
  successful: 'text-green-600 bg-green-50',
  pending: 'text-yellow-600 bg-yellow-50',
  failed: 'text-red-600 bg-red-50',
};

export const TransactionGrid = ({
  title,
  description,
  isLoading,
  data,
  onFilter,
}: TransactionGridProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: 'type',
      header: '',
      cell: ({ row }) => {
        const status = row.original.status as keyof typeof statusColors;

        return (
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              {row.original.type === 'withdrawal' ? (
                <ArrowDownLeft className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
              ) : (
                <ArrowDownLeft className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
              )}
            </div>
            <div className="min-w-0">
              <div className="font-medium text-gray-900 text-sm sm:text-base truncate max-w-[150px] sm:max-w-[200px] md:max-w-none">
                {row.original.type === 'withdrawal'
                  ? 'Withdrawal'
                  : row.original.metadata?.product_name || 'No product name'}
              </div>
              <div className="text-xs sm:text-sm text-gray-500">
                {row.original.type === 'withdrawal' ? (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}
                  >
                    {status?.charAt?.(0)?.toUpperCase() + status?.slice(1)}
                  </span>
                ) : (
                  <span className="truncate block max-w-[150px] sm:max-w-[200px] md:max-w-none">
                    {row.original.metadata?.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'amount',
      header: '',
      cell: ({ row }) => {
        const amount = row.original.amount;
        const currencyMap: Record<string, string> = {
          nigeria: 'NGN',
          united_states: 'USD',
          ghana: 'GHS',
          kenya: 'KES',
          south_africa: 'ZAR',
          united_kingdom: 'GBP',
          european_union: 'EUR',
        };
        const currency =
          currencyMap[
            row.original.metadata?.country?.toLowerCase()?.replace(' ', '_') || 'united_states'
          ] || 'USD';
        const formatted = `${currency} ${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
        return (
          <div className="text-right">
            <div className="font-bold text-base sm:text-xl md:text-2xl text-gray-900">
              {formatted}
            </div>
            <div className="text-gray-500 text-xs sm:text-sm">
              {new Date(row.original.date).toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
              })}
            </div>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const handleExport = () => {
    // Implement export logic
    const headers = [
      'Type',
      'Product Name',
      'Customer Name',
      'Status',
      'Amount',
      'Payment Reference',
      'Date',
    ];

    const csvRows: string[] = [];
    csvRows.push(headers.join(','));

    data.forEach(txn => {
      const row = [
        txn.type,
        txn.metadata?.product_name || '',
        txn.metadata?.name || '',
        txn.status,
        txn.amount.toString(),
        txn.payment_reference || '',
        txn.date,
      ];
      csvRows.push(row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','));
    });

    const csvContent = csvRows.join('\n');

    // Add BOM (Byte Order Mark) to ensure proper encoding in Excel
    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csvContent;

    // Create and download the CSV file
    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  if (isLoading) {
    return (
      <div className="bg-white">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-32 mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-9 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-9 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-16 ml-auto"></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[...Array(5)].map((_, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-32 mb-1 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                      </div>
                    </div>
                  </td>
                  <td className=" py-4 whitespace-nowrap">
                    <div className="text-right">
                      <div className="h-6 bg-gray-200 rounded w-24 ml-auto mb-1 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-16 ml-auto animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg">
      <div className="py-4 sm:py-6 border-b border-gray-200 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 self-end sm:self-auto">
            <Button
              variant="outline"
              size="lg"
              onClick={onFilter}
              className="flex items-center gap-3  bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-700"
            >
              <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">Filter</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleExport}
              className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-700"
            >
              <span className="text-xs sm:text-sm">Export list</span>
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="border-0">
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="py-3 px-4 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-8 text-center text-gray-500">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
