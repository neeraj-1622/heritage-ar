
import { ObjectModelData } from '@/utils/objectReconstructor';

export interface DetectionResult {
  class: string;
  score: number;
  model?: ObjectModelData;
}

export interface WebcamObjectDetectorProps {
  onDetection: (detection: DetectionResult | null) => void;
  enabled?: boolean;
  className?: string;
}
