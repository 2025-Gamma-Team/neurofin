import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  LinearProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { keyframes } from '@mui/system';

// Animaciones para el topo
const disappear = keyframes`
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0); opacity: 0; }
`;

const appear = keyframes`
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

// Posiciones fijas para los topos
const MOLE_POSITIONS = [
  { x: 20, y: 60 },
  { x: 40, y: 60 },
  { x: 60, y: 60 },
  { x: 80, y: 60 },
];

const Game = () => {
  const [money, setMoney] = useState(1000);
  const [health, setHealth] = useState(100);
  const [happiness, setHappiness] = useState(100);
  const [knowledge, setKnowledge] = useState(0);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [visibleMoles, setVisibleMoles] = useState(Array(4).fill(false));
  const [canClickMoles, setCanClickMoles] = useState(Array(4).fill(true));

  const showRandomMole = useCallback(() => {
    const availableMoles = visibleMoles.map((visible, index) => !visible ? index : -1).filter(index => index !== -1);
    if (availableMoles.length > 0) {
      const randomIndex = availableMoles[Math.floor(Math.random() * availableMoles.length)];
      setVisibleMoles(prev => {
        const newState = [...prev];
        newState[randomIndex] = true;
        return newState;
      });
      setCanClickMoles(prev => {
        const newState = [...prev];
        newState[randomIndex] = true;
        return newState;
      });

      // Ocultar el topo después de un tiempo aleatorio
      setTimeout(() => {
        setVisibleMoles(prev => {
          const newState = [...prev];
          newState[randomIndex] = false;
          return newState;
        });
      }, Math.random() * 1500 + 1000);
    }
  }, [visibleMoles]);

  useEffect(() => {
    const interval = setInterval(() => {
      showRandomMole();
    }, 2000);

    return () => clearInterval(interval);
  }, [showRandomMole]);

  const handleMoleClick = (index: number) => {
    if (canClickMoles[index] && visibleMoles[index]) {
      setCanClickMoles(prev => {
        const newState = [...prev];
        newState[index] = false;
        return newState;
      });
      setVisibleMoles(prev => {
        const newState = [...prev];
        newState[index] = false;
        return newState;
      });
      setMoney(prev => prev + 50);
      setHappiness(prev => Math.min(100, prev + 5));
      showNotification('¡Atrapaste al topo! +50 pesos 🎯');
    }
  };

  const handleWork = () => {
    setMoney(prev => prev + 100);
    setHealth(prev => Math.max(0, prev - 10));
    setHappiness(prev => Math.max(0, prev - 5));
    showNotification('¡Ganaste 100 pesos trabajando! 💰');
  };

  const handleStudy = () => {
    setKnowledge(prev => Math.min(100, prev + 10));
    setHappiness(prev => Math.max(0, prev - 5));
    showNotification('¡Aprendiste algo nuevo! 📚');
  };

  const handleRest = () => {
    setHealth(prev => Math.min(100, prev + 15));
    setHappiness(prev => Math.min(100, prev + 10));
    setMoney(prev => Math.max(0, prev - 50));
    showNotification('Te has recuperado pero gastaste 50 pesos 😴');
  };

  const handleInvest = () => {
    if (money >= 200) {
      const success = Math.random() > 0.5;
      if (success) {
        setMoney(prev => prev + 100);
        showNotification('¡Tu inversión fue exitosa! Ganaste 100 pesos 🎉');
      } else {
        setMoney(prev => prev - 100);
        showNotification('Tu inversión no fue exitosa. Perdiste 100 pesos 😢');
      }
    } else {
      showNotification('No tienes suficiente dinero para invertir 💸');
    }
  };

  const showNotification = (msg: string) => {
    setMessage(msg);
    setShowMessage(true);
  };

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#2196f3', fontWeight: 'bold', mb: 4 }}>
        ¡Atrapa al Topo Financiero!
      </Typography>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-around', 
        flexWrap: 'wrap',
        mb: 4 
      }}>
        {MOLE_POSITIONS.map((pos, index) => (
          <Box
            key={index}
            onClick={() => handleMoleClick(index)}
            sx={{
              width: '150px',
              height: '150px',
              position: 'relative',
              cursor: 'pointer',
              margin: '10px',
            }}
          >
            {visibleMoles[index] && (
              <img
                src="/TOP.png"
                alt="Topo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  position: 'absolute',
                  animation: `${appear} 0.3s ease-out`,
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                  transform: canClickMoles[index] ? 'scale(1)' : 'scale(0)',
                  transition: 'transform 0.3s ease-out',
                }}
              />
            )}
          </Box>
        ))}
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, background: 'linear-gradient(45deg, #FFE082 30%, #FFB74D 90%)' }}>
            <Typography variant="h6">Dinero: ${money} 💰</Typography>
            <LinearProgress 
              variant="determinate" 
              value={(money / 2000) * 100} 
              sx={{ 
                mt: 1,
                height: 10,
                borderRadius: 5,
                backgroundColor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#FFB74D'
                }
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, background: 'linear-gradient(45deg, #81C784 30%, #4CAF50 90%)' }}>
            <Typography variant="h6">Salud: {health}% ❤️</Typography>
            <LinearProgress 
              variant="determinate" 
              value={health} 
              color="success"
              sx={{ 
                mt: 1,
                height: 10,
                borderRadius: 5
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, background: 'linear-gradient(45deg, #FFB74D 30%, #FF9800 90%)' }}>
            <Typography variant="h6">Felicidad: {happiness}% 😊</Typography>
            <LinearProgress 
              variant="determinate" 
              value={happiness} 
              color="warning"
              sx={{ 
                mt: 1,
                height: 10,
                borderRadius: 5
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, background: 'linear-gradient(45deg, #64B5F6 30%, #2196F3 90%)' }}>
            <Typography variant="h6">Conocimiento: {knowledge}% 📚</Typography>
            <LinearProgress 
              variant="determinate" 
              value={knowledge} 
              color="info"
              sx={{ 
                mt: 1,
                height: 10,
                borderRadius: 5
              }}
            />
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Box
            sx={{
              p: 2,
              bgcolor: '#00bcd4',
              color: 'white',
              borderRadius: 2,
              cursor: health <= 0 ? 'not-allowed' : 'pointer',
              opacity: health <= 0 ? 0.7 : 1,
              transition: 'transform 0.2s, opacity 0.2s',
              '&:hover': {
                transform: health <= 0 ? 'none' : 'scale(1.02)'
              }
            }}
            onClick={health <= 0 ? undefined : handleWork}
          >
            <Typography variant="h6">TRABAJAR 💼</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box
            sx={{
              p: 2,
              bgcolor: '#5c6bc0',
              color: 'white',
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)'
              }
            }}
            onClick={handleStudy}
          >
            <Typography variant="h6">ESTUDIAR 📚</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box
            sx={{
              p: 2,
              bgcolor: '#66bb6a',
              color: 'white',
              borderRadius: 2,
              cursor: money < 50 ? 'not-allowed' : 'pointer',
              opacity: money < 50 ? 0.7 : 1,
              transition: 'transform 0.2s, opacity 0.2s',
              '&:hover': {
                transform: money < 50 ? 'none' : 'scale(1.02)'
              }
            }}
            onClick={money < 50 ? undefined : handleRest}
          >
            <Typography variant="h6">DESCANSAR 😴</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box
            sx={{
              p: 2,
              bgcolor: '#ffa726',
              color: 'white',
              borderRadius: 2,
              cursor: money < 200 ? 'not-allowed' : 'pointer',
              opacity: money < 200 ? 0.7 : 1,
              transition: 'transform 0.2s, opacity 0.2s',
              '&:hover': {
                transform: money < 200 ? 'none' : 'scale(1.02)'
              }
            }}
            onClick={money < 200 ? undefined : handleInvest}
          >
            <Typography variant="h6">INVERTIR 📈</Typography>
          </Box>
        </Grid>
      </Grid>

      <Snackbar 
        open={showMessage} 
        autoHideDuration={3000} 
        onClose={() => setShowMessage(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity="info" 
          sx={{ 
            width: '100%',
            fontSize: '1.1rem',
            '& .MuiAlert-icon': {
              fontSize: '2rem'
            }
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Game;