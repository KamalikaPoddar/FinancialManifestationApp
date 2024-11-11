import { useSession } from "next-auth/react"
import Link from "next/link"

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
