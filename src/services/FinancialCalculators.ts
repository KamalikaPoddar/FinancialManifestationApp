// src/services/FinancialCalculators.ts
import { PrismaClient } from '@prisma/client'

enum CalculatorType {
  SAVINGS_GOAL,
  DEBT_REPAYMENT,
  INVESTMENT_RETURN,
  RETIREMENT_PLANNING,
  EMI_CALCULATOR
}

interface CalculatorInput {
  type: CalculatorType
  parameters: any
}

class FinancialCalculatorsService {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  // Savings Goal Calculator
  calculateSavingsGoal(params: {
    targetAmount: number
    currentSavings: number
    monthlyContribution: number
    timeframe: number
    interestRate: number
  }) {
    const { 
      targetAmount, 
      currentSavings, 
      monthlyContribution, 
      timeframe, 
      interestRate 
    } = params

    // Compound interest calculation
    const monthlyRate = interestRate / 12 / 100
    const months = timeframe * 12

    const futureValue = currentSavings * Math.pow(1 + monthlyRate, months) +
      monthlyContribution * 
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)

    const shortfall = Math.max(0, targetAmount - futureValue)

    return {
      futureValue,
      monthlyContributionNeeded: shortfall > 0 
        ? shortfall / (months) 
        : 0,
      goalAchievementProbability: futureValue >= targetAmount ? 1 : futureValue / targetAmount
    }
  }

  // Debt Repayment Calculator
  calculateDebtRepayment(params: {
    principal: number
    interestRate: number
    tenure: number
  }) {
    const { principal, interestRate, tenure } = params
    const monthlyRate = interestRate / 12 / 100

    const monthlyPayment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
      (Math.pow(1 + monthlyRate, tenure) - 1)

    const totalPayment = monthlyPayment * tenure
    const totalInterest = totalPayment - principal

    return {
      monthlyPayment,
      totalPayment,
      totalInterest,
      interestPercentage: (totalInterest / principal) * 100
    }
  }

  // Investment Return Calculator
  calculateInvestmentReturn(params: {
    principal: number
    monthlyContribution: number
    expectedReturn: number
    tenure: number
  }) {
    const { 
      principal, 
      monthlyContribution, 
      expectedReturn, 
      tenure 
    } = params

    const annualRate = expectedReturn / 100
    const monthlyRate = annualRate / 12

    const futureValue = principal * Math.pow(1 + monthlyRate, tenure * 12) +
      monthlyContribution * 
      ((Math.pow(1 + monthlyRate, tenure * 12) - 1) / monthlyRate)

    return {
      futureValue,
      totalContribution: principal + (monthlyContribution * tenure * 12),
      totalGains: futureValue - (principal + (monthlyContribution * tenure * 12))
    }
  }

  // Retirement Planning Calculator
  calculateRetirementPlanning(params: {
    currentAge: number
    retirementAge: number
    currentAnnualIncome: number
    desiredRetirementIncome: number
    currentSavings: number
    expectedAnnualReturn: number
  }) {
    const { 
      currentAge, 
      retirementAge, 
      currentAnnualIncome, 
      desiredRetirementIncome, 
      currentSavings, 
      expectedAnnualReturn 
    } = params

    const yearsToRetirement = retirementAge - currentAge
    const retirementYears = 85 - retirementAge // Assumed life expectancy

    // Inflation adjustment
    const inflationRate = 0.06 // 6% inflation
    const adjustedDesiredIncome = desiredRetirementIncome * 
      Math.pow(1 + inflationRate, yearsToRetirement)

    // Calculate required corpus
    const requiredCorpus = adjustedDesiredIncome * retirementYears / 
      (expectedAnnualReturn / 100)

    // Calculate monthly savings needed
    const monthlySavingsNeeded = (requiredCorpus - currentSavings) / 
      (yearsToRetirement * 12)

    return {
      requiredCorpus,
      monthlyContributionNeeded: monthlySavingsNeeded,
      currentShortfall: requiredCorpus - currentSavings,
      retirementIncomeAdequacy: 
        (adjustedDesiredIncome / currentAnnualIncome) * 100
    }
  }
}

export default new FinancialCalculatorsService()
