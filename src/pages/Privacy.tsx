
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';

const Privacy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-heritage-950 to-heritage-900 text-heritage-100">
      <Header title="Privacy Policy" showBackButton />

      <motion.div 
        className="container mx-auto px-4 py-24 md:py-32"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-center mb-12 text-gradient"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Privacy Policy
        </motion.h1>

        <motion.div 
          className="max-w-3xl mx-auto glass-panel rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">Introduction</h2>
              <p className="text-heritage-300 leading-relaxed">
                At HeritageAR, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our augmented reality application and website. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">Information We Collect</h2>
              <p className="text-heritage-300 leading-relaxed mb-4">
                We collect several types of information for various purposes to provide and improve our Service to you:
              </p>
              <ul className="list-disc list-inside space-y-2 text-heritage-300">
                <li className="ml-4">Personal Information: name, email address, phone number</li>
                <li className="ml-4">Usage Data: IP address, browser type, pages visited</li>
                <li className="ml-4">Location Data: when you use our AR features (with your permission)</li>
                <li className="ml-4">Device Information: operating system, device type, system settings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">How We Use Your Information</h2>
              <p className="text-heritage-300 leading-relaxed mb-4">
                We use the collected information for various purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-heritage-300">
                <li className="ml-4">To provide and maintain our Service</li>
                <li className="ml-4">To notify you about changes to our Service</li>
                <li className="ml-4">To provide customer support</li>
                <li className="ml-4">To gather analysis or valuable information so that we can improve our Service</li>
                <li className="ml-4">To detect, prevent and address technical issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">Camera and AR Data</h2>
              <p className="text-heritage-300 leading-relaxed">
                HeritageAR needs access to your device's camera to provide augmented reality experiences. The camera data is processed in real-time on your device to recognize objects and overlay digital content. We do not store or transmit your camera feed to our servers except when explicitly initiated by you to scan a specific historical object.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">Contact Us</h2>
              <p className="text-heritage-300 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at privacy@heritagear.example.com.
              </p>
            </section>
          </div>
        </motion.div>

        <motion.p 
          className="text-center text-heritage-400 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Last updated: June 2023
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Privacy;
