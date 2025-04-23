import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Grid,
  Button,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Face,
  ColorLens,
  Style,
  Mood,
  Palette,
  Save,
  Refresh
} from '@mui/icons-material';
import { createAvatar } from '@dicebear/core';
import { personas } from '@dicebear/collection';

interface UserAvatarProps {
  healthStatus?: 'excelente' | 'buena' | 'regular' | 'mala';
  onSave?: (avatarConfig: AvatarConfig) => void;
}

type HairColor = 'brown' | 'black' | 'blonde' | 'gray' | 'red';
type SkinColor = 'light' | 'brown' | 'dark' | 'black' | 'yellow' | 'red' | 'white';
type ClothesColor = 'white' | 'gray' | 'black' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink';
type HairStyle = 'shortCombover' | 'curlyHighTop' | 'bobCut' | 'curly' | 'pigtails' | 'curlyBun' | 'buzzcut' | 'bobBangs' | 'bald' | 'balding' | 'cap' | 'bunUndercut' | 'mohawk';
type EyeStyle = 'open' | 'sleep' | 'wink' | 'glasses' | 'happy' | 'sunglasses';
type MouthStyle = 'smile' | 'frown' | 'surprise' | 'pacifier' | 'bigSmile' | 'smirk' | 'lips';
type NoseStyle = 'mediumRound' | 'smallRound' | 'wrinkles';
type BodyStyle = 'small' | 'squared' | 'rounded' | 'checkered';
type FacialHairStyle = 'beardMustache' | 'pyramid' | 'walrus' | 'goatee' | 'shadow' | 'soulPatch';

interface AvatarConfig {
  seed: string;
  hairColor: HairColor;
  skinColor: SkinColor;
  body?: BodyStyle;
  eyes?: EyeStyle;
  facialHair?: FacialHairStyle;
  hair?: HairStyle;
  mouth?: MouthStyle;
  nose?: NoseStyle;
}

const SKIN_COLORS: SkinColor[] = ['light', 'brown', 'dark', 'black', 'yellow', 'red', 'white'];
const HAIR_COLORS: HairColor[] = ['brown', 'black', 'blonde', 'gray', 'red'];
const CLOTHES_COLORS: ClothesColor[] = ['white', 'gray', 'black', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'];

const HAIR_STYLES: HairStyle[] = ['shortCombover', 'curlyHighTop', 'bobCut', 'curly', 'pigtails', 'curlyBun', 'buzzcut', 'bobBangs', 'bald', 'balding', 'cap', 'bunUndercut', 'mohawk'];
const EYE_STYLES: EyeStyle[] = ['open', 'sleep', 'wink', 'glasses', 'happy', 'sunglasses'];
const MOUTH_STYLES: MouthStyle[] = ['smile', 'frown', 'surprise', 'pacifier', 'bigSmile', 'smirk', 'lips'];
const NOSE_STYLES: NoseStyle[] = ['mediumRound', 'smallRound', 'wrinkles'];
const BODY_STYLES: BodyStyle[] = ['small', 'squared', 'rounded', 'checkered'];

const defaultConfig: AvatarConfig = {
  seed: Math.random().toString(),
  hairColor: 'brown',
  skinColor: 'light',
  body: 'small',
  eyes: 'open',
  mouth: 'smile',
  nose: 'mediumRound',
  hair: 'shortCombover'
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  healthStatus = 'regular',
  onSave
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [avatarSvg, setAvatarSvg] = useState<string>('');
  const [currentConfig, setCurrentConfig] = useState<AvatarConfig>({
    ...defaultConfig
  });

  const getHealthStyle = (status: string) => {
    switch (status) {
      case 'excelente':
        return {
          gradient: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
          borderColor: theme.palette.success.main,
          shadowColor: 'rgba(76, 175, 80, 0.3)',
          mouth: 'smile' as MouthStyle
        };
      case 'buena':
        return {
          gradient: 'linear-gradient(45deg, #2196F3 30%, #64B5F6 90%)',
          borderColor: theme.palette.info.main,
          shadowColor: 'rgba(33, 150, 243, 0.3)',
          mouth: 'smile' as MouthStyle
        };
      case 'regular':
        return {
          gradient: 'linear-gradient(45deg, #FFC107 30%, #FFD54F 90%)',
          borderColor: theme.palette.warning.main,
          shadowColor: 'rgba(255, 193, 7, 0.3)',
          mouth: 'frown' as MouthStyle
        };
      case 'mala':
        return {
          gradient: 'linear-gradient(45deg, #F44336 30%, #E57373 90%)',
          borderColor: theme.palette.error.main,
          shadowColor: 'rgba(244, 67, 54, 0.3)',
          mouth: 'frown' as MouthStyle
        };
      default:
        return {
          gradient: 'linear-gradient(45deg, #9C27B0 30%, #BA68C8 90%)',
          borderColor: theme.palette.primary.main,
          shadowColor: 'rgba(156, 39, 176, 0.3)',
          mouth: 'smile' as MouthStyle
        };
    }
  };

  useEffect(() => {
    const healthStyle = getHealthStyle(healthStatus);
    const newConfig = {
      ...currentConfig,
      mouth: healthStyle.mouth
    };
    updateAvatar(newConfig);
  }, [healthStatus]);

  const updateAvatar = async (config: AvatarConfig) => {
    try {
      const avatar = createAvatar(personas, {
        seed: config.seed,
        backgroundColor: ['transparent'],
        hair: [config.hair || 'shortCombover'],
        hairColor: [config.hairColor],
        skinColor: [config.skinColor],
        body: [config.body || 'small'],
        eyes: [config.eyes || 'open'],
        mouth: [config.mouth || 'smile'],
        nose: [config.nose || 'mediumRound'],
        facialHair: config.facialHair ? [config.facialHair] : [],
        radius: 50,
        scale: 90,
      });

      const svg = await avatar.toString();
      setAvatarSvg(svg);
      setCurrentConfig(config);
    } catch (error) {
      console.error('Error al generar el avatar:', error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleConfigChange = (key: keyof AvatarConfig, value: any) => {
    const newConfig = {
      ...currentConfig,
      [key]: value === '' ? undefined : value
    };
    updateAvatar(newConfig);
  };

  const handleSave = () => {
    localStorage.setItem('avatarConfig', JSON.stringify(currentConfig));
    onSave?.(currentConfig);
  };

  const handleReset = () => {
    const healthStyle = getHealthStyle(healthStatus);
    const newDefaultConfig = {
      ...defaultConfig,
      mouth: healthStyle.mouth
    };
    updateAvatar(newDefaultConfig);
  };

  const healthStyle = getHealthStyle(healthStatus);

  const renderConfigOptions = () => {
    switch (activeTab) {
      case 0: // Características faciales
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Estilo de pelo</InputLabel>
                <Select
                  value={currentConfig.hair || ''}
                  onChange={(e) => handleConfigChange('hair', e.target.value)}
                >
                  {HAIR_STYLES.map((style) => (
                    <MenuItem key={style} value={style}>
                      {style}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Color de pelo</InputLabel>
                <Select
                  value={currentConfig.hairColor}
                  onChange={(e) => handleConfigChange('hairColor', e.target.value)}
                >
                  {HAIR_COLORS.map((color) => (
                    <MenuItem key={color} value={color}>
                      {color}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Color de piel</InputLabel>
                <Select
                  value={currentConfig.skinColor}
                  onChange={(e) => handleConfigChange('skinColor', e.target.value)}
                >
                  {SKIN_COLORS.map((color) => (
                    <MenuItem key={color} value={color}>
                      {color}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 1: // Expresiones
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Ojos</InputLabel>
                <Select
                  value={currentConfig.eyes || ''}
                  onChange={(e) => handleConfigChange('eyes', e.target.value)}
                >
                  {EYE_STYLES.map((style) => (
                    <MenuItem key={style} value={style}>
                      {style}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Boca</InputLabel>
                <Select
                  value={currentConfig.mouth || ''}
                  onChange={(e) => handleConfigChange('mouth', e.target.value)}
                >
                  {MOUTH_STYLES.map((style) => (
                    <MenuItem key={style} value={style}>
                      {style}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Nariz</InputLabel>
                <Select
                  value={currentConfig.nose || ''}
                  onChange={(e) => handleConfigChange('nose', e.target.value)}
                >
                  {NOSE_STYLES.map((style) => (
                    <MenuItem key={style} value={style}>
                      {style}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  const tabs = [
    { icon: <Face />, label: 'Características' },
    { icon: <Mood />, label: 'Expresiones' }
  ];

  return (
    <Card
      sx={{
        maxWidth: 800,
        margin: 'auto',
        background: theme.palette.background.paper,
        borderRadius: 4,
        border: `2px solid ${healthStyle.borderColor}`,
        boxShadow: `0 8px 32px ${healthStyle.shadowColor}`,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: `0 12px 40px ${healthStyle.shadowColor}`
        }
      }}
    >
      <CardContent>
        <Grid container spacing={3}>
          {/* Columna del Avatar */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" fontWeight="bold" sx={{
                background: healthStyle.gradient,
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}>
                Tu Avatar Financiero
              </Typography>
              <Box>
                <Tooltip title="Guardar configuración">
                  <IconButton onClick={handleSave} color="primary">
                    <Save />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Restablecer">
                  <IconButton onClick={handleReset} color="secondary">
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Box
              sx={{
                width: '100%',
                height: '400px',
                background: healthStyle.gradient,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                mb: 2,
                p: 2
              }}
            >
              {avatarSvg ? (
                <Box
                  component="div"
                  dangerouslySetInnerHTML={{ __html: avatarSvg }}
                  sx={{
                    width: '300px',
                    height: '300px',
                    margin: 'auto',
                    '& svg': {
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 2
                  }}
                >
                  <Typography variant="h6" sx={{ color: 'white', textAlign: 'center' }}>
                    Personaliza tu avatar para ver los cambios
                  </Typography>
                </Box>
              )}
            </Box>

            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                mb: 2,
                '& .MuiTab-root': {
                  minWidth: 'auto',
                  px: 2
                }
              }}
            >
              {tabs.map((tab) => (
                <Tab key={tab.label} icon={tab.icon} label={tab.label} />
              ))}
            </Tabs>

            <Box sx={{ p: 2 }}>
              {renderConfigOptions()}
            </Box>
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{
          mt: 2,
          color: healthStyle.borderColor,
          textAlign: 'center',
          fontStyle: 'italic'
        }}>
          Tu salud financiera es: {healthStatus.charAt(0).toUpperCase() + healthStatus.slice(1)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default UserAvatar;
