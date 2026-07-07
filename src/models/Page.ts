import { FileModel, IFileModel } from "./Media.ts";
import { mediaUrl } from '@/utils/mediaUrl';

interface IPageContent {
  post_id: number | null;
  content: string | null;
  language_id: number | null;
  name: string;
  slug: string;
  meta_title: string | null;
  excerpt: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
}

class PageContent implements IPageContent {
  content: string | null;
  post_id: number | null;
  language_id: number | null;
  name: string;
  slug: string;
  meta_title: string | null;
  excerpt: string | null;
  meta_description: string | null;
  meta_keywords: string | null;

  constructor(data: Partial<IPageContent> = {}) {
    this.post_id = data.post_id ?? null;
    this.language_id = data.language_id ?? 1;
    this.name = data.name ?? '';
    this.slug = data.slug ?? '';
    this.meta_title = data.meta_title ?? '';
    this.excerpt = data.excerpt ?? '';
    this.meta_description = data.meta_description ?? '';
    this.meta_keywords = data.meta_keywords ?? '';
    this.content = data.content ?? '';

  }
}

export interface IPage {
  post_id: number;
  admin_id: number;
  status: string;
  comment_status: string;
  password: string;
  parent: number;
  sort_order: number;
  type: string;
  template: string;
  comment_count: number;
  views: number;
  description: string;
  description_one: string;
  description_two: string;
  description_three: string;
  created_at: string;
  updated_at: string;
  site_id: number;
  display_name: string | null;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  postContent?: PageContent;
  name?: string;
  metadata?: any;
  title?: string | null;
  // page images 
  image: IFileModel[];
  image_thumb: IFileModel[];
  image_banner: IFileModel[];
  feature_image: IFileModel[];
  feature_image_thumb: IFileModel[];
  main_image_one: IFileModel[];
  main_image_two: IFileModel[];
}

export class Page implements IPage {
  post_id: number;
  admin_id: number;
  status: string;
  comment_status: string;
  password: string;
  parent: number;
  sort_order: number;
  type: string;
  template: string;
  comment_count: number;
  views: number;
  description: string;
  description_one: string;
  description_two: string;
  description_three: string;
  created_at: string;
  updated_at: string;
  site_id: number;
  display_name: string | null;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  postContent?: PageContent;
  name?: string;
  metadata?: any;
  title?: string | null;
  image: IFileModel[];
  image_thumb: IFileModel[];
  image_banner: IFileModel[];
  feature_image: IFileModel[];
  feature_image_thumb: IFileModel[];
  main_image_one: IFileModel[];
  main_image_two: IFileModel[];

  constructor(data: Partial<IPage> = {}) {
    this.post_id = data.post_id ?? 0;
    this.admin_id = data.admin_id ?? 0;
    this.status = data.status ?? '';
    this.comment_status = data.comment_status ?? '';
    this.password = data.password ?? '';
    this.parent = data.parent ?? 0;
    this.sort_order = data.sort_order ?? 0;
    this.type = data.type ?? 'page';
    this.template = data.template ?? '';
    this.comment_count = data.comment_count ?? 0;
    this.views = data.views ?? 0;
    this.description = data.description ?? '';
    this.description_one = data.description_one ?? '';
    this.description_two = data.description_two ?? '';
    this.description_three = data.description_three ?? '';
    this.created_at = data.created_at ?? '';
    this.updated_at = data.updated_at ?? '';
    this.site_id = data.site_id ?? 0;
    this.display_name = data.display_name ?? null;
    this.username = data.username ?? null;
    this.first_name = data.first_name ?? null;
    this.last_name = data.last_name ?? null;
    this.name = data.name ?? '';
    this.title = data.title ?? '';

    // Handle all image variations
    this.image = this.parseImageArray(data, 'image');
    this.image_thumb = this.parseImageArray(data, 'image_thumb');
    this.image_banner = this.parseImageArray(data, 'image_banner');
    this.feature_image = this.parseImageArray(data, 'feature_image');
    this.feature_image_thumb = this.parseImageArray(data, 'feature_image_thumb');
    this.main_image_one = this.parseImageArray(data, 'main_image_one');
    this.main_image_two = this.parseImageArray(data, 'main_image_two');

    this.postContent = typeof data.postContent === 'string' ? JSON.parse(data.postContent) : data.postContent ? new PageContent(data.postContent) : new PageContent();

    this.metadata = data.metadata ?? {
      openGraph: {
        openGraphTitle: '',
        openGraphDescription: '',
      },
      twitter: {
        twitterTitle: '',
        twitterDescription: '',
        twitterLabel1: '',
        twitterLabel2: '',
        twitterData1: '',
        twitterData2: '',
      }
    };
  }

  private parseImageArray(data: any, key: string): IFileModel[] {
    try {
      let value = data[key];

      if (typeof value === 'string') {
        value = JSON.parse(value);
      }

      return Array.isArray(value)
        ? value.map((imgItem: any) => new FileModel(imgItem))
        : [];
    } catch (error) {
      console.warn(`Error parsing ${key} data:`, error);
      return [];
    }
  }

  /**
   * Get author name following the backend strategy
   */
  getAuthorName(): string {
    if(this.first_name && this.last_name){
      return `${this.first_name || ''} ${this.last_name || ''}`.trim();
    } else if (this.display_name) {
      return this.display_name;
    } else if (this.first_name || this.last_name) {
      return `${this.first_name || ''} ${this.last_name || ''}`.trim();
    } else if (this.username) {
      return this.username;
    } else {
      return 'Unknown Author';
    }
  }

  /**
   * Get thumbnail URL from image data
   */
  getThumbnailUrl(): string {
    try {
      if (Array.isArray(this.image_banner) && this.image_banner.length > 0) {
        const firstImage = this.image_banner[0];
        if (firstImage.objectURL) {
          return firstImage.objectURL;
        } else if (firstImage.image) {
          return mediaUrl(firstImage.image);
        }
      }
    } catch (e) {
      // If parsing fails, return empty string
    }
    return '';
  }

  /**
   * Get page title from content or use a fallback
   */
  getTitle(): string {
    if (this.postContent?.name) {
      return this.postContent.name;
    }
    // Fallback to description or post_id
    return this.description ? this.description.replace(/<[^>]*>/g, '').substring(0, 50) : `Page ${this.post_id}`;
  }

  getFormattedDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Create a Page instance from a plain object
   * @param {Partial<IPage>} data - Plain object containing page data
   * @returns {Page} New Page instance
   */
  static fromJSON(data: Partial<IPage>): Page {
    return new Page(data);
  }
}