import { NextApiRequest, NextApiResponse } from 'next';
import { generateFarmingAdvice } from '../../../lib/openai';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { crop } = req.query;
    
    if (!crop || typeof crop !== 'string') {
      return res.status(400).json({ message: 'Crop parameter is required' });
    }

    // Get advice from OpenAI
    const advice = await generateFarmingAdvice(crop);
    
    // In a production environment, we would store this advice in the database
    // For this MVP, we'll just return the advice
    
    return res.status(200).json({ 
      crop, 
      advice,
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Error generating advice:', error);
    return res.status(500).json({ message: 'Error generating advice' });
  }
}
