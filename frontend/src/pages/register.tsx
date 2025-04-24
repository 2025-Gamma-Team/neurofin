import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Alert,
  Link,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { Person, Lock, Email, Badge } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import backgroundImage from "../assets/background.jpg";
import neuroLogo from "../assets/neuro.jpeg";
import FinancialPersonalityQuiz from "../components/FinancialPersonalityQuiz";

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading, error, setError } = useAuthStore();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    financialPersonality: "",
  });

  const steps = ['Información Personal', 'Cuestionario de Personalidad'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleQuizComplete = (personality: string) => {
    setFormData(prev => ({
      ...prev,
      financialPersonality: personality
    }));
    handleSubmit();
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeStep === 0) {
      if (formData.password !== formData.confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
      }
      setActiveStep(1);
    }
  };

  const handleSubmit = async () => {
    try {
      await register(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password,
        formData.financialPersonality
      );
      navigate("/login", { 
        state: { 
          message: "Registro exitoso. Por favor inicia sesión.",
          personality: formData.financialPersonality 
        } 
      });
    } catch (err) {
      console.error("Error de registro:", err);
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(5px)",
        },
      }}
    >
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: activeStep === 0 ? "400px" : "600px",
          borderRadius: "20px",
          padding: "2rem",
          background: "rgba(20, 30, 48, 0.7)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Box
              sx={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                border: "1px solid rgba(255, 255, 255, 0.2)",
                overflow: "hidden",
              }}
            >
              <img
                src={neuroLogo}
                alt="NeuroFin Logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          </motion.div>
          <Typography variant="h5" sx={{ color: "white", mb: 1 }}>
            Crear Cuenta
          </Typography>

          <Stepper activeStep={activeStep} sx={{ width: '100%', mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>
                  <Typography color="white">{label}</Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {activeStep === 0 ? (
          <Box
            component="form"
            onSubmit={handleNext}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box sx={{ position: "relative" }}>
              <Badge
                sx={{
                  position: "absolute",
                  left: 8,
                  top: 12,
                  color: "rgba(255,255,255,0.7)",
                  zIndex: 1,
                }}
              />
              <TextField
                fullWidth
                name="firstName"
                placeholder="Nombre"
                value={formData.firstName}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    pl: 4,
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
                }}
              />
            </Box>

            <Box sx={{ position: "relative" }}>
              <Badge
                sx={{
                  position: "absolute",
                  left: 8,
                  top: 12,
                  color: "rgba(255,255,255,0.7)",
                  zIndex: 1,
                }}
              />
              <TextField
                fullWidth
                name="lastName"
                placeholder="Apellido"
                value={formData.lastName}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    pl: 4,
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
                }}
              />
            </Box>

            <Box sx={{ position: "relative" }}>
              <Email
                sx={{
                  position: "absolute",
                  left: 8,
                  top: 12,
                  color: "rgba(255,255,255,0.7)",
                  zIndex: 1,
                }}
              />
              <TextField
                fullWidth
                name="email"
                placeholder="Correo electrónico"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    pl: 4,
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
                }}
              />
            </Box>

            <Box sx={{ position: "relative" }}>
              <Lock
                sx={{
                  position: "absolute",
                  left: 8,
                  top: 12,
                  color: "rgba(255,255,255,0.7)",
                  zIndex: 1,
                }}
              />
              <TextField
                fullWidth
                name="password"
                placeholder="Contraseña"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    pl: 4,
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
                }}
              />
            </Box>

            <Box sx={{ position: "relative" }}>
              <Lock
                sx={{
                  position: "absolute",
                  left: 8,
                  top: 12,
                  color: "rgba(255,255,255,0.7)",
                  zIndex: 1,
                }}
              />
              <TextField
                fullWidth
                name="confirmPassword"
                placeholder="Confirmar contraseña"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    pl: 4,
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
                }}
              />
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
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
                mt: 2,
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
              {isLoading ? <CircularProgress size={24} /> : "Siguiente"}
            </Button>

            <Box sx={{ textAlign: "center" }}>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  textDecoration: "none",
                  "&:hover": {
                    color: "white",
                  },
                }}
              >
                ¿Ya tienes una cuenta? Inicia sesión
              </Link>
            </Box>
          </Box>
        ) : (
          <FinancialPersonalityQuiz onComplete={handleQuizComplete} />
        )}
      </Paper>
    </Container>
  );
} 