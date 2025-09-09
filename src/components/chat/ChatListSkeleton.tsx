'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export function ChatListSkeleton() {
  return (
    <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Skeleton className="h-8 w-full" />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-3">
            <div className="flex items-center space-x-2">
              <Skeleton className="w-4 h-4 rounded" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
