import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 w-full animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-4 w-[350px] max-w-full" />
        </div>
        <Skeleton className="h-10 w-[140px]" />
      </div>

      {/* Table Skeleton */}
      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="border-b bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[80px]" />
          </div>
        </div>
        <div className="divide-y">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between">
              <Skeleton className="h-5 w-[150px]" />
              <Skeleton className="h-5 w-[120px]" />
              <Skeleton className="h-5 w-[120px]" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function EditorSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 p-8 w-full animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-8 w-[300px]" />
        <Skeleton className="h-4 w-[400px] max-w-full" />
      </div>

      {/* Form Skeleton */}
      <div className="space-y-6 bg-card p-6 rounded-xl border">
        <div className="space-y-2">
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-32 w-full" />
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[140px]" />
        </div>
      </div>
    </div>
  );
}

export function BuilderSkeleton() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] w-full p-8 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[120px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
      </div>

      {/* Two Column Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 flex-1 min-h-0">
        <div className="lg:col-span-2 bg-card rounded-xl border shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b">
            <Skeleton className="h-6 w-[150px]" />
          </div>
          <div className="p-4 space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b flex justify-between">
            <Skeleton className="h-6 w-[100px]" />
            <Skeleton className="h-6 w-[40px]" />
          </div>
          <div className="p-4 space-y-4">
            <Skeleton className="h-10 w-full" />
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
