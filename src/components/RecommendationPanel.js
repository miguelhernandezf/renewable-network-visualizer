import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  LinearProgress,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  SolarPower as SolarIcon,
  WindPower as WindIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

const RecommendationPanel = ({ recommendation, calculations, isActive }) => {
  if (!recommendation) return null;

  const renderCalculationStep = (step, index) => {
    const { node, input, weights, sum, activation } = step;
    
    return (
      <Paper key={index} sx={{ p: 2, mb: 2 }} elevation={3}>
        <Typography variant="subtitle1" gutterBottom>
          {node === 'hidden' ? `Hidden Node ${index + 1}` : 'Output Node'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Inputs: {input.map((val, i) => val.toFixed(2)).join(' * ')}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Weights: {weights.map(w => w.toFixed(2)).join(' * ')}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Sum: {sum.toFixed(2)}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Activation: {activation.toFixed(4)}
        </Typography>
      </Paper>
    );
  };

  const renderRecommendationCard = () => {
    if (!recommendation) return null;

    const { recommendation: rec, energyType, confidence, featureImportance } = recommendation;
    const energyIcon = energyType.type === 'Solar' ? <SolarIcon /> : <WindIcon />;
    const recommendationIcon = confidence >= 80 ? <CheckIcon color="success" /> : <WarningIcon color="warning" />;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader
          avatar={energyIcon}
          title={rec}
          subheader={`Confidence: ${confidence.toFixed(1)}%`}
          action={
            <Tooltip title="Energy Type Recommendation">
              <IconButton>
                {energyIcon}
              </IconButton>
            </Tooltip>
          }
        />
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Optimal Energy Type: {energyType.type}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Reason: {energyType.reason}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Solar Score: {energyType.solarScore.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Wind Score: {energyType.windScore.toFixed(2)}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Energy Placement Recommendation
      </Typography>
      
      {renderRecommendationCard()}

      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Feature Importance
      </Typography>
      <Grid container spacing={2}>
        {recommendation && recommendation.featureImportance && Object.entries(recommendation.featureImportance).map(([feature, importance]) => (
          <Grid item xs={12} sm={6} key={feature}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                {feature.replace(/([A-Z])/g, ' $1').trim()}
              </Typography>
              <Box sx={{ width: '100%', mb: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={importance}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 5,
                    },
                  }}
                />
              </Box>
              <Typography variant="body2" color="textSecondary">
                {importance.toFixed(1)}%
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Calculation Steps
      </Typography>
      <Grid container spacing={2}>
        {calculations && calculations.map(renderCalculationStep)}
      </Grid>
    </Box>
  );
};

export default RecommendationPanel;
