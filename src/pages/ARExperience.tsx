import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ARView from '../components/ARView';
import ARModelViewer from '../components/ARModelViewer';
import WebcamObjectDetector from '../components/WebcamObjectDetector';
import { HistoricalSite } from '@/lib/supabase';
import { getAllSites } from '@/frontend/api/sitesApi';
import { ArrowLeft, Image, Camera, Layers, Compass, Info, Scan, Webcam } from 'lucide-react';
import { toast } from "sonner";

const ARExperience: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const siteId = searchParams.get('siteId');
  
  const [sites, setSites] = useState<HistoricalSite[]>([]);
  const [selectedSiteIndex, setSelectedSiteIndex] = useState<number>(0);
  const [selectedSite, setSelectedSite] = useState<HistoricalSite | null>(null);
  const [isSiteMenuOpen, setIsSiteMenuOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showTip, setShowTip] = useState(false);
  const [showARModel, setShowARModel] = useState(false);
  const [enableRotation, setEnableRotation] = useState(false);
  const [useRealAR, setUseRealAR] = useState(false);
  const [detectedObject, setDetectedObject] = useState<{ class: string; score: number } | null>(null);
  const [objectDetectionMode, setObjectDetectionMode] = useState(false);

  useEffect(() => {
    document.body.classList.add('ar-mode');
    loadSites();
    
    return () => {
      document.body.classList.remove('ar-mode');
    };
  }, []);

  const loadSites = async () => {
    const loadedSites = await getAllSites();
    setSites(loadedSites);
    
    if (siteId) {
      const index = loadedSites.findIndex(site => site.id === siteId);
      if (index !== -1) {
        setSelectedSiteIndex(index);
        setSelectedSite(loadedSites[index]);
      } else {
        setSelectedSite(loadedSites[0]);
      }
    } else {
      setSelectedSite(loadedSites[0]);
    }
    
    setIsInitializing(false);
  };

  useEffect(() => {
    setShowARModel(false);
  }, [selectedSite]);

  const handleNextSite = () => {
    const nextIndex = (selectedSiteIndex + 1) % sites.length;
    setSelectedSiteIndex(nextIndex);
    setSelectedSite(sites[nextIndex]);
  };

  const handlePreviousSite = () => {
    const prevIndex = selectedSiteIndex === 0 ? sites.length - 1 : selectedSiteIndex - 1;
    setSelectedSiteIndex(prevIndex);
    setSelectedSite(sites[prevIndex]);
  };

  if (isInitializing || !selectedSite) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black">
        <div className="text-center text-white">
          <div className="mb-4 text-2xl font-bold">Loading AR Experience...</div>
          <div className="text-sm text-gray-400">Please wait while we prepare your experience</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen">
      {/* AR View */}
      <div className="absolute inset-0">
        {useRealAR ? (
          <WebcamObjectDetector
            onDetection={setDetectedObject}
            enabled={objectDetectionMode}
          />
        ) : (
          <ARView
            selectedSite={selectedSite}
            showModel={showARModel}
            enableRotation={enableRotation}
            onNextSite={handleNextSite}
            onInfoClick={() => setIsSiteMenuOpen(true)}
          />
        )}
      </div>

      {/* Controls Overlay */}
      <div className="absolute inset-x-0 top-0 z-10 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full bg-black/50 p-2 text-white backdrop-blur-md"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>

          <div className="flex space-x-2">
            <button
              onClick={() => setShowARModel(!showARModel)}
              className={`rounded-full p-2 backdrop-blur-md ${
                showARModel ? 'bg-accent text-white' : 'bg-black/50 text-white'
              }`}
            >
              <Layers className="h-6 w-6" />
            </button>
            
            <button
              onClick={() => setEnableRotation(!enableRotation)}
              className={`rounded-full p-2 backdrop-blur-md ${
                enableRotation ? 'bg-accent text-white' : 'bg-black/50 text-white'
              }`}
            >
              <Compass className="h-6 w-6" />
            </button>

            <button
              onClick={() => setIsSiteMenuOpen(true)}
              className="rounded-full bg-black/50 p-2 text-white backdrop-blur-md"
            >
              <Info className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Site Info Panel */}
      {isSiteMenuOpen && (
        <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm">
          <div className="mx-auto max-w-2xl p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">{selectedSite.name}</h2>
              <button
                onClick={() => setIsSiteMenuOpen(false)}
                className="rounded-full bg-white/10 p-2 text-white"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6 overflow-hidden rounded-xl">
              <img
                src={selectedSite.image_url}
                alt={selectedSite.name}
                className="h-64 w-full object-cover"
              />
            </div>

            <div className="space-y-4 text-white">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-white/10 p-3">
                  <div className="text-sm text-gray-400">Location</div>
                  <div>{selectedSite.location}</div>
                </div>
                <div className="rounded-lg bg-white/10 p-3">
                  <div className="text-sm text-gray-400">Period</div>
                  <div>{selectedSite.period}</div>
                </div>
              </div>

              <p className="text-gray-300">
                {selectedSite.long_description || selectedSite.short_description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handlePreviousSite}
                  className="rounded-lg bg-white/10 p-3 text-left hover:bg-white/20"
                >
                  <div className="text-sm text-gray-400">Previous</div>
                  <div>{sites[(selectedSiteIndex - 1 + sites.length) % sites.length].name}</div>
                </button>
                <button
                  onClick={handleNextSite}
                  className="rounded-lg bg-white/10 p-3 text-left hover:bg-white/20"
                >
                  <div className="text-sm text-gray-400">Next</div>
                  <div>{sites[(selectedSiteIndex + 1) % sites.length].name}</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      {showTip && (
        <div className="absolute inset-x-0 bottom-20 z-10 px-4">
          <div className="mx-auto max-w-md rounded-lg bg-black/50 p-4 text-center text-white backdrop-blur-md">
            <p>Tap and hold to place the 3D model in your environment</p>
            <button
              onClick={() => setShowTip(false)}
              className="mt-2 text-sm text-gray-400"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ARExperience;
