import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Transaction } from "@/types/finance";
import { DeleteTransactionDialog } from "./DeleteTransactionDialog";

interface TransactionsTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => Promise<void>;
  onEdit: (transaction: Transaction) => void;
}

export function TransactionsTable({ transactions, onDelete, onEdit }: TransactionsTableProps) {
  const { formatCurrency } = useCurrency();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Unit Cost</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions?.map((record) => (
          <TableRow key={record.id}>
            <TableCell className="font-mono">
              {new Date(record.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell className="font-mono capitalize">{record.type}</TableCell>
            <TableCell className="font-mono capitalize">
              {record.category.split('_').join(' ')}
            </TableCell>
            <TableCell className="font-mono">{record.description}</TableCell>
            <TableCell className="font-mono">
              {formatCurrency(record.unit_cost || 0)}
            </TableCell>
            <TableCell className="font-mono">{record.quantity || 0}</TableCell>
            <TableCell className="font-mono">
              {formatCurrency(record.amount)}
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onEdit(record)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <DeleteTransactionDialog onDelete={() => onDelete(record.id)} />
              </div>
            </TableCell>
          </TableRow>
        ))}
        {!transactions?.length && (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-4">
              No transactions found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}