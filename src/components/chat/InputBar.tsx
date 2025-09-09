import React from 'react'
import { Send } from 'lucide-react'

interface InputBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  disabled?: boolean
  isDarkMode?: boolean
  placeholder?: string
}

export default function InputBar({
  value,
  onChange,
  onSubmit,
  disabled = false,
  isDarkMode = false,
  placeholder = "Ask me anything..."
}: InputBarProps) {

  return (
    <div className="relative w-full">
      <div
        className={`relative w-full rounded-xl backdrop-blur-md border transition-all duration-200 focus-within:ring-2 focus-within:ring-opacity-50 ${
          isDarkMode
            ? 'bg-slate-800/40 border-slate-600/40 focus-within:border-slate-500/60 focus-within:ring-slate-400/30'
            : 'bg-white/80 border-gray-200/60 focus-within:border-gray-300/80 focus-within:ring-gray-400/30'
        }`}
      >
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full p-4 pr-20 bg-transparent rounded-xl focus:outline-none disabled:opacity-50 ${
            isDarkMode 
              ? 'text-slate-100 placeholder-slate-400' 
              : 'text-gray-900 placeholder-gray-500'
          }`}
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {/* Send Button */}
          <button 
            type="submit"
            onClick={onSubmit}
            disabled={!value.trim() || disabled}
            className={`p-2 rounded-full transition-all duration-200 disabled:opacity-50 ${
              isDarkMode 
                ? 'bg-slate-700/60 hover:bg-slate-600/80 text-slate-200 backdrop-blur-sm border border-slate-500/40' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}