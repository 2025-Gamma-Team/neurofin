import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Tabs,
  Tab,
  useTheme,
  SvgIcon
} from '@mui/material';
import { YouTube as YouTubeIcon, Instagram as InstagramIcon } from '@mui/icons-material';

// Ícono personalizado para TikTok
const TikTokIcon = (props: any) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 00-1-.08A6.34 6.34 0 003 15.66a6.34 6.34 0 0010.86 4.44A6.37 6.37 0 0015 15.66V8.23a8.2 8.2 0 004.59 1.42v-3z"/>
  </SvgIcon>
);

interface Video {
  id: string;
  title: string;
  description: string;
  platform: 'youtube' | 'tiktok' | 'instagram';
  videoId: string;
  duration?: string;
  author: string;
  authorHandle: string;
  embedUrl: string;
  originalUrl: string;
  date: string;
}

const videos: Video[] = [
  {
    id: '1',
    title: 'Finanzas para Neurodivergentes',
    description: 'Aprende estrategias financieras adaptadas específicamente para personas con TDAH y otras neurodivergencias.',
    platform: 'instagram',
    videoId: 'C4Omc68pMFh',
    author: 'Liliana Zamacona',
    authorHandle: '@lachinafinanciera',
    embedUrl: 'https://www.instagram.com/reel/C4Omc68pMFh/embed',
    originalUrl: 'https://www.instagram.com/lachinafinanciera/reel/C4Omc68pMFh/',
    date: '2025-03-06'
  },
  {
    id: '2',
    title: 'Finanzas y TDAH: Trucos para el Control Económico',
    description: 'Descubre técnicas prácticas para manejar tu dinero cuando tienes TDAH.',
    platform: 'tiktok',
    videoId: 'mireiaferrerbueno',
    author: 'Mireia Ferrer',
    authorHandle: '@mireiaferrerbueno',
    embedUrl: 'https://www.tiktok.com/embed/mireiaferrerbueno',
    originalUrl: 'https://www.tiktok.com/@mireiaferrerbueno',
    date: '2025-03-07',
    duration: '2:18'
  },
  {
    id: '3',
    title: 'Transformando mis Finanzas 2025',
    description: 'Tips y trucos neurodivergentes para manejar finanzas en pareja y personales.',
    platform: 'instagram',
    videoId: 'finanzasparaperritxs',
    author: 'Finanzas Para Perritxs',
    authorHandle: '@finanzasparaperritxs',
    embedUrl: 'https://www.instagram.com/reel/finanzasparaperritxs/embed',
    originalUrl: 'https://www.instagram.com/finanzasparaperritxs',
    date: '2025-01-08',
    duration: '2:06'
  },
  {
    id: '4',
    title: 'Taller de Finanzas Neurodivergentes',
    description: 'Herramientas prácticas para administrar dinero y aprender a ahorrar.',
    platform: 'instagram',
    videoId: 'badiscapacidad',
    author: 'COPIDIS',
    authorHandle: '@badiscapacidad',
    embedUrl: 'https://www.instagram.com/reel/badiscapacidad/embed',
    originalUrl: 'https://www.instagram.com/badiscapacidad',
    date: '2025-03-25',
    duration: '0:47'
  },
  {
    id: '5',
    title: 'Finanzas y TDAH: Gestión del Dinero',
    description: 'Consejos prácticos para gestionar tu dinero cuando tienes TDAH, incluyendo estrategias para el control de gastos.',
    platform: 'tiktok',
    videoId: '7479130387873025302',
    author: 'Mireia Ferrer',
    authorHandle: '@mireiaferrerbueno',
    embedUrl: 'https://www.tiktok.com/embed/7479130387873025302',
    originalUrl: 'https://www.tiktok.com/@mireiaferrerbueno/video/7479130387873025302',
    date: '2024-03-15',
    duration: '2:45'
  },
  {
    id: '6',
    title: 'Metas Financieras 2025',
    description: 'Organiza tus finanzas y mejora tus hábitos con estrategias adaptadas.',
    platform: 'youtube',
    videoId: 'sofiaMacias2025',
    author: 'Sofía Macías',
    authorHandle: '@SofiaMaciasOf',
    embedUrl: 'https://www.youtube.com/embed/sofiaMacias2025',
    originalUrl: 'https://www.youtube.com/watch?v=sofiaMacias2025',
    date: '2024-12-19',
    duration: '8:40'
  },
  {
    id: '7',
    title: 'Heridas Financieras y Neurodivergencia',
    description: 'Comprende y sana tus heridas financieras desde una perspectiva neurodivergente.',
    platform: 'instagram',
    videoId: 'lachinafinanciera2',
    author: 'Liliana Zamacona',
    authorHandle: '@lachinafinanciera',
    embedUrl: 'https://www.instagram.com/reel/lachinafinanciera2/embed',
    originalUrl: 'https://www.instagram.com/lachinafinanciera',
    date: '2024-11-23',
    duration: '2:51'
  },
  {
    id: '8',
    title: 'TDAH y Finanzas: Guía Práctica',
    description: 'Taller completo de finanzas personales para personas con TDAH.',
    platform: 'instagram',
    videoId: 'mentedmente',
    author: 'MenteDmente - Miriam Rodríguez',
    authorHandle: '@mente.d.mente',
    embedUrl: 'https://www.instagram.com/reel/mentedmente/embed',
    originalUrl: 'https://www.instagram.com/mente.d.mente',
    date: '2024-08-16',
    duration: '0:57'
  }
];

const FinancialEducation = () => {
  const [currentPlatform, setCurrentPlatform] = React.useState<'all' | 'youtube' | 'tiktok' | 'instagram'>('all');
  const theme = useTheme();

  const filteredVideos = currentPlatform === 'all'
    ? videos
    : videos.filter(video => video.platform === currentPlatform);

  const handlePlatformChange = (event: React.SyntheticEvent, newValue: 'all' | 'youtube' | 'tiktok' | 'instagram') => {
    setCurrentPlatform(newValue);
  };

  const handleWatchVideo = (video: Video) => {
    window.open(video.originalUrl, '_blank');
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return <YouTubeIcon />;
      case 'tiktok':
        return <TikTokIcon />;
      case 'instagram':
        return <InstagramIcon />;
      default:
        return null;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return '#FF0000';
      case 'tiktok':
        return '#000000';
      case 'instagram':
        return '#E4405F';
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{
            p: 3,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(38, 38, 38, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            borderRadius: 2,
            border: '1px solid rgba(50, 205, 50, 0.5)',
            boxShadow: '0 0 10px rgba(50, 205, 50, 0.2)'
          }}>
            <Typography variant="h4" gutterBottom sx={{
              color: theme.palette.mode === 'dark' ? '#32CD32' : '#1B5E20',
              fontWeight: 600,
              fontSize: '1.5rem'
            }}>
              Educación Financiera Neurodivergente
            </Typography>
            <Typography variant="subtitle1" paragraph sx={{
              color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
              fontSize: '1rem'
            }}>
              Contenido especializado sobre finanzas para personas neurodivergentes. Aprende estrategias adaptadas a tu forma de pensar.
            </Typography>

            <Tabs
              value={currentPlatform}
              onChange={handlePlatformChange}
              sx={{
                mb: 4,
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTab-root': {
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
                }
              }}
            >
              <Tab
                label="Todo el Contenido"
                value="all"
                sx={{ color: theme.palette.text.primary }}
              />
              <Tab
                label="YouTube"
                value="youtube"
                icon={<YouTubeIcon />}
                iconPosition="start"
                sx={{ color: theme.palette.text.primary }}
              />
              <Tab
                label="TikTok"
                value="tiktok"
                icon={<TikTokIcon />}
                iconPosition="start"
                sx={{ color: theme.palette.text.primary }}
              />
              <Tab
                label="Instagram"
                value="instagram"
                icon={<InstagramIcon />}
                iconPosition="start"
                sx={{ color: theme.palette.text.primary }}
              />
            </Tabs>

            <Grid container spacing={3}>
              {filteredVideos.map((video) => (
                <Grid item xs={12} sm={6} md={4} key={video.id}>
                  <Card sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(38, 38, 38, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(50, 205, 50, 0.5)',
                    borderRadius: 2,
                    boxShadow: '0 0 10px rgba(50, 205, 50, 0.2)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 0 15px rgba(50, 205, 50, 0.3)',
                      border: '1px solid rgba(50, 205, 50, 0.8)'
                    }
                  }}>
                    <Box sx={{
                      position: 'relative',
                      paddingTop: video.platform === 'instagram' || video.platform === 'tiktok' ? '177%' : '56.25%',
                      bgcolor: 'black'
                    }}>
                      <iframe
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          border: 'none'
                        }}
                        src={video.embedUrl}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </Box>
                    <CardContent sx={{
                      flexGrow: 1,
                      bgcolor: 'transparent'
                    }}>
                      <Typography gutterBottom variant="h6" component="div" sx={{
                        color: theme.palette.mode === 'dark' ? '#32CD32' : '#1B5E20',
                        fontWeight: 600,
                        fontSize: '1.1rem'
                      }}>
                        {video.title}
                      </Typography>
                      <Typography variant="body2" sx={{
                        color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                        fontSize: '0.9rem'
                      }} paragraph>
                        {video.description}
                      </Typography>
                      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" sx={{
                          color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
                        }} display="block">
                          {video.authorHandle}
                        </Typography>
                        {video.duration && (
                          <Typography variant="caption" sx={{
                            color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
                          }}>
                            • {video.duration}
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={getPlatformIcon(video.platform)}
                        onClick={() => handleWatchVideo(video)}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 600,
                          bgcolor: getPlatformColor(video.platform),
                          color: video.platform === 'tiktok' ? '#FFFFFF' : 'inherit',
                          borderRadius: 1.5,
                          '&:hover': {
                            bgcolor: getPlatformColor(video.platform),
                            filter: 'brightness(1.2)',
                            boxShadow: '0 0 10px rgba(50, 205, 50, 0.3)'
                          }
                        }}
                      >
                        Ver en {video.platform === 'youtube' ? 'YouTube' : video.platform === 'tiktok' ? 'TikTok' : 'Instagram'}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FinancialEducation;
