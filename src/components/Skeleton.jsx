import React from 'react';

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200 dark:bg-slate-800 ${className}`}
      {...props}
    />
  );
};

export const MarketingSkeleton = () => (
  <div className="space-y-5 pb-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white dark:bg-slate-900 p-3.5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Skeleton className="w-7 h-7 rounded-xl" />
            <Skeleton className="h-2 w-12" />
          </div>
          <Skeleton className="h-4 w-8" />
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm h-64">
          <div className="flex justify-between mb-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-12 rounded-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-2 w-20" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Skeleton className="h-14 rounded-xl" />
              <Skeleton className="h-14 rounded-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm h-72">
           <div className="flex items-center gap-3 mb-6">
              <Skeleton className="w-8 h-8 rounded-xl" />
              <Skeleton className="h-4 w-24" />
           </div>
           <Skeleton className="h-24 w-full rounded-xl mb-4" />
           <div className="flex justify-between">
              <Skeleton className="h-2 w-32" />
              <Skeleton className="h-8 w-24 rounded-xl" />
           </div>
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-2 w-20 ml-2" />
        <Skeleton className="w-full aspect-[9/18] rounded-[2.5rem]" />
      </div>
    </div>
  </div>
);

export const AnalyticsSkeleton = () => (
  <div className="space-y-6 pb-8 animate-in fade-in duration-500">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-2 w-32" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-24 rounded-xl" />
        <Skeleton className="h-8 w-24 rounded-xl" />
      </div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white dark:bg-slate-900 p-3.5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <Skeleton className="w-7 h-7 rounded-xl" />
            <Skeleton className="h-2 w-12" />
          </div>
          <Skeleton className="h-5 w-20" />
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm h-64">
        <Skeleton className="h-4 w-32 mb-6" />
        <Skeleton className="h-40 w-full" />
      </div>
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm h-64">
        <Skeleton className="h-4 w-24 mb-6" />
        <div className="flex justify-center mb-6">
          <Skeleton className="w-32 h-32 rounded-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>
    </div>
  </div>
);

export const BillingSkeleton = () => (
  <div className="space-y-6 max-w-6xl mx-auto pb-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
      <div className="lg:col-span-3 h-48 bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
         <div className="space-y-4">
            <div className="flex items-center gap-3">
               <Skeleton className="w-10 h-10 rounded-xl" />
               <div className="space-y-2">
                  <Skeleton className="h-2 w-16" />
                  <Skeleton className="h-4 w-32" />
               </div>
            </div>
            <div className="flex gap-2">
               <Skeleton className="h-9 w-24 rounded-xl" />
               <Skeleton className="h-9 w-24 rounded-xl" />
            </div>
         </div>
         <div className="space-y-2 text-right">
            <Skeleton className="h-2 w-16 ml-auto" />
            <Skeleton className="h-10 w-32 ml-auto" />
         </div>
      </div>
      <div className="h-48 bg-white dark:bg-slate-900 rounded-[2rem] p-5 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
         <div className="flex gap-3">
            <Skeleton className="w-8 h-8 rounded-xl" />
            <Skeleton className="h-4 w-20" />
         </div>
         <Skeleton className="h-16 w-full" />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-5 space-y-6">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-8 w-32" />
          <div className="space-y-3">
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-2 w-2/3" />
          </div>
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      ))}
    </div>
  </div>
);

export const SettingsSkeleton = () => (
  <div className="max-w-6xl mx-auto space-y-5 animate-in fade-in duration-500">
    <div className="flex flex-col md:flex-row gap-5">
      <aside className="w-full md:w-56 space-y-2">
        {[1, 2, 3, 4, 5].map(i => (
          <Skeleton key={i} className="h-11 w-full rounded-xl" />
        ))}
      </aside>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex justify-between mb-4">
            <Skeleton className="h-5 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16 rounded-xl" />
              <Skeleton className="h-8 w-20 rounded-xl" />
            </div>
          </div>
          <div className="space-y-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-2 w-24" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
           <Skeleton className="h-2 w-32 ml-2" />
           <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden h-72">
              <Skeleton className="h-20 w-full" />
              <div className="p-5 text-center space-y-4">
                 <Skeleton className="h-5 w-32 mx-auto" />
                 <Skeleton className="h-3 w-48 mx-auto" />
                 <div className="space-y-2 pt-4">
                    <Skeleton className="h-2 w-full" />
                    <Skeleton className="h-2 w-full" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  </div>
);

export default Skeleton;
