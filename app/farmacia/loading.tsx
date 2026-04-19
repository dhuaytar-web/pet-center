import ProductCardSkeleton from '@/components/store/ProductCardSkeleton'
import Skeleton from '@/components/store/Skeleton'

export default function LoadingFarmacia() {
  return (
    <div className="bg-[#111418] py-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-2xl border border-[#2b3a3f] bg-[#161c21] p-5 sm:p-7">
          <Skeleton className="h-4 w-32 rounded-full bg-[#22303a]" />
          <Skeleton className="mt-3 h-12 w-3/4 rounded-2xl" />
          <Skeleton className="mt-3 h-4 w-full rounded-lg" />
        </section>

        <div className="mt-6 rounded-2xl border border-[#2b3a3f] bg-[#161c21] p-4">
          <Skeleton className="h-12 w-full rounded-lg bg-[#0f1418]" />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} compact />
          ))}
        </div>
      </div>
    </div>
  )
}