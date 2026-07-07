import { FileModel, IFileModel } from "./Media.ts";

interface IPostContent {
    post_id: number|null;
    language_id: number|null;
    name: string;
    slug: string;
    meta_title: string|null;
    excerpt: string|null;
    meta_description: string|null;
    meta_keywords: string|null;
  }
  
  class PostContent implements IPostContent {
    post_id: number|null;
    language_id: number|null;
    name: string;
    slug: string;
    meta_title: string|null;
    excerpt: string|null;
    meta_description: string|null;
    meta_keywords: string|null;
  
    constructor(data: Partial<IPostContent> = {}) {
      this.post_id = data.post_id ?? null;
      this.language_id = data.language_id ?? 1;
      this.name = data.name ?? '';
      this.slug = data.slug ?? '';
      this.meta_title = data.meta_title ?? '';
      this.excerpt = data.excerpt ?? '';
      this.meta_description = data.meta_description ?? '';
      this.meta_keywords = data.meta_keywords ?? '';

    }
  }

export interface IPost {
  post_id: number;
  site_id: number;
  status_id: number;
  description: string;
  description_one: string;
  description_two: string;
  description_three: string;
  status: string;
  image_banner: IFileModel[];
  image_thumb: IFileModel[];
  image: IFileModel[];
  images: IFileModel[];
  feature_image: IFileModel[];
  feature_image_thumb: IFileModel[];
  created_at: string;
  updated_at: string;
  postContent: PostContent;
  content: any;
  author: object;
  metadata: any;
  sort_order: number | null;
  banner_way_points: any[];
  is_featured: boolean;
}

export class Post implements IPost {  
  post_id: number;
  site_id: number;
  description: string;
  description_one: string;
  description_two: string;
  description_three: string;
  status_id: number;
  status: string;
  image_banner: IFileModel[];
  image_thumb: IFileModel[];
  image: IFileModel[];
  feature_image: IFileModel[];
  feature_image_thumb: IFileModel[];
  images: IFileModel[];
  created_at: string;
  updated_at: string;
  postContent: PostContent;
  content: any;
  metadata: any;
  author: object;
  is_featured: boolean;
  getFormattedDate: (date: string) => string;
  sort_order: number | null;
  banner_way_points: any[];
  constructor(data: Partial<IPost> = {}) {
    this.banner_way_points = data.banner_way_points ?? [];
    this.sort_order = data.sort_order ?? null;
    this.post_id = data.post_id ?? 0;
    this.site_id = data.site_id ?? 0;
    this.description = data.description ?? '';
    this.description_one = data.description_one ?? '';
    this.description_two = data.description_two ?? '';
    this.description_three = data.description_three ?? '';
    this.status = data.status ?? '';
    this.status_id = data.status_id ?? 1;
    this.is_featured = !!data.is_featured;
    this.author = typeof data.author === 'string' ? JSON.parse(data.author) : data.author ?? {};
    this.created_at = data.created_at ?? '';
    this.updated_at = data.updated_at ?? '';
    this.image = Post.processImage(data.image??[]);
    this.image_banner = Post.processImage(data.image_banner??[]);
    this.image_thumb = Post.processImage(data.image_thumb??[]);
    this.feature_image = Post.processImage(data.feature_image??[]);
    this.feature_image_thumb = Post.processImage(data.feature_image_thumb??[]);
    this.images = [];
    for(let image of data.images||[]){
      // console.log('images', image);
      let img = {
        ...image,
        // name: image.image_link,
        // objectURL: image.image_link
      }
      this.images.push(new FileModel(img as any));
    }
    
    this.postContent = typeof data.postContent === 'string' ? JSON.parse(data.postContent) : data.postContent ? new PostContent(data.postContent) : new PostContent();

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
      this.getFormattedDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
  }

  /**
   * Create a Post instance from a plain object
   * @param {Partial<IPost>} data - Plain object containing post data
   * @returns {Post} New Post instance
   */
  static fromJSON(data: Partial<IPost>): Post {
    return new Post(data);
  }

  static processImage(image: IFileModel[]){
    let img = typeof image === 'string' ? JSON.parse(image) : image ?? [];
    if(typeof img === 'string'){
      return [new FileModel({image: img, objectURL: img})];
    }
    else if(typeof img === 'object' && img.length > 0){
      return img.map((img: any) => new FileModel(img));
    }
    else if(typeof img === 'object'){
      if(img.objectURL){
        return [new FileModel({image: img.objectURL, objectURL: img.objectURL})]
      }
      else {
        return []
      }
    }
    else {
      return img.map((img: any) => new FileModel(img));
    }
  }
}