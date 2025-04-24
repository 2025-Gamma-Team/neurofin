import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent, LinearProgress, useTheme, Chip } from '@mui/material';
import { TrendingUp, TrendingDown, Warning, CheckCircle, AccountBalance, LocationOn } from '@mui/icons-material';
import ExpensesChart from '../../components/ExpensesChart/ExpensesChart';
import { TransactionsChart } from '../../components/TransactionsChart/TransactionsChart';
import { Avatar } from '../../components/Avatar/Avatar';
import { UserAvatar } from '../../components/UserAvatar/UserAvatar';
import { ChatBot } from '../../components/ChatBot/ChatBot';
import { useAuthStore } from '../../store/authStore';
import { jwtDecode } from "jwt-decode";
import api from "../../utils/api";

interface Transaction {
  id: number;
  name: string;
  amount: number;
  type: 'ingreso' | 'egreso';
  date: string;
}

interface APIBalanceEntry {
  userId: string;
  amount: number;
  income: boolean;
  name: string;
  date: string;
}

interface DecodedToken {
  sub: string;
  email: string;
  'cognito:username': string;
  exp: number;
  iat: number;
}

interface LocationInfo {
  country: string;
  currency: string;
  timezone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const mockTransactions: Transaction[] = [
  { id: 1, date: '01/01/2024', name: 'Salario', amount: 3000, type: 'ingreso' },
  { id: 2, date: '02/01/2024', name: 'Supermercado', amount: 150, type: 'egreso' },
  { id: 3, date: '03/01/2024', name: 'Gasolina', amount: 50, type: 'egreso' },
  { id: 4, date: '05/01/2024', name: 'Netflix', amount: 15, type: 'egreso' },
  { id: 5, date: '10/01/2024', name: 'Freelance', amount: 500, type: 'ingreso' },
  { id: 6, date: '15/01/2024', name: 'Alquiler', amount: 800, type: 'egreso' },
  { id: 7, date: '20/01/2024', name: 'Luz', amount: 60, type: 'egreso' },
  { id: 8, date: '25/01/2024', name: 'Agua', amount: 40, type: 'egreso' },
  { id: 9, date: '28/01/2024', name: 'Inversión', amount: 200, type: 'ingreso' },
  { id: 10, date: '01/02/2024', name: 'Salario', amount: 3000, type: 'ingreso' },
  { id: 11, date: '02/02/2024', name: 'Supermercado', amount: 180, type: 'egreso' },
  { id: 12, date: '05/02/2024', name: 'Gimnasio', amount: 30, type: 'egreso' },
  { id: 13, date: '10/02/2024', name: 'Freelance', amount: 400, type: 'ingreso' },
  { id: 14, date: '15/02/2024', name: 'Alquiler', amount: 800, type: 'egreso' },
  { id: 15, date: '20/02/2024', name: 'Internet', amount: 45, type: 'egreso' },
  { id: 16, date: '25/02/2024', name: 'Gas', amount: 35, type: 'egreso' },
  { id: 17, date: '28/02/2024', name: 'Inversión', amount: 250, type: 'ingreso' }
];

const Dashboard = () => {
  const theme = useTheme();
  const { user, token } = useAuthStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [balance, setBalance] = useState(0);
  const [topIncomes, setTopIncomes] = useState<{ name: string; amount: number }[]>([]);
  const [topExpenses, setTopExpenses] = useState<{ name: string; amount: number }[]>([]);
  const [financialHealth, setFinancialHealth] = useState<{
    score: number;
    status: 'excelente' | 'buena' | 'regular' | 'mala';
    message: string;
  }>({
    score: 0,
    status: 'regular',
    message: 'Cargando...'
  });

  const getUserIdFromToken = (): string => {
    if (!token) return '';
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.sub || '';
    } catch (error) {
      console.error('Error decodificando token:', error);
      return '';
    }
  };

  const fetchTransactions = async () => {
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error('No se pudo obtener el userId');
      }

      const response = await api.get(`/balance/${userId}`);
      const parsedBody = JSON.parse(response.data.body);
      
      if (parsedBody.success && Array.isArray(parsedBody.data)) {
        const formattedTransactions: Transaction[] = parsedBody.data.map((entry: APIBalanceEntry) => ({
          id: Date.now() + Math.random(),
          name: entry.name,
          type: entry.income ? 'ingreso' : 'egreso',
          amount: Number(entry.amount),
          date: entry.date
        }));

        setTransactions(formattedTransactions);

        // Calcular totales
        const incomeTotal = formattedTransactions
          .filter(t => t.type === 'ingreso')
          .reduce((sum, t) => sum + t.amount, 0);

        const expensesTotal = formattedTransactions
          .filter(t => t.type === 'egreso')
          .reduce((sum, t) => sum + t.amount, 0);

        // Obtener los principales ingresos y egresos
        const incomes = formattedTransactions
          .filter(t => t.type === 'ingreso')
          .reduce((acc, curr) => {
            const existing = acc.find(item => item.name === curr.name);
            if (existing) {
              existing.amount += curr.amount;
            } else {
              acc.push({ name: curr.name, amount: curr.amount });
            }
            return acc;
          }, [] as { name: string; amount: number }[])
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 2);

        const expenses = formattedTransactions
          .filter(t => t.type === 'egreso')
          .reduce((acc, curr) => {
            const existing = acc.find(item => item.name === curr.name);
            if (existing) {
              existing.amount += curr.amount;
            } else {
              acc.push({ name: curr.name, amount: curr.amount });
            }
            return acc;
          }, [] as { name: string; amount: number }[])
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 2);

        setTopIncomes(incomes);
        setTopExpenses(expenses);
        setTotalIncome(incomeTotal);
        setTotalExpenses(expensesTotal);
        setBalance(incomeTotal - expensesTotal);
      }
    } catch (error) {
      console.error('Error al cargar las transacciones:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTransactions();
    }
  }, [token]);

  useEffect(() => {
    // Obtener información de ubicación
    const getLocationInfo = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();

        setLocationInfo({
          country: data.country_name,
          currency: data.currency,
          timezone: data.timezone,
          coordinates: {
            lat: data.latitude,
            lng: data.longitude
          }
        });
      } catch (error) {
        console.error('Error al obtener la ubicación:', error);
        // Valores por defecto para España
        setLocationInfo({
          country: 'España',
          currency: 'EUR',
          timezone: 'Europe/Madrid',
          coordinates: {
            lat: 40.4168,
            lng: -3.7038
          }
        });
      }
    };

    getLocationInfo();
  }, []);

  useEffect(() => {
    // Calcular salud financiera basada en las transacciones reales
    const calculateFinancialHealth = () => {
      const savingsRate = totalIncome > 0 ? (totalIncome - totalExpenses) / totalIncome : 0;

      let status: 'excelente' | 'buena' | 'regular' | 'mala';
      let message: string;

      if (savingsRate >= 0.3) {
        status = 'excelente';
        message = '¡Excelente! Estás ahorrando más del 30% de tus ingresos.';
      } else if (savingsRate >= 0.2) {
        status = 'buena';
        message = 'Buena salud financiera. Estás ahorrando entre 20-30% de tus ingresos.';
      } else if (savingsRate >= 0.1) {
        status = 'regular';
        message = 'Salud financiera regular. Considera aumentar tus ahorros.';
      } else {
        status = 'mala';
        message = 'Necesitas mejorar tu salud financiera. Estás gastando más de lo que ingresas.';
      }

      setFinancialHealth({
        score: savingsRate * 100,
        status,
        message
      });
    };

    calculateFinancialHealth();
  }, [totalIncome, totalExpenses]);

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'excelente':
        return theme.palette.success.main;
      case 'buena':
        return theme.palette.info.main;
      case 'regular':
        return theme.palette.warning.main;
      case 'mala':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'excelente':
        return <CheckCircle color="success" />;
      case 'buena':
        return <TrendingUp color="info" />;
      case 'regular':
        return <Warning color="warning" />;
      case 'mala':
        return <TrendingDown color="error" />;
      default:
        return null;
    }
  };

  const cardStyle = {
    bgcolor: theme.palette.mode === 'dark' ? 'rgba(28, 34, 35, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    borderRadius: 2,
    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.3)'}`,
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 8px 32px rgba(76, 175, 80, 0.1)' 
      : '0 8px 32px rgba(0, 0, 0, 0.1)',
    color: theme.palette.text.primary,
    height: '100%'
  };

  const headerStyle = {
    color: theme.palette.text.primary,
    fontWeight: 500
  };

  return (
    <Box sx={{ 
      flexGrow: 1, 
      p: 3, 
      bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5', 
      minHeight: '100vh' 
    }}>
      <Grid container spacing={3}>
        {/* Header Section */}
        <Grid item xs={12}>
          <Card sx={cardStyle}>
            <CardContent>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 3
              }}>
                <Box sx={{
                  width: 80,
                  height: 80,
                }}>
                  <UserAvatar healthStatus={financialHealth.status} size={80} />
                </Box>
                <Box>
                  <Typography variant="h4" sx={headerStyle}>
                    Bienvenido {user ? `${user.firstName} ${user.lastName}` : ''} a NeuroFin
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {locationInfo?.country || 'Cargando ubicación...'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Section */}
        <Grid item xs={12} md={4} id="profile-section">
          <Card sx={cardStyle}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                height: '100%'
              }}>
                <UserAvatar healthStatus={financialHealth.status} size={240} />
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Typography variant="h4" sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                    {user ? `${user.firstName} ${user.lastName}` : 'Usuario'}
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                    {user?.createdAt 
                      ? `Miembro desde ${new Date(user.createdAt).getFullYear()}`
                      : 'Miembro nuevo'}
                  </Typography>
                </Box>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  width: '100%',
                  mt: 2
                }}>
                  <Typography variant="h6" sx={{ color: theme.palette.text.primary, textAlign: 'center', mb: 1 }}>
                    Información Personal
                  </Typography>
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    p: 3,
                    borderRadius: 2
                  }}>
                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                      Correo: {user?.email || '-'}
                    </Typography>
                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                      Nombre: {user?.firstName} {user?.lastName}
                    </Typography>
                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                      Usuario: {user?.email?.split('@')[0] || '-'} 
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Financial Health Section */}
        <Grid item xs={12} md={8}>
          <Card sx={cardStyle}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" sx={{ color: theme.palette.success.main, mb: 4, fontWeight: 500 }}>
                Resumen Financiero
              </Typography>

              {/* Balance Total */}
              <Box id="balance-total" sx={{ 
                bgcolor: balance >= 0 
                  ? theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.05)'
                  : theme.palette.mode === 'dark' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(244, 67, 54, 0.05)', 
                p: 4, 
                borderRadius: 2,
                border: `1px solid ${
                  balance >= 0
                    ? theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.15)'
                    : theme.palette.mode === 'dark' ? 'rgba(244, 67, 54, 0.2)' : 'rgba(244, 67, 54, 0.15)'
                }`,
                mb: 4
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <AccountBalance sx={{ 
                    color: balance >= 0 ? theme.palette.success.main : theme.palette.error.main, 
                    fontSize: 32 
                  }} />
                  <Typography variant="h5" sx={{ 
                    color: balance >= 0 ? theme.palette.success.main : theme.palette.error.main 
                  }}>
                    Balance Total
                  </Typography>
                </Box>
                <Typography variant="h2" sx={{ 
                  color: balance >= 0 ? theme.palette.success.main : theme.palette.error.main,
                  mb: 2 
                }}>
                  {new Intl.NumberFormat('es-MX', { 
                    style: 'currency', 
                    currency: locationInfo?.currency || 'MXN',
                    minimumFractionDigits: 2
                  }).format(balance)}
                </Typography>
                <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                  Actualizado hace 2 horas
                </Typography>
              </Box>

              {/* Ingresos y Gastos */}
              <Grid container spacing={3}>
                {/* Ingresos Mensuales */}
                <Grid item xs={12} md={6} id="ingresos-mensuales">
                  <Box sx={{ 
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.05)', 
                    p: 2, 
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.15)'}`,
                    height: '100%'
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ color: theme.palette.success.main }}>$</Typography>
                        <Typography variant="body1" sx={{ color: theme.palette.success.main }}>
                          Ingresos Mensuales
                        </Typography>
                      </Box>
                      <TrendingUp sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                    </Box>
                    <Typography variant="h4" sx={{ color: theme.palette.success.main, mb: 2 }}>
                      {new Intl.NumberFormat('es-MX', { 
                        style: 'currency', 
                        currency: locationInfo?.currency || 'MXN',
                        minimumFractionDigits: 2
                      }).format(totalIncome)}
                    </Typography>
                    {topIncomes.map((income, index) => (
                      <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                          {income.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme.palette.success.main }}>
                          ${income.amount.toLocaleString()}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>

                {/* Gastos Mensuales */}
                <Grid item xs={12} md={6} id="gastos-mensuales">
                  <Box sx={{ 
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(244, 67, 54, 0.05)', 
                    p: 2, 
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(244, 67, 54, 0.2)' : 'rgba(244, 67, 54, 0.15)'}`,
                    height: '100%'
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ color: theme.palette.error.main }}>—</Typography>
                        <Typography variant="body1" sx={{ color: theme.palette.error.main }}>
                          Gastos Mensuales
                        </Typography>
                      </Box>
                      <TrendingDown sx={{ color: theme.palette.error.main, fontSize: 20 }} />
                    </Box>
                    <Typography variant="h4" sx={{ color: theme.palette.error.main, mb: 2 }}>
                      {new Intl.NumberFormat('es-MX', { 
                        style: 'currency', 
                        currency: locationInfo?.currency || 'MXN',
                        minimumFractionDigits: 2
                      }).format(totalExpenses)}
                    </Typography>
                    {topExpenses.map((expense, index) => (
                      <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                          {expense.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme.palette.error.main }}>
                          ${expense.amount.toLocaleString()}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Transactions Section */}
        <Grid item xs={12} id="transactions-summary">
          <Card sx={cardStyle}>
            <CardContent>
              <Typography variant="h6" sx={headerStyle} gutterBottom>
                Resumen de Transacciones
              </Typography>
              <TransactionsChart 
                transactions={transactions} 
                currency={locationInfo?.currency || 'MXN'} 
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ChatBot Component */}
      <ChatBot />
    </Box>
  );
};

export default Dashboard;
