import React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface Expense {
  category: string;
  amount: number;
}

interface ExpensesChartProps {
  expenses: Expense[];
}

const ExpensesChart: React.FC<ExpensesChartProps> = ({ expenses }) => {
  const theme = useTheme();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={expenses}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip 
          formatter={(value: number) => [`$${value.toFixed(2)}`, 'Total']}
        />
        <Bar
          dataKey="amount"
          fill={theme.palette.primary.main}
          name="Total"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ExpensesChart; 