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
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-avataaars-sprites';

interface UserAvatarProps {
  healthStatus?: 'excelente' | 'buena' | 'regular' | 'mala';
  onSave?: (avatarConfig: AvatarConfig) => void;
}

type HairColor = 'brown' | 'black' | 'auburn' | 'blonde' | 'pastelPink' | 'platinum' | 'red' | 'gray' | 'blondeGolden' | 'brownDark' | 'pastel' | 'silverGray';
type SkinColor = 'tanned' | 'yellow' | 'pale' | 'light' | 'brown' | 'darkBrown' | 'black';
type ClothesColor = 'blue01' | 'blue02' | 'blue03' | 'gray01' | 'gray02' | 'heather' | 'pastelBlue' | 'pastelGreen' | 'pastelOrange' | 'pastelRed' | 'pastelYellow' | 'pink' | 'red';
type ClothesType = 'blazerShirt' | 'blazerSweater' | 'collarSweater' | 'hoodie' | 'overall' | 'shirtCrewNeck' | 'shirtVNeck';
type AccessoryType = 'kurt' | 'prescription01' | 'prescription02' | 'round' | 'sunglasses' | 'wayfarers';

interface AvatarConfig {
  seed: string;
  hairColor: HairColor;
  skinColor: SkinColor;
  clothesColor: ClothesColor;
  clothesType: ClothesType;
  accessoriesType?: AccessoryType;
  facialHair?: string;
  eyebrow?: string;
  mouth?: string;
  eyes?: string;
}

const SKIN_COLORS: SkinColor[] = ['light', 'brown', 'darkBrown', 'black', 'tanned', 'yellow', 'pale'];
const HAIR_COLORS: HairColor[] = ['brown', 'black', 'auburn', 'blonde', 'pastelPink', 'platinum', 'red', 'gray', 'blondeGolden', 'brownDark', 'pastel', 'silverGray'];
const CLOTHES_TYPES: ClothesType[] = ['blazerShirt', 'blazerSweater', 'collarSweater', 'hoodie', 'overall', 'shirtCrewNeck', 'shirtVNeck'];
const CLOTHES_COLORS: ClothesColor[] = ['blue01', 'blue02', 'blue03', 'gray01', 'gray02', 'heather', 'pastelBlue', 'pastelGreen', 'pastelOrange', 'pastelRed', 'pastelYellow', 'pink', 'red'];
const ACCESSORIES: AccessoryType[] = ['kurt', 'prescription01', 'prescription02', 'round', 'sunglasses', 'wayfarers'];

export const UserAvatar: React.FC<UserAvatarProps> = ({
  healthStatus = 'regular',
  onSave
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [avatarSvg, setAvatarSvg] = useState<string>('');
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(() => {
    const savedConfig = localStorage.getItem('avatarConfig');
    if (savedConfig) {
      return JSON.parse(savedConfig);
    }
    return {
      seed: 'neurofin',
      hairColor: 'brown' as HairColor,
      skinColor: 'light' as SkinColor,
      clothesColor: 'blue01' as ClothesColor,
      clothesType: 'blazerShirt' as ClothesType,
      accessoriesType: undefined,
      facialHair: undefined,
      eyebrow: 'default',
      mouth: 'smile',
      eyes: 'default'
    };
  });

  const getHealthStyle = (status: string) => {
    switch (status) {
      case 'excelente':
        return {
          gradient: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
          borderColor: theme.palette.success.main,
          shadowColor: 'rgba(76, 175, 80, 0.3)',
          clothesColor: 'pastelGreen' as ClothesColor,
          clothesType: 'blazerShirt' as ClothesType,
          mouth: 'smile'
        };
      case 'buena':
        return {
          gradient: 'linear-gradient(45deg, #2196F3 30%, #64B5F6 90%)',
          borderColor: theme.palette.info.main,
          shadowColor: 'rgba(33, 150, 243, 0.3)',
          clothesColor: 'pastelBlue' as ClothesColor,
          clothesType: 'blazerSweater' as ClothesType,
          mouth: 'smile'
        };
      case 'regular':
        return {
          gradient: 'linear-gradient(45deg, #FFC107 30%, #FFD54F 90%)',
          borderColor: theme.palette.warning.main,
          shadowColor: 'rgba(255, 193, 7, 0.3)',
          clothesColor: 'pastelYellow' as ClothesColor,
          clothesType: 'shirtVNeck' as ClothesType,
          mouth: 'default'
        };
      case 'mala':
        return {
          gradient: 'linear-gradient(45deg, #F44336 30%, #E57373 90%)',
          borderColor: theme.palette.error.main,
          shadowColor: 'rgba(244, 67, 54, 0.3)',
          clothesColor: 'pastelRed' as ClothesColor,
          clothesType: 'hoodie' as ClothesType,
          mouth: 'sad'
        };
      default:
        return {
          gradient: 'linear-gradient(45deg, #9C27B0 30%, #BA68C8 90%)',
          borderColor: theme.palette.primary.main,
          shadowColor: 'rgba(156, 39, 176, 0.3)',
          clothesColor: 'heather' as ClothesColor,
          clothesType: 'shirtCrewNeck' as ClothesType,
          mouth: 'default'
        };
    }
  };

  useEffect(() => {
    const healthStyle = getHealthStyle(healthStatus);
    const newConfig = {
      ...avatarConfig,
      clothesColor: healthStyle.clothesColor,
      clothesType: healthStyle.clothesType,
      mouth: healthStyle.mouth
    };
    updateAvatar(newConfig);
  }, [healthStatus]);

  const updateAvatar = (config: AvatarConfig) => {
    try {
      const avatar = createAvatar(style, {
        seed: config.seed,
        top: ['shortHair'],
        accessories: config.accessoriesType ? [config.accessoriesType] : [],
        hairColor: [config.hairColor],
        facialHair: config.facialHair ? [config.facialHair] : [],
        clotheType: [config.clothesType],
        clotheColor: [config.clothesColor],
        skinColor: [config.skinColor],
        eyebrowType: [config.eyebrow || 'default'],
        mouthType: [config.mouth || 'default'],
        eyeType: [config.eyes || 'default']
      });

      setAvatarSvg(avatar);
      setAvatarConfig(config);
      localStorage.setItem('avatarConfig', JSON.stringify(config));
    } catch (error) {
      console.error('Error al generar el avatar:', error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleConfigChange = (key: keyof AvatarConfig, value: any) => {
    const newConfig = {
      ...avatarConfig,
      [key]: value === '' ? undefined : value
    };
    updateAvatar(newConfig);
  };

  const handleSave = () => {
    localStorage.setItem('avatarConfig', JSON.stringify(avatarConfig));
    onSave?.(avatarConfig);
  };

  const handleReset = () => {
    const healthStyle = getHealthStyle(healthStatus);
    const defaultConfig = {
      seed: 'neurofin',
      hairColor: 'brown' as HairColor,
      skinColor: 'light' as SkinColor,
      clothesColor: healthStyle.clothesColor,
      clothesType: healthStyle.clothesType,
      accessoriesType: undefined,
      facialHair: undefined,
      eyebrow: 'default',
      mouth: healthStyle.mouth,
      eyes: 'default'
    };
    updateAvatar(defaultConfig);
    localStorage.removeItem('avatarConfig');
  };

  const healthStyle = getHealthStyle(healthStatus);

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
                  dangerouslySetInnerHTML={{ __html: avatarSvg }}
                  sx={{
                    width: '100%',
                    height: '100%',
                    '& svg': {
                      width: '100%',
                      height: '100%',
                      transform: 'scale(1.2)',
                      transformOrigin: 'center center'
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
              <Tab icon={<Face />} label="Rostro" />
              <Tab icon={<ColorLens />} label="Color" />
              <Tab icon={<Style />} label="Ropa" />
              <Tab icon={<Mood />} label="Expresión" />
            </Tabs>

            <Box sx={{ p: 2 }}>
              {activeTab === 0 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Tono de Piel</InputLabel>
                      <Select
                        value={avatarConfig.skinColor}
                        onChange={(e) => handleConfigChange('skinColor', e.target.value as SkinColor)}
                        label="Tono de Piel"
                      >
                        {SKIN_COLORS.map((color) => (
                          <MenuItem key={color} value={color}>
                            {color.charAt(0).toUpperCase() + color.slice(1).replace(/([A-Z])/g, ' $1')}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Accesorios</InputLabel>
                      <Select
                        value={avatarConfig.accessoriesType || ''}
                        onChange={(e) => handleConfigChange('accessoriesType', e.target.value as AccessoryType)}
                        label="Accesorios"
                      >
                        <MenuItem value="">Ninguno</MenuItem>
                        {ACCESSORIES.map((accessory) => (
                          <MenuItem key={accessory} value={accessory}>
                            {accessory.charAt(0).toUpperCase() + accessory.slice(1).replace(/([A-Z])/g, ' $1')}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              )}

              {activeTab === 1 && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Color de Pelo</InputLabel>
                      <Select
                        value={avatarConfig.hairColor}
                        onChange={(e) => handleConfigChange('hairColor', e.target.value as HairColor)}
                        label="Color de Pelo"
                      >
                        {HAIR_COLORS.map((color) => (
                          <MenuItem key={color} value={color}>
                            {color.charAt(0).toUpperCase() + color.slice(1).replace(/([A-Z])/g, ' $1')}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              )}

              {activeTab === 2 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Tipo de Ropa</InputLabel>
                      <Select
                        value={avatarConfig.clothesType}
                        onChange={(e) => handleConfigChange('clothesType', e.target.value as ClothesType)}
                        label="Tipo de Ropa"
                      >
                        {CLOTHES_TYPES.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1')}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Color de Ropa</InputLabel>
                      <Select
                        value={avatarConfig.clothesColor}
                        onChange={(e) => handleConfigChange('clothesColor', e.target.value as ClothesColor)}
                        label="Color de Ropa"
                      >
                        {CLOTHES_COLORS.map((color) => (
                          <MenuItem key={color} value={color}>
                            {color.charAt(0).toUpperCase() + color.slice(1).replace(/([A-Z])/g, ' $1')}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              )}
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
