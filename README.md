
# HeritageAR

An augmented reality application for exploring historical sites.

## Project Structure

```
HeritageAR/
├── README.md
├── public/                # Static assets
├── src/
│   ├── frontend/          # Frontend code
│   │   ├── api/           # API clients for data fetching
│   │   └── ...
│   ├── backend/           # Backend server
│   │   ├── database/      # Database connection
│   │   ├── models/        # Data models
│   │   ├── repositories/  # Data access layer
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Express middlewares
│   │   ├── scripts/       # Utility scripts
│   │   ├── server.ts      # Express server entry point
│   │   └── package.json   # Backend dependencies
│   ├── components/        # React components
│   ├── context/           # React contexts
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── pages/             # Page components
│   └── ...
└── package.json           # Frontend dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (local instance or MongoDB Atlas)

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Install backend dependencies:
   ```bash
   cd src/backend
   npm install
   ```

### Running the Application

1. Start MongoDB (if using a local instance)
2. Start the backend server:
   ```bash
   cd src/backend
   npm run dev
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Features

- User authentication (login/register)
- Explore historical sites
- View site details
- AR visualization of historical sites (requires login)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in a user

### Historical Sites
- `GET /api/sites` - Get all sites (public)
- `GET /api/sites/:id` - Get a specific site (protected)
- `POST /api/sites` - Create a new site (protected)
- `PUT /api/sites/:id` - Update a site (protected)
- `DELETE /api/sites/:id` - Delete a site (protected)
