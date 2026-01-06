import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* Hero Section Skeleton */}
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-6 text-center">
        <Skeleton className="h-16 w-3/4 max-w-lg rounded-lg" />
        <Skeleton className="h-6 w-1/2 max-w-md rounded-md" />
        <div className="mt-10 flex gap-4">
          <Skeleton className="h-11 w-32 rounded-md" />
          <Skeleton className="h-11 w-24 rounded-md" />
        </div>
      </div>

      {/* Posts Section Skeleton */}
      <div className="py-20">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-8 w-32 rounded-md" />
          <Skeleton className="h-5 w-20 rounded-md" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="aspect-video w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-2/3 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
