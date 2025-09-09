'use client'

import { useState, useRef, useEffect } from 'react'
import { trpc } from '@/trpc/client'
import { toast } from 'react-hot-toast'
import { TypingIndicator } from './TypingIndicator'
import { MessageBubble } from './MessageBubble'
import InputBar from './InputBar'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  createdAt: Date | string
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'error' | null
}

interface ChatInterfaceProps {
  chatId: string
  userId: string
  initialMessage?: string
  isDarkMode?: boolean
}

export default function ChatInterface({ chatId, userId, initialMessage, isDarkMode }: ChatInterfaceProps) {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [pendingMessage, setPendingMessage] = useState<Message | null>(null)
  const [hasSentInitialMessage, setHasSentInitialMessage] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: messages, refetch: refetchMessages } = trpc.getMessages.useQuery({
    chatId,
  })

  const sendMessageMutation = trpc.sendMessage.useMutation({
    onSuccess: (data) => {
      setMessage('')
      setIsTyping(false)
      
      
      // Clear pending message and refresh
      setPendingMessage(null)
      refetchMessages()
      toast.success('Message sent!')
    },
    onError: (error) => {
      setPendingMessage(prev => prev ? { ...prev, status: 'error' } : null)
      setIsTyping(false)
      toast.error('Failed to send message: ' + error.message)
    },
  })




  // Auto-send initial message if provided and no messages exist yet
  useEffect(() => {
    if (initialMessage && !hasSentInitialMessage && messages && messages.length === 0) {
      setMessage(initialMessage)
      setHasSentInitialMessage(true)
      // Trigger the send message after a short delay to ensure the component is ready
      setTimeout(() => {
        handleSendMessage({ preventDefault: () => {} } as React.FormEvent)
      }, 100)
    }
  }, [initialMessage, hasSentInitialMessage, messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || sendMessageMutation.isPending) return

    const messageContent = message.trim()
    const messageId = `temp-${Date.now()}`
    
    // Create pending message
    const tempMessage: Message = {
      id: messageId,
      content: messageContent,
      role: 'user',
      createdAt: new Date().toISOString(),
      status: 'sending'
    }
    
    setPendingMessage(tempMessage)
    setMessage('')
    setIsTyping(true)

    // Simulate realistic timing - these will update the pending message
    setTimeout(() => setPendingMessage(prev => prev ? { ...prev, status: 'sent' } : null), 300 + Math.random() * 200)
    setTimeout(() => setPendingMessage(prev => prev ? { ...prev, status: 'delivered' } : null), 800 + Math.random() * 400)
    setTimeout(() => setPendingMessage(prev => prev ? { ...prev, status: 'read' } : null), 2000 + Math.random() * 1000)

    try {
      await sendMessageMutation.mutateAsync({
        chatId,
        content: messageContent,
        userId,
      })
    } catch (error) {
      console.error('Error sending message:', error)
      setPendingMessage(prev => prev ? { ...prev, status: 'error' } : null)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
        {messages?.map((msg: any) => (
          <MessageBubble key={msg.id} message={{
            ...msg,
            role: msg.role as 'user' | 'assistant',
            status: msg.status as 'sending' | 'sent' | 'delivered' | 'read' | 'error' | undefined
          }} isDarkMode={isDarkMode} />
        ))}
        
        {/* Pending message */}
        {pendingMessage && (
          <MessageBubble message={{
            ...pendingMessage,
            status: pendingMessage.status as 'sending' | 'sent' | 'delivered' | 'read' | 'error' | undefined
          }} isDarkMode={isDarkMode} />
        )}
        
        {/* Typing indicator */}
        {isTyping && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className={`p-3 sm:p-4 lg:p-6 border-t transition-colors duration-300 ${isDarkMode ? 'border-slate-700/50 bg-slate-900/20' : 'border-gray-200 bg-white'}`}>
        <form onSubmit={handleSendMessage}>
          <InputBar
            value={message}
            onChange={setMessage}
            onSubmit={handleSendMessage}
            disabled={sendMessageMutation.isPending}
            isDarkMode={isDarkMode}
            placeholder="Ask about your career..."
          />
        </form>
      </div>
    </div>
  )
}
