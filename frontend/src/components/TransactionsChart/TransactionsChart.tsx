import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  TooltipProps
} from 'recharts';
import { Paper, Typography, Box, useTheme } from '@mui/material';
import { TrendingUp, TrendingDown, Savings } from '@mui/icons-material';

interface Transaction {
  id: number;
  name: string;
  amount: number;
  type: 'ingreso' | 'egreso';
  date: string;
}

interface TransactionsChartProps {
  transactions: Transaction[];
  currency: string;
}

interface ChartData {
  date: string;
  ingresos: number;
  gastos: number;
  balance: number;
}

export const TransactionsChart: React.FC<TransactionsChartProps> = ({ transactions, currency }) => {
  const theme = useTheme();

  // Procesar los datos para la gráfica
  const chartData = transactions.reduce((acc: ChartData[], transaction) => {
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
        gastos: transaction.type === 'egreso' ? transaction.amount : 0,
        balance: transaction.type === 'ingreso' ? transaction.amount : -transaction.amount
      });
    }
    return acc;
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const ingreso = (payload.find(p => p.name === 'Dinero que entró')?.value as number) || 0;
      const gasto = (payload.find(p => p.name === 'Deudas y gastos')?.value as number) || 0;
      const balance = ingreso - gasto;

      return (
        <Paper
          elevation={3}
          sx={{
            p: 2,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(28, 34, 35, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.3)'}`,
            color: theme.palette.text.primary,
            minWidth: 200
          }}
        >
          <Typography variant="subtitle2" gutterBottom sx={{ borderBottom: `1px solid ${theme.palette.divider}`, pb: 1 }}>
            {label}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <TrendingUp sx={{ color: theme.palette.success.main }} />
            <Typography variant="body2" sx={{ color: theme.palette.success.main, display: 'flex', alignItems: 'center' }}>
              Dinero que entró: <Box component="span" sx={{ ml: 1, fontSize: '1.1em' }}>{formatCurrency(ingreso)}</Box>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <TrendingDown sx={{ color: theme.palette.error.main }} />
            <Typography variant="body2" sx={{ color: theme.palette.error.main, display: 'flex', alignItems: 'center' }}>
              Deudas y gastos: <Box component="span" sx={{ ml: 1, fontSize: '1.1em' }}>{formatCurrency(gasto)}</Box>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pt: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Savings sx={{ color: balance >= 0 ? theme.palette.success.main : theme.palette.error.main }} />
            <Typography variant="body2" sx={{ color: balance >= 0 ? theme.palette.success.main : theme.palette.error.main, display: 'flex', alignItems: 'center' }}>
              Lo que quedó: <Box component="span" sx={{ ml: 1, fontSize: '1.1em', fontWeight: 'bold' }}>{formatCurrency(balance)}</Box>
            </Typography>
          </Box>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper
      sx={{
        p: 3,
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(28, 34, 35, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderRadius: 2,
        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.3)'}`,
        height: 400,
        color: theme.palette.text.primary
      }}
    >
      <Typography variant="h6" gutterBottom align="center" sx={{ mb: 3 }}>
        ¿Cómo va mi dinero? 💰
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUp sx={{ color: theme.palette.success.main, fontSize: 28 }} />
          <Typography sx={{ color: theme.palette.text.primary }}>Dinero que entró</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingDown sx={{ color: theme.palette.error.main, fontSize: 28 }} />
          <Typography sx={{ color: theme.palette.text.primary }}>Deudas y gastos</Typography>
        </Box>
      </Box>
      <ResponsiveContainer width="100%" height="75%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} />
          <XAxis
            dataKey="date"
            stroke={theme.palette.text.primary}
            tick={{ fill: theme.palette.text.primary }}
          />
          <YAxis
            stroke={theme.palette.text.primary}
            tick={{ fill: theme.palette.text.primary }}
            tickFormatter={formatCurrency}
          />
          <Tooltip content={CustomTooltip} />
          <ReferenceLine y={0} stroke={theme.palette.divider} strokeDasharray="3 3" />
          <Bar
            dataKey="ingresos"
            name="Dinero que entró"
            fill={theme.palette.success.main}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="gastos"
            name="Deudas y gastos"
            fill={theme.palette.error.main}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};
