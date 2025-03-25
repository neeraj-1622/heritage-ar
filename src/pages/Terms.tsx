
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';

const Terms: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using HeritageAR, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our application."
    },
    {
      title: "2. Changes to Terms",
      content: "HeritageAR reserves the right to modify these terms at any time. We will provide notice of any significant changes. Your continued use of the application after such modifications will constitute your acknowledgment of the modified terms."
    },
    {
      title: "3. Using Our Services",
      content: "You must follow any policies made available to you within the HeritageAR services. You may only use our services as permitted by law. We may suspend or stop providing our services to you if you do not comply with our terms or policies or if we are investigating suspected misconduct."
    },
    {
      title: "4. AR Content",
      content: "HeritageAR provides augmented reality content related to historical sites and artifacts. This content is provided for educational and entertainment purposes only. While we strive for accuracy, we cannot guarantee that all historical information is completely accurate or up to date."
    },
    {
      title: "5. User Safety",
      content: "When using AR features, please be aware of your surroundings. Do not use the AR features while driving, operating heavy machinery, or in any situation where your attention should be fully on your environment. HeritageAR is not responsible for any accidents or injuries resulting from inattention while using our application."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-heritage-950 to-heritage-900 text-heritage-100">
      <Header title="Terms of Service" showBackButton />

      <motion.div 
        className="container mx-auto px-4 py-24 md:py-32"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-center mb-12 text-gradient"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Terms of Service
        </motion.h1>

        <motion.div 
          className="max-w-3xl mx-auto glass-panel rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.section 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (index * 0.1), duration: 0.5 }}
              >
                <h2 className="text-xl font-semibold mb-3 text-accent">{section.title}</h2>
                <p className="text-heritage-300 leading-relaxed">{section.content}</p>
              </motion.section>
            ))}

            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + (sections.length * 0.1), duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold mb-3 text-accent">6. Intellectual Property</h2>
              <p className="text-heritage-300 leading-relaxed">
                The HeritageAR application, including all content, features, and functionality, is owned by HeritageAR and is protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + ((sections.length + 1) * 0.1), duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold mb-3 text-accent">7. Contact Us</h2>
              <p className="text-heritage-300 leading-relaxed">
                If you have any questions about these Terms, please contact us at terms@heritagear.example.com.
              </p>
            </motion.section>
          </div>
        </motion.div>

        <motion.p 
          className="text-center text-heritage-400 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          Last updated: June 2023
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Terms;
