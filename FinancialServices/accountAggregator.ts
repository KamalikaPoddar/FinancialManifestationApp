class SahamatiAccountAggregator {
  // Generate consent artefact
  async generateConsentArtefact(userId: string, accounts: string[])

  // Fetch financial data
  async fetchFinancialData(consentArtefact: string)

  // Normalize financial data
  private normalizeFinancialData(rawData: any)
}
