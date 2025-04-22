import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Paper, Typography, useTheme } from '@mui/material';

interface Transaction {
  date: string;
  description: string;
  amount: number;
  type: 'ingreso' | 'gasto';
}

interface TransactionsChartProps {
  transactions: Transaction[];
  currency: string;
}

export const TransactionsChart: React.FC<TransactionsChartProps> = ({ transactions, currency }) => {
  const theme = useTheme();

  // Procesar los datos para la gráfica
  const chartData = transactions.reduce((acc: any[], transaction) => {
    const existingDate = acc.find(item => item.date === transaction.date);

    if (existingDate) {
      if (transaction.type === 'ingreso') {
        existingDate.ingresos += transaction.amount;
      } else {
        existingDate.gastos += transaction.amount;
      }
      existingDate.balance = existingDate.ingresos - existingDate.gastos;
    } else {
      acc.push({
        date: transaction.date,
        ingresos: transaction.type === 'ingreso' ? transaction.amount : 0,
        gastos: transaction.type === 'gasto' ? transaction.amount : 0,
        balance: transaction.type === 'ingreso' ? transaction.amount : -transaction.amount
      });
    }
    return acc;
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          elevation={3}
          sx={{
            p: 2,
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            {label}
          </Typography>
          <Typography variant="body2" color={theme.palette.success.main}>
            Ingresos: {formatCurrency(payload[0].value)}
          </Typography>
          <Typography variant="body2" color={theme.palette.error.main}>
            Gastos: {formatCurrency(payload[1].value)}
          </Typography>
          <Typography variant="body2" color={theme.palette.primary.main}>
            Balance: {formatCurrency(payload[2].value)}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        bgcolor: theme.palette.background.paper,
        borderRadius: 2,
        height: 400
      }}
    >
      <Typography variant="h6" gutterBottom>
        Análisis de Transacciones
      </Typography>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis
            dataKey="date"
            stroke={theme.palette.text.secondary}
            tick={{ fill: theme.palette.text.primary }}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            tick={{ fill: theme.palette.text.primary }}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="ingresos"
            stackId="1"
            stroke={theme.palette.success.main}
            fill={theme.palette.success.light}
            fillOpacity={0.8}
          />
          <Area
            type="monotone"
            dataKey="gastos"
            stackId="2"
            stroke={theme.palette.error.main}
            fill={theme.palette.error.light}
            fillOpacity={0.8}
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke={theme.palette.primary.main}
            fill={theme.palette.primary.light}
            fillOpacity={0.8}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
};
