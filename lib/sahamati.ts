import axios from 'axios';

interface SahamatiConfig {
  clientId: string;
  clientSecret: string;
  apiBaseUrl: string;
}

class SahamatiAccountAggregator {
  private config: SahamatiConfig;

  constructor(config: SahamatiConfig) {
    this.config = config;
  }

  async generateConsentArtefact(userId: string, accounts: string[]) {
    try {
      const response = await axios.post(`${this.config.apiBaseUrl}/consent`, {
        userId,
        accounts,
        purpose: 'Financial Planning and Goal Tracking',
        duration: '1year',
        dataConsent: 'STORE'
      }, {
        headers: {
          'Authorization': `Bearer ${this.generateAccessToken()}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        consentId: response.data.consentId,
        consentArtefact: response.data.consentArtefact
      };
    } catch (error) {
      console.error('Sahamati Consent Generation Failed', error);
      throw new Error('Consent Generation Failed');
    }
  }

  async fetchFinancialData(consentArtefact: string) {
    try {
      const response = await axios.get(`${this.config.apiBaseUrl}/financial-data`, {
        headers: {
          'Authorization': `Bearer ${this.generateAccessToken()}`,
          'Consent-Artefact': consentArtefact
        }
      });

      return this.normalizeFinancialData(response.data);
    } catch (error) {
      console.error('Financial Data Retrieval Failed', error);
      throw new Error('Financial Data Retrieval Failed');
    }
  }

  private generateAccessToken(): string {
    // Implement OAuth 2.0 token generation
    // This would typically involve requesting a token from Sahamati's auth server
    return 'generated-access-token';
  }

  private normalizeFinancialData(rawData: any) {
    return {
      accounts: rawData.accounts.map((account: any) => ({
        type: account.type,
        balance: account.balance,
        transactions: account.transactions
      })),
      summary: {
        totalBalance: rawData.accounts.reduce((sum: number, account: any) => sum + account.balance, 0),
        totalTransactions: rawData.accounts.reduce((sum: number, account: any) => sum + account.transactions.length, 0)
      }
    };
  }
}

export default new SahamatiAccountAggregator({
  clientId: process.env.SAHAMATI_CLIENT_ID!,
  clientSecret: process.env.SAHAMATI_CLIENT_SECRET!,
  apiBaseUrl: process.env.SAHAMATI_API_BASE_URL!
});
