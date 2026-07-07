import { ComputedRef, Ref } from 'vue';
import Site, { EmailSetting } from '@/models/Site';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { StoreGeneric } from 'pinia';

export type SiteStore = StoreGeneric & {
  sites: Ref<Site[]>;
  emailSetting: Ref<EmailSetting>;
  fb: Ref<FeedbackHandler>;
  siteNames: ComputedRef<string[]>;
  fetchSites(): Promise<Site[] | undefined>;
  fetchSiteById(siteId: number | string): Promise<Site | undefined>;
  createSite(newSite: Site): Promise<Site | undefined>;
  updateSite(updatedSite: Site): Promise<Site | undefined>;
  deleteSite(siteId: number | string): Promise<void>;
  createEmailSetting(newEmailSetting: EmailSetting): Promise<EmailSetting | undefined>;
};

export declare const useSiteStore: () => SiteStore;
export type UseSiteStore = SiteStore;
