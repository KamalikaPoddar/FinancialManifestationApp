import { useSession } from "next-auth/react"
import Link from "next/link"
import React from 'react'
import Button from '../components/system/Button'
import Card from '../components/system/Card'
import Input from '../components/system/Input'
import { 
  FaCalculator, 
  FaChartLine, 
  FaMoneyBillWave 
} from 'react-icons/fa'


export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-6">
        Manifestation Board
      </h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        Transform your financial dreams into reality with personalized goal tracking 
        and intelligent financial planning.
      </p>

      {!session ? (
        <div className="space-x-4">
          <button 
            onClick={() => signIn()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Get Started
          </button>
        </div>
      ) : (
        <Link 
          href="/dashboard"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Go to Dashboard
        </Link>
      )}
    </div>
  )
}

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-neutral-900">
          Manifestation Board
        </h1>

        <div className="grid md:grid-cols-3 gap-4">
          <Card interactive>
            <div className="flex items-center space-x-4">
              <FaCalculator className="text-primary-500 text-2xl" />
              <h3 className="text-xl font-semibold">Financial Calculators</h3>
            </div>
          </Card>

          <Card interactive>
            <div className="flex items-center space-x-4">
              <FaChartLine className="text-green-500 text-2xl" />
              <h3 className="text-xl font-semibold">Goal Tracking</h3>
            </div>
          </Card>

          <Card interactive>
            <div className="flex items-center space-x-4">
              <FaMoneyBillWave className="text-blue-500 text-2xl" />
              <h3 className="text-xl font-semibold">Projections</h3>
            </div>
          </Card>
        </div>

        <Card variant="glass">
          <form className="space-y-4">
            <Input 
              label="Monthly Income" 
              placeholder="Enter your monthly income"
              type="number"
              icon={<FaMoneyBillWave />}
            />
            <Button variant="primary" className="w-full">
              Calculate Financial Goals
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default HomePage

