import { cn } from '@/lib/utils';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className }: TableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn('w-full text-sm text-left', className)}>{children}</table>
    </div>
  );
}

Table.Head = function TableHead({ children }: TableProps) {
  return <thead className="bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{children}</thead>;
};

Table.Body = function TableBody({ children }: TableProps) {
  return <tbody className="divide-y divide-gray-200 dark:divide-gray-800">{children}</tbody>;
};

Table.Row = function TableRow({ children, className, ...props }: TableProps & React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn('hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors', className)} {...props}>{children}</tr>;
};

Table.Th = function TableTh({ children, className, ...props }: TableProps & React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn('px-4 py-3 font-medium', className)} {...props}>{children}</th>;
};

Table.Td = function TableTd({ children, className, ...props }: TableProps & React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('px-4 py-3 text-gray-700 dark:text-gray-300', className)} {...props}>{children}</td>;
};
