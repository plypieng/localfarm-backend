import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  console.warn('Missing OPENAI_API_KEY');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateFarmingAdvice(crop: string, location: string = 'Niigata, Japan') {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a farming expert specializing in crops in the Niigata region of Japan.'
        },
        {
          role: 'user',
          content: `Provide brief, practical farming advice for growing ${crop} in ${location} today. Include tips on watering, pest management, and what to look out for based on the current season.`
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    return response.choices[0].message.content?.trim();
  } catch (error) {
    console.error('Error generating farming advice:', error);
    return 'Could not generate farming advice at this time. Please try again later.';
  }
}

export async function analyzeImage(imageDescription: string, crop: string) {
  try {
    // In a real implementation, this would process an actual image
    // For now, we simulate image analysis using a text description
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an agricultural expert who specializes in identifying crop health issues from images.'
        },
        {
          role: 'user',
          content: `Analyze this image of ${crop}: ${imageDescription}. What are potential issues, and what recommendations would you give to a farmer?`
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    return response.choices[0].message.content?.trim();
  } catch (error) {
    console.error('Error analyzing image:', error);
    return 'Could not analyze image at this time. Please try again later.';
  }
}

export async function chatWithAI(message: string, history: { role: string, content: string }[] = []) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an agricultural assistant specializing in farming practices in Niigata, Japan. Provide concise, practical advice to farmers.'
        },
        ...history,
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content?.trim();
  } catch (error) {
    console.error('Error chatting with AI:', error);
    return 'Could not process your message at this time. Please try again later.';
  }
}
