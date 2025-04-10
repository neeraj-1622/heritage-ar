import React from 'react';
import AnimatedHeader from '../components/AnimatedHeader';
import { motion } from 'framer-motion';
import { Lock, Shield, Eye, Camera, Database } from 'lucide-react';

const Privacy: React.FC = () => {
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

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedHeader title="Privacy Policy" showBackButton />
      
      <motion.main 
        className="flex-1 pt-24 pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4">
          <motion.div className="max-w-3xl mx-auto mb-10" variants={itemVariants}>
            <div className="flex justify-center mb-8">
              <div className="p-4 rounded-full bg-heritage-800 text-accent">
                <Shield className="h-12 w-12" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-center text-heritage-100 mb-4">Privacy Policy</h1>
            <p className="text-heritage-300 text-center">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto glass-panel rounded-2xl p-8">
            <motion.div className="mb-8" variants={itemVariants}>
              <div className="flex items-center mb-4">
                <Lock className="h-6 w-6 text-accent mr-3" />
                <h2 className="text-2xl font-bold text-heritage-100">Introduction</h2>
              </div>
              <p className="text-heritage-300 mb-4">
                At HeritageAR, we respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you about how we look after your personal data when you visit 
                our website and use our augmented reality services, and tell you about your privacy rights and 
                how the law protects you.
              </p>
              <p className="text-heritage-300">
                We recommend that you read this privacy policy in full to ensure you are fully informed. 
                However, if you only want to access a particular section of this privacy policy, you can 
                click on the relevant link below to jump to that section.
              </p>
            </motion.div>
            
            <motion.div className="mb-8" variants={itemVariants}>
              <div className="flex items-center mb-4">
                <Database className="h-6 w-6 text-accent mr-3" />
                <h2 className="text-2xl font-bold text-heritage-100">Information We Collect</h2>
              </div>
              <p className="text-heritage-300 mb-4">
                We collect several types of information from and about users of our website and application, including:
              </p>
              <ul className="list-disc pl-6 text-heritage-300 space-y-2">
                <li>
                  <span className="font-medium text-heritage-200">Personal Identifiers:</span> Such as name, email address, 
                  display name, and other profile information when you register for an account.
                </li>
                <li>
                  <span className="font-medium text-heritage-200">User Preferences:</span> Including your favorite historical 
                  sites and interaction history with various cultural heritage locations.
                </li>
                <li>
                  <span className="font-medium text-heritage-200">User-Generated Content:</span> Any historical site information, 
                  cultural aspects, or mythology details that you contribute to the platform.
                </li>
                <li>
                  <span className="font-medium text-heritage-200">Usage Data:</span> Information about how you use our website 
                  and application, including which historical sites you view and interact with.
                </li>
                <li>
                  <span className="font-medium text-heritage-200">Device Information:</span> Information about your mobile device 
                  or computer, including type, operating system, and browser.
                </li>
                <li>
                  <span className="font-medium text-heritage-200">Location Data:</span> With your permission, we may collect and 
                  process information about your location to provide relevant AR experiences and nearby historical sites.
                </li>
              </ul>
            </motion.div>
            
            <motion.div className="mb-8" variants={itemVariants}>
              <div className="flex items-center mb-4">
                <Camera className="h-6 w-6 text-accent mr-3" />
                <h2 className="text-2xl font-bold text-heritage-100">Camera and AR Technologies</h2>
              </div>
              <p className="text-heritage-300 mb-4">
                Our application uses your device's camera to provide augmented reality experiences. We do not 
                store or transmit the camera feed to our servers. All AR processing is done locally on your device.
              </p>
              <p className="text-heritage-300">
                When you use our AR features, the application will request permission to access your camera. 
                You can choose to grant or deny this permission, and you can change your decision at any time 
                through your device settings.
              </p>
            </motion.div>
            
            <motion.div className="mb-8" variants={itemVariants}>
              <div className="flex items-center mb-4">
                <Eye className="h-6 w-6 text-accent mr-3" />
                <h2 className="text-2xl font-bold text-heritage-100">How We Use Your Information</h2>
              </div>
              <p className="text-heritage-300 mb-4">
                We use the information we collect about you for various purposes, including:
              </p>
              <ul className="list-disc pl-6 text-heritage-300 space-y-2">
                <li>Providing, maintaining, and improving our services</li>
                <li>Processing and fulfilling your requests</li>
                <li>Sending you technical notices and updates</li>
                <li>Responding to your comments and questions</li>
                <li>Personalizing your experience</li>
                <li>Protecting our services and users</li>
                <li>Complying with legal obligations</li>
              </ul>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-accent mr-3" />
                <h2 className="text-2xl font-bold text-heritage-100">Data Security</h2>
              </div>
              <p className="text-heritage-300 mb-4">
                We implement appropriate security measures to protect your personal information against unauthorized 
                access, alteration, disclosure, or destruction. However, no method of transmission over the Internet 
                or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </motion.div>

            <motion.div className="mb-8" variants={itemVariants}>
              <div className="flex items-center mb-4">
                <Database className="h-6 w-6 text-accent mr-3" />
                <h2 className="text-2xl font-bold text-heritage-100">Data Retention and Your Rights</h2>
              </div>
              <p className="text-heritage-300 mb-4">
                We retain your personal data only for as long as necessary to fulfill the purposes for which we collected it. 
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-heritage-300 space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate personal data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to our processing of your personal data</li>
                <li>Export your personal data in a portable format</li>
              </ul>
              <p className="text-heritage-300 mt-4">
                To exercise any of these rights or if you have any questions about our privacy practices, 
                please contact us at privacy@heritagear.example.com.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.main>
    </div>
  );
};

export default Privacy;
