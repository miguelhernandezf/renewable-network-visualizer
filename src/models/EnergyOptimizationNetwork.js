class EnergyOptimizationNetwork {
  constructor() {
    // Initialize weights with random values
    this.inputToHiddenWeights = Array(35).fill().map(() => Math.random() * 2 - 1); // 7 inputs x 5 hidden nodes
    this.hiddenToOutputWeights = Array(5).fill().map(() => Math.random() * 2 - 1); // 5 hidden nodes x 1 output

    // Initialize biases
    this.hiddenBiases = Array(5).fill(0);
    this.outputBias = 0;
  }

  // Sigmoid activation function
  activation(x) {
    return 1 / (1 + Math.exp(-x));
  }

  // Normalize input values
  normalizeInputs(inputs) {
    return {
      latitude: inputs.latitude / 90, // -90 to 90
      longitude: inputs.longitude / 180, // -180 to 180
      sunlightHours: inputs.sunlightHours / 12, // 0 to 12
      windSpeed: inputs.windSpeed / 50, // 0 to 50
      temperatureRange: inputs.temperatureRange / 50, // 0 to 50
      elevation: inputs.elevation / 5000, // 0 to 5000
      waterProximity: inputs.waterProximity // 0 to 1
    };
  }

  forwardPropagate(inputs) {
    const normalizedInputs = this.normalizeInputs(inputs);
    const inputValues = Object.values(normalizedInputs);

    // Calculate hidden layer activations
    const hiddenActivations = Array(5).fill(0);
    for (let i = 0; i < 5; i++) {
      let sum = 0;
      for (let j = 0; j < 7; j++) {
        sum += inputValues[j] * this.inputToHiddenWeights[i * 7 + j];
      }
      hiddenActivations[i] = this.activation(sum + this.hiddenBiases[i]);
    }

    // Calculate output
    let outputSum = 0;
    for (let i = 0; i < 5; i++) {
      outputSum += hiddenActivations[i] * this.hiddenToOutputWeights[i];
    }
    const output = this.activation(outputSum + this.outputBias);

    return {
      output,
      hiddenActivations,
      calculations: [
        {
          node: 'hidden',
          input: inputValues,
          weights: this.inputToHiddenWeights.slice(0, 35),
          sum: hiddenActivations.map(a => this.activation(a)),
          activation: hiddenActivations
        },
        {
          node: 'output',
          input: hiddenActivations,
          weights: this.hiddenToOutputWeights,
          sum: outputSum,
          activation: output
        }
      ]
    };
  }

  getEnergyPlacementRecommendation(inputs) {
    const result = this.forwardPropagate(inputs);
    const output = result.output;

    // Determine energy type based on output value
    let energyType;
    if (output > 0.7) {
      energyType = {
        type: 'Solar',
        reason: 'High solar radiation potential',
        solarScore: output * 100,
        windScore: (1 - output) * 100
      };
    } else {
      energyType = {
        type: 'Wind',
        reason: 'High wind energy potential',
        solarScore: output * 100,
        windScore: (1 - output) * 100
      };
    }

    // Calculate feature importance
    const featureImportance = {
      Latitude: Math.abs(this.inputToHiddenWeights[0]) * 100,
      Longitude: Math.abs(this.inputToHiddenWeights[1]) * 100,
      SunlightHours: Math.abs(this.inputToHiddenWeights[2]) * 100,
      WindSpeed: Math.abs(this.inputToHiddenWeights[3]) * 100,
      TemperatureRange: Math.abs(this.inputToHiddenWeights[4]) * 100,
      Elevation: Math.abs(this.inputToHiddenWeights[5]) * 100,
      WaterProximity: Math.abs(this.inputToHiddenWeights[6]) * 100
    };

    return {
      recommendation: `Optimal for ${energyType.type} energy placement`,
      energyType,
      confidence: Math.round(output * 100),
      featureImportance,
      calculations: result.calculations
    };
  }
}

export default EnergyOptimizationNetwork;
