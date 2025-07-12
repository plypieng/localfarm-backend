import { NextApiRequest, NextApiResponse } from 'next';
import { chatWithAI } from '../../lib/openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const response = await chatWithAI(message, history || []);
    
    return res.status(200).json({ 
      response,
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Error in chat:', error);
    return res.status(500).json({ message: 'Error processing chat request' });
  }
}
