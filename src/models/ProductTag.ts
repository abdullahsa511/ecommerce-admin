import { IFileModel } from "./Media.ts";

export interface IProductTagData {
    tag_id?: string | null;
    thumbnail?: string;
    name?: string;
    slug?: string;
    description?: string;
    date_added?: string;
    date_updated?: string;
    image: IFileModel[];
}

export default class ProductTag implements IProductTagData {
    tag_id: string | null;
    thumbnail: string;
    name: string;
    slug: string;
    description: string;
    date_added: string;
    date_updated: string;
    image: IFileModel[];

    constructor(data: Partial<IProductTagData> = {}) {
        this.tag_id = data?.tag_id ?? null;
        this.thumbnail = data?.thumbnail ?? '';
        this.name = data?.name ?? '';
        this.slug = data?.slug ?? '';
        this.description = data?.description ?? '';
        this.date_added = data?.date_added ?? new Date().toISOString();
        this.date_updated = data?.date_updated ?? new Date().toISOString();
        this.image = data?.image ?? [];
    }

    static fromJSON(data: Partial<IProductTagData>): ProductTag {
        return new ProductTag(data);
    }
} 