import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Sensor ID is required' });
  }

  // Handle GET request - retrieve sensor data
  if (req.method === 'GET') {
    try {
      // For demo purposes, return mock sensor data
      // In a real implementation, we would query the database
      const mockData = getMockSensorData(id);
      
      return res.status(200).json(mockData);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      return res.status(500).json({ message: 'Error fetching sensor data' });
    }
  }
  
  // Handle POST request - add new sensor reading
  if (req.method === 'POST') {
    try {
      const { type, value, farmId } = req.body;
      
      if (!type || value === undefined || !farmId) {
        return res.status(400).json({ message: 'Type, value, and farmId are required' });
      }
      
      // In a real implementation, we would store this in the database
      // For this MVP, we'll just return success
      
      return res.status(200).json({ 
        message: 'Sensor data recorded successfully',
        timestamp: new Date().toISOString() 
      });
    } catch (error) {
      console.error('Error recording sensor data:', error);
      return res.status(500).json({ message: 'Error recording sensor data' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

// Define the type for sensor readings
type SensorReading = {
  id: string;
  timestamp: string;
  value: number;
  type: string;
};

function getMockSensorData(sensorId: string) {
  // Generate some random sensor data for demo purposes
  const today = new Date();
  const readings: SensorReading[] = [];
  
  // Generate 24 hours of readings
  for (let i = 0; i < 24; i++) {
    const timestamp = new Date(today);
    timestamp.setHours(today.getHours() - i);
    
    let value;
    switch (sensorId) {
      case 'temp':
        value = 20 + Math.sin(i / 4) * 5 + (Math.random() * 2 - 1); // Temperature between 15-25°C
        break;
      case 'humidity':
        value = 60 + Math.sin(i / 6) * 10 + (Math.random() * 5 - 2.5); // Humidity between 50-70%
        break;
      case 'soil_moisture':
        value = 40 + Math.sin(i / 8) * 15 + (Math.random() * 5 - 2.5); // Soil moisture between 25-55%
        break;
      default:
        value = Math.random() * 100;
    }
    
    readings.push({
      id: `reading_${i}`,
      timestamp: timestamp.toISOString(),
      value: parseFloat(value.toFixed(1)),
      type: sensorId
    });
  }
  
  return {
    id: sensorId,
    readings,
    currentValue: readings[0].value,
    lastUpdated: readings[0].timestamp
  };
}
