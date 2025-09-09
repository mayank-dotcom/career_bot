'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { trpc } from '@/trpc/client'
import { toast } from 'react-hot-toast'
import { Plus, MessageSquare } from 'lucide-react'
import { ChatListSkeleton } from './ChatListSkeleton'

interface Chat {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  messages: Array<{
    id: string
    content: string
    role: string
    createdAt: Date
  }>
}

interface ChatListProps {
  userId: string
  onChatSelect: (chatId: string) => void
  selectedChatId?: string
  onUserNotFound?: () => void
}

export default function ChatList({ userId, onChatSelect, selectedChatId, onUserNotFound }: ChatListProps) {
  const [isCreating, setIsCreating] = useState(false)

  const { data: chats, refetch: refetchChats, error: chatsError, isLoading } = trpc.getChats.useQuery({
    userId,
  }, {
    retry: false, // Don't retry on error
    onError: (error) => {
      if (error.message.includes('not found')) {
        // User not found, trigger logout
        onUserNotFound?.()
      }
    }
  })

  const createChatMutation = trpc.createChat.useMutation({
    onSuccess: (newChat) => {
      refetchChats()
      onChatSelect(newChat.id)
      setIsCreating(false)
      toast.success('New chat created!')
    },
    onError: (error) => {
      toast.error('Failed to create chat: ' + error.message)
      setIsCreating(false)
    },
  })

  const handleCreateChat = async () => {
    setIsCreating(true)
    console.log('Creating chat for userId:', userId)
    try {
      await createChatMutation.mutateAsync({
        userId,
        title: 'New Chat',
      })
    } catch (error) {
      console.error('Error creating chat:', error)
    }
  }

  if (isLoading) {
    return <ChatListSkeleton />
  }

  return (
    <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Button
          onClick={handleCreateChat}
          disabled={isCreating}
          className="w-full"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          {isCreating ? 'Creating...' : 'New Chat'}
        </Button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2">
        {chatsError && (
          <div className="text-center text-red-500 mt-8">
            <p className="text-sm">Error loading chats</p>
            <p className="text-xs mt-1">{chatsError.message}</p>
          </div>
        )}
        {chats?.map((chat: Chat) => (
          <Card
            key={chat.id}
            className={`p-3 mb-2 cursor-pointer transition-colors ${
              selectedChatId === chat.id
                ? 'bg-white border-gray-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => onChatSelect(chat.id)}
          >
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-gray-900 dark:text-white">{chat.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {chat.messages.length} messages
                </p>
              </div>
            </div>
          </Card>
        ))}
        {chats?.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No chats yet</p>
            <p className="text-sm">Create your first chat to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}
