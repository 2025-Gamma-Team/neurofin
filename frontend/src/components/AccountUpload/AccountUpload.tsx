import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { UploadFile } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import * as pdfjsLib from 'pdfjs-dist';

// Deshabilitar worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '';

interface Transaction {
  date: string;
  description: string;
  amount: number;
  type: 'ingreso' | 'gasto';
}

interface AccountUploadProps {
  onDataProcessed: (data: Transaction[]) => void;
}

export const AccountUpload: React.FC<AccountUploadProps> = ({ onDataProcessed }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugText, setDebugText] = useState<string>('');
  const theme = useTheme();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      console.log('Tipo de archivo:', selectedFile.type);
      if (selectedFile.type !== 'application/pdf') {
        setError('Por favor selecciona un archivo PDF');
        return;
      }
      setFile(selectedFile);
      setError(null);
      setDebugText('');
    }
  };

  const processFile = async () => {
    if (!file) {
      setError('Por favor selecciona un archivo');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Iniciando procesamiento del PDF');
      const arrayBuffer = await file.arrayBuffer();
      console.log('ArrayBuffer creado');

      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer
      });

      console.log('Tarea de carga creada');

      const pdf = await loadingTask.promise;
      console.log('PDF cargado, número de páginas:', pdf.numPages);

      let fullText = '';

      // Extraer texto de todas las páginas
      for (let i = 1; i <= pdf.numPages; i++) {
        console.log(`Procesando página ${i}`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
      }

      console.log('Texto extraído:', fullText);
      setDebugText(fullText);

      // Procesar el texto para encontrar transacciones
      const transactions: Transaction[] = [];
      const lines = fullText.split('\n');

      lines.forEach((line, index) => {
        console.log(`Procesando línea ${index}:`, line);
        // Buscar patrones de fecha y monto
        const dateMatch = line.match(/(\d{2}\/\d{2}\/\d{4})/);
        const amountMatch = line.match(/([-]?\d+[\d,]*\.\d{2})/);

        if (dateMatch && amountMatch) {
          console.log('Match encontrado:', { dateMatch, amountMatch });
          const date = dateMatch[1];
          const amount = parseFloat(amountMatch[1].replace(',', ''));
          const description = line
            .replace(dateMatch[1], '')
            .replace(amountMatch[1], '')
            .trim();

          transactions.push({
            date,
            description,
            amount: Math.abs(amount),
            type: amount >= 0 ? 'ingreso' : 'gasto'
          });
        }
      });

      console.log('Transacciones encontradas:', transactions);

      if (transactions.length === 0) {
        setError('No se encontraron transacciones en el archivo PDF. Asegúrate de que el formato sea correcto.');
        return;
      }

      // Ordenar transacciones por fecha
      transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Notificar al componente padre con las transacciones procesadas
      onDataProcessed(transactions);
    } catch (err: any) {
      console.error('Error al procesar PDF:', err);
      setError(`Error al procesar el archivo PDF: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 3,
        bgcolor: theme.palette.background.paper,
        borderRadius: 2
      }}
    >
      <Typography variant="h6" gutterBottom>
        Cargar Estado de Cuenta
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          type="file"
          inputProps={{
            accept: 'application/pdf'
          }}
          onChange={handleFileChange}
          fullWidth
          helperText="Solo se aceptan archivos PDF"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={processFile}
          disabled={!file || loading}
          startIcon={loading ? <CircularProgress size={20} /> : <UploadFile />}
          sx={{ alignSelf: 'flex-start' }}
        >
          Procesar Archivo
        </Button>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {debugText && (
          <Paper
            sx={{
              mt: 2,
              p: 2,
              maxHeight: '200px',
              overflow: 'auto',
              bgcolor: theme.palette.grey[100]
            }}
          >
            <Typography variant="caption" component="pre">
              {debugText}
            </Typography>
          </Paper>
        )}
      </Box>
    </Paper>
  );
};
