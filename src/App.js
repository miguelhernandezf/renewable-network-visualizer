import React, { useState } from 'react';
import { Container, Grid } from '@mui/material';
import EnergyOptimizationNetwork from './EnergyOptimizationNetwork';
import DataInputPanel from './components/DataInputPanel';
import NetworkVisualization from './components/NetworkVisualization';
import RecommendationPanel from './components/RecommendationPanel';
import './App.css';

function App() {
  const [inputs, setInputs] = useState({
    latitude: 0,
    longitude: 0,
    sunlightHours: 0,
    windSpeed: 0,
    temperatureRange: 0,
    elevation: 0,
    waterProximity: 0
  });

  const [network, setNetwork] = useState(new EnergyOptimizationNetwork());
  const [recommendation, setRecommendation] = useState(null);
  const [activeConnections, setActiveConnections] = useState([]);
  const [calculations, setCalculations] = useState([]);
  const [isActive, setIsActive] = useState(false);

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: parseFloat(value)
    }));
  };

  const calculateRecommendation = () => {
    setIsActive(true);
    
    // Get recommendation from network
    const recommendation = network.getEnergyPlacementRecommendation(inputs);
    setRecommendation(recommendation);
    
    // Update calculations
    setCalculations(recommendation.calculations);
    
    // Animate connections
    const connections = [];
    // Input to hidden
    network.inputToHiddenWeights.forEach((weight, i) => {
      const fromNode = Math.floor(i / 5);
      const toNode = i % 5;
      connections.push({
        from: 'input',
        i: fromNode,
        to: 'hidden',
        j: toNode,
        time: toNode * 500 + fromNode * 100
      });
    });
    // Hidden to output
    network.hiddenToOutputWeights.forEach((weight, i) => {
      connections.push({
        from: 'hidden',
        i: i,
        to: 'output',
        j: 0,
        time: 2000 + i * 500
      });
    });

    setActiveConnections(connections);
    
    // Reset after animation
    setTimeout(() => {
      setIsActive(false);
      setActiveConnections([]);
    }, 3000);
  };

  return (
    <Container maxWidth="xl" className="app-container">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <h1>Renewable Energy Optimizer</h1>
        </Grid>
        <Grid item xs={12} md={4}>
          <DataInputPanel
            inputs={inputs}
            onInputChange={handleInputChange}
            calculateRecommendation={calculateRecommendation}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <NetworkVisualization
            inputs={inputs}
            weights={{
              inputToHidden: network.inputToHiddenWeights,
              hiddenToOutput: network.hiddenToOutputWeights
            }}
            activeConnections={activeConnections}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <RecommendationPanel
            recommendation={recommendation}
            calculations={calculations}
            isActive={isActive}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
