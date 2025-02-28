# HSL Live Transit App

A real-time public transport tracking application for Helsinki's HSL network built with Next.js. This application allows users to:

- View all HSL public transport routes
- Filter routes by type (Bus, Tram, Rail, Subway, Ferry) and route number
- Track vehicles in real-time on an interactive map (WIP)
- See updates, alerts and cancellations for routes (WIP)

Link to the live application: [HSL Live Transit App](https://hsl-live-yv8n.vercel.app/)

## Technologies Used

- Next.js 15.1.2
- React 18.2.0
- TypeScript
- Leaflet for maps
- GTFS Realtime for vehicle position data
- TailwindCSS for styling
- Jest for testing

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Run tests:
   ```bash
   # Run tests once
   npm test

   # Run tests in watch mode
   npm run test:watch
   ```

## Project Structure

The project is organized into the following key directories:

- `app`: Contains the main Next.js application code
    - `app/routes`: Route listing and filtering functionality
    - `app/routes/[id]`: Individual route details page
    - `app/itinerary`: Itinerary page helps planning trips
    - `app/vehicle-positions/[...bus]`: Real-time vehicle tracking page (WIP)
- `components`: Reusable React components
- `types`: TypeScript type definitions
- `utils`: Utility functions

## Environment Variables

The application requires the following environment variables:

- `NEXT_PUBLIC_API_URL`: The base URL for the HSL API
- `DIGITRANSIT_SUBSCRIPTION_KEY`: Your HSL Digitransit API subscription key

Create a `.env.local` file in the root directory with these variables

## GraphQL API

The application uses HSL's GraphQL API for fetching route information. The API endpoint is:

```
https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql
``` 

## Unit Tests 

Unit tests are located in the `__tests__` directory and are named like `*.test.ts`.

## Approaches
- Use GraphQL API for fetching route information
- Use Leaflet for mapping
- Use GTFS Realtime for vehicle position data
- Use TailwindCSS for styling
- Use Jest for testing
- Diffrent pages for checking route information, updates, alerts, itinerary and live tracking

## Challenges
- HSL API documentation is not very detailed and takes some time to find the information.
- Real-time API relies heavily on REST API, I could not find a way to connect to HSL's MQTT websocket service.
- Lacking of use cases and clarification on the requirements.

## Potential improvements
- More unit tests
- Add more tests for the itinerary page, a map for visualizing the route
- Complete the live tracking and alerts pages