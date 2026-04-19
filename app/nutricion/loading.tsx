import ProductCardSkeleton from '@/components/store/ProductCardSkeleton'
import Skeleton from '@/components/store/Skeleton'

export default function LoadingNutricion() {
  return (
    <div className="page-shell">
      <section className="page-hero p-6 sm:p-8">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="mt-3 h-12 w-3/4 rounded-2xl" />
        <Skeleton className="mt-3 h-5 w-full rounded-lg" />
        <Skeleton className="mt-6 h-12 w-full rounded-2xl" />
      </section>

      <div className="mt-6 flex gap-2 overflow-hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-24 rounded-full" />
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}