
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "We've received your message and will get back to you soon!",
        variant: "default",
      });
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-heritage-950 to-heritage-900 text-heritage-100">
      <Header title="Contact Us" showBackButton />

      <motion.div 
        className="container mx-auto px-4 py-24 md:py-32"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-center mb-6 text-gradient"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Contact Us
        </motion.h1>

        <motion.p 
          className="text-center text-heritage-300 max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Have questions about HeritageAR? Want to partner with us? We'd love to hear from you. Reach out using the form below or through our contact information.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <motion.div 
            className="glass-panel rounded-2xl p-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold mb-6 text-accent">Send Us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-heritage-200 mb-2">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-heritage-800/50 border border-heritage-700 text-heritage-100 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-heritage-200 mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-heritage-800/50 border border-heritage-700 text-heritage-100 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-heritage-200 mb-2">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-heritage-800/50 border border-heritage-700 text-heritage-100 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Enter subject"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-heritage-200 mb-2">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-heritage-800/50 border border-heritage-700 text-heritage-100 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  placeholder="Enter your message"
                ></textarea>
              </div>
              
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Send Message</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col space-y-8"
          >
            <div className="glass-panel rounded-2xl p-8 hover-lift">
              <h2 className="text-2xl font-semibold mb-6 text-accent">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="w-6 h-6 text-accent mr-4 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-heritage-100">Email Us</h3>
                    <p className="text-heritage-300 mt-1">contact@heritagear.example.com</p>
                    <p className="text-heritage-300">support@heritagear.example.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="w-6 h-6 text-accent mr-4 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-heritage-100">Call Us</h3>
                    <p className="text-heritage-300 mt-1">+1 (555) 123-4567</p>
                    <p className="text-heritage-300">Mon-Fri, 9am-5pm EST</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-accent mr-4 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-heritage-100">Visit Us</h3>
                    <p className="text-heritage-300 mt-1">
                      123 Heritage Street<br />
                      Tech City, TE 12345<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-panel rounded-2xl p-8 hover-lift flex-grow">
              <h2 className="text-2xl font-semibold mb-6 text-accent">Connect With Us</h2>
              <p className="text-heritage-300 mb-6">
                Follow us on social media to stay updated with the latest AR experiences, historical discoveries, and app features.
              </p>
              
              <div className="flex space-x-4">
                {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                  <motion.a
                    key={social}
                    href="#"
                    className="w-12 h-12 rounded-full bg-heritage-800 flex items-center justify-center hover:bg-accent transition-colors"
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-6 h-6 bg-heritage-200"></div>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
