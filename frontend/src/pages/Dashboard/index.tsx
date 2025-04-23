import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent, LinearProgress, useTheme, Chip } from '@mui/material';
import { TrendingUp, TrendingDown, Warning, CheckCircle, AccountBalance, LocationOn } from '@mui/icons-material';
import ExpensesChart from '../../components/ExpensesChart/ExpensesChart';
import { TransactionsChart } from '../../components/TransactionsChart/TransactionsChart';
import { Avatar } from '../../components/Avatar/Avatar';
import { UserAvatar } from '../../components/UserAvatar/UserAvatar';
import Map from '../../components/Map/Map';

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
    bgcolor: 'rgba(28, 34, 35, 0.95)',
    borderRadius: 2,
    border: '1px solid rgba(76, 175, 80, 0.5)',
    boxShadow: '0 8px 32px rgba(76, 175, 80, 0.1)',
    color: 'white',
    height: '100%'
  };

  const headerStyle = {
    color: 'white',
    fontWeight: 500
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3, bgcolor: '#1a1a1a', minHeight: '100vh' }}>
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
                  bgcolor: 'primary.main',
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
                  <Typography variant="body1" sx={{ color: 'grey.400' }} gutterBottom>
                    Tu plataforma de gestión financiera personal.
                  </Typography>
                  {locationInfo && (
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Chip
                        icon={<LocationOn />}
                        label={locationInfo.country}
                        sx={{ bgcolor: 'rgba(76, 175, 80, 0.2)', color: 'white', border: '1px solid rgba(76, 175, 80, 0.5)' }}
                        size="small"
                      />
                      <Chip
                        label={`Moneda: ${locationInfo.currency}`}
                        sx={{ bgcolor: 'rgba(76, 175, 80, 0.2)', color: 'white', border: '1px solid rgba(76, 175, 80, 0.5)' }}
                        size="small"
                      />
                      <Chip
                        label={`Zona: ${locationInfo.timezone}`}
                        sx={{ bgcolor: 'rgba(76, 175, 80, 0.2)', color: 'white', border: '1px solid rgba(76, 175, 80, 0.5)' }}
                        size="small"
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Avatar Section */}
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardContent>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 2
              }}>
                <Typography variant="h6" sx={headerStyle}>
                  Tu Avatar Financiero
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    size="small"
                    label="Actualizar"
                    sx={{ bgcolor: 'rgba(76, 175, 80, 0.2)', color: 'white', border: '1px solid rgba(76, 175, 80, 0.5)' }}
                  />
                  <Chip
                    size="small"
                    label="Guardar"
                    sx={{ bgcolor: 'rgba(76, 175, 80, 0.2)', color: 'white', border: '1px solid rgba(76, 175, 80, 0.5)' }}
                  />
                </Box>
              </Box>
              <UserAvatar healthStatus={financialHealth.status} />
            </CardContent>
          </Card>
        </Grid>

        {/* Financial Health Section */}
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#4CAF50', mb: 3 }}>
                Resumen Financiero
              </Typography>

              {/* Balance Total */}
              <Box sx={{ 
                bgcolor: 'rgba(76, 175, 80, 0.1)', 
                p: 3, 
                borderRadius: 2,
                border: '1px solid rgba(76, 175, 80, 0.2)',
                mb: 3
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <AccountBalance sx={{ color: '#4CAF50', fontSize: 28 }} />
                  <Typography variant="h6" sx={{ color: '#4CAF50' }}>
                    Balance Total
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ color: '#4CAF50', mb: 1 }}>
                  {new Intl.NumberFormat('es-MX', { 
                    style: 'currency', 
                    currency: locationInfo?.currency || 'MXN',
                    minimumFractionDigits: 2
                  }).format(transactions.reduce((sum, t) => sum + (t.type === 'ingreso' ? t.amount : -t.amount), 0))}
                </Typography>
                <Typography variant="body2" sx={{ color: 'grey.400' }}>
                  Actualizado hace 2 horas
                </Typography>
              </Box>

              {/* Ingresos y Gastos */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {/* Ingresos Mensuales */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    bgcolor: 'rgba(76, 175, 80, 0.1)', 
                    p: 2, 
                    borderRadius: 2,
                    border: '1px solid rgba(76, 175, 80, 0.2)',
                    height: '100%'
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ color: '#4CAF50' }}>$</Typography>
                        <Typography variant="body1" sx={{ color: '#4CAF50' }}>
                          Ingresos Mensuales
                        </Typography>
                      </Box>
                      <TrendingUp sx={{ color: '#4CAF50', fontSize: 20 }} />
                    </Box>
                    <Typography variant="h4" sx={{ color: '#4CAF50', mb: 2 }}>
                      {new Intl.NumberFormat('es-MX', { 
                        style: 'currency', 
                        currency: locationInfo?.currency || 'MXN',
                        minimumFractionDigits: 2
                      }).format(transactions.filter(t => t.type === 'ingreso').reduce((sum, t) => sum + t.amount, 0))}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: 'grey.400' }}>Salario</Typography>
                      <Typography variant="body2" sx={{ color: '#4CAF50' }}>$15000.00</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: 'grey.400' }}>Freelance</Typography>
                      <Typography variant="body2" sx={{ color: '#4CAF50' }}>$5000.00</Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Gastos Mensuales */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    bgcolor: 'rgba(244, 67, 54, 0.1)', 
                    p: 2, 
                    borderRadius: 2,
                    border: '1px solid rgba(244, 67, 54, 0.2)',
                    height: '100%'
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ color: '#f44336' }}>—</Typography>
                        <Typography variant="body1" sx={{ color: '#f44336' }}>
                          Gastos Mensuales
                        </Typography>
                      </Box>
                      <TrendingDown sx={{ color: '#f44336', fontSize: 20 }} />
                    </Box>
                    <Typography variant="h4" sx={{ color: '#f44336', mb: 2 }}>
                      {new Intl.NumberFormat('es-MX', { 
                        style: 'currency', 
                        currency: locationInfo?.currency || 'MXN',
                        minimumFractionDigits: 2
                      }).format(transactions.filter(t => t.type === 'gasto').reduce((sum, t) => sum + t.amount, 0))}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: 'grey.400' }}>Vivienda</Typography>
                      <Typography variant="body2" sx={{ color: '#f44336' }}>$5000.00</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: 'grey.400' }}>Alimentación</Typography>
                      <Typography variant="body2" sx={{ color: '#f44336' }}>$3000.00</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {/* Mapa */}
              <Box sx={{
                height: 300,
                width: '100%',
                borderRadius: 2,
                overflow: 'hidden',
                border: '1px solid rgba(76, 175, 80, 0.2)'
              }}>
                {locationInfo && (
                  <Map
                    center={[19.4326, -99.1332]}
                    markers={[
                      {
                        position: [19.4326, -99.1332],
                        popup: "Sucursal Principal"
                      }
                    ]}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Transactions Section */}
        <Grid item xs={12}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography variant="h6" sx={headerStyle} gutterBottom>
                Resumen de Transacciones
              </Typography>
              <TransactionsChart 
                transactions={transactions} 
                currency={locationInfo?.currency || 'EUR'} 
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
