import axios from 'axios';

interface CreditBureauConfig {
  apiKey: string;
  apiBaseUrl: string;
}

class CreditBureauService {
  private config: CreditBureauConfig;

  constructor(config: CreditBureauConfig) {
    this.config = config;
  }

  async retrieveCreditScore(userId: string, panNumber: string) {
    try {
      const response = await axios.post(`${this.config.apiBaseUrl}/credit-score`, {
        userId,
        panNumber,
        consent: true
      }, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return this.analyzeCreditScore(response.data);
    } catch (error) {
      console.error('Credit Score Retrieval Failed', error);
      throw new Error('Credit Score Retrieval Failed');
    }
  }

  private analyzeCreditScore(scoreData: any) {
    const score = scoreData.creditScore;
    
    let creditHealth: 'Poor' | 'Fair' | 'Good' | 'Excellent';
    let recommendedActions: string[] = [];

    if (score < 300) {
      creditHealth = 'Poor';
      recommendedActions = [
        'Pay all bills on time',
        'Reduce credit utilization',
        'Avoid new credit applications'
      ];
    } else if (score < 600) {
      creditHealth = 'Fair';
      recommendedActions = [
        'Maintain consistent payment history',
        'Reduce outstanding debts'
      ];
    } else if (score < 750) {
      creditHealth = 'Good';
      recommendedActions = [
        'Continue good financial habits',
        'Consider consolidating debts'
      ];
    } else {
      creditHealth = 'Excellent';
      recommendedActions = [
        'Maintain current financial practices',
        'Explore premium financial products'
      ];
    }

    return {
      score,
      health: creditHealth,
      recommendedActions
    };
  }
}

export default new CreditBureauService({
  apiKey: process.env.CREDIT_BUREAU_API_KEY!,
  apiBaseUrl: process.env.CREDIT_BUREAU_API_URL!
});
