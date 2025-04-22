import React, { useState } from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Paper,
  LinearProgress,
  Container,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';

interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    value: string;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "¿Cómo te sientes cuando gastas dinero en algo no planificado?",
    options: [
      { text: "Me siento muy culpable", value: "conservador" },
      { text: "Me preocupo un poco", value: "moderado" },
      { text: "No me preocupa mucho", value: "arriesgado" },
      { text: "Me hace sentir bien", value: "impulsivo" }
    ]
  },
  {
    id: 2,
    text: "¿Qué haces cuando recibes tu salario?",
    options: [
      { text: "Ahorro una cantidad fija inmediatamente", value: "conservador" },
      { text: "Pago todas mis deudas primero", value: "moderado" },
      { text: "Planeo algunas compras importantes", value: "arriesgado" },
      { text: "Me permito algunos gustos", value: "impulsivo" }
    ]
  },
  {
    id: 3,
    text: "¿Cómo prefieres manejar tus gastos diarios?",
    options: [
      { text: "Tengo un presupuesto detallado", value: "conservador" },
      { text: "Tengo límites generales", value: "moderado" },
      { text: "Gasto según mis necesidades", value: "arriesgado" },
      { text: "No suelo planificar mis gastos", value: "impulsivo" }
    ]
  },
  {
    id: 4,
    text: "¿Cómo reaccionas ante una oferta o descuento?",
    options: [
      { text: "Solo compro si realmente lo necesito", value: "conservador" },
      { text: "Evalúo si vale la pena", value: "moderado" },
      { text: "Suelo aprovechar las ofertas", value: "arriesgado" },
      { text: "Compro inmediatamente", value: "impulsivo" }
    ]
  },
  {
    id: 5,
    text: "¿Cómo te preparas para gastos futuros?",
    options: [
      { text: "Tengo varios fondos de ahorro", value: "conservador" },
      { text: "Ahorro un poco cada mes", value: "moderado" },
      { text: "Uso tarjetas de crédito", value: "arriesgado" },
      { text: "Me preocupo cuando llegue el momento", value: "impulsivo" }
    ]
  }
];

interface FinancialPersonalityQuizProps {
  onComplete: (personality: string) => void;
}

export default function FinancialPersonalityQuiz({ onComplete }: FinancialPersonalityQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  const handleNext = () => {
    if (!selectedAnswer) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
    } else {
      // Determinar la personalidad financiera basada en las respuestas
      const personalityCount: { [key: string]: number } = {
        conservador: 0,
        moderado: 0,
        arriesgado: 0,
        impulsivo: 0
      };

      newAnswers.forEach(answer => {
        personalityCount[answer]++;
      });

      const personality = Object.entries(personalityCount).reduce<string>((maxKey, [key, value]) => {
        return personalityCount[maxKey] > value ? maxKey : key;
      }, Object.keys(personalityCount)[0]);

      onComplete(personality);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const newAnswers = [...answers];
      newAnswers.pop();
      setAnswers(newAnswers);
      setSelectedAnswer(answers[currentQuestion - 1] || '');
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Container maxWidth="sm">
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          background: 'rgba(20, 30, 48, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box sx={{ mb: 4 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'primary.main',
              },
            }}
          />
          <Typography variant="body2" color="white" align="right" sx={{ mt: 1 }}>
            {currentQuestion + 1} de {questions.length}
          </Typography>
        </Box>

        <Typography
          variant="h6"
          component={motion.h6}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          color="white"
          gutterBottom
        >
          {questions[currentQuestion].text}
        </Typography>

        <FormControl component="fieldset" sx={{ width: '100%', mt: 2 }}>
          <RadioGroup value={selectedAnswer} onChange={(e) => setSelectedAnswer(e.target.value)}>
            {questions[currentQuestion].options.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <FormControlLabel
                  value={option.value}
                  control={
                    <Radio
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-checked': {
                          color: 'primary.main',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography color="white">
                      {option.text}
                    </Typography>
                  }
                  sx={{
                    width: '100%',
                    margin: '8px 0',
                    padding: '8px 16px',
                    borderRadius: 1,
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                />
              </motion.div>
            ))}
          </RadioGroup>
        </FormControl>

        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
          <Button
            onClick={handleBack}
            disabled={currentQuestion === 0}
            variant="outlined"
            sx={{
              flex: 1,
              py: 1.5,
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.4)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            Anterior
          </Button>
          <Button
            onClick={handleNext}
            disabled={!selectedAnswer}
            variant="contained"
            sx={{
              flex: 1,
              py: 1.5,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              textTransform: 'none',
              fontSize: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&.Mui-disabled': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            {currentQuestion === questions.length - 1 ? 'Finalizar' : 'Siguiente'}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
} 