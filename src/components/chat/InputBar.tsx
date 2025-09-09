'use client'

import { Input } from '@/components/ui/input'
import { 
  Send,
  Paperclip
} from 'lucide-react'

interface InputBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  disabled?: boolean
  isDarkMode?: boolean
  placeholder?: string
  onFileUpload?: (file: File) => void
}

export default function InputBar({ 
  value, 
  onChange, 
  onSubmit, 
  disabled = false, 
  isDarkMode = false,
  placeholder = "Ask about your career...",
  onFileUpload
}: InputBarProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && onFileUpload) {
      // Check if it's a PDF file
      if (file.type === 'application/pdf') {
        onFileUpload(file)
      } else {
        alert('Please upload a PDF file only.')
      }
    }
  }

  return (
    <div className="w-full">
      {/* Main Input Container */}
      <div className={`relative w-full rounded-2xl border transition-all duration-200 focus-within:ring-2 focus-within:ring-opacity-50 ${
        isDarkMode 
          ? 'bg-slate-800/60 border-slate-600/50 focus-within:border-slate-500/70 focus-within:ring-slate-400/30' 
          : 'bg-gray-50/90 border-gray-300/70 focus-within:border-gray-400/80 focus-within:ring-gray-500/30'
      }`}>
        
        {/* Main Input Field */}
        <div className="flex items-center px-4 py-3 sm:px-6 sm:py-4">
          {/* File Upload Button */}
          {onFileUpload && (
            <div className="relative mr-3">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={disabled}
              />
              <button
                type="button"
                disabled={disabled}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                }`}
              >
                <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          )}

          {/* Text Input */}
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={`flex-1 bg-transparent border-0 p-0 text-sm sm:text-base focus:outline-none focus:ring-0 text-black placeholder-gray-500`}
          />

          {/* Send Button */}
          <button
            onClick={onSubmit}
            disabled={!value.trim() || disabled}
            className={`ml-3 p-2 sm:p-2.5 rounded-full transition-all duration-200 disabled:opacity-50 ${
              isDarkMode 
                ? 'bg-slate-700/70 hover:bg-slate-600/90 text-slate-200 backdrop-blur-sm border border-slate-500/50' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
            type="submit"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
