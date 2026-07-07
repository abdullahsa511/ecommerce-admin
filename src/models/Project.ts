import { ICustomer } from "./Customer.ts";
import { Address } from "./Google.ts";
import { FileModel, IFileModel } from "./Media.ts";


export interface IProject {
  project_id: number;
  customer_id: number|null;
  site_id: number;
  status_id: number;
  name: string;
  description: string;
  preview_text: string;
  location: Address;
  status: string;
  image: IFileModel[];
  images: IFileModel[];
  slug: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  created_at: string;
  updated_at: string;
  title: string;
  label: string;
  link_text: string;
  designer: string;
  credit_label: string;
  photographer: string;
  main_title: string;
  main_description_one: string;
  main_description_two: string;
  main_description_three: string;
  main_description_four: string;
  main_image_one: IFileModel[];
  main_image_two: IFileModel[];
  image_thumb: IFileModel[];
  customer: ICustomer | null;
  sort_order: number | null;
  banner_way_points: any[];
  is_featured: boolean;
}

export default class Project implements IProject {  
  project_id: number;
  customer_id: number|null;
  site_id: number;
  status_id: number;
  name: string;
  description: string;
  location: Address;
  preview_text: string;
  status: string;
  image: IFileModel[];
  images: IFileModel[];
  slug: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  created_at: string;
  updated_at: string;
  customer: ICustomer | null;
  title: string;
  label: string;
  link_text: string;
  designer: string;
  credit_label: string;
  photographer: string;
  main_title: string;
  main_description_one: string;
  main_description_two: string;
  main_description_three: string;
  main_description_four: string;
  main_image_one: IFileModel[];
  main_image_two: IFileModel[];
  image_thumb: IFileModel[];
  sort_order: number | null;
  banner_way_points: any[];
  is_featured: boolean;
  constructor(data: Partial<IProject> = {}) {
    this.sort_order = data.sort_order ?? 0;
    this.banner_way_points = data.banner_way_points ?? [];
    // console.log('modal dta' , data);
    this.project_id = data.project_id ?? 0;
    this.customer_id = data.customer_id ?? null;
    this.site_id = data.site_id ?? 0;
    this.status_id = data.status_id ?? 1;
    this.name = data.name ?? '';
    this.description = data.description ?? '';
    this.location = data.location ?? new Address({});
    this.status = data.status ?? '';
    this.preview_text = data.preview_text ?? '';
    this.is_featured = !!data.is_featured;
    // Handle image arrays more safely
    try {
      let img = data.image;
      if (typeof img === 'string') {
        img = JSON.parse(img);
      }
      this.image = Array.isArray(img) ? img.map((imgItem: any) => new FileModel(imgItem)) : [];
    } catch (error) {
      console.warn('Error parsing image data:', error);
      this.image = [];
    }
    
    try {
      let images = data.images;
      if (typeof images === 'string') {
        images = JSON.parse(images);
      }
      this.images = Array.isArray(images) ? images.map((imgItem: any) => new FileModel(imgItem)) : [];
    } catch (error) {
      console.warn('Error parsing images data:', error);
      this.images = [];
    }
    
    this.slug = data.slug ?? '';
    this.created_at = data.created_at ?? '';
    this.updated_at = data.updated_at ?? '';
    
    // Handle customer data safely
    try {
      this.customer = typeof data.customer === 'string' ? JSON.parse(data.customer) : data.customer ?? null;
    } catch (error) {
      console.warn('Error parsing customer data:', error);
      this.customer = null;
    }
    
    this.meta_title = data.meta_title ?? '';
    this.meta_description = data.meta_description ?? '';
    this.meta_keywords = data.meta_keywords ?? '';
    this.title = data.title ?? '';
    this.label = data.label ?? '';
    this.link_text = data.link_text ?? 'View Project';
    this.designer = data.designer ?? '';
    this.credit_label = data.credit_label ?? '';
    this.photographer = data.photographer ?? '';
    this.main_title = data.main_title ?? '';
    this.main_description_one = data.main_description_one ?? '';
    this.main_description_two = data.main_description_two ?? '';
    this.main_description_three = data.main_description_three ?? '';
    this.main_description_four = data.main_description_four ?? '';
    
    // Handle main images safely
    try {
      let img_one = data.main_image_one;
      if (typeof img_one === 'string') {
        img_one = JSON.parse(img_one);
      }
      this.main_image_one = Array.isArray(img_one) ? img_one.map((img: any) => new FileModel(img)) : [];
    } catch (error) {
      console.warn('Error parsing main_image_one data:', error);
      this.main_image_one = [];
    }
    
    try {
      let img_two = data.main_image_two;
      if (typeof img_two === 'string') {
        img_two = JSON.parse(img_two);
      }
      this.main_image_two = Array.isArray(img_two) ? img_two.map((img: any) => new FileModel(img)) : [];
    } catch (error) {
      console.warn('Error parsing main_image_two data:', error);
      this.main_image_two = [];
    }
    try {
      let img_thumb = data.image_thumb;
      if (typeof img_thumb === 'string') {
        img_thumb = JSON.parse(img_thumb);
      }
      this.image_thumb = Array.isArray(img_thumb) ? img_thumb.map((img: any) => new FileModel(img)) : [];
    } catch (error) {
      console.warn('Error parsing image_thumb data:', error);
      this.image_thumb = [];
    }
  }
}

export interface IProjectStatus {
  project_status_id: number;
  name: string;
}

export class ProjectStatus implements IProjectStatus {
  project_status_id: number;
  name: string;
  constructor(data: Partial<IProjectStatus> = {}) {
    this.project_status_id = data.project_status_id ?? 0;
    this.name = data.name ?? '';
  }
}