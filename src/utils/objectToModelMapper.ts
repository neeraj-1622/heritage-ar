
type DetectedObjectMapping = {
  [key: string]: {
    modelUrl: string;
    scale: number;
    description: string;
  }
};

// Map common objects to available 3D models
export const OBJECT_MODEL_MAPPINGS: DetectedObjectMapping = {
  // Common objects that can be detected by COCO-SSD
  "person": {
    modelUrl: "/models/monument.glb",
    scale: 0.5,
    description: "A human figure detected in the scene"
  },
  "laptop": {
    modelUrl: "/models/colosseum.glb",
    scale: 0.4,
    description: "A laptop computer"
  },
  "cell phone": {
    modelUrl: "/models/taj_mahal.glb",
    scale: 0.3,
    description: "A mobile phone device"
  },
  "book": {
    modelUrl: "/models/parthenon.glb",
    scale: 0.4,
    description: "A printed book"
  },
  "bottle": {
    modelUrl: "/models/angkor_wat.glb",
    scale: 0.3,
    description: "A bottle"
  },
  "cup": {
    modelUrl: "/models/chichen_itza.glb",
    scale: 0.25,
    description: "A drinking cup"
  },
  "keyboard": {
    modelUrl: "/models/machu_picchu.glb",
    scale: 0.4,
    description: "A computer keyboard"
  },
  "mouse": {
    modelUrl: "/models/colosseum.glb", 
    scale: 0.3,
    description: "A computer mouse"
  },
  "remote": {
    modelUrl: "/models/parthenon.glb",
    scale: 0.35,
    description: "A remote control"
  },
  "chair": {
    modelUrl: "/models/taj_mahal.glb",
    scale: 0.5,
    description: "A chair or seat"
  },
  "tv": {
    modelUrl: "/models/angkor_wat.glb",
    scale: 0.45,
    description: "A television or monitor"
  },
  // Default fallback
  "default": {
    modelUrl: "/models/monument.glb",
    scale: 0.5,
    description: "An object detected in the scene"
  }
};

export const getModelForObject = (objectClass: string) => {
  return OBJECT_MODEL_MAPPINGS[objectClass] || OBJECT_MODEL_MAPPINGS.default;
};
