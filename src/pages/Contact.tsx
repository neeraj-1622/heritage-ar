
import React, { useState } from 'react';
import AnimatedHeader from '../components/AnimatedHeader';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "We've received your message and will get back to you soon!",
      });
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedHeader title="Contact Us" showBackButton />
      
      <motion.main 
        className="flex-1 pt-24 pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4">
          <motion.div className="max-w-3xl mx-auto mb-12 text-center" variants={itemVariants}>
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-accent/20 text-accent inline-flex items-center justify-center">
                <Mail className="h-6 w-6" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">Get in Touch</h1>
            <p className="text-heritage-300 text-lg">
              Have questions about HeritageAR? Want to collaborate with us? 
              We'd love to hear from you!
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div className="lg:col-span-1" variants={itemVariants}>
              <div className="glass-panel rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-heritage-800 flex items-center justify-center mr-4 flex-shrink-0">
                      <Mail className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-heritage-300 text-sm">Email</p>
                      <p className="text-white">contact@heritagear.example.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-heritage-800 flex items-center justify-center mr-4 flex-shrink-0">
                      <Phone className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-heritage-300 text-sm">Phone</p>
                      <p className="text-white">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-heritage-800 flex items-center justify-center mr-4 flex-shrink-0">
                      <MapPin className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-heritage-300 text-sm">Address</p>
                      <p className="text-white">123 Heritage Street</p>
                      <p className="text-white">Tech City, CA 94107</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-heritage-800">
                  <h3 className="text-xl font-medium text-white mb-4">Office Hours</h3>
                  <p className="text-heritage-300">Monday - Friday: 9AM - 5PM</p>
                  <p className="text-heritage-300">Saturday - Sunday: Closed</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div className="lg:col-span-2" variants={itemVariants}>
              <div className="glass-panel rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
                        Your Name
                      </label>
                      <Input 
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="bg-heritage-800/50 border-heritage-700 text-white placeholder:text-heritage-400"
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                        Email Address
                      </label>
                      <Input 
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-heritage-800/50 border-heritage-700 text-white placeholder:text-heritage-400"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-white mb-1">
                      Subject
                    </label>
                    <Input 
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      className="bg-heritage-800/50 border-heritage-700 text-white placeholder:text-heritage-400"
                      placeholder="How can we help you?"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-white mb-1">
                      Message
                    </label>
                    <Textarea 
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="bg-heritage-800/50 border-heritage-700 text-white placeholder:text-heritage-400 min-h-[150px]"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-accent hover:bg-accent/80 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.main>
    </div>
  );
};

export default Contact;
