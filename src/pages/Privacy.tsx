
import React, { useEffect } from 'react';
import AnimatedHeader from '../components/AnimatedHeader';
import { motion } from 'framer-motion';

const Privacy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-heritage-950 text-white">
      <AnimatedHeader title="Privacy Policy" showBackButton={true} />
      
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
              <h1 className="text-4xl font-bold mb-8 text-gradient relative z-10">Privacy Policy</h1>
              
              <div className="glass-panel rounded-xl p-8 mb-10">
                <p className="text-lg mb-6 text-white/90">Last Updated: {new Date().toLocaleDateString()}</p>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h2 className="text-2xl font-semibold mb-4 text-white">1. Introduction</h2>
                  <p className="mb-6 text-white/80">
                    At HeritageAR, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h2 className="text-2xl font-semibold mb-4 text-white">2. Data We Collect</h2>
                  <p className="mb-3 text-white/80">
                    We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                  </p>
                  <ul className="list-disc pl-6 mb-6 text-white/80">
                    <li className="mb-2">Identity Data includes first name, last name, username or similar identifier.</li>
                    <li className="mb-2">Contact Data includes email address and telephone numbers.</li>
                    <li className="mb-2">Technical Data includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                    <li className="mb-2">Usage Data includes information about how you use our website and services.</li>
                  </ul>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <h2 className="text-2xl font-semibold mb-4 text-white">3. How We Use Your Data</h2>
                  <p className="mb-3 text-white/80">
                    We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                  </p>
                  <ul className="list-disc pl-6 mb-6 text-white/80">
                    <li className="mb-2">Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                    <li className="mb-2">Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                    <li className="mb-2">Where we need to comply with a legal obligation.</li>
                  </ul>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <h2 className="text-2xl font-semibold mb-4 text-white">4. Data Security</h2>
                  <p className="mb-6 text-white/80">
                    We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <h2 className="text-2xl font-semibold mb-4 text-white">5. Contact Us</h2>
                  <p className="mb-6 text-white/80">
                    If you have any questions about this privacy policy or our privacy practices, please contact us at privacy@heritagear.com.
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

export default Privacy;
