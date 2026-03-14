import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

function CardRoot({ children, className }: CardProps) {
  return (
    <div className={cn('bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm', className)}>
      {children}
    </div>
  );
}

function CardHeader({ children, className }: CardProps) {
  return (
    <div className={cn('px-6 py-4 border-b border-gray-200 dark:border-gray-800', className)}>
      {children}
    </div>
  );
}

function CardBody({ children, className }: CardProps) {
  return <div className={cn('px-6 py-4', className)}>{children}</div>;
}

function CardFooter({ children, className }: CardProps) {
  return (
    <div className={cn('px-6 py-4 border-t border-gray-200 dark:border-gray-800', className)}>
      {children}
    </div>
  );
}

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});
