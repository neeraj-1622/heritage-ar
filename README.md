# Heritage AR 🏛️

An immersive Augmented Reality experience for exploring historical monuments and sites. View famous landmarks like the Taj Mahal, Colosseum, and Parthenon in 3D and AR, right from your browser! Visit the Website https://heritage-ar.netlify.app/

---

## 🌟 Features

### 🏰 Historical Sites Exploration
- Gallery view of historical monuments
- Detailed information pages for each site
- User favorites system
- Educational content about each monument

### 📱 AR & 3D Features
- View monuments in Augmented Reality
- Interactive 3D model viewing
- Real-world object detection
- Place and manipulate 3D models in your environment
- Orbit controls for 3D model interaction

### 👤 User Features
- Secure authentication system
- Personal profile management
- Favorite sites collection
- Password recovery system

---

## 🛠️ Technology Stack

### Frontend
- **React** with **TypeScript**
- **Three.js** & **React Three Fiber** for 3D rendering
- **@react-three/drei** & **@react-three/xr** for AR
- **Framer Motion** for animations
- **Tailwind CSS** & **Shadcn UI** for styling
- **React Hook Form** with **Zod** validation
- **Lucide React** for icons

### Backend
- **Supabase**
  - PostgreSQL database
  - Authentication
  - Storage for assets
  - Real-time updates

### AR/3D Technologies
- **WebXR** API
- **GLB/GLTF** model format
- **THREE.js** ecosystem
- Object detection capabilities

---

## 📁 Project Structure

```
heritage-ar/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Shadcn UI components
│   │   ├── ARView.tsx      # AR visualization component
│   │   └── ARModelViewer.tsx
│   ├── pages/              # Route pages
│   ├── lib/                # Utilities and helpers
│   │   ├── supabase.ts     # Supabase client
│   │   └── database.types.ts
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Helper functions
│   │   ├── objectReconstructor.ts
│   │   └── objectToModelMapper.ts
│   └── integrations/       # External service integrations
├── public/
│   ├── models/            # 3D model files (.glb)
│   └── images/           # Static images
├── supabase/             # Supabase configuration
├── .env                  # Environment variables
├── tailwind.config.ts    # Tailwind configuration
├── vite.config.ts        # Vite configuration
└── package.json          # Dependencies and scripts
```

---

## 🗄️ Database Structure

### Historical Sites Table
- Site information (name, period, location)
- Descriptions and media URLs
- AR configuration (coordinates, scaling)
- Creation and update metadata

### User Profiles Table
- User information
- Authentication details
- Profile customization

### User Favorites Table
- User-site relationships
- Favorite sites tracking

---

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/heritage-ar.git
   cd heritage-ar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase and other API credentials.

4. **Start development server**
   ```bash
   npm run dev
   ```

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
