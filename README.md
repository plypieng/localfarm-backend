# LocalFarm AI - Backend API

This is the unified backend API for the LocalFarm AI platform, serving both the mobile and web applications.

## Features

- RESTful API endpoints for farming advice, weather data, sensor data, and chat
- Prisma ORM with PostgreSQL database integration
- OpenAI GPT-4 integration for AI-powered farming advice
- Authentication using NextAuth.js with Google OAuth
- Weather data via OpenWeatherMap API integration

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- PostgreSQL database
- OpenAI API key
- OpenWeatherMap API key
- Google OAuth credentials (for authentication)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your environment variables:
   ```bash
   cp .env.example .env
   ```
4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Advice

- `GET /api/advice/:crop` - Get AI-generated farming advice for a specific crop

### Chat

- `POST /api/chat` - Send a message to the farming AI assistant

### Weather

- `GET /api/weather?location=niigata` - Get weather data for a specific location

### Sensors

- `GET /api/sensors/:id` - Get data from a specific sensor
- `POST /api/sensors/:id` - Add new sensor reading

## Deployment

This application is designed to be deployed to Vercel. Connect your GitHub repository to Vercel and configure the environment variables.

## License

MIT
