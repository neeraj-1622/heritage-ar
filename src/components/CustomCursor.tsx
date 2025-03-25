
import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);
    
    const handleMouseEnter = () => setHidden(false);
    const handleMouseLeave = () => setHidden(true);

    const handleLinkHoverEvents = () => {
      document.querySelectorAll('a, button, [role="button"]').forEach(el => {
        el.addEventListener('mouseenter', () => setLinkHovered(true));
        el.addEventListener('mouseleave', () => setLinkHovered(false));
      });
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    // Set up link hover detection after a short delay to ensure DOM is ready
    setTimeout(handleLinkHoverEvents, 1000);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      
      document.querySelectorAll('a, button, [role="button"]').forEach(el => {
        el.removeEventListener('mouseenter', () => setLinkHovered(true));
        el.removeEventListener('mouseleave', () => setLinkHovered(false));
      });
    };
  }, []);

  return (
    <>
      <style>
        {`
          * {
            cursor: none !important;
          }
        `}
      </style>
      <div
        className={`fixed pointer-events-none z-[9999] transition-opacity duration-300 ${hidden ? 'opacity-0' : 'opacity-100'}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        {/* Outer cursor ring */}
        <div
          className={`absolute rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
            clicked ? 'scale-75 opacity-80' : 'scale-100 opacity-100'
          } ${
            linkHovered ? 'scale-150 bg-accent/20 backdrop-blur-sm' : ''
          }`}
          style={{
            width: linkHovered ? '50px' : '30px',
            height: linkHovered ? '50px' : '30px',
            backgroundColor: linkHovered ? 'transparent' : 'rgba(199, 210, 254, 0.2)',
            backdropFilter: 'blur(2px)',
            border: '1px solid rgba(199, 210, 254, 0.4)',
            boxShadow: '0 0 10px rgba(199, 210, 254, 0.3)',
          }}
        ></div>
        
        {/* Inner cursor dot */}
        <div
          className={`absolute w-2 h-2 bg-accent rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-out ${
            clicked ? 'scale-75' : 'scale-100'
          }`}
        ></div>
      </div>
    </>
  );
};

export default CustomCursor;
