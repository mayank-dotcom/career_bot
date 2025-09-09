'use client'

import { Check, CheckCheck, Clock, AlertCircle } from 'lucide-react'

interface MessageStatusProps {
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'error'
  timestamp?: Date | string
}

export function MessageStatus({ status, timestamp }: MessageStatusProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-gray-400 animate-pulse" />
      case 'sent':
        return <Check className="w-3 h-3 text-blue-500" />
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-blue-500" />
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-500" />
      default:
        return null
    }
  }

  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  return (
    <div className="flex items-center justify-end gap-1 mt-1">
      {timestamp && (
        <span className="text-xs text-gray-500 opacity-70">
          {formatTime(timestamp)}
        </span>
      )}
      <div className="flex items-center">
        {getStatusIcon()}
      </div>
    </div>
  )
}
