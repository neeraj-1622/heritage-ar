
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  const footerLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Privacy', path: '/privacy' },
    { name: 'Terms', path: '/terms' },
    { name: 'Contact', path: '/contact' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <footer className="bg-heritage-900/50 backdrop-blur-sm border-t border-heritage-800/30">
      <motion.div 
        className="container mx-auto px-4 py-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <motion.div variants={childVariants} className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-accent to-accent/70 rounded-md"></div>
                <span className="relative font-bold text-white z-10">AR</span>
              </div>
              <h3 className="text-xl font-bold text-heritage-100">HeritageAR</h3>
            </Link>
            <p className="text-heritage-400 max-w-md">
              Experience history in a new dimension with augmented reality. HeritageAR brings historical sites and artifacts to life through immersive AR technology.
            </p>
            
            <div className="mt-6 flex space-x-4">
              {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-full bg-heritage-800/80 flex items-center justify-center hover:bg-accent/80 transition-colors"
                  whileHover={{ y: -3 }}
                >
                  <div className="w-5 h-5 bg-heritage-200"></div>
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          <motion.div variants={childVariants}>
            <h3 className="text-heritage-100 font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-heritage-400 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div variants={childVariants}>
            <h3 className="text-heritage-100 font-medium mb-4">Contact Us</h3>
            <ul className="space-y-2 text-heritage-400">
              <li>contact@heritagear.example.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Heritage Street, Tech City</li>
            </ul>
            
            <div className="mt-6">
              <Link 
                to="/contact"
                className="px-4 py-2 rounded-full bg-heritage-800 text-heritage-200 hover:bg-accent hover:text-white transition-colors text-sm"
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          variants={childVariants}
          className="mt-12 pt-6 border-t border-heritage-800/30 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-heritage-500 text-sm">
            © {new Date().getFullYear()} HeritageAR. All rights reserved.
          </p>
          
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="/privacy" className="text-heritage-500 hover:text-heritage-300 text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-heritage-500 hover:text-heritage-300 text-sm">
              Terms of Service
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
