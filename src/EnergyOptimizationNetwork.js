/**
 * EnergyOptimizationNetwork class for renewable energy placement optimization
 * This model predicts optimal placement of solar panels or wind turbines
 * based on environmental and geographical factors.
 */

class EnergyOptimizationNetwork {
  /**
   * Initialize the energy optimization network
   * @param {Object} options - Configuration options
   * @param {boolean} options.randomWeights - Whether to initialize with random weights
   */
  constructor({ randomWeights = true } = {}) {
    // Input nodes (7 features):
    // 1. Latitude
    // 2. Longitude
    // 3. Average Sunlight Hours
    // 4. Average Wind Speed
    // 5. Temperature Range
    // 6. Land Elevation
    // 7. Nearby Water Bodies
    this.inputToHiddenWeights = Array(7 * 5).fill(0);
    this.hiddenToOutputWeights = Array(5).fill(0);

    if (randomWeights) {
      this.randomizeWeights();
    }

    // Activation functions
    this.activation = x => 1 / (1 + Math.exp(-x)); // Sigmoid
    this.activationDerivative = x => this.activation(x) * (1 - this.activation(x));

    // Input ranges and normalization factors
    this.inputRanges = {
      latitude: { min: -90, max: 90 },
      longitude: { min: -180, max: 180 },
      sunlightHours: { min: 0, max: 12 },
      windSpeed: { min: 0, max: 50 }, // km/h
      temperatureRange: { min: 0, max: 50 }, // Celsius
      elevation: { min: 0, max: 5000 }, // meters
      waterProximity: { min: 0, max: 1 } // 0-1 scale
    };
  }

  /**
   * Randomize all weights in the network
   */
  randomizeWeights() {
    // Initialize weights with random values between -1 and 1
    this.inputToHiddenWeights = Array(7 * 5).fill(0).map(() => 
      Math.random() * 2 - 1
    );
    this.hiddenToOutputWeights = Array(5).fill(0).map(() => 
      Math.random() * 2 - 1
    );
  }

  /**
   * Normalize input values based on predefined ranges
   * @param {Object} inputs - Raw input values
   * @returns {Array} - Normalized input values
   */
  normalizeInputs(inputs) {
    return Object.entries(inputs).map(([key, value]) => {
      const range = this.inputRanges[key];
      return (value - range.min) / (range.max - range.min);
    });
  }

  /**
   * Forward propagate inputs through the network
   * @param {Object} inputs - Input values
   * @returns {Object} - Results including hidden layer activations and output
   */
  forwardPropagate(inputs) {
    // Normalize inputs
    const normalizedInputs = this.normalizeInputs(inputs);
    
    // Calculate hidden layer activations
    const hiddenActivations = Array(5).fill(0);
    const hiddenCalculations = [];

    for (let i = 0; i < 5; i++) {
      let sum = 0;
      for (let j = 0; j < 7; j++) {
        sum += normalizedInputs[j] * this.inputToHiddenWeights[i * 7 + j];
      }
      const activation = this.activation(sum);
      hiddenActivations[i] = activation;
      
      hiddenCalculations.push({
        node: 'hidden',
        index: i,
        input: normalizedInputs,
        weights: this.inputToHiddenWeights.slice(i * 7, (i + 1) * 7),
        sum: sum,
        activation: activation
      });
    }

    // Calculate output
    let outputSum = 0;
    for (let i = 0; i < 5; i++) {
      outputSum += hiddenActivations[i] * this.hiddenToOutputWeights[i];
    }
    const output = this.activation(outputSum);

    return {
      hiddenActivations,
      output,
      calculations: [
        ...hiddenCalculations,
        {
          node: 'output',
          index: 0,
          input: hiddenActivations,
          weights: this.hiddenToOutputWeights,
          sum: outputSum,
          activation: output
        }
      ]
    };
  }

  /**
   * Calculate feature importance based on weights and activations
   * @param {Object} inputs - Input values
   * @returns {Object} - Feature importance scores
   */
  calculateFeatureImportance(inputs) {
    const normalizedInputs = this.normalizeInputs(inputs);
    const importance = Array(7).fill(0);

    // Calculate importance for each input
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 7; j++) {
        importance[j] += Math.abs(this.inputToHiddenWeights[i * 7 + j] * normalizedInputs[j]);
      }
    }

    // Normalize importance values
    const maxImportance = Math.max(...importance);
    return importance.map(i => i / maxImportance * 100);
  }

  /**
   * Get a detailed explanation of the optimal energy placement
   * @param {Object} inputs - Input values
   * @returns {Object} - Energy placement recommendation
   */
  getEnergyPlacementRecommendation(inputs) {
    const result = this.forwardPropagate(inputs);
    const importance = this.calculateFeatureImportance(inputs);
    const output = result.output;

    // Interpret the output value
    let recommendation;
    if (output >= 0.8) {
      recommendation = 'Highly Suitable for Renewable Energy Installation';
    } else if (output >= 0.5) {
      recommendation = 'Moderately Suitable for Renewable Energy Installation';
    } else {
      recommendation = 'Not Ideal for Renewable Energy Installation';
    }

    // Determine optimal energy type
    const energyType = this.determineOptimalEnergyType(inputs, importance);

    return {
      recommendation,
      energyType,
      confidence: output * 100,
      featureImportance: {
        latitude: importance[0],
        longitude: importance[1],
        sunlightHours: importance[2],
        windSpeed: importance[3],
        temperatureRange: importance[4],
        elevation: importance[5],
        waterProximity: importance[6]
      },
      calculations: result.calculations
    };
  }

  /**
   * Determine optimal energy type based on inputs and feature importance
   * @param {Object} inputs - Input values
   * @param {Array} importance - Feature importance scores
   * @returns {Object} - Optimal energy type recommendation
   */
  determineOptimalEnergyType(inputs, importance) {
    const solarScore = 
      (inputs.sunlightHours * importance[2]) +
      (inputs.temperatureRange * importance[4]) +
      (inputs.waterProximity * importance[6]);

    const windScore = 
      (inputs.windSpeed * importance[3]) +
      (inputs.elevation * importance[5]);

    return {
      type: solarScore >= windScore ? 'Solar' : 'Wind',
      solarScore: solarScore,
      windScore: windScore,
      reason: solarScore >= windScore
        ? 'High sunlight hours and favorable temperature conditions'
        : 'Strong wind speeds and elevated terrain'
    };
  }
}

export default EnergyOptimizationNetwork;
