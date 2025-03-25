
import React, { useState, useEffect } from 'react';
import AnimatedHeader from '../components/AnimatedHeader';
import { motion } from 'framer-motion';
import { useToast } from '../hooks/use-toast';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      setName('');
      setEmail('');
      setMessage('');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-heritage-950 text-white">
      <AnimatedHeader title="Contact Us" showBackButton={true} />
      
      <main className="flex-1 pt-28 pb-12">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12 max-w-4xl mx-auto"
          >
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-accent/20 blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-heritage-300/10 blur-3xl"></div>
              
              <h1 className="text-4xl font-bold mb-8 text-gradient relative z-10">Get in Touch</h1>
              
              <div className="glass-panel rounded-xl p-8 mb-10 relative overflow-hidden">
                <div className="grid md:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <h2 className="text-2xl font-semibold mb-4 text-white">Contact Information</h2>
                    <p className="mb-6 text-white/80">
                      Have questions about our AR experiences or want to collaborate? We'd love to hear from you! Fill out the form or use the contact information below.
                    </p>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2 text-white">Email</h3>
                      <p className="text-accent">info@heritagear.com</p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2 text-white">Address</h3>
                      <p className="text-white/80">
                        123 Digital Avenue<br />
                        Innovation District<br />
                        San Francisco, CA 94105
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2 text-white">Social Media</h3>
                      <div className="flex space-x-4">
                        <a href="#" className="text-accent hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="text-accent hover:text-white transition-colors">Instagram</a>
                        <a href="#" className="text-accent hover:text-white transition-colors">LinkedIn</a>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <h2 className="text-2xl font-semibold mb-4 text-white">Send a Message</h2>
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-1">Name</label>
                        <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full p-3 bg-heritage-900/80 border border-heritage-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white"
                          placeholder="Your name"
                          required
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-1">Email</label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-3 bg-heritage-900/80 border border-heritage-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="message" className="block text-sm font-medium text-white/90 mb-1">Message</label>
                        <textarea
                          id="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={5}
                          className="w-full p-3 bg-heritage-900/80 border border-heritage-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white"
                          placeholder="How can we help you?"
                          required
                        ></textarea>
                      </div>
                      
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors duration-300 flex items-center justify-center"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="mr-2">Sending...</span>
                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          </>
                        ) : (
                          'Send Message'
                        )}
                      </button>
                    </form>
                  </motion.div>
                </div>
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

export default Contact;
