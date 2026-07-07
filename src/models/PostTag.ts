
import { FileModel, IFileModel } from './Media.ts';

export interface IPostTagData {
  post_tag_id: number | null;
  image?: IFileModel[] | [];
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  status?: number | null;
  created_at?: string;
  post_id?: number | null;
}

export default class PostTag implements IPostTagData {
  post_tag_id: number | null;
  image?: IFileModel[] | [];
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  status?: number | null;
  created_at?: string;
  post_id?: number | null;

  constructor(data: Partial<IPostTagData> = {}) {    
    this.post_tag_id = data.post_tag_id ?? null;
    this.name = data.name ?? "";
    this.slug = data.slug ?? "";
    this.description = data.description ?? "";
    this.status = data.status ?? 1;
    this.created_at = data.created_at ?? '';
    this.post_id = data.post_id ?? 0;
    this.image = PostTag.processImage(data.image??[]);

  }

  static fromDBRow(row: any): PostTag {
    return new PostTag({
      post_tag_id: row.post_tag_id,
      image: row.image ?? null,
      name: row.name ?? null,
      slug: row.slug ?? null,
      description: row.description ?? null,
      status: row.status ?? 1,
      post_id: row.post_id ?? 0,
    });
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

