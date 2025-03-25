
import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);
  const [inputHovered, setInputHovered] = useState(false);
  const [scrollable, setScrollable] = useState(false);
  const [imageHovered, setImageHovered] = useState(false);

  useEffect(() => {
    // Smooth cursor following with slight delay for trailing effect
    let mouseX = 0;
    let mouseY = 0;
    let posX = 0;
    let posY = 0;
    
    const updatePosition = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => {
      setClicked(false);
      setDragging(false);
    };
    
    // Check if mouse is being dragged
    const handleDragStart = () => setDragging(true);
    
    const handleMouseEnter = () => setHidden(false);
    const handleMouseLeave = () => setHidden(true);

    const handleInteractiveElements = () => {
      // Links, buttons, and interactive elements
      document.querySelectorAll('a, button, [role="button"], .interactive').forEach(el => {
        el.addEventListener('mouseenter', () => setLinkHovered(true));
        el.addEventListener('mouseleave', () => setLinkHovered(false));
      });
      
      // Buttons
      document.querySelectorAll('button, .button-primary, .button-secondary').forEach(el => {
        el.addEventListener('mouseenter', () => setButtonHovered(true));
        el.addEventListener('mouseleave', () => setButtonHovered(false));
      });
      
      // Input elements
      document.querySelectorAll('input, textarea, select').forEach(el => {
        el.addEventListener('mouseenter', () => setInputHovered(true));
        el.addEventListener('mouseleave', () => setInputHovered(false));
      });
      
      // Scrollable elements
      document.querySelectorAll('.overflow-auto, .overflow-y-auto, .overflow-x-auto').forEach(el => {
        el.addEventListener('mouseenter', () => setScrollable(true));
        el.addEventListener('mouseleave', () => setScrollable(false));
      });
      
      // Images
      document.querySelectorAll('img').forEach(el => {
        el.addEventListener('mouseenter', () => setImageHovered(true));
        el.addEventListener('mouseleave', () => setImageHovered(false));
      });
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('dragstart', handleDragStart);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    // Smooth animation loop
    const followMouse = () => {
      // Add some easing for smooth movement
      const friction = 0.15;
      
      // Calculate distance between current position and mouse
      posX += (mouseX - posX) * friction;
      posY += (mouseY - posY) * friction;
      
      // Round to avoid sub-pixel rendering and improve performance
      setPosition({ 
        x: Math.round(posX), 
        y: Math.round(posY)
      });
      
      requestAnimationFrame(followMouse);
    };
    
    followMouse();
    
    // Set up interactive elements detection after a delay to ensure DOM is ready
    setTimeout(handleInteractiveElements, 1000);
    
    // Re-run detection periodically to catch dynamically added elements
    const intervalId = setInterval(handleInteractiveElements, 3000);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('dragstart', handleDragStart);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      
      clearInterval(intervalId);
      
      // Clean up all event listeners
      document.querySelectorAll('a, button, [role="button"], .interactive, input, textarea, select, img').forEach(el => {
        el.removeEventListener('mouseenter', () => {});
        el.removeEventListener('mouseleave', () => {});
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
          
          ::selection {
            background-color: rgba(56, 189, 248, 0.3);
            color: white;
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
            dragging ? 'scale-90 opacity-60' : ''
          } ${
            linkHovered ? 'scale-150 bg-accent/20 backdrop-blur-sm' : ''
          } ${
            buttonHovered ? 'scale-150 bg-accent/30 backdrop-blur-sm' : ''
          } ${
            inputHovered ? 'scale-[1.2] opacity-80 bg-white/20' : ''
          } ${
            scrollable ? 'scale-75 opacity-60' : ''
          } ${
            imageHovered ? 'scale-[2] opacity-40 bg-transparent border-accent' : ''
          }`}
          style={{
            width: imageHovered ? '60px' : linkHovered || buttonHovered ? '50px' : '30px',
            height: imageHovered ? '60px' : linkHovered || buttonHovered ? '50px' : '30px',
            backgroundColor: inputHovered ? 'rgba(255, 255, 255, 0.1)' : 
                             buttonHovered ? 'rgba(56, 189, 248, 0.2)' : 
                             linkHovered ? 'rgba(56, 189, 248, 0.1)' : 
                             'rgba(56, 189, 248, 0.15)',
            backdropFilter: 'blur(2px)',
            border: imageHovered ? '1px solid rgba(56, 189, 248, 0.8)' : 
                    linkHovered ? '1px solid rgba(56, 189, 248, 0.6)' : 
                    '1px solid rgba(56, 189, 248, 0.4)',
            boxShadow: '0 0 10px rgba(56, 189, 248, 0.3)',
          }}
        >
          {buttonHovered && (
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] font-bold text-white opacity-80">
              Click
            </span>
          )}
        </div>
        
        {/* Inner cursor dot */}
        <div
          className={`absolute bg-accent rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out ${
            clicked ? 'scale-75' : 'scale-100'
          } ${
            linkHovered || buttonHovered ? 'scale-150' : ''
          } ${
            imageHovered ? 'scale-0' : ''
          }`}
          style={{
            width: '6px',
            height: '6px',
            boxShadow: '0 0 8px rgba(56, 189, 248, 0.8)',
          }}
        ></div>
        
        {/* Trailing dots for motion effect */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-accent/60 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              opacity: 0.3 - i * 0.1,
              transform: `translate(-50%, -50%) scale(${0.8 - i * 0.2})`,
              transition: `opacity 0.3s ease-out ${i * 0.05}s, transform 0.3s ease-out ${i * 0.05}s`,
            }}
          ></div>
        ))}
      </div>
    </>
  );
};

export default CustomCursor;
