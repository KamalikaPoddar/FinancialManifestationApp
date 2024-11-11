import { useSession } from 'next-auth/react'
import ManifestationBoard from '../components/ManifestationBoard'
import FinancialHealthWidget from '../components/FinancialHealthWidget'

export default function Dashboard() {
  const { data: session } = useSession()

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">
        Welcome, {session?.user?.name}
      </h1>

      {/* Manifestation Board */}
      <ManifestationBoard />

      {/* Other Dashboard Widgets */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <FinancialHealthWidget />
        {/* Add more widgets as needed */}
      </div>
    </div>
  )
}
