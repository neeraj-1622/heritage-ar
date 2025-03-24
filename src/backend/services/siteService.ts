
import { Db } from 'mongodb';
import { HistoricalSite, HistoricalSiteInput } from '../models/HistoricalSite';
import { SiteRepository } from '../repositories/siteRepository';

export class SiteService {
  private siteRepository: SiteRepository;

  constructor(db: Db) {
    this.siteRepository = new SiteRepository(db);
  }

  async getAllSites(): Promise<HistoricalSite[]> {
    return this.siteRepository.findAll();
  }

  async getSiteById(id: string): Promise<HistoricalSite | null> {
    return this.siteRepository.findById(id);
  }

  async createSite(siteData: HistoricalSiteInput): Promise<HistoricalSite> {
    return this.siteRepository.create(siteData);
  }

  async updateSite(id: string, siteData: Partial<HistoricalSiteInput>): Promise<HistoricalSite | null> {
    return this.siteRepository.update(id, siteData);
  }

  async deleteSite(id: string): Promise<boolean> {
    return this.siteRepository.delete(id);
  }

  async initializeDefaultData(sites: HistoricalSite[]): Promise<void> {
    await this.siteRepository.initializeDefaultData(sites);
  }
}
