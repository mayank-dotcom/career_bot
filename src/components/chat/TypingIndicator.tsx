'use client'

import { Card } from '@/components/ui/card'
import { Bot } from 'lucide-react'

export function TypingIndicator() {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
        <Bot className="w-4 h-4 text-gray-600" />
      </div>
      <Card className="bg-gray-100 text-gray-900 px-4 py-2 rounded-2xl rounded-bl-md">
        <div className="flex items-center space-x-1">
          <span className="text-sm">AI is typing</span>
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </Card>
    </div>
  )
}
