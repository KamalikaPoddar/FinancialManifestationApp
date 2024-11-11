import prisma from '../prisma'
import { calculateCompoundInterest, calculateInflation } from '../utils/financialCalculations'

interface FinancialProfile {
  monthlyIncome: number
  expenses: number
  existingSavings: number
  riskTolerance: 'low' | 'medium' | 'high'
}

interface InvestmentOption {
  name: string
  expectedReturn: number
  risk: number
  liquidityScore: number
}

const INVESTMENT_OPTIONS: InvestmentOption[] = [
  {
    name: 'Savings Account',
    expectedReturn: 0.04, // 4% 
    risk: 0.1,
    liquidityScore: 1
  },
  {
    name: 'Fixed Deposits',
    expectedReturn: 0.06, // 6%
    risk: 0.2,
    liquidityScore: 0.8
  },
  {
    name: 'Mutual Funds',
    expectedReturn: 0.12, // 12%
    risk: 0.5,
    liquidityScore: 0.6
  },
  {
    name: 'Stock Market',
    expectedReturn: 0.15, // 15%
    risk: 0.8,
    liquidityScore: 0.4
  },
  {
    name: 'Real Estate',
    expectedReturn: 0.10, // 10%
    risk: 0.6,
    liquidityScore: 0.2
  },
  {
    name: 'Cryptocurrency',
    expectedReturn: 0.25, // 25%
    risk: 0.9,
    liquidityScore: 0.3
  }
]

class AdvancedFinancialProjectionService {
  // Comprehensive goal projection method
  async generateAdvancedProjection(
    goalId: string, 
    additionalContext?: Partial<FinancialProfile>
  ) {
    // Fetch goal and user details
    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
      include: { 
        user: { 
          include: { 
            profile: true,
            financialHistory: true
          } 
        } 
      }
    })

    if (!goal) {
      throw new Error('Goal not found')
    }

    // Combine default and additional context
    const financialProfile = this.buildFinancialProfile(goal, additionalContext)

    // Calculate projection scenarios
    const projectionScenarios = this.generateProjectionScenarios(
      goal, 
      financialProfile
    )

    // Risk-adjusted optimization
    const optimizedStrategy = this.optimizeInvestmentStrategy(
      projectionScenarios, 
      financialProfile
    )

    // Comprehensive analysis
    return {
      goal: {
        title: goal.title,
        targetAmount: goal.targetAmount,
        deadline: goal.deadline
      },
      financialProfile,
      scenarios: projectionScenarios,
      recommendedStrategy: optimizedStrategy,
      insights: this.generateInsights(projectionScenarios, goal)
    }
  }

  // Build comprehensive financial profile
  private buildFinancialProfile(
    goal: any, 
    additionalContext?: Partial<FinancialProfile>
  ): FinancialProfile {
    const profile = goal.user.profile || {}
    
    return {
      monthlyIncome: profile.monthlyIncome || 50000,
      expenses: this.calculateMonthlyExpenses(profile),
      existingSavings: this.calculateExistingSavings(goal.user),
      riskTolerance: this.determineRiskTolerance(goal.user),
      ...additionalContext
    }
  }

  // Calculate monthly expenses with intelligent estimation
  private calculateMonthlyExpenses(profile: any): number {
    // If explicit expenses exist, use them
    if (profile.monthlyExpenses) return profile.monthlyExpenses

    // Estimate expenses based on income
    const incomeBasedExpenses = profile.monthlyIncome * 0.6 // 60% of income
    return incomeBasedExpenses
  }

  // Calculate existing savings with multiple sources
  private calculateExistingSavings(user: any): number {
    // Aggregate savings from different sources
    const bankSavings = user.bankAccounts?.reduce(
      (sum, account) => sum + account.balance, 
      0
    ) || 0

    const investments = user.investments?.reduce(
      (sum, investment) => sum + investment.currentValue, 
      0
    ) || 0

    return bankSavings + investments
  }

  // Determine risk tolerance based on user profile
  private determineRiskTolerance(user: any): 'low' | 'medium' | 'high' {
    // Consider factors like age, income, existing investments
    const age = this.calculateAge(user.dateOfBirth)
    const income = user.profile?.monthlyIncome || 0

    if (age < 30 && income > 100000) return 'high'
    if (age < 45 && income > 50000) return 'medium'
    return 'low'
  }

  // Generate multiple projection scenarios
  private generateProjectionScenarios(
    goal: any, 
    financialProfile: FinancialProfile
  ) {
    const monthsToGoal = this.calculateMonthsToGoal(goal.deadline)
    const monthlyContribution = this.calculateMonthlyContribution(
      goal, 
      financialProfile
    )

    return INVESTMENT_OPTIONS.map(option => ({
      ...option,
      projectedAmount: this.calculateProjectedAmount(
        financialProfile.existingSavings,
        monthlyContribution,
        option.expectedReturn,
        monthsToGoal
      ),
      timeToGoal: this.calculateTimeToGoal(
        goal.targetAmount,
        financialProfile.existingSavings,
        monthlyContribution,
        option.expectedReturn
      )
    }))
  }

  // Optimize investment strategy based on risk and goals
  private optimizeInvestmentStrategy(
    scenarios: any[], 
    financialProfile: FinancialProfile
  ) {
    // Multi-factor optimization
    const scoredScenarios = scenarios.map(scenario => ({
      ...scenario,
      optimizationScore: this.calculateOptimizationScore(
        scenario, 
        financialProfile
      )
    }))

    // Sort and return top strategy
    return scoredScenarios
      .sort((a, b) => b.optimizationScore - a.optimizationScore)[0]
  }

  // Calculate comprehensive optimization score
  private calculateOptimizationScore(
    scenario: any, 
    financialProfile: FinancialProfile
  ): number {
    const riskMultiplier = this.getRiskMultiplier(financialProfile.riskTolerance)
    
    return (
      scenario.projectedAmount * 0.4 +
      (1 - scenario.risk) * 1000 * 0.3 +
      scenario.liquidityScore * 500 * 0.2 +
      scenario.expectedReturn * 2000 * riskMultiplier
    )
  }

  // Risk tolerance multiplier
  private getRiskMultiplier(riskTolerance: 'low' | 'medium' | 'high'): number {
    const multipliers = {
      low: 0.5,
      medium: 0.75,
      high: 1
    }
    return multipliers[riskTolerance]
  }

  // Generate actionable insights
  private generateInsights(scenarios: any[], goal: any) {
    const bestScenario = scenarios
      .sort((a, b) => b.projectedAmount - a.projectedAmount)[0]
    
    const shortfall = Math.max(0, goal.targetAmount - bestScenario.projectedAmount)

    return {
      recommendedInvestment: bestScenario.name,
      potentialShortfall: shortfall,
      recommendedMonthlyContribution: this.calculateRecommendedContribution(
        goal, 
        bestScenario
      ),
      inflationAdjustedTarget: this.calculateInflationAdjustedTarget(goal)
    }
  }

  // Calculate recommended monthly contribution
  private calculateRecommendedContribution(goal: any, scenario: any): number {
    const monthsToGoal = this.calculateMonthsToGoal(goal.deadline)
    return goal.targetAmount / monthsToGoal
  }

  // Calculate inflation-adjusted target
  private calculateInflationAdjustedTarget(goal: any): number {
    const annualInflation = 0.06 // 6% inflation
    const monthsToGoal = this.calculateMonthsToGoal(goal.deadline)
    return goal.targetAmount * Math.pow(1 + annualInflation, monthsToGoal / 12)
  }

  // Utility methods
  private calculateMonthsToGoal(deadline: Date): number {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    return Math.max(
      (deadlineDate.getFullYear() - now.getFullYear()) * 12 +
      (deadlineDate.getMonth() - now.getMonth()),
      1
    )
  }

  private calculateMonthlyContribution(
    goal: any, 
    financialProfile: FinancialProfile
  ): number {
    const disposableIncome = financialProfile.monthlyIncome - financialProfile.expenses
    const monthsToGoal = this.calculateMonthsToGoal(goal.deadline)
    
    // Calculate recommended monthly contribution
    const recommendedContribution = Math.min(
      (goal.targetAmount - goal.currentAmount) / monthsToGoal,
      disposableIncome * 0.3 // Cap at 30% of disposable income
    )

    return Math.max(recommendedContribution, 0)
  }

  private calculateProjectedAmount(
    existingSavings: number,
    monthlyContribution: number,
    annualReturn: number,
    months: number
  ): number {
    return calculateCompoundInterest(
      existingSavings, 
      monthlyContribution, 
      annualReturn, 
      months / 12
    )
  }

  private calculateAge(dateOfBirth?: Date): number {
    if (!dateOfBirth) return 30 // Default age
    const ageDifMs = Date.now() - dateOfBirth.getTime()
    const ageDate = new Date(ageDifMs)
    return Math.abs(ageDate.getUTCFullYear() - 1970)
  }
}

// Utility calculation functions
function calculateCompoundInterest(
  principal: number, 
  monthlyContribution: number, 
  annualRate: number, 
  years: number
): number {
  const monthlyRate = annualRate / 12
  const months = years * 12
  
  return principal * Math.pow(1 + monthlyRate, months) + 
         monthlyContribution * 
         ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
}

function calculateInflation(
  amount: number, 
  inflationRate: number, 
  years: number
): number {
  return amount * Math.pow(1 + inflationRate, years)
}

async function getAdvancedProjection(goalId: string) {
  try {
    const projection = await advancedFinancialProjectionService.generateAdvancedProjection(
      goalId,
      {
        // Optional additional context
        riskTolerance: 'medium',
        monthlyIncome: 75000
      }
    )

    console.log(projection.recommendedStrategy)
    console.log(projection.insights)
  } catch (error) {
    // Handle projection errors
  }
}

// Enum for Education Levels
enum EducationLevel {
  HIGH_SCHOOL = 'High School',
  BACHELOR = 'Bachelor\'s Degree',
  MASTER = 'Master\'s Degree',
  PHD = 'Doctorate',
  PROFESSIONAL = 'Professional Degree'
}

// Enum for Study Fields
enum StudyField {
  ENGINEERING = 'Engineering',
  COMPUTER_SCIENCE = 'Computer Science',
  MEDICAL = 'Medical Sciences',
  BUSINESS = 'Business Administration',
  FINANCE = 'Finance',
  ARTS = 'Arts',
  SCIENCE = 'Pure Sciences',
  LAW = 'Legal Studies',
  HUMANITIES = 'Humanities'
}

interface EducationalProfile {
  highestDegree: EducationLevel
  fieldOfStudy: StudyField
  graduationYear: number
  institution?: string
}

// Income Growth Potential Matrix
const INCOME_GROWTH_MATRIX = {
  [EducationLevel.HIGH_SCHOOL]: {
    baseGrowthRate: 0.03, // 3%
    careerMobility: 0.2
  },
  [EducationLevel.BACHELOR]: {
    baseGrowthRate: 0.06, // 6%
    careerMobility: 0.4
  },
  [EducationLevel.MASTER]: {
    baseGrowthRate: 0.10, // 10%
    careerMobility: 0.6
  },
  [EducationLevel.PHD]: {
    baseGrowthRate: 0.15, // 15%
    careerMobility: 0.8
  },
  [EducationLevel.PROFESSIONAL]: {
    baseGrowthRate: 0.12, // 12%
    careerMobility: 0.7
  }
}

const FIELD_INCOME_MULTIPLIERS = {
  [StudyField.COMPUTER_SCIENCE]: 1.3,
  [StudyField.ENGINEERING]: 1.25,
  [StudyField.FINANCE]: 1.2,
  [StudyField.MEDICAL]: 1.4,
  [StudyField.BUSINESS]: 1.15,
  [StudyField.LAW]: 1.25,
  [StudyField.SCIENCE]: 1.1,
  [StudyField.ARTS]: 0.9,
  [StudyField.HUMANITIES]: 0.85
}

class EducationEnhancedProjectionService {
  // Extend previous projection method to include educational insights
  async generateEducationEnhancedProjection(
    goalId: string,
    educationalProfile: EducationalProfile
  ) {
    // Previous projection logic...
    const baseProjection = await super.generateAdvancedProjection(goalId)

    // Calculate education-enhanced projections
    const educationEnhancedProjection = this.applyEducationalEnhancements(
      baseProjection, 
      educationalProfile
    )

    return {
      ...baseProjection,
      educationInsights: educationEnhancedProjection
    }
  }

  private applyEducationalEnhancements(
    baseProjection: any, 
    educationalProfile: EducationalProfile
  ) {
    const currentAge = this.calculateAge(educationalProfile.graduationYear)
    const educationGrowthRate = this.calculateEducationBasedGrowthRate(
      educationalProfile, 
      currentAge
    )

    return {
      educationLevel: educationalProfile.highestDegree,
      fieldOfStudy: educationalProfile.fieldOfStudy,
      potentialCareerTrajectory: this.predictCareerTrajectory(
        educationalProfile, 
        baseProjection.financialProfile.monthlyIncome
      ),
      enhancedIncomeProjection: this.calculateEnhancedIncomeProjection(
        baseProjection.financialProfile.monthlyIncome,
        educationGrowthRate,
        educationalProfile
      ),
      skillUpgradeRecommendations: this.generateSkillUpgradeRecommendations(
        educationalProfile
      )
    }
  }

  private calculateEducationBasedGrowthRate(
    educationalProfile: EducationalProfile,
    currentAge: number
  ): number {
    const baseGrowthRate = INCOME_GROWTH_MATRIX[educationalProfile.highestDegree].baseGrowthRate
    const fieldMultiplier = FIELD_INCOME_MULTIPLIERS[educationalProfile.fieldOfStudy]
    
    // Age and experience factor
    const ageFactor = currentAge < 30 ? 1.2 : 
                      currentAge < 40 ? 1.0 : 
                      currentAge < 50 ? 0.8 : 0.6

    return baseGrowthRate * fieldMultiplier * ageFactor
  }

  private predictCareerTrajectory(
    educationalProfile: EducationalProfile,
    currentIncome: number
  ) {
    const careerStages = [
      {
        stage: 'Early Career',
        yearsRange: '0-5 years',
        incomeProjection: currentIncome * 1.2,
        keyFocus: 'Skill Development'
      },
      {
        stage: 'Mid Career',
        yearsRange: '5-15 years',
        incomeProjection: currentIncome * 1.5,
        keyFocus: 'Specialization'
      },
      {
        stage: 'Senior Level',
        yearsRange: '15-25 years',
        incomeProjection: currentIncome * 2,
        keyFocus: 'Leadership'
      }
    ]

    return careerStages
  }

  private generateSkillUpgradeRecommendations(
    educationalProfile: EducationalProfile
  ) {
    const recommendationsByField = {
      [StudyField.COMPUTER_SCIENCE]: [
        'Cloud Computing Certification',
        'Advanced Machine Learning Course',
        'Cybersecurity Specialization'
      ],
      [StudyField.ENGINEERING]: [
        'Project Management Professional (PMP)',
        'Lean Six Sigma Certification',
        'Domain-Specific Technical Certifications'
      ],
      [StudyField.BUSINESS]: [
        'MBA or Executive Program',
        'Digital Marketing Certification',
        'Financial Modeling Course'
      ],
      // Add more fields...
    }

    return recommendationsByField[educationalProfile.fieldOfStudy] || [
      'Generic Professional Development Courses'
    ]
  }

  private calculateEnhancedIncomeProjection(
    currentIncome: number,
    educationGrowthRate: number,
    educationalProfile: EducationalProfile
  ) {
    const projectionYears = [5, 10, 15, 20]
    
    return projectionYears.map(years => ({
      year: years,
      projectedIncome: currentIncome * Math.pow(1 + educationGrowthRate, years),
      cumulativeGrowth: (Math.pow(1 + educationGrowthRate, years) - 1) * 100
    }))
  }
}

// Usage Example
async function getEducationEnhancedProjection(
  goalId: string, 
  educationalProfile: EducationalProfile
) {
  const projectionService = new EducationEnhancedProjectionService()
  
  const enhancedProjection = await projectionService.generateEducationEnhancedProjection(
    goalId,
    {
      highestDegree: EducationLevel.BACHELOR,
      fieldOfStudy: StudyField.COMPUTER_SCIENCE,
      graduationYear: 2018,
      institution: 'IIT Bombay'
    }
  )

  console.log(enhancedProjection.educationInsights)
}

export default new AdvancedFinancialProjectionService()
