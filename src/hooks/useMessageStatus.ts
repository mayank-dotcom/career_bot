'use client'

import { useState, useCallback } from 'react'

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'error'

interface UseMessageStatusReturn {
  status: MessageStatus
  updateStatus: (newStatus: MessageStatus) => void
  simulateProgression: (messageId: string) => void
}

export function useMessageStatus(initialStatus: MessageStatus = 'sending'): UseMessageStatusReturn {
  const [status, setStatus] = useState<MessageStatus>(initialStatus)

  const updateStatus = useCallback((newStatus: MessageStatus) => {
    setStatus(newStatus)
  }, [])

  const simulateProgression = useCallback((messageId: string) => {
    // Simulate network delay for "sent" status
    setTimeout(() => {
      setStatus('sent')
    }, 300 + Math.random() * 200) // 300-500ms

    // Simulate delivery to server
    setTimeout(() => {
      setStatus('delivered')
    }, 800 + Math.random() * 400) // 800-1200ms

    // Simulate AI "reading" the message
    setTimeout(() => {
      setStatus('read')
    }, 2000 + Math.random() * 1000) // 2-3 seconds
  }, [])

  return {
    status,
    updateStatus,
    simulateProgression
  }
}
