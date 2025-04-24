import React from 'react';
import { Avatar as MuiAvatar, Box, keyframes } from '@mui/material';
import { AccountBalance, TrendingUp, TrendingDown, Warning, CheckCircle } from '@mui/icons-material';

interface AvatarProps {
  size?: number;
  iconSize?: number;
  healthStatus?: 'excelente' | 'buena' | 'regular' | 'mala';
}

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.3);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 15px 5px rgba(0, 0, 0, 0.2);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
`;

const getHealthGradient = (status?: string) => {
  switch (status) {
    case 'excelente':
      return {
        gradient: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
        icon: <CheckCircle />
      };
    case 'buena':
      return {
        gradient: 'linear-gradient(45deg, #2196F3 30%, #64B5F6 90%)',
        icon: <TrendingUp />
      };
    case 'regular':
      return {
        gradient: 'linear-gradient(45deg, #FFC107 30%, #FFD54F 90%)',
        icon: <Warning />
      };
    case 'mala':
      return {
        gradient: 'linear-gradient(45deg, #F44336 30%, #E57373 90%)',
        icon: <TrendingDown />
      };
    default:
      return {
        gradient: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        icon: <AccountBalance />
      };
  }
};

export const Avatar: React.FC<AvatarProps> = ({
  size = 80,
  iconSize = 40,
  healthStatus
}) => {
  const { gradient, icon } = getHealthGradient(healthStatus);

  return (
    <Box
      sx={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        background: gradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: `${pulse} 2s infinite`,
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.1)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -4,
          left: -4,
          right: -4,
          bottom: -4,
          borderRadius: '50%',
          background: gradient,
          zIndex: -1,
          filter: 'blur(8px)',
          opacity: 0.6
        }
      }}
    >
      <MuiAvatar
        sx={{
          width: size - 8,
          height: size - 8,
          bgcolor: 'transparent',
          '& .MuiSvgIcon-root': {
            fontSize: iconSize,
            color: 'white',
            filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
          }
        }}
      >
        {icon}
      </MuiAvatar>
    </Box>
  );
};
