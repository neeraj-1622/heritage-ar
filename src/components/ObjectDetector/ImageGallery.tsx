
import React from 'react';

interface ImageGalleryProps {
  images: string[];
  isCapturing: boolean;
  isProcessing: boolean;
  sides?: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images, 
  isCapturing, 
  isProcessing,
  sides = []
}) => {
  if (images.length === 0 || isCapturing || isProcessing) return null;
  
  return (
    <div className="mt-4 p-3 bg-heritage-800/30 backdrop-blur-sm rounded-lg">
      <p className="text-white text-sm mb-2">Captured views: {images.length}</p>
      <div className="flex overflow-x-auto pb-2 gap-2">
        {images.map((img, index) => (
          <div key={index} className="flex-shrink-0 w-16 h-20 flex flex-col">
            <div className="h-16 w-16 rounded-md overflow-hidden">
              <img src={img} alt={`Angle ${index+1}`} className="w-full h-full object-cover" />
            </div>
            {sides && sides[index] && (
              <span className="text-white text-xs text-center mt-1">{sides[index]}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
