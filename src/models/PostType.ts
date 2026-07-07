export default class PostType {
  post_type_id: number | null;
  name: string;
  type: string;
  plural: string;
  icon: string;
  image: File[];
  source: string;
  site_id: number | null;

  constructor(data: Partial<PostType> = {}) {
    this.post_type_id = data.post_type_id ?? null;
    this.name = data.name ?? '';
    this.type = data.type ?? '';
    this.plural = data.plural ?? '';
    this.icon = data.icon ?? '';
    this.image = data.image ?? [];
    this.source = data.source ?? 'default';
    this.site_id = data.site_id ?? 1;
  }

  static fromJSON(data: Partial<PostType>): PostType {
    return new PostType(data);
  }
}