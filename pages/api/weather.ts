import { NextApiRequest, NextApiResponse } from 'next';
import { getWeatherData } from '../../lib/weather';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { location } = req.query;
    const weather = await getWeatherData(location as string);
    
    return res.status(200).json({ 
      ...weather,
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Error fetching weather:', error);
    return res.status(500).json({ message: 'Error fetching weather data' });
  }
}
