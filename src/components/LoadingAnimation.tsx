
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface LoadingAnimationProps {
  onComplete: () => void;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showVRSequence, setShowVRSequence] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const loadingTexts = [
    "Initializing AR environment...",
    "Scanning historical database...",
    "Calibrating dimensional portal...",
    "Preparing time-travel sequence...",
    "Establishing reality anchors...",
    "Ready to explore history..."
  ];
  
  useEffect(() => {
    let startTime = Date.now();
    const duration = 4000; // 4 seconds animation
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const nextProgress = Math.min(100, (elapsed / duration) * 100);
      
      setProgress(nextProgress);
      
      // Update loading text
      if (nextProgress > textIndex * 20 && textIndex < loadingTexts.length - 1) {
        setTextIndex(prev => prev + 1);
      }
      
      if (nextProgress < 100) {
        requestAnimationFrame(animate);
      } else {
        setShowVRSequence(true);
        setTimeout(() => {
          onComplete();
        }, 1800);
      }
    };
    
    requestAnimationFrame(animate);
    
    // Setup canvas animation
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const particlesArray: Particle[] = [];
        const maxParticles = 100;
        
        class Particle {
          x: number;
          y: number;
          size: number;
          speedX: number;
          speedY: number;
          color: string;
          
          constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 2;
            this.speedY = (Math.random() - 0.5) * 2;
            this.color = `rgba(56, 189, 248, ${Math.random() * 0.8})`;
          }
          
          update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
          }
          
          draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        
        const init = () => {
          for (let i = 0; i < maxParticles; i++) {
            particlesArray.push(new Particle());
          }
        };
        
        const animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
          }
          
          // Draw connecting lines
          for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
              const dx = particlesArray[a].x - particlesArray[b].x;
              const dy = particlesArray[a].y - particlesArray[b].y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance < 100) {
                ctx.strokeStyle = `rgba(56, 189, 248, ${0.1 * (1 - distance / 100)})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
              }
            }
          }
          
          requestAnimationFrame(animate);
        };
        
        init();
        animate();
      }
    }
    
    return () => {
      // Cleanup
    };
  }, [onComplete, textIndex]);
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-heritage-950 z-50 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      
      <div className="z-10 max-w-md w-full px-6 flex flex-col items-center">
        {!showVRSequence ? (
          <>
            <div className="relative w-48 h-48 mb-8">
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                animate={{ 
                  rotate: [0, 360],
                }}
                transition={{ 
                  duration: 3,
                  ease: "linear",
                  repeat: Infinity,
                }}
              >
                <svg className="h-32 w-32 text-accent" viewBox="0 0 24 24">
                  <motion.path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    strokeDasharray="60"
                    strokeDashoffset={60 - (60 * progress) / 100}
                  />
                </svg>
              </motion.div>
              
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-4 border-heritage-800/50"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-accent/30"></div>
            </div>
            
            <div className="text-center mb-10">
              <motion.h2 
                className="text-2xl font-semibold tracking-wide text-white mb-1"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                HeritageAR
              </motion.h2>
              <p className="text-accent text-sm mb-4">Augmented Reality Portal</p>
              
              <div className="h-6">
                <motion.p 
                  key={textIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-heritage-400 text-sm"
                >
                  {loadingTexts[textIndex]}
                </motion.p>
              </div>
            </div>
            
            <div className="w-64 h-1.5 bg-heritage-800/50 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-accent rounded-full"
                style={{ width: `${progress}%` }}
                initial={{ width: "0%" }}
              />
            </div>
            <p className="text-heritage-500 mt-2 text-sm">{Math.round(progress)}%</p>
          </>
        ) : (
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="mb-6 relative"
              animate={{ 
                scale: [1, 1.2, 0],
              }}
              transition={{ 
                duration: 1.5,
                times: [0, 0.7, 1],
                ease: "easeInOut",
              }}
            >
              <div className="w-32 h-32 mx-auto rounded-full bg-accent/30 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-accent/50 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-accent/80 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.h2
              className="text-xl font-semibold text-white"
              animate={{ 
                opacity: [0, 1, 0],
              }}
              transition={{ 
                duration: 1.5,
                times: [0, 0.5, 1],
                ease: "easeInOut",
              }}
            >
              Entering AR Experience
            </motion.h2>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LoadingAnimation;
