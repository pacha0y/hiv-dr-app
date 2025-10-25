import clsx from 'clsx';
import React from 'react';

type CardProps = React.HTMLAttributes<HTMLDivElement>;
type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-gray-200 bg-white shadow-sm',
        className
      )}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: CardContentProps) {
  return (
    <div className={clsx('p-4', className)} {...props} />
  );
}
