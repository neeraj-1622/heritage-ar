
import React from 'react';

interface ImageGalleryProps {
  images: string[];
  isCapturing: boolean;
  isProcessing: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, isCapturing, isProcessing }) => {
  if (images.length === 0 || isCapturing || isProcessing) return null;
  
  return (
    <div className="mt-4 p-3 bg-heritage-800/30 backdrop-blur-sm rounded-lg">
      <p className="text-white text-sm mb-2">Captured images: {images.length}</p>
      <div className="flex overflow-x-auto pb-2 gap-2">
        {images.map((img, index) => (
          <div key={index} className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
            <img src={img} alt={`Angle ${index+1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
