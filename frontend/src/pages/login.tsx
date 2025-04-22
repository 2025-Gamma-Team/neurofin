import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Link,
} from "@mui/material";
import { Person, Lock } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import backgroundImage from "../assets/background.jpg";
import neuroLogo from "../assets/neuro.jpeg";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, setError } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rememberMe" ? checked : value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { email, password } = formData;
      await login(email, password);
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Error de login:", err);
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
          maxWidth: "400px",
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
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Person
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
              id="email"
              placeholder="Email ID"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
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
                "& .MuiOutlinedInput-input": {
                  "&::placeholder": {
                    color: "rgba(255, 255, 255, 0.5)",
                    opacity: 1,
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
              placeholder="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
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
                "& .MuiOutlinedInput-input": {
                  "&::placeholder": {
                    color: "rgba(255, 255, 255, 0.5)",
                    opacity: 1,
                  },
                },
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 1,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  sx={{
                    color: "rgba(255, 255, 255, 0.5)",
                    "&.Mui-checked": {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                  }}
                />
              }
              label={
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  Remember me
                </Typography>
              }
            />
            <Link
              href="#"
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                textDecoration: "none",
                "&:hover": {
                  color: "white",
                },
              }}
            >
              Forgot Password?
            </Link>
          </Box>

          {error && (
            <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
              {error}
            </Typography>
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
            {isLoading ? <CircularProgress size={24} /> : "Iniciar Sesión"}
          </Button>

          <Box sx={{ textAlign: "center" }}>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/register");
              }}
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                textDecoration: "none",
                "&:hover": {
                  color: "white",
                },
              }}
            >
              ¿No tienes una cuenta? Regístrate
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
