import React from 'react';
import AnimatedHeader from '../components/AnimatedHeader';
import { motion } from 'framer-motion';
import { Camera, View, Map, History, Volume2 } from 'lucide-react';

const About: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const features = [
    {
      icon: <Camera className="h-8 w-8 text-accent" />,
      title: "AR Experience",
      description: "View historical monuments in augmented reality through your device's camera, with real-time object detection and 3D model creation."
    },
    {
      icon: <View className="h-8 w-8 text-accent" />,
      title: "3D Model Viewer",
      description: "Interact with detailed 3D models of historical monuments like the Taj Mahal, Colosseum, Parthenon, and more."
    },
    {
      icon: <Map className="h-8 w-8 text-accent" />,
      title: "City Explorer Tour",
      description: "Take guided tours of cities with categorized locations including food spots, cultural centers, nature parks, and shopping districts."
    },
    {
      icon: <History className="h-8 w-8 text-accent" />,
      title: "Historical Information",
      description: "Access comprehensive details about each monument including its period, location, and historical significance."
    },
    {
      icon: <Volume2 className="h-8 w-8 text-accent" />,
      title: "Audio Narration",
      description: "Listen to detailed narrations about each historical site with built-in text-to-speech functionality."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedHeader title="About HeritageAR" showBackButton />
      
      <motion.main 
        className="flex-1 pt-24 pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4">
          <motion.div className="max-w-3xl mx-auto mb-16" variants={itemVariants}>
            <div className="flex justify-center mb-8">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-accent to-accent/70 rounded-md"></div>
                <span className="relative font-bold text-white text-2xl z-10">AR</span>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-center text-heritage-100 mb-4">Our Mission</h1>
            <p className="text-heritage-300 text-lg text-center">
              HeritageAR brings historical monuments to life through immersive augmented reality experiences. 
              Our platform combines cutting-edge AR technology with detailed 3D models to let you explore 
              and learn about iconic historical sites from anywhere in the world.
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mb-16">
            <h2 className="text-3xl font-bold text-center text-heritage-100 mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="glass-panel rounded-2xl p-6 hover-lift"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center mb-4">
                    {feature.icon}
                    <h3 className="text-xl font-semibold text-heritage-100 ml-3">{feature.title}</h3>
                  </div>
                  <p className="text-heritage-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div className="glass-panel rounded-2xl p-8 max-w-3xl mx-auto" variants={itemVariants}>
            <h2 className="text-3xl font-bold text-heritage-100 mb-4">How It Works</h2>
            <p className="text-heritage-300 mb-4">
              HeritageAR uses advanced augmented reality and 3D modeling technologies to create immersive 
              experiences. When you point your device's camera at an object, our system can detect and analyze it, 
              potentially creating a 3D model in real-time.
            </p>
            <p className="text-heritage-300 mb-4">
              Our platform features a collection of meticulously crafted 3D models of famous historical monuments, 
              from the Taj Mahal to the Colosseum. You can view these models in AR, rotate them in 360 degrees, 
              and learn about their history through detailed information panels and audio narrations.
            </p>
            <p className="text-heritage-300">
              Beyond individual monuments, HeritageAR also offers a City Explorer Tour feature that helps you 
              discover various points of interest in different categories. Whether you're interested in local 
              cuisine, cultural spots, nature parks, or shopping districts, our platform helps you explore and 
              experience cities in a new way.
            </p>
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
};

export default About;
