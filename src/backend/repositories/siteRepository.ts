import { Db, ObjectId } from 'mongodb';
import { HistoricalSite, HistoricalSiteInput } from '../models/HistoricalSite';

export class SiteRepository {
  private db: Db;
  private collection = 'sites';

  constructor(db: Db) {
    this.db = db;
  }

  async findAll(): Promise<HistoricalSite[]> {
    return await this.db.collection(this.collection).find().toArray() as unknown as HistoricalSite[];
  }

  async findById(id: string): Promise<HistoricalSite | null> {
    try {
      const site = await this.db.collection(this.collection).findOne({ id });
      return site as unknown as HistoricalSite;
    } catch (error) {
      console.error(`Error finding site with ID ${id}:`, error);
      return null;
    }
  }

  async create(siteData: HistoricalSiteInput): Promise<HistoricalSite> {
    const newSite: HistoricalSite = {
      ...siteData,
      id: new ObjectId().toString(), // Generate a unique ID
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.db.collection(this.collection).insertOne(newSite);
    return newSite;
  }

  async update(id: string, siteData: Partial<HistoricalSiteInput>): Promise<HistoricalSite | null> {
    const updatedSite = {
      ...siteData,
      updatedAt: new Date()
    };

    const result = await this.db.collection(this.collection).findOneAndUpdate(
      { id },
      { $set: updatedSite },
      { returnDocument: 'after' }
    );

    return result as unknown as HistoricalSite;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.collection(this.collection).deleteOne({ id });
    return result.deletedCount === 1;
  }

  async initializeDefaultData(sites: HistoricalSite[]): Promise<void> {
    const count = await this.db.collection(this.collection).countDocuments();
    
    if (count === 0) {
      console.log('Initializing default site data...');
      const now = new Date();
      const sitesWithTimestamps = sites.map(site => ({
        ...site,
        createdAt: now,
        updatedAt: now
      }));
      await this.db.collection(this.collection).insertMany(sitesWithTimestamps);
      console.log(`${sites.length} default sites inserted.`);
    }
  }
}
