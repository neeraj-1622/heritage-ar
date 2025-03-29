import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HistoricalSite } from '@/lib/supabase';
import { getSiteById, isSiteFavorited } from '@/frontend/api/sitesApi';
import { useAuth } from '@/context/AuthContext';
import { HeartIcon, HeartFilledIcon, GaugeIcon } from '@radix-ui/react-icons';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SiteDetail: React.FC = () => {
  const { id } = useParams();
  const [siteData, setSiteData] = useState<HistoricalSite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        setLoading(true);
        
        // Get site details from API
        const { site, error } = await getSiteById(id as string);
        
        if (error || !site) {
          setError('Could not load site details.');
          console.error('Error loading site:', error);
          return;
        }
        
        setSiteData(site);
        
        // If user is authenticated, check if this site is favorited
        if (user) {
          const isFavorite = await isSiteFavorited(user.id, id as string);
          setIsFavorited(isFavorite);
        }
      } catch (err) {
        console.error('Error in fetchSiteData:', err);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSiteData();
    } else {
      setError('Invalid site ID.');
    }
  }, [id, user]);

  const handleFavorite = () => {
    // Placeholder for favorite action
    alert('Favorite action not implemented yet.');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="w-full max-w-4xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-3/4 bg-heritage-100 rounded"></div>
            <div className="h-64 bg-heritage-100 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-4 bg-heritage-100 rounded w-1/2"></div>
              <div className="h-4 bg-heritage-100 rounded w-full"></div>
              <div className="h-4 bg-heritage-100 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !siteData) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="w-full max-w-4xl mx-auto">
          <div className="p-6 bg-red-50 rounded-lg border border-red-100 text-center">
            <h2 className="text-2xl font-medium text-red-800">Site Not Found</h2>
            <p className="mt-2 text-red-600">
              {error || 'The requested site could not be found.'}
            </p>
            <Link to="/" className="mt-4 inline-flex button-secondary">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Section */}
      <div 
        className="relative h-96 bg-cover bg-center"
        style={{ backgroundImage: `url(${siteData.image_url})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent">
          <div className="container mx-auto px-4 h-full flex items-end pb-8">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold">{siteData.name}</h1>
              <div className="flex items-center mt-3 space-x-4">
                <Badge className="bg-heritage-500 text-white px-3 py-1 text-sm">
                  {siteData.period}
                </Badge>
                <span className="text-sm md:text-base opacity-90">
                  {siteData.name} | {siteData.location}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold text-heritage-100">About {siteData.period}</h2>
              
              <div className="flex items-center gap-3">
                <Link to="/ar" className="button-accent flex items-center gap-2">
                  <GaugeIcon className="w-4 h-4" />
                  <span>View in AR</span>
                </Link>
                
                {user && (
                  <Button
                    onClick={handleFavorite}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {isFavorited ? (
                      <>
                        <HeartFilledIcon className="w-4 h-4 text-red-500" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <HeartIcon className="w-4 h-4" />
                        <span>Save</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
            
            <div className="prose prose-invert max-w-none">
              {siteData.long_description ? (
                <p>{siteData.long_description}</p>
              ) : (
                <p>{siteData.short_description}</p>
              )}
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-heritage-100 mb-4">
                Additional Media
              </h3>
              <p className="text-heritage-300">
                Explore more about {siteData.name} through these resources:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-accent hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn more on Wikipedia
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-accent hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Watch a documentary on YouTube
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-accent hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View 3D models on Sketchfab
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="md:w-96">
            <div className="p-4 bg-heritage-900 rounded-lg">
              <h4 className="text-lg font-semibold text-heritage-100 mb-3">
                Plan Your Visit
              </h4>
              <p className="text-heritage-300">
                {siteData.name} is located at:
              </p>
              <address className="text-heritage-400 not-italic mt-2">
                {siteData.location}
              </address>
              <p className="text-heritage-300 mt-3">
                Consider visiting these nearby attractions:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-accent hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Local Museum
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-accent hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Historical Park
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteDetail;
