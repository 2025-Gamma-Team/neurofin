export interface DirectDebit {
  id?: string;
  userId: string;
  description: string;
  amount: number;
  frequency: 'monthly' | 'biweekly' | 'weekly';
  nextPaymentDate: string;
  status: 'active' | 'paused' | 'cancelled';
  accountNumber: string;
  bankName: string;
}

const LAMBDA_URL = 'https://h2etr5676jywn2wqr63ggnysuq0fpxyv.lambda-url.us-east-1.on.aws';

export const paymentService = {
  // Obtener todos los pagos domiciliados del usuario
  getDirectDebits: async (userId: string): Promise<DirectDebit[]> => {
    try {
      const response = await fetch(`${LAMBDA_URL}/direct-debits?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Error al obtener pagos domiciliados');
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener pagos domiciliados:', error);
      throw error;
    }
  },

  // Crear un nuevo pago domiciliado
  createDirectDebit: async (directDebit: Omit<DirectDebit, 'id'>): Promise<DirectDebit> => {
    try {
      const response = await fetch(`${LAMBDA_URL}/direct-debits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(directDebit),
      });
      if (!response.ok) {
        throw new Error('Error al crear pago domiciliado');
      }
      return await response.json();
    } catch (error) {
      console.error('Error al crear pago domiciliado:', error);
      throw error;
    }
  },

  // Actualizar un pago domiciliado existente
  updateDirectDebit: async (directDebitId: string, updates: Partial<DirectDebit>): Promise<DirectDebit> => {
    try {
      const response = await fetch(`${LAMBDA_URL}/direct-debits/${directDebitId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar pago domiciliado');
      }
      return await response.json();
    } catch (error) {
      console.error('Error al actualizar pago domiciliado:', error);
      throw error;
    }
  },

  // Eliminar un pago domiciliado
  deleteDirectDebit: async (directDebitId: string): Promise<void> => {
    try {
      const response = await fetch(`${LAMBDA_URL}/direct-debits/${directDebitId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar pago domiciliado');
      }
    } catch (error) {
      console.error('Error al eliminar pago domiciliado:', error);
      throw error;
    }
  }
}; 