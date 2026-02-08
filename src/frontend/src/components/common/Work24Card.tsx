import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Work24CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Work24Card({ children, className, onClick }: Work24CardProps) {
  return (
    <Card
      className={cn(
        'overflow-hidden transition-all duration-300 hover:shadow-medium',
        onClick && 'cursor-pointer hover:scale-[1.02]',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
}
