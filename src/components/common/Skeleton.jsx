import React from 'react';

export default function Skeleton({ className = '', variant = 'rectangular' }) {
  const base = 'animate-pulse bg-slate-200/80';
  const variants = {
    circular: 'rounded-full',
    rounded: 'rounded-xl',
    rectangular: 'rounded-lg',
    text: 'rounded h-4',
  };

  return <div className={`${base} ${variants[variant] || variants.rectangular} ${className}`} aria-hidden="true" />;
}

export function CardSkeleton() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="w-10 h-10" variant="rounded" />
        <Skeleton className="w-16 h-5" variant="rounded" />
      </div>
      <Skeleton className="w-24 h-4 mb-2" variant="text" />
      <Skeleton className="w-36 h-8 mb-3" variant="text" />
      <Skeleton className="w-28 h-3.5" variant="text" />
    </div>
  );
}

export function ChartSkeleton({ title = 'Loading visualization...' }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col h-full min-h-[360px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="w-36 h-5 mb-1.5" variant="text" />
          <Skeleton className="w-24 h-3.5" variant="text" />
        </div>
        <Skeleton className="w-20 h-7" variant="rounded" />
      </div>
      <div className="flex-1 flex items-end gap-3 justify-center pb-6">
        <Skeleton className="w-10 h-28" variant="rounded" />
        <Skeleton className="w-10 h-44" variant="rounded" />
        <Skeleton className="w-10 h-32" variant="rounded" />
        <Skeleton className="w-10 h-52" variant="rounded" />
        <Skeleton className="w-10 h-40" variant="rounded" />
        <Skeleton className="w-10 h-48" variant="rounded" />
      </div>
      <div className="flex justify-center gap-6 pt-4 border-t border-slate-100">
        <Skeleton className="w-20 h-4" variant="text" />
        <Skeleton className="w-20 h-4" variant="text" />
      </div>
    </div>
  );
}

export function TransactionsSkeleton() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="w-40 h-5" variant="text" />
        <Skeleton className="w-28 h-4" variant="text" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-3.5">
              <Skeleton className="w-10 h-10" variant="rounded" />
              <div>
                <Skeleton className="w-32 h-4 mb-1.5" variant="text" />
                <Skeleton className="w-20 h-3" variant="text" />
              </div>
            </div>
            <div className="text-right">
              <Skeleton className="w-20 h-4 mb-1.5 ml-auto" variant="text" />
              <Skeleton className="w-14 h-3 ml-auto" variant="text" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BudgetSkeleton() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="w-36 h-5" variant="text" />
        <Skeleton className="w-20 h-4" variant="text" />
      </div>
      <div className="space-y-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="w-24 h-4" variant="text" />
              <Skeleton className="w-28 h-4" variant="text" />
            </div>
            <Skeleton className="w-full h-2.5" variant="rounded" />
            <Skeleton className="w-36 h-3" variant="text" />
          </div>
        ))}
      </div>
    </div>
  );
}
