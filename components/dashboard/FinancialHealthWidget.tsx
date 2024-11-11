import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface FinancialHealthProps {
  creditScore: number;
  netWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

const FinancialHealthWidget: React.FC<FinancialHealthProps> = ({
  creditScore,
  netWorth,
  monthlyIncome,
  monthlyExpenses
}) => {
  const getColorForCreditScore = (score: number) => {
    if (score < 300) return 'text-red-500';
    if (score < 600) return 'text-yellow-500';
    if (score < 750) return 'text-blue-500';
    return 'text-green-500';
  };

  const savingsRate = ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Financial Health Overview</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold">Credit Score</h3>
          <p className={`text-3xl font-bold ${getColorForCreditScore(creditScore)}`}>
            {creditScore}
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold">Net Worth</h3>
          <p className="text-2xl font-bold">
            ₹{netWorth.toLocaleString()}
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold">Savings Rate</h3>
          <p className={`text-xl font-bold ${savingsRate > 20 ? 'text-green-500' : 'text-red-500'}`}>
            {savingsRate.toFixed(2)}%
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold">Monthly Cash Flow</h3>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart 
              data={[
                { name: 'Income', value: monthlyIncome },
                { name: 'Expenses', value: monthlyExpenses }
              ]}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FinancialHealthWidget;
