/**
 * @fileoverview ProductFinish model class for managing product finish data
 */

export interface IProductFinishData {
    finish_id?: string | null;
    thumbnail?: string;
    name?: string;
    slug?: string;
    description?: string;
    date_added?: string;
    date_updated?: string;
    image?: any[];
}

export default class ProductFinish implements IProductFinishData {
    finish_id: string | null;
    thumbnail: string;
    name: string;
    slug: string;
    description: string;
    date_added: string;
    date_updated: string;
    image: any[];

    constructor(data: Partial<IProductFinishData> = {}) {
        this.finish_id = data?.finish_id ?? null;
        this.thumbnail = data?.thumbnail ?? '';
        this.name = data?.name ?? '';
        this.slug = data?.slug ?? '';
        this.description = data?.description ?? '';
        this.date_added = data?.date_added ?? new Date().toISOString();
        this.date_updated = data?.date_updated ?? new Date().toISOString();
        this.image = data?.image ?? [];
    }

    static fromJSON(data: Partial<IProductFinishData>): ProductFinish {
        return new ProductFinish(data);
    }
}
