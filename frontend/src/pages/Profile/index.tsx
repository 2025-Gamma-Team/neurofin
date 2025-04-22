import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Button,
  useTheme,
  Chip,
  IconButton,
  Tooltip
} from "@mui/material";
import { useAuthStore } from "../../store/authStore";
import {
  Edit as EditIcon,
  AccountBalance as AccountBalanceIcon,
  Timeline as TimelineIcon,
  LocationOn as LocationIcon,
  Language as LanguageIcon,
  AttachMoney as MoneyIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

export default function Profile() {
  const { user } = useAuthStore();
  const theme = useTheme();

  const userBadges = [
    { icon: <LocationIcon />, text: 'Mexico', color: '#FF9800' },
    { icon: <MoneyIcon />, text: 'Moneda: MXN', color: '#4CAF50' },
    { icon: <LanguageIcon />, text: 'Zona: America/Mexico_City', color: '#2196F3' }
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{
            p: 3,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(38, 38, 38, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            borderRadius: 2,
            border: '1px solid rgba(50, 205, 50, 0.5)',
            boxShadow: '0 0 10px rgba(50, 205, 50, 0.2)'
          }}>
            {/* Header con Avatar y Acciones */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 4,
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 3
              }}>
                <Avatar sx={{
                  width: 120,
                  height: 120,
                  bgcolor: '#2196F3',
                  fontSize: '3rem',
                  mb: { xs: 2, md: 0 },
                  border: '4px solid',
                  borderColor: 'rgba(33, 150, 243, 0.5)',
                  boxShadow: '0 0 20px rgba(33, 150, 243, 0.3)'
                }}>
                  {user?.firstName?.[0]?.toUpperCase() || 'U'}
                </Avatar>
                <Box>
                  <Typography variant="h4" gutterBottom sx={{
                    color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                    fontWeight: 600
                  }}>
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  <Typography variant="subtitle1" sx={{
                    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                    mb: 2
                  }}>
                    {user?.email}
                  </Typography>
                  {user?.financialPersonality && (
                    <Chip
                      label={`Perfil Financiero: ${user.financialPersonality.charAt(0).toUpperCase() + user.financialPersonality.slice(1)}`}
                      sx={{
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(50, 205, 50, 0.1)' : 'rgba(27, 94, 32, 0.05)',
                        color: theme.palette.mode === 'dark' ? '#32CD32' : '#1B5E20',
                        border: '1px solid',
                        borderColor: theme.palette.mode === 'dark' ? 'rgba(50, 205, 50, 0.3)' : 'rgba(27, 94, 32, 0.3)',
                        mb: 2
                      }}
                    />
                  )}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {userBadges.map((badge, index) => (
                      <Chip
                        key={index}
                        icon={badge.icon}
                        label={badge.text}
                        sx={{
                          bgcolor: `${badge.color}20`,
                          color: badge.color,
                          border: `1px solid ${badge.color}40`,
                          '& .MuiChip-icon': {
                            color: badge.color
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
              <Box sx={{
                display: 'flex',
                gap: 1
              }}>
                <Tooltip title="Notificaciones">
                  <IconButton sx={{
                    color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                    '&:hover': { bgcolor: 'rgba(33, 150, 243, 0.1)' }
                  }}>
                    <NotificationsIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Configuración">
                  <IconButton sx={{
                    color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                    '&:hover': { bgcolor: 'rgba(33, 150, 243, 0.1)' }
                  }}>
                    <SettingsIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Seguridad">
                  <IconButton sx={{
                    color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                    '&:hover': { bgcolor: 'rgba(33, 150, 243, 0.1)' }
                  }}>
                    <SecurityIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Grid container spacing={4}>
              {/* Sección de Estadísticas */}
              <Grid item xs={12} md={8}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{
                    color: theme.palette.mode === 'dark' ? '#32CD32' : '#1B5E20',
                    fontWeight: 600,
                    mb: 3
                  }}>
                    Resumen Financiero
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{
                        p: 3,
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(50, 205, 50, 0.1)' : 'rgba(27, 94, 32, 0.05)',
                        border: '1px solid',
                        borderColor: theme.palette.mode === 'dark' ? 'rgba(50, 205, 50, 0.3)' : 'rgba(27, 94, 32, 0.3)',
                        borderRadius: 2,
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 4px 20px rgba(50, 205, 50, 0.2)'
                        }
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <AccountBalanceIcon sx={{
                            color: theme.palette.mode === 'dark' ? '#32CD32' : '#1B5E20',
                            mr: 1,
                            fontSize: '2rem'
                          }} />
                          <Typography variant="subtitle1" sx={{
                            color: theme.palette.mode === 'dark' ? '#32CD32' : '#1B5E20',
                            fontWeight: 600
                          }}>
                            Balance Total
                          </Typography>
                        </Box>
                        <Typography variant="h4" sx={{
                          color: theme.palette.mode === 'dark' ? '#32CD32' : '#1B5E20',
                          fontWeight: 700
                        }}>
                          $25,840.00 MXN
                        </Typography>
                        <Typography variant="body2" sx={{
                          color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                          mt: 1
                        }}>
                          Actualizado hace 2 horas
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Paper sx={{
                        p: 3,
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(50, 205, 50, 0.1)' : 'rgba(27, 94, 32, 0.05)',
                        border: '1px solid',
                        borderColor: theme.palette.mode === 'dark' ? 'rgba(50, 205, 50, 0.3)' : 'rgba(27, 94, 32, 0.3)',
                        borderRadius: 2,
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 4px 20px rgba(50, 205, 50, 0.2)'
                        }
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <TimelineIcon sx={{
                            color: theme.palette.mode === 'dark' ? '#32CD32' : '#1B5E20',
                            mr: 1,
                            fontSize: '2rem'
                          }} />
                          <Typography variant="subtitle1" sx={{
                            color: theme.palette.mode === 'dark' ? '#32CD32' : '#1B5E20',
                            fontWeight: 600
                          }}>
                            Salud Financiera
                          </Typography>
                        </Box>
                        <Typography variant="h4" sx={{
                          color: theme.palette.mode === 'dark' ? '#32CD32' : '#1B5E20',
                          fontWeight: 700
                        }}>
                          Excelente
                        </Typography>
                        <Typography variant="body2" sx={{
                          color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                          mt: 1
                        }}>
                          Basado en tus últimos 3 meses
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              {/* Sección de Información Personal */}
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{
                    color: theme.palette.mode === 'dark' ? '#32CD32' : '#1B5E20',
                    fontWeight: 600,
                    mb: 3
                  }}>
                    Información Personal
                  </Typography>
                  <Paper sx={{
                    p: 3,
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(38, 38, 38, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid',
                    borderColor: theme.palette.mode === 'dark' ? 'rgba(50, 205, 50, 0.3)' : 'rgba(27, 94, 32, 0.3)',
                    borderRadius: 2
                  }}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{
                        color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
                      }}>
                        Nombre Completo
                      </Typography>
                      <Typography variant="body1" sx={{
                        color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                        fontWeight: 500
                      }}>
                        {user?.firstName} {user?.lastName}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{
                        color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
                      }}>
                        Correo Electrónico
                      </Typography>
                      <Typography variant="body1" sx={{
                        color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                        fontWeight: 500
                      }}>
                        {user?.email}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{
                        color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
                      }}>
                        Fecha de Registro
                      </Typography>
                      <Typography variant="body1" sx={{
                        color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                        fontWeight: 500
                      }}>
                        15 de Marzo, 2024
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{
                        color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
                      }}>
                        Último Acceso
                      </Typography>
                      <Typography variant="body1" sx={{
                        color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                        fontWeight: 500
                      }}>
                        Hace 2 horas
                      </Typography>
                    </Box>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<EditIcon />}
                      sx={{
                        mt: 3,
                        borderColor: theme.palette.mode === 'dark' ? '#32CD32' : '#1B5E20',
                        color: theme.palette.mode === 'dark' ? '#32CD32' : '#1B5E20',
                        '&:hover': {
                          borderColor: theme.palette.mode === 'dark' ? '#32CD32' : '#1B5E20',
                          bgcolor: 'rgba(50, 205, 50, 0.1)'
                        }
                      }}
                    >
                      Editar Información
                    </Button>
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
