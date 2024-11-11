// src/app/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import { 
  FaChartLine, 
  FaWallet, 
  FaChartPie, 
  FaRocket, 
  FaCheckCircle, 
  FaBullseye 
} from 'react-icons/fa'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-primary-50">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary-600">
            Manifestation Board
          </div>
          <nav className="flex space-x-6">
            <Link 
              href="#features" 
              className="text-neutral-700 hover:text-primary-600 transition"
            >
              What We Do
            </Link>
            <Link 
              href="/auth/signup" 
              className="text-neutral-700 hover:text-primary-600 transition"
            >
              Sign Up
            </Link>
            <Link 
              href="#contact" 
              className="text-neutral-700 hover:text-primary-600 transition"
            >
              Contact Us
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-24 flex items-center">
        <div className="w-1/2 space-y-6">
          <h1 className="text-5xl font-bold text-neutral-900">
            Transform Your Financial Dreams into Reality
          </h1>
          <p className="text-xl text-neutral-600">
            Manifest your financial goals with powerful tracking, 
            visualization, and actionable insights.
          </p>
          <div className="flex space-x-4">
            <Link 
              href="/auth/signup" 
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
            >
              Get Started
            </Link>
            <Link 
              href="#features" 
              className="border border-primary-600 text-primary-600 px-6 py-3 rounded-lg hover:bg-primary-50 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
        <div className="w-1/2 relative">
          <Image 
            src="/images/money-manifestation.png" 
            alt="Money Manifestation" 
            width={600} 
            height={600} 
            className="transform translate-x-10 scale-110 hover:scale-115 transition-transform duration-300"
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-neutral-900 mb-4">
            Powerful Features to Manifest Your Goals
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Unlock your financial potential with our comprehensive 
            goal-tracking and manifestation tools.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-neutral-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">
            What Our Users Are Saying
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial) => (
              <TestimonialCard key={testimonial.name} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto px-4 py-16">
        <div className="bg-white shadow-lg rounded-lg p-12 max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8">
            Contact Us
          </h2>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <input 
                type="text" 
                placeholder="Your Name" 
                className="w-full p-3 border rounded-lg"
              />
              <input 
                type="email" 
                placeholder="Your Email" 
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <textarea 
              placeholder="Your Message" 
              className="w-full p-3 border rounded-lg h-32"
            />
            <button 
              type="submit" 
              className="w-full bg-primary-600 text-white p-3 rounded-lg hover:bg-primary-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 Manifestation Board. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

// Feature Card Component
function FeatureCard({ 
  icon: Icon, 
  title, 
  description 
}: FeatureProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition text-center">
      <div className="text-4xl text-primary-600 mb-4 flex justify-center">
        <Icon />
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-neutral-600">{description}</p>
    </div>
  )
}

// Testimonial Card Component
function TestimonialCard({ 
  name, 
  quote, 
  image 
}: TestimonialProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="italic mb-4">"{quote}"</p>
      <div className="flex items-center">
        <Image 
          src={image} 
          alt={name} 
          width={50} 
          height={50} 
          className="rounded-full mr-4"
        />
        <div>
          <h4 className="font-semibold">{name}</h4>
        </div>
      </div>
    </div>
  )
}

// Feature Data
const FEATURES: FeatureProps[] = [
  {
    icon: FaChartLine,
    title: 'Goal Tracking',
    description: 'Set, monitor, and achieve your financial goals with precision.'
  },
  {
    icon: FaWallet,
    title: 'Transaction Management',
    description: 'Effortlessly track and categorize your income and expenses.'
  },
  {
    icon: FaChartPie,
    title: 'Financial Insights',
    description: 'Gain deep insights into your spending and saving patterns.'
  },
  {
    icon: FaRocket,
    title: 'Goal Visualization',
    description: 'Visualize your progress and stay motivated on your journey.'
  },
  {
    icon: FaCheckCircle,
    title: 'Progress Tracking',
    description: 'Monitor your milestones and celebrate your achievements.'
  },
  {
    icon: FaBullseye,
    title: 'Manifestation Tools',
    description: 'Leverage powerful tools to manifest your financial dreams.'
  }
]

// Testimonial Data
const TESTIMONIALS: TestimonialProps[] = [
  {
    name: 'Sarah Johnson',
    quote: 'Manifestation Board helped me turn my financial dreams into reality!',
    image: '/images/testimonial-1.jpg'
  },
  {
    name: 'Michael Chen',
    quote: 'Incredible app that keeps me focused and motivated on my goals.',
    image: '/images/testimonial-2.jpg'
  },
  {
    name: 'Emily Rodriguez',
    quote: 'I\'ve never felt more in control of my financial future.',
    image: '/images/testimonial-3.jpg'
  }
]

// Type Definitions
interface FeatureProps {
  icon: React.ElementType
  title: string
  description: string
}

interface TestimonialProps {
  name: string
  quote: string
  image: string
}
