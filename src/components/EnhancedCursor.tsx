
import React, { useEffect, useState } from 'react';

const EnhancedCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [inputHovered, setInputHovered] = useState(false);
  const [cursorVariant, setCursorVariant] = useState('default');
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    let moveTimer: NodeJS.Timeout;
    
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Set moving state
      setIsMoving(true);
      clearTimeout(moveTimer);
      moveTimer = setTimeout(() => {
        setIsMoving(false);
      }, 100);
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);
    
    const handleMouseEnter = () => setHidden(false);
    const handleMouseLeave = () => setHidden(true);

    const handleElementInteraction = () => {
      // Track interactive elements
      const interactiveElements = document.querySelectorAll('a, button, [role="button"], .interactive');
      const inputElements = document.querySelectorAll('input, textarea, select, [contenteditable="true"]');
      
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
          setLinkHovered(true);
          setCursorVariant('link');
        });
        el.addEventListener('mouseleave', () => {
          setLinkHovered(false);
          setCursorVariant('default');
        });
      });
      
      inputElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
          setInputHovered(true);
          setCursorVariant('input');
        });
        el.addEventListener('mouseleave', () => {
          setInputHovered(false);
          setCursorVariant('default');
        });
      });
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    // Run after a short delay to ensure DOM is loaded
    setTimeout(handleElementInteraction, 1000);
    
    // Re-attach event listeners when DOM changes
    const observer = new MutationObserver(() => {
      setTimeout(handleElementInteraction, 100);
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(moveTimer);
      observer.disconnect();
    };
  }, []);

  const getCursorStyles = () => {
    switch (cursorVariant) {
      case 'link':
        return {
          outer: {
            width: '32px',
            height: '32px',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            mixBlendMode: 'screen' as React.CSSProperties['mixBlendMode'],
          },
          inner: {
            backgroundColor: 'rgba(56, 189, 248, 0.8)',
          }
        };
      case 'input':
        return {
          outer: {
            width: '20px',
            height: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          },
          inner: {
            width: '3px',
            height: '14px',
            borderRadius: '1px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          }
        };
      default:
        return {
          outer: {
            width: '24px',
            height: '24px',
            backgroundColor: 'rgba(210, 220, 240, 0.1)',
            border: '1px solid rgba(210, 220, 240, 0.2)',
          },
          inner: {
            backgroundColor: 'rgba(210, 220, 240, 0.6)',
          }
        };
    }
  };

  const cursorStyles = getCursorStyles();

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
        {/* Outer cursor ring with transition */}
        <div
          className={`absolute rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-200 backdrop-blur-sm ${
            clicked ? 'scale-90' : isMoving ? 'scale-105' : 'scale-100'
          }`}
          style={{
            ...cursorStyles.outer,
            boxShadow: isMoving ? '0 0 12px rgba(56, 189, 248, 0.3)' : 'none',
            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.3s ease, height 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
          }}
        ></div>
        
        {/* Inner cursor dot with dynamic styling */}
        <div
          className={`absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ease-out ${
            clicked ? 'scale-75' : 'scale-100'
          }`}
          style={{
            width: cursorStyles.inner.width || '4px',
            height: cursorStyles.inner.height || '4px',
            borderRadius: cursorStyles.inner.borderRadius || '50%',
            backgroundColor: cursorStyles.inner.backgroundColor,
            transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.3s ease, height 0.3s ease, background-color 0.3s ease',
          }}
        ></div>
      </div>
    </>
  );
};

export default EnhancedCursor;
