'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { trpc } from '@/trpc/client'
import { toast } from 'react-hot-toast'
import ChatBot from '@/components/chat/ChatBot'
import AuthForm from '@/components/auth/AuthForm'
import { Bot, User, Plus, Menu, X, Moon, Sun } from 'lucide-react'

// Type for the authenticated user
type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  isSubscribed: boolean;
}

export default function Home() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isValidating, setIsValidating] = useState(true)
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [initialMessage, setInitialMessage] = useState<string | undefined>(undefined)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // tRPC queries and mutations
  const { data: chats, refetch: refetchChats } = trpc.getChats.useQuery(
    { userId: user?.id || '' },
    { enabled: !!user?.id }
  )

  const createChatMutation = trpc.createChat.useMutation({
    onSuccess: (newChat) => {
      setSelectedChatId(newChat.id)
      refetchChats()
      toast.success('New chat created!')
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const validateExistingSession = () => {
      const savedToken = localStorage.getItem('authToken')
      const savedUser = localStorage.getItem('userData')
      
      if (savedToken && savedUser) {
        try {
          // Parse saved user data
          const userData = JSON.parse(savedUser)
          setUser(userData)
          setIsLoggedIn(true)
        } catch (error) {
          // Invalid saved data, clear localStorage
          localStorage.removeItem('authToken')
          localStorage.removeItem('userData')
        }
      }
      setIsValidating(false)
    }

    validateExistingSession()
  }, [])

  const handleAuthSuccess = (userData: AuthUser, token: string) => {
    setUser(userData)
    setIsLoggedIn(true)
    localStorage.setItem('authToken', token)
    localStorage.setItem('userData', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    setIsLoggedIn(false)
    setSelectedChatId(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    toast.success('Logged out successfully')
  }

  const handleNewChat = () => {
    if (user?.id) {
      createChatMutation.mutate({ userId: user.id })
    }
  }

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId)
  }

  const handleChatCreated = (chatId: string) => {
    setSelectedChatId(chatId)
    refetchChats()
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  // Show loading state while validating session
  if (isValidating) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#CCFF01] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Bot className="w-8 h-8 text-black" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show auth form if not logged in
  if (!isLoggedIn) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />
  }

  return (
    <div className={`h-screen flex transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm z-20 sm:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Glow Effect */}
      {isSidebarOpen && (
        <div 
          className="absolute left-0 sm:left-72 lg:left-80 top-0 w-96 sm:w-20 h-full pointer-events-none z-10"
          style={{
            background: isDarkMode 
              ? 'linear-gradient(90deg, rgba(100, 116, 139, 0.3) 0%, rgba(100, 116, 139, 0.15) 50%, transparent 100%)'
              : 'linear-gradient(90deg, rgba(204, 255, 1, 0.4) 0%, rgba(204, 255, 1, 0.2) 50%, transparent 100%)'
          }}
        />
      )}
      
      {/* Dark Sidebar */}
      <div className={`${isSidebarOpen ? 'w-96 sm:w-72 lg:w-80' : 'w-0'} ${isDarkMode ? 'bg-slate-900/30 backdrop-blur-2xl border-r border-slate-600/30' : 'bg-black'} flex flex-col relative transition-all duration-300 overflow-hidden z-30`}>
        {/* Subtle theme-colored overlay */}
        <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-transparent opacity-5 pointer-events-none ${isDarkMode ? 'via-purple-500' : 'via-[#CCFF01]'}`}></div>
        {/* Header */}
        {isSidebarOpen && (
          <div className={`p-4 sm:p-6 border-b relative z-10 ${isDarkMode ? 'border-slate-600/30' : 'border-gray-800'}`}>
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${isDarkMode ? 'bg-slate-700/60 backdrop-blur-sm border border-slate-500/30' : 'bg-[#CCFF01]'}`}>
                <Bot className={`w-4 h-4 ${isDarkMode ? 'text-slate-200' : 'text-black'}`} />
              </div>
              <h1 className={`text-lg sm:text-xl font-semibold ${isDarkMode ? 'text-slate-100' : 'text-white'}`}>Career Bot</h1>
            </div>
          </div>
        )}

        {/* Navigation */}
        {isSidebarOpen && (
          <div className="flex flex-col h-full relative z-10">
            {/* Fixed Header with New Chat Button */}
            <div className="p-4 sm:p-6 pb-3 sm:pb-4">
              <Button 
                onClick={handleNewChat}
                disabled={createChatMutation.isPending}
                className={`w-full border-0 font-medium transition-all duration-200 text-sm sm:text-base ${
                  isDarkMode 
                    ? 'bg-slate-800/40 hover:bg-slate-700/60 text-slate-200 backdrop-blur-md border border-slate-500/40 shadow-xl' 
                    : 'bg-[#CCFF01] hover:bg-[#B8E600] text-black'
                }`}
              >
                <Plus className="w-4 h-4 mr-2" />
                {createChatMutation.isPending ? 'Creating...' : 'New Chat'}
              </Button>
            </div>

            {/* User Profile - Moved up for mobile */}
            <div className={`px-4 sm:px-6 pb-4 sm:hidden ${isDarkMode ? 'border-slate-600/30' : 'border-gray-800'}`}>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800/20 backdrop-blur-sm border border-slate-600/30">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-slate-700/50 backdrop-blur-md border border-slate-500/40' : 'bg-gray-600'}`}>
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${isDarkMode ? 'text-slate-100' : 'text-white'}`}>{user?.name || 'User'}</p>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>Free Plan</p>
                </div>
                <Button onClick={handleLogout} variant="ghost" size="sm" className={`text-xs ${isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40 backdrop-blur-sm' : 'text-gray-400 hover:text-white'}`}>
                  Logout
                </Button>
              </div>
            </div>

            {/* Scrollable Recent Chats */}
            <div className="px-4 sm:px-6 pb-4 overflow-hidden">
              <h3 className={`text-xs sm:text-sm font-medium mb-2 sm:mb-3 ${isDarkMode ? 'text-slate-300' : 'text-gray-400'}`}>Recent</h3>
              <div 
                className={`space-y-2 overflow-y-auto max-h-64 pr-2 scrollbar-thin ${
                  isDarkMode 
                    ? 'scrollbar-thumb-slate-500 scrollbar-track-slate-800/20' 
                    : 'scrollbar-thumb-[#CCFF01] scrollbar-track-[#CCFF01]/20'
                }`}
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: isDarkMode 
                    ? 'rgba(100, 116, 139, 0.6) rgba(100, 116, 139, 0.2)' 
                    : 'rgba(204, 255, 1, 0.6) rgba(204, 255, 1, 0.2)'
                }}
              >
                {chats && chats.length > 0 ? (
                  chats.map((chat: any) => (
                    <div
                      key={chat.id}
                      onClick={() => handleChatSelect(chat.id)}
                        className={`text-xs sm:text-sm p-2 sm:p-3 rounded cursor-pointer transition-all duration-200 ${
                          selectedChatId === chat.id 
                            ? 'bg-slate-700/60 text-slate-100 font-medium backdrop-blur-md border border-slate-500/40' 
                            : isDarkMode 
                              ? 'bg-slate-800/30 hover:bg-slate-700/50 text-slate-300 hover:text-slate-100 backdrop-blur-md border border-slate-600/30' 
                              : 'bg-gray-800 hover:bg-[#CCFF01] hover:bg-opacity-20 text-white hover:text-[#CCFF01]'
                        }`}
                    >
                      {chat.title || 'New Chat'}
                    </div>
                  ))
                ) : (
                  <div className={`text-xs sm:text-sm p-2 sm:p-3 rounded ${isDarkMode ? 'text-slate-400 bg-slate-800/30 backdrop-blur-md border border-slate-600/30' : 'text-gray-500 bg-gray-800'}`}>
                    No chats yet. Create your first chat!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* User Profile - Desktop version at bottom */}
        {isSidebarOpen && (
          <div className={`p-4 sm:p-6 border-t relative z-10 hidden sm:block ${isDarkMode ? 'border-slate-600/30' : 'border-gray-800'}`}>
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-slate-700/50 backdrop-blur-md border border-slate-500/40' : 'bg-gray-600'}`}>
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs sm:text-sm font-medium truncate ${isDarkMode ? 'text-slate-100' : 'text-white'}`}>{user?.name || 'User'}</p>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>Free Plan</p>
              </div>
              <Button onClick={handleLogout} variant="ghost" size="sm" className={`text-xs sm:text-sm ${isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40 backdrop-blur-sm' : 'text-gray-400 hover:text-white'}`}>
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 relative transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/20 backdrop-blur-sm' : 'bg-white'}`}>
        {/* Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={`absolute top-3 left-3 sm:top-4 sm:left-4 z-40 p-2 rounded-lg shadow-lg transition-colors ${
            isDarkMode 
              ? 'bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 backdrop-blur-md border border-slate-600/40' 
              : 'bg-[#CCFF01] hover:bg-[#B8E600] text-black'
          }`}
        >
          {isSidebarOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
        
        {/* Dark Mode Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className={`absolute top-3 right-3 sm:top-4 sm:right-4 z-40 p-2 rounded-lg shadow-lg transition-colors ${
            isDarkMode 
              ? 'bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 backdrop-blur-md border border-slate-600/40' 
              : 'bg-[#CCFF01] hover:bg-[#B8E600] text-black'
          }`}
        >
          {isDarkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
        
        <ChatBot 
          userId={user?.id || ''} 
          onUserNotFound={handleLogout}
          selectedChatId={selectedChatId}
          onChatCreated={handleChatCreated}
          initialMessage={initialMessage}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  )
}
