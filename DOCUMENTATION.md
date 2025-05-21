# Renewable Energy Optimizer

This application demonstrates forward propagation in a neural network that optimizes renewable energy placement.

## Why Forward Propagation?
Forward propagation is the process of passing input data through a neural network to generate predictions. In this application, it's used to:
- Process environmental data sequentially through the network layers
- Calculate weighted sums and apply activation functions
- Generate a final output that determines the optimal energy type
- Visualize how each input contributes to the final decision

The visualization shows this process step by step, making it easier to understand how the neural network makes its recommendations.

## Neural Network Architecture
- Input Layer: 7 nodes (latitude, longitude, sunlight, wind, temperature, elevation, water)
- Hidden Layer: 5 nodes
- Output Layer: 1 node

## Forward Propagation
1. Input values are normalized (0-1 range)
2. Hidden layer calculates weighted sums and applies sigmoid activation
3. Output layer generates final value (0-1)

## Recommendation
- Output > 0.7: Solar energy recommended
- Output ≤ 0.7: Wind energy recommended
- Confidence scores based on output value
- Feature importance shown as bar charts

## Visualization
- Animated neural network showing forward propagation
- Connection weights displayed on hover
- Detailed calculation steps shown
- Feature importance visualization
