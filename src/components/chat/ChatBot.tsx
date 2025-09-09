'use client'

import { useState } from 'react'
import ChatList from './ChatList'
import ChatInterface from './ChatInterface'
import InputBar from './InputBar'
import { trpc } from '@/trpc/client'
import toast from 'react-hot-toast'

interface ChatBotProps {
  userId: string
  onUserNotFound?: () => void
  selectedChatId: string | null
  onChatCreated: (chatId: string) => void
  initialMessage?: string
  isDarkMode?: boolean
}

export default function ChatBot({ userId, onUserNotFound, selectedChatId, onChatCreated, initialMessage, isDarkMode }: ChatBotProps) {
  const [inputValue, setInputValue] = useState('')
  const [currentInitialMessage, setCurrentInitialMessage] = useState<string | undefined>(initialMessage)

  const createChatMutation = trpc.createChat.useMutation({
    onSuccess: (newChat) => {
      onChatCreated(newChat.id)
      toast.success('New chat created!')
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handlePromptClick = (prompt: string) => {
    if (userId) {
      // Set the initial message before creating the chat
      setCurrentInitialMessage(prompt)
      createChatMutation.mutate({ 
        userId, 
        title: prompt.length > 30 ? prompt.substring(0, 30) + '...' : prompt
      })
    }
  }

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && userId) {
      setCurrentInitialMessage(inputValue)
      createChatMutation.mutate({ 
        userId, 
        title: inputValue.length > 30 ? inputValue.substring(0, 30) + '...' : inputValue
      })
      setInputValue('')
    }
  }


  return (
    <div className={`h-full transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
        {selectedChatId ? (
          <ChatInterface
            chatId={selectedChatId}
            userId={userId}
            initialMessage={currentInitialMessage}
            isDarkMode={isDarkMode}
          />
        ) : (
        <div className="h-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="text-center max-w-2xl w-full">
            <h2 className={`text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 ${isDarkMode ? 'text-purple-100' : 'text-gray-900'}`}>
              Welcome to Career Bot
              </h2>
            <p className={`text-lg sm:text-xl mb-2 ${isDarkMode ? 'text-purple-200' : 'text-gray-600'}`}>
              Your AI Career Advisor
            </p>
            <p className={`mb-6 sm:mb-8 text-sm sm:text-base ${isDarkMode ? 'text-purple-300' : 'text-gray-500'}`}>
              Get personalized career guidance, resume tips, interview prep, and professional development advice. Choose a topic below or ask your own career question.
            </p>
            
            {/* Prompt Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <button 
                onClick={() => handlePromptClick('How to write a compelling resume for tech roles')}
                disabled={createChatMutation.isPending}
                className={`p-3 sm:p-4 border rounded-lg text-left hover:border-[#CCFF01] transition-colors disabled:opacity-50 ${isDarkMode ? 'border-purple-700 hover:bg-purple-900' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded flex items-center justify-center ${isDarkMode ? 'bg-purple-800' : 'bg-gray-100'}`}>
                    <span className={`text-sm sm:text-base ${isDarkMode ? 'text-purple-200' : 'text-gray-600'}`}>📝</span>
                  </div>
                  <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-purple-100' : 'text-gray-800'}`}>Resume writing for tech roles</span>
                </div>
              </button>
              
              <button 
                onClick={() => handlePromptClick('How to prepare for technical interviews')}
                disabled={createChatMutation.isPending}
                className={`p-3 sm:p-4 border rounded-lg text-left hover:border-[#CCFF01] transition-colors disabled:opacity-50 ${isDarkMode ? 'border-purple-700 hover:bg-purple-900' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded flex items-center justify-center ${isDarkMode ? 'bg-purple-800' : 'bg-gray-100'}`}>
                    <span className={`text-sm sm:text-base ${isDarkMode ? 'text-purple-200' : 'text-gray-600'}`}>🎯</span>
                  </div>
                  <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-purple-100' : 'text-gray-800'}`}>Technical interview prep</span>
                </div>
              </button>
              
              <button 
                onClick={() => handlePromptClick('How to negotiate salary and benefits')}
                disabled={createChatMutation.isPending}
                className={`p-3 sm:p-4 border rounded-lg text-left hover:border-[#CCFF01] transition-colors disabled:opacity-50 ${isDarkMode ? 'border-purple-700 hover:bg-purple-900' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded flex items-center justify-center ${isDarkMode ? 'bg-purple-800' : 'bg-gray-100'}`}>
                    <span className={`text-sm sm:text-base ${isDarkMode ? 'text-purple-200' : 'text-gray-600'}`}>💰</span>
                  </div>
                  <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-purple-100' : 'text-gray-800'}`}>Salary negotiation</span>
                </div>
              </button>
              
              <button 
                onClick={() => handlePromptClick('How to build a professional network')}
                disabled={createChatMutation.isPending}
                className={`p-3 sm:p-4 border rounded-lg text-left hover:border-[#CCFF01] transition-colors disabled:opacity-50 ${isDarkMode ? 'border-purple-700 hover:bg-purple-900' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded flex items-center justify-center ${isDarkMode ? 'bg-purple-800' : 'bg-gray-100'}`}>
                    <span className={`text-sm sm:text-base ${isDarkMode ? 'text-purple-200' : 'text-gray-600'}`}>🤝</span>
                  </div>
                  <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-purple-100' : 'text-gray-800'}`}>Professional networking</span>
                </div>
              </button>
            </div>
            
            {/* Input Field */}
            <form onSubmit={handleInputSubmit} className="w-full">
              <InputBar
                value={inputValue}
                onChange={setInputValue}
                onSubmit={handleInputSubmit}
                disabled={createChatMutation.isPending}
                isDarkMode={isDarkMode}
                placeholder="Ask about your career..."
              />
            </form>
            </div>
          </div>
        )}
    </div>
  )
}
