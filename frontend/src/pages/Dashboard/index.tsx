import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent, LinearProgress, useTheme, Chip } from '@mui/material';
import { TrendingUp, TrendingDown, Warning, CheckCircle, AccountBalance, LocationOn } from '@mui/icons-material';
import ExpensesChart from '../../components/ExpensesChart/ExpensesChart';
import { TransactionsChart } from '../../components/TransactionsChart/TransactionsChart';
import { Avatar } from '../../components/Avatar/Avatar';
import { UserAvatar } from '../../components/UserAvatar/UserAvatar';
import { Map } from '../../components/Map/Map';

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

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, bgcolor: theme.palette.background.paper }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                pointerEvents: 'none'
              }
            }}>
              <Box sx={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Avatar size={100} iconSize={50} />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  Bienvenido a NeuroFin
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Tu plataforma de gestión financiera personal.
                </Typography>
                {locationInfo && (
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip
                      icon={<LocationOn />}
                      label={locationInfo.country}
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={`Moneda: ${locationInfo.currency}`}
                      color="secondary"
                      variant="outlined"
                    />
                    <Chip
                      label={`Zona: ${locationInfo.timezone}`}
                      color="info"
                      variant="outlined"
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', bgcolor: theme.palette.background.paper }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {getHealthIcon(financialHealth.status)}
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Salud Financiera
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={financialHealth.score}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  mb: 2,
                  backgroundColor: theme.palette.grey[200],
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getHealthColor(financialHealth.status)
                  }
                }}
              />
              <Typography variant="body1" color="text.secondary">
                {financialHealth.message}
              </Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Tasa de Ahorro: {financialHealth.score.toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', bgcolor: theme.palette.background.paper }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumen de Transacciones
              </Typography>
              <TransactionsChart transactions={transactions} currency={locationInfo?.currency || 'EUR'} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <UserAvatar healthStatus={financialHealth.status} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{
            maxWidth: 800,
            m: 2,
            background: theme.palette.background.paper,
            borderRadius: 4,
            border: `2px solid ${theme.palette.primary.main}`,
            boxShadow: `0 8px 32px ${theme.palette.primary.main}25`,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: `0 12px 40px ${theme.palette.primary.main}40`
            }
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontWeight: 'bold'
              }}>
                <LocationOn sx={{ color: theme.palette.primary.main }} />
                Ubicación
              </Typography>
              <Box sx={{
                height: 400,
                width: '100%',
                mt: 2,
                borderRadius: 2,
                overflow: 'hidden',
                border: `1px solid ${theme.palette.divider}`
              }}>
                {locationInfo && (
                  <Map
                    center={[locationInfo.coordinates.lat, locationInfo.coordinates.lng]}
                    zoom={13}
                    markers={[
                      {
                        position: [locationInfo.coordinates.lat, locationInfo.coordinates.lng],
                        title: "Tu ubicación",
                        description: `${locationInfo.country} - ${locationInfo.timezone}`
                      }
                    ]}
                  />
                )}
              </Box>
              <Typography variant="body2" sx={{
                mt: 2,
                color: theme.palette.primary.main,
                textAlign: 'center',
                fontStyle: 'italic'
              }}>
                {locationInfo ? `${locationInfo.country} - ${locationInfo.currency}` : 'Cargando ubicación...'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
