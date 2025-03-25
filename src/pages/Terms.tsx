
import React, { useEffect } from 'react';
import AnimatedHeader from '../components/AnimatedHeader';
import { motion } from 'framer-motion';

const Terms: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-heritage-950 text-white">
      <AnimatedHeader title="Terms of Service" showBackButton={true} />
      
      <main className="flex-1 pt-28 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-accent/20 blur-3xl"></div>
              <h1 className="text-4xl font-bold mb-8 text-gradient relative z-10">Terms of Service</h1>
              
              <div className="glass-panel rounded-xl p-8 mb-10">
                <p className="text-lg mb-6 text-white/90">Last Updated: {new Date().toLocaleDateString()}</p>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h2 className="text-2xl font-semibold mb-4 text-white">1. Acceptance of Terms</h2>
                  <p className="mb-6 text-white/80">
                    By accessing or using the HeritageAR service, you agree to be bound by these Terms of Service. If you do not agree to these Terms, you should not use our service.
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h2 className="text-2xl font-semibold mb-4 text-white">2. Description of Service</h2>
                  <p className="mb-6 text-white/80">
                    HeritageAR provides an augmented reality platform that allows users to explore historical sites and cultural artifacts through digital technology. Our service may include features such as AR viewing, historical information, and interactive elements.
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <h2 className="text-2xl font-semibold mb-4 text-white">3. User Accounts</h2>
                  <p className="mb-3 text-white/80">
                    To access certain features of our Service, you may be required to create an account. You are responsible for:
                  </p>
                  <ul className="list-disc pl-6 mb-6 text-white/80">
                    <li className="mb-2">Maintaining the confidentiality of your account and password.</li>
                    <li className="mb-2">Restricting access to your computer or mobile device.</li>
                    <li className="mb-2">Accepting responsibility for all activities that occur under your account.</li>
                  </ul>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <h2 className="text-2xl font-semibold mb-4 text-white">4. Intellectual Property</h2>
                  <p className="mb-6 text-white/80">
                    The Service and its original content, features, and functionality are owned by HeritageAR and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <h2 className="text-2xl font-semibold mb-4 text-white">5. User Conduct</h2>
                  <p className="mb-3 text-white/80">
                    You agree not to use the Service:
                  </p>
                  <ul className="list-disc pl-6 mb-6 text-white/80">
                    <li className="mb-2">In any way that violates any applicable national or international law or regulation.</li>
                    <li className="mb-2">To impersonate or attempt to impersonate HeritageAR, an employee, another user, or any other person.</li>
                    <li className="mb-2">To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service.</li>
                  </ul>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <h2 className="text-2xl font-semibold mb-4 text-white">6. Termination</h2>
                  <p className="mb-6 text-white/80">
                    We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever.
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <h2 className="text-2xl font-semibold mb-4 text-white">7. Contact Us</h2>
                  <p className="mb-6 text-white/80">
                    If you have any questions about these Terms, please contact us at terms@heritagear.com.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <footer className="py-10 bg-heritage-900 border-t border-heritage-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="relative w-8 h-8 flex items-center justify-center mr-2">
                <div className="absolute inset-0 bg-gradient-to-tr from-accent to-accent-400 rounded-md"></div>
                <span className="relative font-bold text-white z-10">AR</span>
              </div>
              <span className="text-white font-semibold">HeritageAR</span>
            </div>
            
            <div className="flex space-x-8 text-sm text-heritage-400">
              <a href="/about" className="hover:text-white transition-colors">About</a>
              <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms</a>
              <a href="/contact" className="hover:text-white transition-colors">Contact</a>
            </div>
            
            <div className="mt-6 md:mt-0 text-heritage-500 text-sm">
              &copy; {new Date().getFullYear()} HeritageAR
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Terms;
