import React from 'react';
import AnimatedHeader from '../components/AnimatedHeader';
import { motion } from 'framer-motion';
import { BookOpen, Video, Globe } from 'lucide-react';

const Blog: React.FC = () => {
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

  const blogPosts = [
    {
      title: "Ancient Temples of India",
      type: "video",
      embedUrl: "https://www.youtube.com/embed/189BmqF8zd8",
      description: "Explore the magnificent ancient temples of India and their architectural marvels."
    },
    {
      title: "Cultural Heritage of Egypt",
      type: "video",
      embedUrl: "https://www.youtube.com/embed/F-ql_8-gHK4",
      description: "Journey through the rich cultural heritage and historical sites of ancient Egypt."
    },
    {
      title: "UNESCO World Heritage Sites",
      type: "external",
      url: "https://whc.unesco.org/en/list/",
      description: "Discover the complete list of UNESCO World Heritage Sites and their significance."
    },
    {
      title: "Traditional Arts and Crafts",
      type: "article",
      content: `Cultural heritage isn't just about monuments and collections of objects. It also includes 
      traditions or living expressions inherited from our ancestors and passed on to future generations. 
      This intangible cultural heritage includes:
      
      • Oral traditions
      • Performing arts
      • Social practices
      • Rituals and festive events
      • Knowledge and practices concerning nature
      • Traditional craftsmanship`,
      description: "Understanding the importance of intangible cultural heritage."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedHeader title="Heritage Blog" showBackButton />
      
      <motion.main 
        className="flex-1 pt-24 pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4">
          <motion.div className="max-w-4xl mx-auto mb-10" variants={itemVariants}>
            <div className="flex justify-center mb-8">
              <div className="p-4 rounded-full bg-heritage-800 text-accent">
                <BookOpen className="h-12 w-12" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-center text-heritage-100 mb-4">Heritage Blog</h1>
            <p className="text-heritage-300 text-center max-w-2xl mx-auto">
              Explore fascinating stories, videos, and articles about cultural heritage sites from around the world.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {blogPosts.map((post, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="glass-panel rounded-2xl p-6 flex flex-col"
              >
                <div className="flex items-center mb-4">
                  {post.type === 'video' ? (
                    <Video className="h-6 w-6 text-accent mr-3" />
                  ) : post.type === 'external' ? (
                    <Globe className="h-6 w-6 text-accent mr-3" />
                  ) : (
                    <BookOpen className="h-6 w-6 text-accent mr-3" />
                  )}
                  <h2 className="text-2xl font-bold text-heritage-100">{post.title}</h2>
                </div>
                
                {post.type === 'video' && (
                  <div className="relative pb-[56.25%] mb-4">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src={post.embedUrl}
                      title={post.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
                
                {post.type === 'external' && (
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent/80 underline mb-4"
                  >
                    Visit Website
                  </a>
                )}
                
                {post.type === 'article' && (
                  <div className="prose prose-invert mb-4 max-w-none">
                    <p className="whitespace-pre-wrap text-heritage-300">{post.content}</p>
                  </div>
                )}
                
                <p className="text-heritage-300 mt-auto">{post.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.main>
    </div>
  );
};

export default Blog; 