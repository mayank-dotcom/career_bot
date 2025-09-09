'use client'

import { Card } from '@/components/ui/card'
import { MessageStatus } from './MessageStatus'
import { Bot, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

interface MessageBubbleProps {
  message: {
    id: string
    content: string
    role: 'user' | 'assistant'
    createdAt: Date | string
    status?: 'sending' | 'sent' | 'delivered' | 'read' | 'error'
  }
  isDarkMode?: boolean
}

export function MessageBubble({ message, isDarkMode = false }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  
  return (
    <div className={`flex items-start space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
        }`}>
          <Bot className={`w-4 h-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`} />
        </div>
      )}
      
      <div className="flex flex-col max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
        <Card
          className={`px-4 py-2 relative ${
            isUser
              ? 'bg-[#CCFF01] text-black rounded-2xl rounded-br-md'
              : isDarkMode 
                ? 'bg-slate-800 text-slate-100 rounded-2xl rounded-bl-md'
                : 'bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md'
          }`}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed">{message.content}</p>
          ) : (
            <div className="text-sm leading-relaxed prose prose-sm max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  // Custom styling for markdown elements with dark mode support
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-outside mb-2 space-y-1 ml-4 pl-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-outside mb-2 space-y-1 ml-4 pl-2">{children}</ol>,
                  li: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
                  strong: ({ children }) => (
                    <strong className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => <em className="italic">{children}</em>,
                  code: ({ children }) => (
                    <code className={`px-1 py-0.5 rounded text-xs font-mono ${
                      isDarkMode 
                        ? 'bg-slate-700 text-slate-200' 
                        : 'bg-gray-200 text-gray-800'
                    }`}>
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className={`p-2 rounded text-xs font-mono overflow-x-auto mb-2 ${
                      isDarkMode 
                        ? 'bg-slate-700 text-slate-200' 
                        : 'bg-gray-200 text-gray-800'
                    }`}>
                      {children}
                    </pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className={`border-l-4 pl-3 italic mb-2 ${
                      isDarkMode 
                        ? 'border-slate-600 text-slate-300' 
                        : 'border-gray-300 text-gray-700'
                    }`}>
                      {children}
                    </blockquote>
                  ),
                  h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
                  h4: ({ children }) => <h4 className="text-sm font-semibold mb-1">{children}</h4>,
                  h5: ({ children }) => <h5 className="text-sm font-semibold mb-1">{children}</h5>,
                  h6: ({ children }) => <h6 className="text-sm font-semibold mb-1">{children}</h6>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </Card>
        
        {isUser && message.status && (
          <MessageStatus status={message.status} timestamp={message.createdAt} />
        )}
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-[#CCFF01] rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-black" />
        </div>
      )}
    </div>
  )
}
