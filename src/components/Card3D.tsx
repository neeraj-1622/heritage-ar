
import React, { useRef, useState, useEffect } from 'react';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  borderLight?: boolean;
  glare?: boolean;
}

const Card3D: React.FC<Card3DProps> = ({ 
  children, 
  className = '', 
  intensity = 15,
  borderLight = true,
  glare = true
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center (normalized from -1 to 1)
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    
    // Set rotation (multiplied by intensity factor)
    setRotation({
      x: -y * intensity, // Reversed for natural feel
      y: x * intensity
    });
    
    // Track mouse position for the glare effect
    setPosition({
      x: (e.clientX - rect.left) / rect.width * 100,
      y: (e.clientY - rect.top) / rect.height * 100
    });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    // Reset rotation with a smooth transition
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div 
      ref={cardRef}
      className={`relative transform-gpu transition-transform duration-200 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovering 
          ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.02, 1.02, 1.02)` 
          : 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)',
        transition: 'transform 0.2s ease-out',
      }}
    >
      {children}
      
      {borderLight && isHovering && (
        <div 
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${position.x}% ${position.y}%, rgba(255, 255, 255, 0.15), transparent 40%)`,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 2,
          }}
        ></div>
      )}
      
      {glare && isHovering && (
        <div 
          className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
          style={{
            background: `linear-gradient(${45 + rotation.x}deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.05) 10%, rgba(255, 255, 255, 0.1) 20%, rgba(255, 255, 255, 0))`,
            transform: `rotate(${rotation.y}deg)`,
            zIndex: 3,
          }}
        ></div>
      )}
    </div>
  );
};

export default Card3D;
