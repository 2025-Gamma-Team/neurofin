import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Fab,
  Paper,
  Typography,
  IconButton,
  Collapse,
  useTheme,
  Tooltip,
  Zoom,
  TextField,
  Button,
  Avatar,
  CircularProgress
} from '@mui/material';
import {
  SmartToy,
  Close,
  AccountBalance,
  Send,
  ArrowForward,
  Psychology,
  AutoFixHigh
} from '@mui/icons-material';
import api from '@/utils/api';

interface ChatMessage {
  text: string;
  elementId?: string;
  sender: 'bot' | 'user';
  type?: 'tutorial' | 'chat';
  isLoading?: boolean;
}

const tutorialSteps: ChatMessage[] = [
  {
    text: "¡Hola! Soy tu asistente financiero especializado. Estoy aquí para ayudarte a manejar tus finanzas de una manera que se adapte a ti. ¿Te gustaría un tour por tu dashboard o prefieres hacerme preguntas específicas sobre finanzas?",
    sender: 'bot',
    type: 'tutorial'
  },
  {
    text: "Este es tu perfil personal. Lo he diseñado de manera clara y organizada para que sea fácil de entender.",
    elementId: "profile-section",
    sender: 'bot',
    type: 'tutorial'
  },
  {
    text: "Aquí está tu balance total. Uso colores y números grandes para que la información sea más visual y fácil de procesar.",
    elementId: "balance-total",
    sender: 'bot',
    type: 'tutorial'
  },
  {
    text: "Esta sección muestra tus ingresos mensuales. He organizado la información en categorías claras para ayudarte a mantener un mejor control.",
    elementId: "ingresos-mensuales",
    sender: 'bot',
    type: 'tutorial'
  },
  {
    text: "Y aquí están tus gastos mensuales. Uso códigos de color para ayudarte a identificar rápidamente diferentes tipos de gastos.",
    elementId: "gastos-mensuales",
    sender: 'bot',
    type: 'tutorial'
  },
  {
    text: "Por último, aquí tienes el resumen de transacciones. Lo he simplificado para que sea más fácil de seguir.",
    elementId: "transactions-summary",
    sender: 'bot',
    type: 'tutorial'
  }
];

const financialTips = {
  autism: [
    "💡 Establece rutinas financieras claras y predecibles",
    "📊 Usa visualizaciones y gráficos para entender mejor tus finanzas",
    "🎯 Define metas financieras específicas y medibles",
    "⏰ Configura recordatorios para pagos y revisiones financieras",
    "📱 Utiliza apps y herramientas digitales para automatizar tareas",
    "🏦 Mantén un sistema de organización consistente para tus gastos"
  ],
  adhd: [
    "⚡ Divide tus metas financieras en pasos pequeños y manejables",
    "🎨 Usa códigos de colores para diferentes categorías de gastos",
    "📱 Configura alertas y recordatorios para pagos importantes",
    "🎯 Establece recompensas por alcanzar objetivos financieros",
    "📊 Utiliza herramientas visuales para hacer seguimiento",
    "💰 Automatiza tus ahorros y pagos recurrentes"
  ]
};

const getAIResponse = async (message: string): Promise<any> => {
  // Aquí iría la lógica de conexión con la IA
  // Por ahora simulamos respuestas basadas en palabras clave
  const messagePayload = {
    userMessage: message.toLowerCase(),
    language: "es"
  };
  const response = await api.post('/chat', messagePayload)
  return JSON.parse(response.data.body).advisorResponse
};

export const ChatBot: React.FC = () => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([tutorialSteps[0]]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTutorialMode, setIsTutorialMode] = useState(true);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setHighlightedElement(tutorialSteps[currentStep + 1].elementId || null);
      setMessages(prev => [...prev, tutorialSteps[currentStep + 1]]);
    } else {
      setIsTutorialMode(false);
      setHighlightedElement(null);
      setMessages(prev => [...prev, {
        text: "¿En qué más puedo ayudarte? Puedes preguntarme sobre estrategias financieras específicas para TEA o TDA/TDAH.",
        sender: 'bot',
        type: 'chat'
      }]);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentStep(0);
    setHighlightedElement(null);
    setMessages([tutorialSteps[0]]);
    setIsTutorialMode(true);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      text: inputMessage,
      sender: 'user',
      type: 'chat'
    };

    const loadingMessage: ChatMessage = {
      text: "Pensando...",
      sender: 'bot',
      type: 'chat',
      isLoading: true
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInputMessage('');

    // Simular delay de respuesta
    const response = await getAIResponse(inputMessage);
    
    
    setMessages(prev => [
      ...prev.filter(msg => !msg.isLoading),
      {
        text: response,
        sender: 'bot',
        type: 'chat'
      }
    ]);
  };

  return (
    <>
      {/* Highlight Overlay */}
      {highlightedElement && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1200,
            pointerEvents: 'none'
          }}
        />
      )}

      {/* ChatBot Button */}
      <Tooltip 
        title="Asistente Financiero Especializado" 
        placement="left"
        TransitionComponent={Zoom}
      >
        <Fab
          color="primary"
          aria-label="chatbot"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1300
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Psychology />
        </Fab>
      </Tooltip>

      {/* Chat Interface */}
      <Collapse
        in={isOpen}
        sx={{
          position: 'fixed',
          bottom: 90,
          right: 24,
          zIndex: 1300,
          maxWidth: 380
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 2,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(28, 34, 35, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            borderRadius: 2,
            border: `1px solid ${theme.palette.primary.main}`
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Psychology color="primary" />
              Asistente NeuroFin
            </Typography>
            <IconButton size="small" onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>

          {/* Messages Container */}
          <Box 
            sx={{ 
              height: '300px', 
              overflowY: 'auto',
              mb: 2,
              p: 1
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                  gap: 1,
                  mb: 2
                }}
              >
                {message.sender === 'bot' && (
                  <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                    <Psychology />
                  </Avatar>
                )}
                <Paper
                  sx={{
                    p: 1.5,
                    maxWidth: '80%',
                    bgcolor: message.sender === 'user' 
                      ? theme.palette.primary.main 
                      : theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(0, 0, 0, 0.05)',
                    color: message.sender === 'user' 
                      ? '#fff' 
                      : theme.palette.text.primary
                  }}
                >
                  {message.isLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Typography variant="body1">
                      {message.text}
                    </Typography>
                  )}
                </Paper>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          {!isTutorialMode ? (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Escribe tu mensaje..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3
                  }
                }}
              />
              <Fab
                color="primary"
                size="small"
                onClick={handleSendMessage}
              >
                <Send />
              </Fab>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setIsTutorialMode(false);
                  setHighlightedElement(null);
                  setMessages(prev => [...prev, {
                    text: "¿En qué puedo ayudarte? Cuéntame sobre tus necesidades específicas.",
                    sender: 'bot',
                    type: 'chat'
                  }]);
                }}
              >
                Saltar Tour
              </Button>
              <Fab
                color="primary"
                size="small"
                onClick={handleNext}
              >
                {currentStep === tutorialSteps.length - 1 ? <AutoFixHigh /> : <ArrowForward />}
              </Fab>
            </Box>
          )}
        </Paper>
      </Collapse>
    </>
  );
}; 