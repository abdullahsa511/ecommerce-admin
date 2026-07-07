export default class PostType {
  constructor(data = {}) {
    this.post_type_id = data.post_type_id ?? null;
    this.name = data.name ?? '';
    this.type = data.type ?? '';
    this.plural = data.plural ?? '';
    this.icon = data.icon ?? '';
    this.image = data.image ?? [];
    this.source = data.source ?? 'default';
    this.site_id = data.site_id ?? 1;
  }

  static fromJSON(data) {
    return new PostType(data);
  }
} 