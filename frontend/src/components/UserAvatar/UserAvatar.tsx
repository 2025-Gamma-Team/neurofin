import React from 'react';
import { Box } from '@mui/material';
import { createAvatar } from '@dicebear/core';
import { personas } from '@dicebear/collection';

interface UserAvatarProps {
  healthStatus: 'excelente' | 'buena' | 'regular' | 'mala';
  size?: number;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ healthStatus, size = 180 }) => {
  const avatar = createAvatar(personas, {
    seed: healthStatus,
    backgroundColor: [healthStatus === 'excelente' ? '75DD7F' : 
                     healthStatus === 'buena' ? '95B8D1' :
                     healthStatus === 'regular' ? 'F8D347' :
                     healthStatus === 'mala' ? 'F88B7E' : 'b6e3f4'],
    hair: ['shortCombover'],
    hairColor: ['brown'],
    skinColor: ['light'],
    eyes: ['happy'],
    mouth: ['smile'],
    facialHair: ['beardMustache'],
    scale: 120,
    size: size
  });

  const svgString = avatar.toString();

  return (
    <Box
      component="div"
      sx={{
        width: size,
        height: size,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '& svg': {
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        },
      }}
      dangerouslySetInnerHTML={{ __html: svgString }}
    />
  );
};