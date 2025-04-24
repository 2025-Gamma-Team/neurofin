import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Stack,
  Alert,
  Snackbar,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  OpenInNew as OpenInNewIcon,
  DeleteOutline as DeleteIcon
} from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';
import { jwtDecode } from 'jwt-decode';

interface ApiPayment {
  frecuency: string;
  se_t: number;
  amount?: number;
  lastPaymentDay: string;
  serviceName: string;
  cancelUrl: string;
  userId: string;
  subscriptionId: string;
  status: boolean;
}

interface ApiResponse {
  success: boolean;
  data: ApiPayment[];
  body: any;
  count: number;
}

interface RecurringPayment {
  id?: string;
  serviceName: string;
  amount: number;
  lastPaymentDay?: string;
  status: boolean;
  cancelUrl: string;
  description?: string;
  frequency: 'mensual' | 'yearly';
  userId?: string;
  subscriptionId?: string;
}

interface DecodedToken {
  'cognito:username': string;
  email: string;
  name: string;
  family_name: string;
}

const API_URL = 'https://xr601d9sn5.execute-api.us-east-1.amazonaws.com/prod/subscriptions';

const RecurringPayments = () => {
  const { token, user } = useAuthStore();
  const [payments, setPayments] = useState<RecurringPayment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<RecurringPayment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const getUserIdFromToken = (): string => {
    if (!token) return '';
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded['cognito:username'];
  };

  const fetchSubscriptions = async () => {
    try {
      const userId = getUserIdFromToken();
      const response = await fetch(`${API_URL}/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      });
      
      const responseText = await response.text();
      
      try {
        const parsedResponse = JSON.parse(responseText);
        const responseData = JSON.parse(parsedResponse.body);
        
        if (responseData.success && Array.isArray(responseData.data)) {
          const formattedPayments: RecurringPayment[] = responseData.data.map((payment: any) => ({
            serviceName: payment.serviceName,
            amount: payment.amount,
            lastPaymentDay: payment.lastPaymentDay,
            status: payment.status,
            cancelUrl: payment.cancelUrl,
            frequency: payment.frecuency as 'mensual' | 'yearly',
            userId: payment.userId,
            subscriptionId: payment.subscriptionId
          }));
          
          setPayments(formattedPayments);
        }
      } catch (parseError) {
        throw new Error('Error al procesar la respuesta del servidor');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las suscripciones');
    }
  };

  useEffect(() => {
    if (token) {
      fetchSubscriptions();
    }
  }, [token]);

  const totalMonthly = useMemo(() => {
    return payments
      .filter(payment => payment.status)
      .reduce((sum, payment) => sum + payment.amount, 0);
  }, [payments]);

  const handleSavePayment = async () => {
    if (!editingPayment?.serviceName || !editingPayment?.amount) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      const userId = getUserIdFromToken();
      const subscriptionId = `sub_${Date.now()}`;
      
      const payloadData = {
        userId,
        subscriptionId,
        amount: editingPayment.amount.toString(),
        cancelUrl: editingPayment.cancelUrl,
        frecuency: editingPayment.frequency === 'yearly' ? 'yearly' : 'monthly',
        lastPaymentDay: new Date(editingPayment.lastPaymentDay || new Date()).toISOString(),
        serviceName: editingPayment.serviceName,
        status: "active"
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        mode: 'cors',
        body: JSON.stringify(payloadData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al guardar: ${response.status} ${errorText}`);
      }

      const responseText = await response.text();
      const parsedResponse = JSON.parse(responseText);
      const responseData = JSON.parse(parsedResponse.body);

      if (responseData.success && responseData.data) {
        const savedPayment = responseData.data;
        const formattedSavedPayment = {
          ...savedPayment,
          status: true,
          amount: Number(savedPayment.amount),
          frequency: savedPayment.frecuency === 'yearly' ? 'yearly' : 'mensual'
        };
        
        setPayments(prev => [...prev, formattedSavedPayment]);
        setSuccessMessage('Suscripción guardada exitosamente');
        setIsDialogOpen(false);
        setEditingPayment(null);
      } else {
        throw new Error('Error en el formato de la respuesta del servidor');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la suscripción');
    }
  };

  const handleDeletePayment = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al eliminar: ${response.status} ${errorText}`);
      }

      setPayments(payments.filter(payment => payment.id !== id));
      setSuccessMessage('Suscripción eliminada exitosamente');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar la suscripción');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ mb: 1 }}>
              {user ? `${user.firstName} ${user.lastName}` : 'Pagos Domiciliados'}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Total Mensual: ${totalMonthly.toFixed(2)}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingPayment({
                serviceName: '',
                amount: 0,
                status: true,
                cancelUrl: '',
                frequency: 'mensual'
              });
              setIsDialogOpen(true);
            }}
          >
            AGREGAR PAGO
          </Button>
        </Box>

        <List sx={{ '& > *:not(:last-child)': { borderBottom: '1px solid rgba(0, 0, 0, 0.12)' } }}>
          {payments.map((payment) => (
            <ListItem
              key={payment.subscriptionId}
              sx={{
                py: 2,
                px: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}
            >
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6" component="div">
                  {`${payment.serviceName} - Amazon`}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  ${payment.amount.toFixed(2)}/{payment.frequency}
                </Typography>
              </Box>
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    {payment.description}
                  </Typography>
                  {payment.lastPaymentDay && (
                    <Typography variant="body2" color="text.secondary">
                      Próximo pago: {new Date(payment.lastPaymentDay).toLocaleDateString()}
                    </Typography>
                  )}
                </Stack>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label={payment.status ? 'Activo' : 'Inactivo'}
                    color={payment.status ? 'success' : 'default'}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                  <IconButton size="small" onClick={() => window.open(payment.cancelUrl, '_blank')}>
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDeletePayment(payment.id!)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingPayment?.id ? 'Editar Pago' : 'Nuevo Pago'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Servicio"
            value={editingPayment?.serviceName || ''}
            onChange={(e) => setEditingPayment(prev => prev ? { ...prev, serviceName: e.target.value } : null)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Monto"
            type="number"
            value={editingPayment?.amount || ''}
            onChange={(e) => setEditingPayment(prev => prev ? { ...prev, amount: Number(e.target.value) } : null)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="URL de Cancelación"
            value={editingPayment?.cancelUrl || ''}
            onChange={(e) => setEditingPayment(prev => prev ? { ...prev, cancelUrl: e.target.value } : null)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Fecha del Último Pago"
            type="date"
            value={editingPayment?.lastPaymentDay || new Date().toISOString().split('T')[0]}
            onChange={(e) => setEditingPayment(prev => prev ? { ...prev, lastPaymentDay: e.target.value } : null)}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            select
            fullWidth
            label="Frecuencia"
            value={editingPayment?.frequency || 'mensual'}
            onChange={(e) => setEditingPayment(prev => prev ? { ...prev, frequency: e.target.value as 'mensual' | 'yearly' } : null)}
            margin="normal"
          >
            <MenuItem value="mensual">Mensual</MenuItem>
            <MenuItem value="yearly">Anual</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Descripción"
            value={editingPayment?.description || ''}
            onChange={(e) => setEditingPayment(prev => prev ? { ...prev, description: e.target.value } : null)}
            margin="normal"
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleSavePayment} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
      >
        <Alert severity="success" onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RecurringPayments; 