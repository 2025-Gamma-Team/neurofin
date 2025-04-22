import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Typography } from '@mui/material';

// Corregir el problema del ícono por defecto de Leaflet
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Corregir el problema de los íconos en Leaflet
const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    position: [number, number];
    title: string;
    description?: string;
  }>;
}

export const Map: React.FC<MapProps> = ({
  center = [19.4326, -99.1332], // Ciudad de México por defecto
  zoom = 13,
  markers = []
}) => {
  return (
    <Box sx={{
      height: '400px',
      width: '100%',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '2px solid rgba(0,0,0,0.1)',
      '& .leaflet-container': {
        height: '100%',
        width: '100%',
        borderRadius: '8px',
      }
    }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
          >
            <Popup>
              <Typography variant="subtitle1" fontWeight="bold">
                {marker.title}
              </Typography>
              {marker.description && (
                <Typography variant="body2">
                  {marker.description}
                </Typography>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};
