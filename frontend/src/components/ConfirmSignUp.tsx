import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import { CognitoUser } from "amazon-cognito-identity-js";
import { userPool } from "../config/cognito";

interface ConfirmSignUpProps {
  email: string;
  onComplete: () => void;
}

export default function ConfirmSignUp({
  email,
  onComplete,
}: ConfirmSignUpProps) {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        setError(err.message || "Error al confirmar el registro");
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      onComplete();
    });
  };

  const handleResendCode = () => {
    setIsLoading(true);
    setError(null);

    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.resendConfirmationCode((err, result) => {
      if (err) {
        setError(err.message || "Error al reenviar el código");
        setIsLoading(false);
        return;
      }
      setError("Código reenviado. Por favor revisa tu correo.");
      setIsLoading(false);
    });
  };

  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      elevation={3}
      sx={{
        width: "100%",
        maxWidth: "400px",
        borderRadius: "20px",
        padding: "2rem",
        background: "rgba(20, 30, 48, 0.7)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <Typography
        variant="h5"
        sx={{ color: "white", mb: 3, textAlign: "center" }}
      >
        Confirmar Registro
      </Typography>

      <Box component="form" onSubmit={handleConfirm}>
        <TextField
          fullWidth
          label="Código de verificación"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              color: "white",
              "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
              "&:hover fieldset": {
                borderColor: "rgba(255, 255, 255, 0.2)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "rgba(255, 255, 255, 0.3)",
              },
            },
            "& .MuiInputLabel-root": {
              color: "rgba(255, 255, 255, 0.7)",
            },
          }}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          component={motion.button}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          fullWidth
          variant="contained"
          disabled={isLoading}
          sx={{
            mb: 2,
            py: 1.5,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "10px",
            textTransform: "none",
            fontSize: "1rem",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            },
          }}
        >
          {isLoading ? <CircularProgress size={24} /> : "Confirmar"}
        </Button>

        <Button
          fullWidth
          onClick={handleResendCode}
          disabled={isLoading}
          sx={{
            color: "rgba(255, 255, 255, 0.7)",
            "&:hover": {
              color: "white",
            },
          }}
        >
          Reenviar código
        </Button>
      </Box>
    </Paper>
  );
}