import React from "react"

const cardBaseClasses =
  "flex w-[320px] shrink-0 flex-col overflow-hidden rounded-3xl border border-border/40 bg-card/50 text-left shadow-sm"

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-muted/30 ${className}`} />
}

export function GamesSectionSkeleton() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-[110rem] px-8 md:px-16">
        <div className="space-y-4">
          <SkeletonBlock className="h-8 w-56" />
          <SkeletonBlock className="h-4 w-80" />
        </div>
        <div className="mt-8 flex gap-5 overflow-hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className={cardBaseClasses}>
              <SkeletonBlock className="h-48 w-full rounded-none" />
              <div className="space-y-3 p-5">
                <SkeletonBlock className="h-5 w-48" />
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-5/6" />
                <div className="flex gap-2">
                  <SkeletonBlock className="h-6 w-20 rounded-full" />
                  <SkeletonBlock className="h-4 w-24 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function PortfolioSectionSkeleton() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-[110rem] px-8 md:px-16">
        <div className="space-y-4">
          <SkeletonBlock className="h-8 w-48" />
          <SkeletonBlock className="h-4 w-72" />
        </div>
        <div className="mt-8 flex gap-5 overflow-hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className={cardBaseClasses}>
              <SkeletonBlock className="h-48 w-full rounded-none" />
              <div className="space-y-3 p-5">
                <SkeletonBlock className="h-5 w-52" />
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-4/5" />
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 3 }).map((__, tagIndex) => (
                    <SkeletonBlock key={tagIndex} className="h-6 w-20 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
