import React from 'react';
import AnimatedHeader from '../components/AnimatedHeader';
import { motion } from 'framer-motion';
import { FileText, Shield, AlertTriangle, Copyright, AlertCircle } from 'lucide-react';

const Terms: React.FC = () => {
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
      <AnimatedHeader title="Terms of Service" showBackButton />
      
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
                <FileText className="h-12 w-12" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-center text-heritage-100 mb-4">Terms of Service</h1>
            <p className="text-heritage-300 text-center">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto glass-panel rounded-2xl p-8">
            <motion.div className="mb-8" variants={itemVariants}>
              <div className="flex items-center mb-4">
                <FileText className="h-6 w-6 text-accent mr-3" />
                <h2 className="text-2xl font-bold text-heritage-100">Agreement to Terms</h2>
              </div>
              <p className="text-heritage-300 mb-4">
                By accessing or using the HeritageAR website and mobile application (the "Service"), you agree to be bound 
                by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, 
                you are prohibited from using or accessing the Service.
              </p>
              <p className="text-heritage-300">
                We may modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page. 
                Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
              </p>
            </motion.div>
            
            <motion.div className="mb-8" variants={itemVariants}>
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-accent mr-3" />
                <h2 className="text-2xl font-bold text-heritage-100">User Accounts</h2>
              </div>
              <p className="text-heritage-300 mb-4">
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. 
                Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
              </p>
              <p className="text-heritage-300 mb-4">
                You are responsible for safeguarding the password that you use to access the Service and for any activities or actions 
                under your password. You agree not to disclose your password to any third party. You must notify us immediately upon 
                becoming aware of any breach of security or unauthorized use of your account.
              </p>
            </motion.div>
            
            <motion.div className="mb-8" variants={itemVariants}>
              <div className="flex items-center mb-4">
                <Copyright className="h-6 w-6 text-accent mr-3" />
                <h2 className="text-2xl font-bold text-heritage-100">Intellectual Property</h2>
              </div>
              <p className="text-heritage-300 mb-4">
                The Service and its original content, features, and functionality are and will remain the exclusive property of 
                HeritageAR and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States 
                and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without 
                the prior written consent of HeritageAR.
              </p>
              <p className="text-heritage-300 mb-4">
                Historical information, 3D models, and educational content provided through the Service are based on public domain 
                information, licensed materials, or original content created by HeritageAR. Attribution for specific content is 
                provided where applicable.
              </p>
            </motion.div>
            
            <motion.div className="mb-8" variants={itemVariants}>
              <div className="flex items-center mb-4">
                <Copyright className="h-6 w-6 text-accent mr-3" />
                <h2 className="text-2xl font-bold text-heritage-100">Historical Sites and User Content</h2>
              </div>
              <p className="text-heritage-300 mb-4">
                Users may contribute historical site information and cultural content to the platform. By submitting content, you:
              </p>
              <ul className="list-disc pl-6 text-heritage-300 space-y-2">
                <li>Grant HeritageAR a worldwide, non-exclusive license to use, modify, and display the content</li>
                <li>Confirm that you have the right to share the content and it doesn't infringe on others' rights</li>
                <li>Understand that content may be reviewed for accuracy and appropriateness</li>
                <li>Accept that HeritageAR may remove content that violates our guidelines</li>
              </ul>
              <p className="text-heritage-300 mt-4 mb-4">
                Historical site information, including mythology and cultural aspects, is provided for educational purposes. 
                While we strive for accuracy, we cannot guarantee the completeness or accuracy of all historical information.
              </p>
            </motion.div>
            
            <motion.div className="mb-8" variants={itemVariants}>
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-accent mr-3" />
                <h2 className="text-2xl font-bold text-heritage-100">User Safety and AR Usage</h2>
              </div>
              <p className="text-heritage-300 mb-4">
                The augmented reality features of our Service require the use of your device's camera and movement in physical spaces. 
                By using these features, you agree to:
              </p>
              <ul className="list-disc pl-6 text-heritage-300 space-y-2">
                <li>Be aware of your surroundings at all times while using AR features</li>
                <li>Not use the AR features while operating vehicles or machinery</li>
                <li>Comply with all applicable laws regarding personal safety and the safety of others</li>
                <li>Use the AR features in a safe environment free from obstacles or hazards</li>
                <li>Take regular breaks when using AR features for extended periods</li>
              </ul>
              <p className="text-heritage-300 mt-4">
                HeritageAR is not responsible for any injuries, accidents, or property damage that may occur while using the AR features 
                of the Service.
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <div className="flex items-center mb-4">
                <AlertCircle className="h-6 w-6 text-accent mr-3" />
                <h2 className="text-2xl font-bold text-heritage-100">Limitation of Liability</h2>
              </div>
              <p className="text-heritage-300 mb-4">
                In no event shall HeritageAR, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any 
                indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, 
                goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="list-disc pl-6 text-heritage-300 space-y-2">
                <li>Your access to or use of or inability to access or use the Service</li>
                <li>Any conduct or content of any third party on the Service</li>
                <li>Any content obtained from the Service</li>
                <li>Unauthorized access, use or alteration of your transmissions or content</li>
              </ul>
              <p className="text-heritage-300 mt-4">
                If you have any questions about these Terms, please contact us at terms@heritagear.example.com.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.main>
    </div>
  );
};

export default Terms;
