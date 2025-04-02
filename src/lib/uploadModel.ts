
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Upload a 3D model file (GLB/GLTF) for a historical site
 * @param siteId - ID of the historical site
 * @param file - The model file to upload
 * @returns URL of the uploaded model
 */
export const uploadModelForSite = async (siteId: string, file: File): Promise<string | null> => {
  // Check if file is a valid 3D model (GLB or GLTF)
  if (!file.name.toLowerCase().endsWith('.glb') && !file.name.toLowerCase().endsWith('.gltf')) {
    toast({
      title: "Invalid file format",
      description: "Please upload a GLB or GLTF file",
      variant: "destructive"
    });
    return null;
  }
  
  try {
    // Generate a unique file name
    const fileName = `${siteId}-${Date.now()}.${file.name.split('.').pop()}`;
    
    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from('models')
      .upload(fileName, file);
      
    if (error) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('models')
      .getPublicUrl(fileName);
      
    // Update the historical site with the model URL
    const { error: updateError } = await supabase
      .from('historical_sites')
      .update({ ar_model_url: publicUrl })
      .eq('id', siteId);
      
    if (updateError) {
      toast({
        title: "Failed to update site",
        description: updateError.message,
        variant: "destructive"
      });
      return null;
    }
    
    toast({
      title: "Model uploaded successfully",
      description: "The 3D model has been linked to this site",
    });
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading model:', error);
    toast({
      title: "Upload error",
      description: "Failed to upload 3D model",
      variant: "destructive"
    });
    return null;
  }
};
