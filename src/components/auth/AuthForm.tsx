'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { trpc } from '@/trpc/client'
import { toast } from 'react-hot-toast'
import { Bot, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react'

interface AuthFormProps {
  onAuthSuccess: (user: any, token: string) => void
}

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  })

  const signupMutation = trpc.signup.useMutation({
    onSuccess: (data) => {
      toast.success('Account created successfully!')
      onAuthSuccess(data.user, data.token)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const signinMutation = trpc.signin.useMutation({
    onSuccess: (data) => {
      toast.success('Welcome back!')
      onAuthSuccess(data.user, data.token)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all required fields')
      return
    }

    if (isSignUp && formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    try {
      if (isSignUp) {
        await signupMutation.mutateAsync({
          email: formData.email,
          password: formData.password,
          name: formData.name || undefined,
        })
      } else {
        await signinMutation.mutateAsync({
          email: formData.email,
          password: formData.password,
        })
      }
    } catch (error) {
      // Error is handled by the mutation onError
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const isLoading = signupMutation.isPending || signinMutation.isPending

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white border-gray-200">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#CCFF01] rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600">
            {isSignUp 
              ? 'Sign up to start your career journey' 
              : 'Sign in to continue your career journey'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Full Name (Optional)
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                disabled={isLoading}
              />
            </div>
          )}

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password *
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {isSignUp && (
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#CCFF01] hover:bg-[#B8E600] text-black border-0"
            disabled={isLoading}
          >
            {isSignUp ? (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                {isLoading ? 'Signing In...' : 'Sign In'}
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </p>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setFormData({ email: '', password: '', name: '' })
            }}
            className="text-sm text-gray-600 hover:text-gray-800 font-medium mt-1"
            disabled={isLoading}
          >
            {isSignUp ? 'Sign in instead' : 'Create an account'}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          By {isSignUp ? 'creating an account' : 'signing in'}, you agree to our terms of service and privacy policy.
        </p>
      </Card>
    </div>
  )
}
