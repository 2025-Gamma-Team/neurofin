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
  center: [number, number];
  markers?: Array<{
    position: [number, number];
    popup?: string;
  }>;
}

const Map: React.FC<MapProps> = ({ center, markers = [] }) => {
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
        center={[center[0], center[1]]}
        zoom={13}
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
            icon={L.icon({
              iconUrl: 'marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })}
          >
            {marker.popup && <Popup>{marker.popup}</Popup>}
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

export default Map;
