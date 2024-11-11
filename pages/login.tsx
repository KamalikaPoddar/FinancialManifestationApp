import { useState } from 'react'
import { useRouter } from 'next/router'

// Enum for login stages
enum LoginStage {
  EMAIL_INPUT,
  OTP_VERIFICATION
}

export default function Login() {
  const [loginStage, setLoginStage] = useState<LoginStage>(LoginStage.EMAIL_INPUT)
  const [identifier, setIdentifier] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  // Function to validate email or mobile number
  const isValidIdentifier = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const mobileRegex = /^[6-9]\d{9}$/

    return emailRegex.test(value) || mobileRegex.test(value)
  }

  // First stage - Check if user exists
  const handleIdentifierSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate identifier format
    if (!isValidIdentifier(identifier)) {
      setError('Please enter a valid email or mobile number')
      return
    }

    try {
      // API call to check if user exists
      const response = await fetch('/api/auth/check-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ identifier })
      })

      const result = await response.json()

      if (result.exists) {
        // User exists, move to OTP stage
        setLoginStage(LoginStage.OTP_VERIFICATION)
      } else {
        // User not found, redirect to signup
        router.push(`/signup?identifier=${encodeURIComponent(identifier)}`)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    }
  }

  // Second stage - OTP Verification
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Hardcoded OTP validation (as per requirement)
    if (otp !== '1234') {
      setError('Invalid OTP. Please try again.')
      return
    }

    try {
      // API call to verify OTP and login
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          identifier, 
          otp 
        })
      })

      const result = await response.json()

      if (result.success) {
        // Redirect to dashboard or home page
        router.push('/dashboard')
      } else {
        setError('OTP verification failed')
      }
    } catch (err) {
      setError('An error occurred during verification')
    }
  }

  // Render Email/Mobile Input Stage
  const renderEmailInput = () => (
    <form onSubmit={handleIdentifierSubmit} className="space-y-4">
      <div>
        <label className="block mb-2">Email or Mobile Number</label>
        <input 
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Enter email or mobile number"
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>
      <button 
        type="submit" 
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Continue
      </button>
    </form>
  )

  // Render OTP Verification Stage
  const renderOtpVerification = () => (
    <form onSubmit={handleOtpSubmit} className="space-y-4">
      <div>
        <label className="block mb-2">
          Enter OTP sent to {identifier}
        </label>
        <input 
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 4-digit OTP"
          maxLength={4}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
        <p className="text-sm text-gray-500 mt-2">
          Hint: Use hardcoded OTP 1234
        </p>
      </div>
      <button 
        type="submit" 
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Verify OTP
      </button>
      <button 
        type="button"
        onClick={() => setLoginStage(LoginStage.EMAIL_INPUT)}
        className="w-full text-blue-600 underline"
      >
        Change Email/Mobile
      </button>
    </form>
  )

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center mb-6">
          {loginStage === LoginStage.EMAIL_INPUT 
            ? 'Login' 
            : 'Verify OTP'}
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        {loginStage === LoginStage.EMAIL_INPUT 
          ? renderEmailInput() 
          : renderOtpVerification()}

        <div className="mt-4 text-center">
          {loginStage === LoginStage.EMAIL_INPUT && (
            <>
              <div className="flex items-center justify-center space-x-2 my-4">
                <div className="h-px bg-gray-300 w-full"></div>
                <span className="text-gray-500">or</span>
                <div className="h-px bg-gray-300 w-full"></div>
              </div>
              
              <button 
                onClick={() => {/* Google Sign In */}}
                className="w-full flex items-center justify-center bg-white border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
              >
                <img 
                  src="/google-icon.svg" 
                  alt="Google" 
                  className="mr-2 h-5 w-5" 
                />
                Continue with Google
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
