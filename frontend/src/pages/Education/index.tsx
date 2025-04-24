import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  Button,
  Grid,
  Paper
} from '@mui/material';
import { YouTube as YouTubeIcon } from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const EducationPage = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const resources = [
    {
      title: "Manejo de Finanzas con TDAH",
      description: "Aprende estrategias prácticas para manejar tu dinero considerando las particularidades del TDAH: presupuestos, automatización y control de gastos impulsivos.",
      duration: "25:30",
      author: "ADHD Finance Expert",
      type: "video",
      url: "https://www.youtube.com/watch?v=2koLIu4d_Vo",
      imageUrl: "https://img.youtube.com/vi/2koLIu4d_Vo/maxresdefault.jpg"
    },
    {
      title: "Impacto del TDAH en tus Finanzas",
      description: "Descubre cómo el TDAH afecta tu relación con el dinero y aprende estrategias específicas para superar estos desafíos.",
      duration: "20:15",
      author: "Neuro Finance Coach",
      type: "video",
      url: "https://www.youtube.com/watch?v=H9hWehEwvZQ",
      imageUrl: "https://img.youtube.com/vi/H9hWehEwvZQ/maxresdefault.jpg"
    },
    {
      title: "5 Estrategias Financieras para Personas con TDAH",
      description: "Cinco métodos prácticos y efectivos para manejar tu dinero de manera diferente cuando tienes TDAH.",
      duration: "15:45",
      author: "Money Mindset Coach",
      type: "video",
      url: "https://www.youtube.com/watch?v=adcDmKLsU7s",
      imageUrl: "https://img.youtube.com/vi/adcDmKLsU7s/maxresdefault.jpg"
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Educación Financiera
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Aprende sobre finanzas personales con estos recursos gratuitos seleccionados especialmente para personas neurodivergentes.
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="resource tabs">
            <Tab label="TODOS" />
            <Tab label="YOUTUBE" />
            <Tab label="TIKTOK" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {resources.map((resource, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={resource.imageUrl}
                    alt={resource.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {resource.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {resource.description}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Por: {resource.author}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Duración: {resource.duration}
                      </Typography>
                    </Box>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="contained"
                      startIcon={<YouTubeIcon />}
                      fullWidth
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      VER VIDEO
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {resources.filter(r => r.type === 'video').map((resource, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={resource.imageUrl}
                    alt={resource.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {resource.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {resource.description}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Por: {resource.author}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Duración: {resource.duration}
                      </Typography>
                    </Box>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="contained"
                      startIcon={<YouTubeIcon />}
                      fullWidth
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      VER VIDEO
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Próximamente contenido de TikTok...
            </Typography>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default EducationPage; 