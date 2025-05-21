import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

const presetLocations = [
  {
    name: 'Desert Location',
    latitude: 33.55,
    longitude: -116.26,
    sunlightHours: 10.5,
    windSpeed: 15,
    temperatureRange: 30,
    elevation: 100,
    waterProximity: 0.1
  },
  {
    name: 'Mountain Location',
    latitude: 45.37,
    longitude: -121.69,
    sunlightHours: 6.5,
    windSpeed: 25,
    temperatureRange: 20,
    elevation: 1500,
    waterProximity: 0.3
  },
  {
    name: 'Coastal Location',
    latitude: 37.77,
    longitude: -122.42,
    sunlightHours: 8,
    windSpeed: 20,
    temperatureRange: 15,
    elevation: 50,
    waterProximity: 1
  }
];

const DataInputPanel = ({ inputs, onInputChange, calculateRecommendation }) => {
  const [selectedLocation, setSelectedLocation] = useState('');

  const handleLocationSelect = (location) => {
    setSelectedLocation(location.name);
    Object.entries(location).forEach(([key, value]) => {
      if (key !== 'name') {
        onInputChange(key, value);
      }
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Location Data Input
      </Typography>
      
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Preset Locations</InputLabel>
        <Select
          value={selectedLocation}
          label="Preset Locations"
          onChange={(e) => handleLocationSelect(presetLocations.find(p => p.name === e.target.value))}
        >
          <MenuItem value="">None</MenuItem>
          {presetLocations.map(location => (
            <MenuItem key={location.name} value={location.name}>
              {location.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Latitude"
          value={inputs.latitude}
          onChange={(e) => onInputChange('latitude', e.target.value)}
          type="number"
          helperText="Range: -90 to 90"
        />
        <TextField
          label="Longitude"
          value={inputs.longitude}
          onChange={(e) => onInputChange('longitude', e.target.value)}
          type="number"
          helperText="Range: -180 to 180"
        />
        <TextField
          label="Average Sunlight Hours"
          value={inputs.sunlightHours}
          onChange={(e) => onInputChange('sunlightHours', e.target.value)}
          type="number"
          helperText="Range: 0 to 12 hours"
        />
        <TextField
          label="Average Wind Speed (km/h)"
          value={inputs.windSpeed}
          onChange={(e) => onInputChange('windSpeed', e.target.value)}
          type="number"
          helperText="Range: 0 to 50 km/h"
        />
        <TextField
          label="Temperature Range (°C)"
          value={inputs.temperatureRange}
          onChange={(e) => onInputChange('temperatureRange', e.target.value)}
          type="number"
          helperText="Range: 0 to 50°C"
        />
        <TextField
          label="Elevation (m)"
          value={inputs.elevation}
          onChange={(e) => onInputChange('elevation', e.target.value)}
          type="number"
          helperText="Range: 0 to 5000m"
        />
        <TextField
          label="Nearby Water Bodies"
          value={inputs.waterProximity}
          onChange={(e) => onInputChange('waterProximity', e.target.value)}
          type="number"
          helperText="Range: 0 to 1 (0 = no water, 1 = near water)"
        />
      </Box>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={calculateRecommendation}
        >
          Calculate Recommendation
        </Button>
      </Box>
    </Box>
  );
};

export default DataInputPanel;
