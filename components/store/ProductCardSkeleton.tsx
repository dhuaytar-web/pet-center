import Skeleton from '@/components/store/Skeleton'

type ProductCardSkeletonProps = {
  compact?: boolean
}

export default function ProductCardSkeleton({ compact = false }: ProductCardSkeletonProps) {
  return (
    <article className={`surface-card flex h-full flex-col rounded-3xl ${compact ? 'p-3.5' : 'p-5'}`}>
      <Skeleton className={`aspect-square ${compact ? 'rounded-xl' : 'rounded-2xl'} border border-[#e5d6c5]`} />
      <div className="mt-4 space-y-3">
        <Skeleton className="h-4 w-3/4 rounded-lg" />
        <Skeleton className="h-3 w-1/2 rounded-lg" />
      </div>
      <div className="mt-auto flex items-center justify-between pt-4">
        <Skeleton className={`${compact ? 'h-4 w-20' : 'h-5 w-24'} rounded-lg`} />
        <Skeleton className={`${compact ? 'h-8 w-20' : 'h-9 w-24'} rounded-xl`} />
      </div>
      <Skeleton className="mt-3 h-10 rounded-xl" />
    </article>
  )
}