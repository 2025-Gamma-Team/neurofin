import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { DirectDebit, paymentService } from '../../services/paymentService';
import { useAuthStore } from '../../store/authStore';

interface User {
  sub: string;
  email: string;
  // otras propiedades del usuario...
}

export const DirectDebitList: React.FC = () => {
  const [directDebits, setDirectDebits] = useState<DirectDebit[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDebit, setSelectedDebit] = useState<DirectDebit | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore() as { user: User | null };

  const [formData, setFormData] = useState<Omit<DirectDebit, 'id' | 'userId'>>({
    description: '',
    amount: 0,
    frequency: 'monthly',
    nextPaymentDate: '',
    status: 'active',
    accountNumber: '',
    bankName: '',
  });

  const loadDirectDebits = async () => {
    try {
      if (user?.sub) {
        const debits = await paymentService.getDirectDebits(user.sub);
        setDirectDebits(debits);
      }
    } catch (err) {
      setError('Error al cargar los pagos domiciliados');
    }
  };

  useEffect(() => {
    loadDirectDebits();
  }, [user]);

  const handleOpenDialog = (debit?: DirectDebit) => {
    if (debit) {
      setSelectedDebit(debit);
      setFormData({
        description: debit.description,
        amount: debit.amount,
        frequency: debit.frequency,
        nextPaymentDate: debit.nextPaymentDate,
        status: debit.status,
        accountNumber: debit.accountNumber,
        bankName: debit.bankName,
      });
    } else {
      setSelectedDebit(null);
      setFormData({
        description: '',
        amount: 0,
        frequency: 'monthly',
        nextPaymentDate: '',
        status: 'active',
        accountNumber: '',
        bankName: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedDebit(null);
    setError(null);
  };

  const handleSubmit = async () => {
    try {
      if (!user?.sub) return;

      if (selectedDebit) {
        await paymentService.updateDirectDebit(selectedDebit.id!, {
          ...formData,
          userId: user.sub,
        });
      } else {
        await paymentService.createDirectDebit({
          ...formData,
          userId: user.sub,
        });
      }
      
      await loadDirectDebits();
      handleCloseDialog();
    } catch (err) {
      setError('Error al guardar el pago domiciliado');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await paymentService.deleteDirectDebit(id);
      await loadDirectDebits();
    } catch (err) {
      setError('Error al eliminar el pago domiciliado');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Pagos Domiciliados</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Pago Domiciliado
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Descripción</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell>Frecuencia</TableCell>
              <TableCell>Próximo Pago</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Banco</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {directDebits.map((debit) => (
              <TableRow key={debit.id}>
                <TableCell>{debit.description}</TableCell>
                <TableCell>${debit.amount.toFixed(2)}</TableCell>
                <TableCell>{debit.frequency}</TableCell>
                <TableCell>{new Date(debit.nextPaymentDate).toLocaleDateString()}</TableCell>
                <TableCell>{debit.status}</TableCell>
                <TableCell>{debit.bankName}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(debit)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => debit.id && handleDelete(debit.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedDebit ? 'Editar Pago Domiciliado' : 'Nuevo Pago Domiciliado'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Descripción"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
            />
            <TextField
              label="Monto"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              fullWidth
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
              }}
            />
            <TextField
              select
              label="Frecuencia"
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value as DirectDebit['frequency'] })}
              fullWidth
            >
              <MenuItem value="monthly">Mensual</MenuItem>
              <MenuItem value="biweekly">Quincenal</MenuItem>
              <MenuItem value="weekly">Semanal</MenuItem>
            </TextField>
            <TextField
              label="Próximo Pago"
              type="date"
              value={formData.nextPaymentDate}
              onChange={(e) => setFormData({ ...formData, nextPaymentDate: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              select
              label="Estado"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as DirectDebit['status'] })}
              fullWidth
            >
              <MenuItem value="active">Activo</MenuItem>
              <MenuItem value="paused">Pausado</MenuItem>
              <MenuItem value="cancelled">Cancelado</MenuItem>
            </TextField>
            <TextField
              label="Número de Cuenta"
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              fullWidth
            />
            <TextField
              label="Banco"
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedDebit ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 