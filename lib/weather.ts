// Weather API integration

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  icon: string;
  forecast: WeatherForecast[];
}

interface WeatherForecast {
  date: string;
  temperature: {
    min: number;
    max: number;
  };
  condition: string;
  icon: string;
  precipitation: number;
}

export async function getWeatherData(location: string = 'Niigata,jp'): Promise<WeatherData> {
  try {
    // In a real implementation, this would call the OpenWeatherMap API
    // For now, we return mock data
    
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!apiKey) {
      console.warn('Missing OPENWEATHER_API_KEY');
      return getMockWeatherData();
    }
    
    // This would be the actual API call
    // const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;
    // const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`;
    
    // For now, return mock data
    return getMockWeatherData();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return getMockWeatherData();
  }
}

function getMockWeatherData(): WeatherData {
  const today = new Date();
  
  return {
    temperature: 22,
    humidity: 65,
    windSpeed: 8,
    condition: 'Partly Cloudy',
    icon: '03d',
    forecast: [
      {
        date: new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0],
        temperature: { min: 18, max: 24 },
        condition: 'Sunny',
        icon: '01d',
        precipitation: 0
      },
      {
        date: new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0],
        temperature: { min: 17, max: 23 },
        condition: 'Partly Cloudy',
        icon: '02d',
        precipitation: 10
      },
      {
        date: new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0],
        temperature: { min: 16, max: 21 },
        condition: 'Rain',
        icon: '10d',
        precipitation: 60
      },
      {
        date: new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0],
        temperature: { min: 15, max: 20 },
        condition: 'Rain',
        icon: '09d',
        precipitation: 80
      },
      {
        date: new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0],
        temperature: { min: 17, max: 22 },
        condition: 'Partly Cloudy',
        icon: '03d',
        precipitation: 20
      }
    ]
  };
}
