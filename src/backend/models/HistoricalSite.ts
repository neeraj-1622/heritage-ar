
import { ObjectId } from 'mongodb';

export interface HistoricalSite {
  _id?: ObjectId;
  id: string;
  name: string;
  period: string;
  location: string;
  shortDescription: string;
  longDescription?: string;
  imageUrl: string;
  arModelUrl?: string;
  coordinates?: { lat: number; lng: number };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface HistoricalSiteInput {
  name: string;
  period: string;
  location: string;
  shortDescription: string;
  longDescription?: string;
  imageUrl: string;
  arModelUrl?: string;
  coordinates?: { lat: number; lng: number };
}
