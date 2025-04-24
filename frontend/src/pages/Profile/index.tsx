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
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Alert,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import { useState, useEffect } from "react";
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
  Security as SecurityIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Remove as RemoveIcon,
  NotificationsActive as NotificationsActiveIcon,
  NotificationsOff as NotificationsOffIcon,
  Lock as LockIcon,
  Language as LanguageIcon2,
  Palette as PaletteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  VpnKey as VpnKeyIcon,
  Fingerprint as FingerprintIcon,
  Shield as ShieldIcon,
  Person as PersonIcon
} from '@mui/icons-material';

export default function Profile() {
  const { user } = useAuthStore();
  const theme = useTheme();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [isNotificationsDialogOpen, setIsNotificationsDialogOpen] = useState(false);
  const [isSecurityDialogOpen, setIsSecurityDialogOpen] = useState(false);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [isCurrencyDialogOpen, setIsCurrencyDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });
  const [editError, setEditError] = useState('');
  const [incomes, setIncomes] = useState([
    { id: 1, source: 'Salario', amount: 15000 },
    { id: 2, source: 'Freelance', amount: 5000 }
  ]);
  const [expenses, setExpenses] = useState([
    { id: 1, category: 'Vivienda', amount: 5000 },
    { id: 2, category: 'Alimentación', amount: 3000 }
  ]);
  const [newIncome, setNewIncome] = useState({ source: '', amount: '' });
  const [newExpense, setNewExpense] = useState({ category: '', amount: '' });
  const [balanceTotal, setBalanceTotal] = useState(0);
  const [settings, setSettings] = useState({
    language: 'es',
    theme: 'light',
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false
  });
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Nuevo ingreso registrado', message: 'Se ha registrado un nuevo ingreso de $5,000', time: 'Hace 2 horas', read: false },
    { id: 2, title: 'Gasto excedido', message: 'Has excedido tu presupuesto mensual en la categoría Alimentación', time: 'Hace 1 día', read: true },
    { id: 3, title: 'Actualización de seguridad', message: 'Se ha detectado un nuevo inicio de sesión desde un dispositivo desconocido', time: 'Hace 2 días', read: true }
  ]);
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    biometricAuth: false,
    sessionTimeout: 30,
    passwordLastChanged: '2024-03-15'
  });
  const [location, setLocation] = useState({
    country: 'México',
    city: 'Ciudad de México',
    timezone: 'America/Mexico_City'
  });
  const [currency, setCurrency] = useState({
    code: 'MXN',
    symbol: '$',
    name: 'Peso Mexicano'
  });
  const [userBadges, setUserBadges] = useState([
    { icon: <LocationIcon />, text: 'México', color: '#FF9800' },
    { icon: <MoneyIcon />, text: 'Moneda: MXN', color: '#4CAF50' },
    { icon: <LanguageIcon />, text: 'Zona: America/Mexico_City', color: '#2196F3' }
  ]);

  useEffect(() => {
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    setBalanceTotal(totalIncome - totalExpenses);
  }, [incomes, expenses]);

  const handleEditOpen = () => {
    setEditFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    });
    setEditError('');
    setIsEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setIsEditDialogOpen(false);
    setEditError('');
  };

  const validateEditForm = () => {
    if (!editFormData.firstName.trim()) {
      setEditError('El nombre es requerido');
      return false;
    }
    if (!editFormData.lastName.trim()) {
      setEditError('El apellido es requerido');
      return false;
    }
    if (!editFormData.email.trim()) {
      setEditError('El correo electrónico es requerido');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editFormData.email)) {
      setEditError('Por favor ingrese un correo electrónico válido');
      return false;
    }
    return true;
  };

  const handleEditSave = async () => {
    try {
      if (!validateEditForm()) {
        return;
      }

      // Actualizar el estado local del usuario
      const updatedUser = {
        ...user,
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        email: editFormData.email,
      };

      // Aquí iría la llamada a la API para actualizar el usuario
      console.log('Guardando cambios:', updatedUser);
      
      // Actualizar el estado local
      if (user) {
        user.firstName = editFormData.firstName;
        user.lastName = editFormData.lastName;
        user.email = editFormData.email;
      }

      setIsEditDialogOpen(false);
      setEditError('');
    } catch (error) {
      setEditError('Error al actualizar la información. Por favor intente nuevamente.');
    }
  };

  const handleIncomeOpen = () => {
    setNewIncome({ source: '', amount: '' });
    setIsIncomeDialogOpen(true);
  };

  const handleIncomeClose = () => {
    setIsIncomeDialogOpen(false);
  };

  const handleIncomeSave = () => {
    if (newIncome.source && newIncome.amount) {
      const newIncomeItem = {
        id: incomes.length + 1,
        source: newIncome.source,
        amount: Number(newIncome.amount)
      };
      setIncomes([...incomes, newIncomeItem]);
      setIsIncomeDialogOpen(false);
      setNewIncome({ source: '', amount: '' });
    }
  };

  const handleDeleteIncome = (id: number) => {
    setIncomes(incomes.filter(income => income.id !== id));
  };

  const handleExpenseOpen = () => {
    setNewExpense({ category: '', amount: '' });
    setIsExpenseDialogOpen(true);
  };

  const handleExpenseClose = () => {
    setIsExpenseDialogOpen(false);
  };

  const handleExpenseSave = () => {
    if (newExpense.category && newExpense.amount) {
      const newExpenseItem = {
        id: expenses.length + 1,
        category: newExpense.category,
        amount: Number(newExpense.amount)
      };
      setExpenses([...expenses, newExpenseItem]);
      setIsExpenseDialogOpen(false);
      setNewExpense({ category: '', amount: '' });
    }
  };

  const handleDeleteExpense = (id: number) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleSettingsOpen = () => {
    setIsSettingsDialogOpen(true);
  };

  const handleSettingsClose = () => {
    setIsSettingsDialogOpen(false);
  };

  const handleSettingsSave = () => {
    // Aquí iría la lógica para guardar la configuración
    setIsSettingsDialogOpen(false);
  };

  const handleNotificationsOpen = () => {
    setIsNotificationsDialogOpen(true);
  };

  const handleNotificationsClose = () => {
    setIsNotificationsDialogOpen(false);
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const handleSecurityOpen = () => {
    setIsSecurityDialogOpen(true);
  };

  const handleSecurityClose = () => {
    setIsSecurityDialogOpen(false);
  };

  const handleSecuritySave = () => {
    // Aquí iría la lógica para guardar la configuración de seguridad
    setIsSecurityDialogOpen(false);
  };

  const handleLocationOpen = () => {
    setIsLocationDialogOpen(true);
  };

  const handleLocationClose = () => {
    setIsLocationDialogOpen(false);
  };

  const handleLocationSave = () => {
    // Actualizar el badge de ubicación
    const updatedBadges = userBadges.map(badge => {
      if (badge.text.includes('México')) {
        return { ...badge, text: location.country };
      }
      if (badge.text.includes('Zona')) {
        return { ...badge, text: `Zona: ${location.timezone}` };
      }
      return badge;
    });
    setUserBadges(updatedBadges);
    setIsLocationDialogOpen(false);
  };

  const handleCurrencyOpen = () => {
    setIsCurrencyDialogOpen(true);
  };

  const handleCurrencyClose = () => {
    setIsCurrencyDialogOpen(false);
  };

  const handleCurrencySave = () => {
    // Actualizar el badge de moneda
    const updatedBadges = userBadges.map(badge => {
      if (badge.text.includes('Moneda')) {
        return { ...badge, text: `Moneda: ${currency.code}` };
      }
      return badge;
    });
    setUserBadges(updatedBadges);
    setIsCurrencyDialogOpen(false);
  };

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
            {/* Header with Avatar and Actions */}
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
                        onClick={() => {
                          if (badge.text.includes('México')) {
                            handleLocationOpen();
                          } else if (badge.text.includes('Moneda')) {
                            handleCurrencyOpen();
                          }
                        }}
                        sx={{
                          bgcolor: `${badge.color}20`,
                          color: badge.color,
                          border: `1px solid ${badge.color}40`,
                          '& .MuiChip-icon': {
                            color: badge.color
                          },
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: `${badge.color}30`
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
                  <IconButton 
                    onClick={handleNotificationsOpen}
                    sx={{
                      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                      '&:hover': { bgcolor: 'rgba(33, 150, 243, 0.1)' }
                    }}
                  >
                    <NotificationsIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Configuración">
                  <IconButton 
                    onClick={handleSettingsOpen}
                    sx={{
                      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                      '&:hover': { bgcolor: 'rgba(33, 150, 243, 0.1)' }
                    }}
                  >
                    <SettingsIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Seguridad">
                  <IconButton 
                    onClick={handleSecurityOpen}
                    sx={{
                      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                      '&:hover': { bgcolor: 'rgba(33, 150, 243, 0.1)' }
                    }}
                  >
                    <SecurityIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Grid container spacing={4}>
              {/* Statistics Section */}
              <Grid item xs={12} md={8}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccountBalanceIcon sx={{
                      color: theme.palette.mode === 'dark' ? '#32CD32' : '#1B5E20',
                      mr: 1,
                      fontSize: '2rem'
                    }} />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Avatar Customization Section */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12}>
            <Paper sx={{
              p: 3,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(38, 38, 38, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              borderRadius: 2,
              border: '1px solid rgba(50, 205, 50, 0.5)',
              boxShadow: '0 0 10px rgba(50, 205, 50, 0.2)'
            }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 3
              }}>
                <Typography variant="h6" sx={{ color: theme.palette.success.main }}>
                  Personalizar Avatar
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Estilo de pelo</InputLabel>
                    <Select
                      defaultValue="shortCombover"
                      label="Estilo de pelo"
                    >
                      <MenuItem value="shortCombover">Corto con raya</MenuItem>
                      <MenuItem value="longHair">Pelo largo</MenuItem>
                      <MenuItem value="curlyHair">Pelo rizado</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Color de pelo</InputLabel>
                    <Select
                      defaultValue="brown"
                      label="Color de pelo"
                    >
                      <MenuItem value="brown">Castaño</MenuItem>
                      <MenuItem value="black">Negro</MenuItem>
                      <MenuItem value="blonde">Rubio</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Color de piel</InputLabel>
                    <Select
                      defaultValue="light"
                      label="Color de piel"
                    >
                      <MenuItem value="light">Clara</MenuItem>
                      <MenuItem value="medium">Media</MenuItem>
                      <MenuItem value="dark">Oscura</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>

      {/* Personal Information Edit Modal */}
      <Dialog open={isEditDialogOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Información Personal</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {editError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {editError}
              </Alert>
            )}
            <TextField
              fullWidth
              label="Nombre"
              value={editFormData.firstName}
              onChange={(e) => {
                setEditFormData(prev => ({ ...prev, firstName: e.target.value }));
                setEditError('');
              }}
              required
              error={!!editError && !editFormData.firstName}
            />
            <TextField
              fullWidth
              label="Apellido"
              value={editFormData.lastName}
              onChange={(e) => {
                setEditFormData(prev => ({ ...prev, lastName: e.target.value }));
                setEditError('');
              }}
              required
              error={!!editError && !editFormData.lastName}
            />
            <TextField
              fullWidth
              label="Correo Electrónico"
              type="email"
              value={editFormData.email}
              onChange={(e) => {
                setEditFormData(prev => ({ ...prev, email: e.target.value }));
                setEditError('');
              }}
              required
              error={!!editError && !editFormData.email}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancelar</Button>
          <Button 
            onClick={handleEditSave} 
            variant="contained" 
            color="primary"
            disabled={!editFormData.firstName || !editFormData.lastName || !editFormData.email}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Income Modal */}
      <Dialog open={isIncomeDialogOpen} onClose={handleIncomeClose} maxWidth="sm" fullWidth>
        <DialogTitle>Agregar Nuevo Ingreso</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Fuente de Ingreso"
              value={newIncome.source}
              onChange={(e) => setNewIncome({ ...newIncome, source: e.target.value })}
            />
            <TextField
              fullWidth
              label="Monto Mensual"
              type="number"
              value={newIncome.amount}
              onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleIncomeClose}>Cancelar</Button>
          <Button 
            onClick={handleIncomeSave} 
            variant="contained" 
            color="primary"
            disabled={!newIncome.source || !newIncome.amount}
          >
            Agregar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Expense Modal */}
      <Dialog open={isExpenseDialogOpen} onClose={handleExpenseClose} maxWidth="sm" fullWidth>
        <DialogTitle>Agregar Nuevo Gasto</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Categoría del Gasto"
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            />
            <TextField
              fullWidth
              label="Monto Mensual"
              type="number"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleExpenseClose}>Cancelar</Button>
          <Button 
            onClick={handleExpenseSave} 
            variant="contained" 
            color="primary"
            disabled={!newExpense.category || !newExpense.amount}
          >
            Agregar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={isSettingsDialogOpen} onClose={handleSettingsClose} maxWidth="sm" fullWidth>
        <DialogTitle>Configuración</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Idioma</InputLabel>
              <Select
                value={settings.language}
                label="Idioma"
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              >
                <MenuItem value="es">Español</MenuItem>
                <MenuItem value="en">English</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Tema</InputLabel>
              <Select
                value={settings.theme}
                label="Tema"
                onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
              >
                <MenuItem value="light">Claro</MenuItem>
                <MenuItem value="dark">Oscuro</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="subtitle1" sx={{ mt: 2 }}>Notificaciones</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                />
              }
              label="Notificaciones por correo electrónico"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.pushNotifications}
                  onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                />
              }
              label="Notificaciones push"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.smsNotifications}
                  onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                />
              }
              label="Notificaciones por SMS"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSettingsClose}>Cancelar</Button>
          <Button onClick={handleSettingsSave} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications Modal */}
      <Dialog open={isNotificationsDialogOpen} onClose={handleNotificationsClose} maxWidth="sm" fullWidth>
        <DialogTitle>Notificaciones</DialogTitle>
        <DialogContent>
          <List sx={{ width: '100%', mt: 2 }}>
            {notifications.map((notification) => (
              <Box key={notification.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    bgcolor: notification.read ? 'transparent' : 'action.hover',
                    borderRadius: 1,
                    mb: 1
                  }}
                >
                  <ListItemIcon>
                    {notification.read ? <NotificationsOffIcon /> : <NotificationsActiveIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={notification.title}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" display="block" color="text.secondary">
                          {notification.time}
                        </Typography>
                      </>
                    }
                  />
                  {!notification.read && (
                    <Button
                      size="small"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      Marcar como leída
                    </Button>
                  )}
                </ListItem>
                <Divider variant="inset" component="li" />
              </Box>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNotificationsClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Security Modal */}
      <Dialog open={isSecurityDialogOpen} onClose={handleSecurityClose} maxWidth="sm" fullWidth>
        <DialogTitle>Seguridad</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={securitySettings.twoFactorAuth}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, twoFactorAuth: e.target.checked })}
                />
              }
              label="Autenticación de dos factores"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={securitySettings.biometricAuth}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, biometricAuth: e.target.checked })}
                />
              }
              label="Autenticación biométrica"
            />
            <FormControl fullWidth>
              <InputLabel>Tiempo de sesión</InputLabel>
              <Select
                value={securitySettings.sessionTimeout}
                label="Tiempo de sesión"
                onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: Number(e.target.value) })}
              >
                <MenuItem value={15}>15 minutos</MenuItem>
                <MenuItem value={30}>30 minutos</MenuItem>
                <MenuItem value={60}>1 hora</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Última actualización de contraseña: {securitySettings.passwordLastChanged}
              </Typography>
              <Button
                startIcon={<VpnKeyIcon />}
                sx={{ mt: 1 }}
              >
                Cambiar contraseña
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSecurityClose}>Cancelar</Button>
          <Button onClick={handleSecuritySave} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Ubicación */}
      <Dialog open={isLocationDialogOpen} onClose={handleLocationClose} maxWidth="sm" fullWidth>
        <DialogTitle>Configuración de Ubicación</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="País"
              value={location.country}
              onChange={(e) => setLocation({ ...location, country: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Ciudad"
              value={location.city}
              onChange={(e) => setLocation({ ...location, city: e.target.value })}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Zona Horaria</InputLabel>
              <Select
                value={location.timezone}
                onChange={(e) => setLocation({ ...location, timezone: e.target.value })}
                label="Zona Horaria"
              >
                <MenuItem value="America/Mexico_City">Ciudad de México (UTC-6)</MenuItem>
                <MenuItem value="America/New_York">Nueva York (UTC-5)</MenuItem>
                <MenuItem value="Europe/London">Londres (UTC+0)</MenuItem>
                <MenuItem value="Asia/Tokyo">Tokio (UTC+9)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLocationClose}>Cancelar</Button>
          <Button onClick={handleLocationSave} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Moneda */}
      <Dialog open={isCurrencyDialogOpen} onClose={handleCurrencyClose} maxWidth="sm" fullWidth>
        <DialogTitle>Configuración de Moneda</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Moneda</InputLabel>
              <Select
                value={currency.code}
                onChange={(e) => {
                  const selectedCurrency = {
                    MXN: { code: 'MXN', symbol: '$', name: 'Peso Mexicano' },
                    USD: { code: 'USD', symbol: '$', name: 'Dólar Estadounidense' },
                    EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
                    GBP: { code: 'GBP', symbol: '£', name: 'Libra Esterlina' }
                  }[e.target.value];
                  if (selectedCurrency) {
                    setCurrency(selectedCurrency);
                  }
                }}
                label="Moneda"
              >
                <MenuItem value="MXN">Peso Mexicano (MXN)</MenuItem>
                <MenuItem value="USD">Dólar Estadounidense (USD)</MenuItem>
                <MenuItem value="EUR">Euro (EUR)</MenuItem>
                <MenuItem value="GBP">Libra Esterlina (GBP)</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              La moneda seleccionada se utilizará para mostrar todos los montos en la aplicación.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCurrencyClose}>Cancelar</Button>
          <Button onClick={handleCurrencySave} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
