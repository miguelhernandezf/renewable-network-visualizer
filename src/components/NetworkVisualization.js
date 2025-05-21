import React from 'react';
import styled from 'styled-components';

const NetworkContainer = styled.div`
  width: 100%;
  height: 600px;
  position: relative;
  background: #f5f5f5;
  padding: 20px;
`;

const Node = styled.circle`
  fill: ${props => props.active ? '#4caf50' : '#666'};
  stroke: #333;
  stroke-width: 2;
`;

const Connection = styled.line`
  stroke: ${props => props.active ? '#4caf50' : '#ddd'};
  stroke-width: 2;
  transition: stroke 0.3s ease;
`;

const WeightLabel = styled.text`
  font-size: 12px;
  fill: #333;
  opacity: 0;
  transition: opacity 0.3s ease;
  ${Connection}:hover + & {
    opacity: 1;
  }
`;

const NetworkVisualization = ({ inputs, weights, activeConnections }) => {
  const nodePositions = {
    inputs: [
      { x: 100, y: 50 },
      { x: 100, y: 100 },
      { x: 100, y: 150 },
      { x: 100, y: 250 },
      { x: 100, y: 350 },
      { x: 100, y: 450 },
      { x: 100, y: 550 }
    ],
    hidden: [
      { x: 300, y: 100 },
      { x: 300, y: 200 },
      { x: 300, y: 300 },
      { x: 300, y: 400 },
      { x: 300, y: 500 }
    ],
    output: [{ x: 500, y: 300 }]
  };

  const drawConnections = () => {
    const connections = [];
    // Input to Hidden connections
    nodePositions.inputs.forEach((input, i) => {
      nodePositions.hidden.forEach((hidden, j) => {
        const isActive = activeConnections.some(conn => 
          conn.from === 'input' && conn.i === i && conn.to === 'hidden' && conn.j === j
        );
        connections.push(
          <>
            <Connection
              key={`i2h_${i}_${j}`}
              x1={input.x + 10}
              y1={input.y + 10}
              x2={hidden.x - 10}
              y2={hidden.y + 10}
              active={isActive}
            />
            <WeightLabel
              x={(input.x + hidden.x) / 2}
              y={(input.y + hidden.y) / 2}
            >
              {weights.inputToHidden[i * 5 + j].toFixed(2)}
            </WeightLabel>
          </>
        );
      });
    });

    // Hidden to Output connections
    nodePositions.hidden.forEach((hidden, i) => {
      nodePositions.output.forEach((output, j) => {
        const isActive = activeConnections.some(conn => 
          conn.from === 'hidden' && conn.i === i && conn.to === 'output' && conn.j === j
        );
        connections.push(
          <>
            <Connection
              key={`h2o_${i}_${j}`}
              x1={hidden.x + 10}
              y1={hidden.y + 10}
              x2={output.x - 10}
              y2={output.y + 10}
              active={isActive}
            />
            <WeightLabel
              x={(hidden.x + output.x) / 2}
              y={(hidden.y + output.y) / 2}
            >
              {weights.hiddenToOutput[i].toFixed(2)}
            </WeightLabel>
          </>
        );
      });
    });

    return connections;
  };

  const inputLabels = [
    'Latitude',
    'Longitude',
    'Sunlight Hours',
    'Wind Speed',
    'Temp Range',
    'Elevation',
    'Water Prox.'
  ];

  return (
    <NetworkContainer>
      <svg width="100%" height="100%">
        {drawConnections()}
        {/* Input Nodes */}
        {nodePositions.inputs.map((pos, i) => (
          <>
            <Node
              key={`input_${i}`}
              cx={pos.x}
              cy={pos.y}
              r="20"
              active={activeConnections.some(conn => conn.from === 'input' && conn.i === i)}
            />
            <text x={pos.x - 30} y={pos.y + 5} fontSize="12" textAnchor="end">
              {inputLabels[i]}
            </text>
          </>
        ))}
        {/* Hidden Nodes */}
        {nodePositions.hidden.map((pos, i) => (
          <Node
            key={`hidden_${i}`}
            cx={pos.x}
            cy={pos.y}
            r="20"
            active={activeConnections.some(conn => conn.to === 'hidden' && conn.j === i)}
          />
        ))}
        {/* Output Node */}
        {nodePositions.output.map((pos, i) => (
          <Node
            key={`output_${i}`}
            cx={pos.x}
            cy={pos.y}
            r="20"
            active={activeConnections.some(conn => conn.to === 'output' && conn.j === i)}
          />
        ))}
      </svg>
    </NetworkContainer>
  );
};

export default NetworkVisualization;
