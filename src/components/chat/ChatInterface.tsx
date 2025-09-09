'use client'

import { useState, useRef, useEffect } from 'react'
import { trpc } from '@/trpc/client'
import { toast } from 'react-hot-toast'
import { TypingIndicator } from './TypingIndicator'
import { MessageBubble } from './MessageBubble'
import InputBar from './InputBar'
import { parsePDF } from '@/lib/pdfParser'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  createdAt: Date | string
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'error'
}

interface ChatInterfaceProps {
  chatId: string
  userId: string
  initialMessage?: string
  isDarkMode?: boolean
  uploadedPdfData?: string | null
  onPdfDataUsed?: () => void
}

export default function ChatInterface({ chatId, userId, initialMessage, isDarkMode, uploadedPdfData, onPdfDataUsed }: ChatInterfaceProps) {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [pendingMessage, setPendingMessage] = useState<Message | null>(null)
  const [hasSentInitialMessage, setHasSentInitialMessage] = useState(false)
  const [resumeData, setResumeData] = useState<string | null>(uploadedPdfData || null)
  const [isUploading, setIsUploading] = useState(false)
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


  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    try {
      const parsedResume = await parsePDF(file)
      
      // Store the resume data for context
      setResumeData(parsedResume.text)
      
      // Show success message and let user type their own message
      toast.success(`PDF "${parsedResume.fileName}" uploaded successfully! Now type your message.`)
    } catch (error) {
      console.error('Error parsing PDF:', error)
      toast.error('Failed to parse PDF. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  // Update resume data when uploadedPdfData prop changes
  useEffect(() => {
    if (uploadedPdfData) {
      setResumeData(uploadedPdfData)
    }
  }, [uploadedPdfData])

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
      createdAt: new Date(),
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
      // Include PDF content if available
      let finalContent = messageContent
      if (resumeData) {
        finalContent = `[PDF Context: ${resumeData}]\n\nUser Message: ${messageContent}`
        // Clear resume data after sending to avoid sending it again
        setResumeData(null)
        // Notify parent component that PDF data was used
        onPdfDataUsed?.()
      }
      
      await sendMessageMutation.mutateAsync({
        chatId,
        content: finalContent,
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
        {messages?.map((msg: Message) => (
          <MessageBubble key={msg.id} message={msg} isDarkMode={isDarkMode} />
        ))}
        
        {/* Pending message */}
        {pendingMessage && (
          <MessageBubble message={pendingMessage} isDarkMode={isDarkMode} />
        )}
        
        {/* Typing indicator */}
        {isTyping && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className={`p-3 sm:p-4 lg:p-6 border-t transition-colors duration-300 ${isDarkMode ? 'border-slate-700/50 bg-slate-900/20' : 'border-gray-200 bg-white'}`}>
        {/* PDF Upload Indicator */}
        {resumeData && (
          <div className={`mb-3 p-3 rounded-lg border ${isDarkMode ? 'bg-slate-800/50 border-slate-600 text-slate-200' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">PDF uploaded and ready to send with your message</span>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSendMessage}>
          <InputBar
            value={message}
            onChange={setMessage}
            onSubmit={handleSendMessage}
            disabled={sendMessageMutation.isPending || isUploading}
            isDarkMode={isDarkMode}
            placeholder={resumeData ? "Type your message about the PDF..." : "Ask about your career..."}
            onFileUpload={handleFileUpload}
          />
        </form>
      </div>
    </div>
  )
}
