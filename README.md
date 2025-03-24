
# HeritageAR: Reconstructing History in Augmented Reality

This project allows users to explore historical sites in augmented reality. Users can browse a gallery of historical sites, view detailed information, and experience 3D reconstructions in AR.

## Project Structure

The project is organized into frontend and backend folders:

```
HeritageAR/
├── src/
│   ├── frontend/            # Frontend React components and API clients
│   │   └── api/
│   │       └── sitesApi.ts  # API client for historical sites
│   ├── backend/             # Backend Express.js server and MongoDB integration
│   │   ├── database/        # Database connection and utilities
│   │   ├── models/          # Data models and types
│   │   ├── repositories/    # Data access layer
│   │   ├── services/        # Business logic
│   │   ├── data/            # Default/seed data
│   │   ├── scripts/         # Utility scripts
│   │   └── server.ts        # Express server entry point
│   ├── components/          # Shared React components
│   └── pages/               # Page components
```

## Technologies Used

- **Frontend**: React, React Router, TanStack Query, Tailwind CSS
- **Backend**: Express.js, MongoDB
- **AR Technology**: Web-based AR (planned integration)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/heritageAR.git
   cd heritageAR
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start MongoDB:
   ```
   # If using local MongoDB
   mongod --dbpath=/data
   ```

4. Start the backend server:
   ```
   cd src/backend
   npm run dev
   ```

5. In a new terminal, start the frontend:
   ```
   npm run dev
   ```

6. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Development

### Seeding the Database

To populate the database with sample data:

```
cd src/backend
npm run seed
```

### API Endpoints

The backend provides the following API endpoints:

- `GET /api/sites` - Get all historical sites
- `GET /api/sites/:id` - Get a specific historical site by ID
- `POST /api/sites` - Create a new historical site
- `PUT /api/sites/:id` - Update an existing historical site
- `DELETE /api/sites/:id` - Delete a historical site

## Features

- Browse a gallery of historical sites
- View detailed information about each site
- Experience 3D reconstructions in augmented reality (coming soon)
- Admin panel for managing historical sites data (planned)

## License

MIT

## Acknowledgments

- Images sourced from Unsplash
- 3D models sourced from various public domain repositories
