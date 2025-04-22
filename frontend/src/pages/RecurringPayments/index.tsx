import React, { useState } from 'react';
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
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  OpenInNew as OpenInNewIcon,
  DeleteOutline as DeleteIcon
} from '@mui/icons-material';

interface RecurringPayment {
  id: string;
  service: string;
  amount: number;
  nextPayment: string;
  status: 'active' | 'pending' | 'cancelled';
  website: string;
  description?: string;
}

const RecurringPayments = () => {
  const [payments, setPayments] = useState<RecurringPayment[]>([
    {
      id: '1',
      service: 'Netflix',
      amount: 15.99,
      nextPayment: '2024-04-13',
      status: 'active',
      website: 'https://netflix.com',
      description: 'Plan Premium 4K'
    },
    {
      id: '2',
      service: 'Spotify',
      amount: 9.99,
      nextPayment: '2024-04-08',
      status: 'active',
      website: 'https://spotify.com',
      description: 'Plan Individual'
    },
    {
      id: '3',
      service: 'Amazon Prime',
      amount: 12.99,
      nextPayment: '2024-04-18',
      status: 'active',
      website: 'https://amazon.com',
      description: 'Prime + Video + Music'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<RecurringPayment | null>(null);

  const totalMonthly = payments
    .filter(payment => payment.status === 'active')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const handleEditPayment = (payment: RecurringPayment) => {
    setEditingPayment(payment);
    setIsDialogOpen(true);
  };

  const handleDeletePayment = (id: string) => {
    setPayments(payments.filter(payment => payment.id !== id));
  };

  const handleSavePayment = () => {
    if (!editingPayment?.service || !editingPayment?.amount || !editingPayment?.nextPayment) {
      return;
    }

    if (editingPayment.id) {
      setPayments(payments.map(p => p.id === editingPayment.id ? editingPayment : p));
    } else {
      setPayments([...payments, { ...editingPayment, id: Date.now().toString(), status: 'active' }]);
    }

    setIsDialogOpen(false);
    setEditingPayment(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ mb: 1 }}>
              Pagos Domiciliados
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
                id: '',
                service: '',
                amount: 0,
                nextPayment: new Date().toISOString().split('T')[0],
                status: 'active',
                website: ''
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
              key={payment.id}
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
                  {payment.service}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  ${payment.amount.toFixed(2)}/mes
                </Typography>
              </Box>
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    {payment.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Próximo pago: {new Date(payment.nextPayment).toLocaleDateString()}
                  </Typography>
                </Stack>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label={payment.status}
                    color="success"
                    size="small"
                    sx={{ textTransform: 'lowercase' }}
                  />
                  <IconButton size="small" onClick={() => handleEditPayment(payment)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => window.open(payment.website, '_blank')}>
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDeletePayment(payment.id)}>
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
            value={editingPayment?.service || ''}
            onChange={(e) => setEditingPayment(prev => prev ? { ...prev, service: e.target.value } : null)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Monto Mensual"
            type="number"
            value={editingPayment?.amount || ''}
            onChange={(e) => setEditingPayment(prev => prev ? { ...prev, amount: Number(e.target.value) } : null)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Próximo Pago"
            type="date"
            value={editingPayment?.nextPayment || ''}
            onChange={(e) => setEditingPayment(prev => prev ? { ...prev, nextPayment: e.target.value } : null)}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Sitio Web"
            value={editingPayment?.website || ''}
            onChange={(e) => setEditingPayment(prev => prev ? { ...prev, website: e.target.value } : null)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Descripción"
            value={editingPayment?.description || ''}
            onChange={(e) => setEditingPayment(prev => prev ? { ...prev, description: e.target.value } : null)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setIsDialogOpen(false);
            setEditingPayment(null);
          }}>
            Cancelar
          </Button>
          <Button onClick={handleSavePayment} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecurringPayments; 