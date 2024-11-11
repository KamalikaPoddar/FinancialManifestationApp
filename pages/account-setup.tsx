import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import toast, { Toaster } from 'react-hot-toast'

const FINANCIAL_GOALS = [
  'Buy a House',
  'Save for Retirement',
  'Travel or Relocation',
  'Emergency Fund',
  'Investment',
  'Education',
  'Marriage',
  "Children's Education",
  'Buy a Car',
  'Start a Business',
  'Tech and Gadgets',
  'Fitness and Hobbies',
  'Luxury Purchases'
]

export default function AccountSetup() {
  const { data: session } = useSession()
  const router = useRouter()
  const [profileData, setProfileData] = useState({
    monthlyIncome: '',
    occupation: '',
    financialGoals: [] as string[]
  })

  const handleGoalSelection = (goal: string) => {
    setProfileData(prev => {
      // If goal is already selected, remove it
      if (prev.financialGoals.includes(goal)) {
        return {
          ...prev,
          financialGoals: prev.financialGoals.filter(g => g !== goal)
        }
      }

      // If trying to select more than 5 goals
      if (prev.financialGoals.length >= 5) {
        toast(
          'Big Dreamer huh? Let us focus on a few achievable targets first. Choose up to 5 dreams you wish to manifest now.', 
          {
            icon: '🌟',
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
              maxWidth: '500px'
            }
          }
        )
        return prev
      }

      // Add the goal
      return {
        ...prev,
        financialGoals: [...prev.financialGoals, goal]
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (profileData.financialGoals.length === 0) {
      toast.error('Please select at least one financial goal')
      return
    }

    try {
      const response = await fetch('/api/account/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...profileData,
          userId: session?.user?.id
        })
      })

      if (response.ok) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Account setup failed', error)
      toast.error('Account setup failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Toast Notification Container */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center mb-6">
          Complete Your Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Monthly Income Input */}
          <div>
            <label className="block mb-2 font-semibold">Monthly Income</label>
            <input 
              type="number"
              value={profileData.monthlyIncome}
              onChange={(e) => setProfileData({
                ...profileData, 
                monthlyIncome: e.target.value
              })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter your monthly income"
              required
            />
          </div>

          {/* Occupation Input */}
          <div>
            <label className="block mb-2 font-semibold">Occupation</label>
            <select
              value={profileData.occupation}
              onChange={(e) => setProfileData({
                ...profileData, 
                occupation: e.target.value
              })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="">Select Occupation</option>
              <option value="employed">Employed</option>
              <option value="self-employed">Self-Employed</option>
              <option value="student">Student</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Financial Goals Selection */}
          <div>
            <label className="block mb-4 font-semibold">
              Select Financial Goals (Choose up to 5)
            </label>
            <div className="grid md:grid-cols-3 gap-3">
              {FINANCIAL_GOALS.map((goal) => (
                <div 
                  key={goal}
                  className={`
                    flex items-center p-3 rounded-lg cursor-pointer transition-all
                    ${profileData.financialGoals.includes(goal) 
                      ? 'bg-blue-100 border-blue-500 border' 
                      : 'bg-gray-100 hover:bg-gray-200'}
                  `}
                  onClick={() => handleGoalSelection(goal)}
                >
                  <input
                    type="checkbox"
                    checked={profileData.financialGoals.includes(goal)}
                    readOnly
                    className="mr-2 form-checkbox"
                  />
                  <span>{goal}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Selected Goals: {profileData.financialGoals.length}/5
            </p>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Complete Profile
          </button>
        </form>
      </div>
    </div>
  )
}
