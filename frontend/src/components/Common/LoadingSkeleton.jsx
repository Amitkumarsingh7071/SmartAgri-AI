import React from 'react';

export const CardSkeleton = () => (
  <div className="glass-panel p-6 rounded-2xl animate-pulse-slow">
    <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
    <div className="h-10 w-2/3 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
    <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="glass-panel p-6 rounded-2xl animate-pulse-slow">
    <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
    <div className="h-48 w-full bg-gray-300 dark:bg-gray-600 rounded-xl mb-4"></div>
    <div className="flex gap-4">
      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  </div>
);

export const TableSkeleton = () => (
  <div className="glass-panel p-6 rounded-2xl animate-pulse-slow">
    <div className="flex justify-between items-center mb-6">
      <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-10 w-32 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
    </div>
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-4 items-center border-b border-gray-100 dark:border-gray-800 pb-3">
          <div className="h-10 w-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 w-1/4 bg-gray-100 dark:bg-gray-800 rounded"></div>
          </div>
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

export const FormSkeleton = () => (
  <div className="glass-panel p-6 rounded-2xl animate-pulse-slow space-y-6">
    <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-10 w-full bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
        </div>
      ))}
    </div>
    <div className="h-12 w-32 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
  </div>
);

const LoadingSkeleton = {
  Card: CardSkeleton,
  Chart: ChartSkeleton,
  Table: TableSkeleton,
  Form: FormSkeleton
};

export default LoadingSkeleton;
