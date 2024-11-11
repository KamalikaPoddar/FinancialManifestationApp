import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function AccountSetup() {
  const { data: session } = useSession()
  const router = useRouter()
  const [profileData, setProfileData] = useState({
    monthlyIncome: '',
    occupation: '',
    financialGoals: [] as string[]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
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
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center mb-6">
          Complete Your Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Monthly Income</label>
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

          <div>
            <label className="block mb-2">Occupation</label>
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

          <div>
            <label className="block mb-2">Financial Goals</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Buy a House', 
                'Save for Retirement', 
                'Travel', 
                'Emergency Fund',
                'Investment',
                'Education'
              ].map((goal) => (
                <label key={goal} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    value={goal}
                    checked={profileData.financialGoals.includes(goal)}
                    onChange={(e) => {
                      const updatedGoals = e.target.checked
                        ? [...profileData.financialGoals, goal]
                        : profileData.financialGoals.filter(g => g !== goal)
                      setProfileData({...profileData, financialGoals: updatedGoals})
                    }}
                    className="form-checkbox"
                  />
                  <span className="ml-2">{goal}</span>
                </label>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Complete Profile
          </button>
        </form>
      </div>
    </div>
  )
}
