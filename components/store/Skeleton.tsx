type SkeletonProps = {
  className?: string
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse rounded-2xl bg-[linear-gradient(90deg,#ece7e1_0%,#f7f3ec_50%,#ece7e1_100%)] ${className}`} />
}