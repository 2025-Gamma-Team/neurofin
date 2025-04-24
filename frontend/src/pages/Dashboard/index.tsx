import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent, LinearProgress, useTheme, Chip } from '@mui/material';
import { TrendingUp, TrendingDown, Warning, CheckCircle, AccountBalance, LocationOn } from '@mui/icons-material';
import ExpensesChart from '../../components/ExpensesChart/ExpensesChart';
import { TransactionsChart } from '../../components/TransactionsChart/TransactionsChart';
import { Avatar } from '../../components/Avatar/Avatar';
import { UserAvatar } from '../../components/UserAvatar/UserAvatar';
import { ChatBot } from '../../components/ChatBot/ChatBot';

interface Transaction {
  date: string;
  description: string;
  amount: number;
  type: 'ingreso' | 'gasto';
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
  { date: '01/01/2024', description: 'Salario', amount: 3000, type: 'ingreso' },
  { date: '02/01/2024', description: 'Supermercado', amount: 150, type: 'gasto' },
  { date: '03/01/2024', description: 'Gasolina', amount: 50, type: 'gasto' },
  { date: '05/01/2024', description: 'Netflix', amount: 15, type: 'gasto' },
  { date: '10/01/2024', description: 'Freelance', amount: 500, type: 'ingreso' },
  { date: '15/01/2024', description: 'Alquiler', amount: 800, type: 'gasto' },
  { date: '20/01/2024', description: 'Luz', amount: 60, type: 'gasto' },
  { date: '25/01/2024', description: 'Agua', amount: 40, type: 'gasto' },
  { date: '28/01/2024', description: 'Inversión', amount: 200, type: 'ingreso' },
  { date: '01/02/2024', description: 'Salario', amount: 3000, type: 'ingreso' },
  { date: '02/02/2024', description: 'Supermercado', amount: 180, type: 'gasto' },
  { date: '05/02/2024', description: 'Gimnasio', amount: 30, type: 'gasto' },
  { date: '10/02/2024', description: 'Freelance', amount: 400, type: 'ingreso' },
  { date: '15/02/2024', description: 'Alquiler', amount: 800, type: 'gasto' },
  { date: '20/02/2024', description: 'Internet', amount: 45, type: 'gasto' },
  { date: '25/02/2024', description: 'Gas', amount: 35, type: 'gasto' },
  { date: '28/02/2024', description: 'Inversión', amount: 250, type: 'ingreso' },
];

const Dashboard = () => {
  const theme = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [financialHealth, setFinancialHealth] = useState<{
    score: number;
    status: 'excelente' | 'buena' | 'regular' | 'mala';
    message: string;
  }>({
    score: 0,
    status: 'regular',
    message: 'Cargando...'
  });

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
    // Calcular salud financiera basada en las transacciones
    const calculateFinancialHealth = () => {
      const totalIncome = transactions
        .filter(t => t.type === 'ingreso')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpenses = transactions
        .filter(t => t.type === 'gasto')
        .reduce((sum, t) => sum + t.amount, 0);

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
  }, [transactions]);

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
                  bgcolor: theme.palette.primary.main,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <AccountBalance sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" sx={headerStyle} gutterBottom>
                    Bienvenido a NeuroFin
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.palette.text.secondary }} gutterBottom>
                    Tu plataforma de gestión financiera personal.
                  </Typography>
                  {locationInfo && (
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Chip
                        icon={<LocationOn />}
                        label={locationInfo.country}
                        sx={{ 
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.1)',
                          color: theme.palette.text.primary,
                          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.5)' : 'rgba(76, 175, 80, 0.3)'}` 
                        }}
                        size="small"
                      />
                      <Chip
                        label={`Moneda: ${locationInfo.currency}`}
                        sx={{ 
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.1)',
                          color: theme.palette.text.primary,
                          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.5)' : 'rgba(76, 175, 80, 0.3)'}` 
                        }}
                        size="small"
                      />
                      <Chip
                        label={`Zona: ${locationInfo.timezone}`}
                        sx={{ 
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.1)',
                          color: theme.palette.text.primary,
                          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.5)' : 'rgba(76, 175, 80, 0.3)'}` 
                        }}
                        size="small"
                      />
                    </Box>
                  )}
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
                    Juan Pérez
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                    Miembro desde 2024
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
                      Correo: juan.perez@example.com
                    </Typography>
                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                      Teléfono: +34 123 456 789
                    </Typography>
                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                      País: España
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
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.05)', 
                p: 4, 
                borderRadius: 2,
                border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.15)'}`,
                mb: 4
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <AccountBalance sx={{ color: theme.palette.success.main, fontSize: 32 }} />
                  <Typography variant="h5" sx={{ color: theme.palette.success.main }}>
                    Balance Total
                  </Typography>
                </Box>
                <Typography variant="h2" sx={{ color: theme.palette.success.main, mb: 2 }}>
                  {new Intl.NumberFormat('es-MX', { 
                    style: 'currency', 
                    currency: locationInfo?.currency || 'MXN',
                    minimumFractionDigits: 2
                  }).format(transactions.reduce((sum, t) => sum + (t.type === 'ingreso' ? t.amount : -t.amount), 0))}
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
                      }).format(transactions.filter(t => t.type === 'ingreso').reduce((sum, t) => sum + t.amount, 0))}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>Salario</Typography>
                      <Typography variant="body2" sx={{ color: theme.palette.success.main }}>$15000.00</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>Freelance</Typography>
                      <Typography variant="body2" sx={{ color: theme.palette.success.main }}>$5000.00</Typography>
                    </Box>
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
                      }).format(transactions.filter(t => t.type === 'gasto').reduce((sum, t) => sum + t.amount, 0))}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>Vivienda</Typography>
                      <Typography variant="body2" sx={{ color: theme.palette.error.main }}>$5000.00</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>Alimentación</Typography>
                      <Typography variant="body2" sx={{ color: theme.palette.error.main }}>$3000.00</Typography>
                    </Box>
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
