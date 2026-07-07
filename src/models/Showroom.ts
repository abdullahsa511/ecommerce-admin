import { FileModel, IFileModel } from "./Media.ts";

export interface IShowroom {
    showrooms_id: number;
    title: string;
    slug: string;
    description: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    opening_hours: string | null;
    google_map_link: string | null;
    image: IFileModel[];
    banner_image: FileModel[];
    overview_image: FileModel[];
    status: string;
    is_section_active: number;
    sort_order: number | null;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
    banner_way_points: any[];
}

/** Showroom class */
export class Showroom implements IShowroom {
    showrooms_id: number;
    title: string;
    slug: string;
    description: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    opening_hours: string | null;
    image: IFileModel[];
     banner_image: FileModel[];
    overview_image: FileModel[];
    status: string;
    is_section_active: number;
    sort_order: number | null;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
    banner_way_points: any[];

    constructor(data: Partial<IShowroom> = {}) { // default to empty object

        this.showrooms_id = data.showrooms_id ?? 0;
        this.title = data.title ?? '';
        this.slug = data.slug ?? '';
        this.description = data.description ?? "";
        this.phone = data.phone ?? null;
        this.email = data.email ?? null;
        this.opening_hours = data.opening_hours ?? null;
        this.google_map_link = data.google_map_link ?? null;
        this.status = data.status ?? '';
        this.is_section_active = data.is_section_active ?? 0;
        this.sort_order = data.sort_order ?? null;
        this.created_at = data.created_at ?? '';
        this.updated_at = data.updated_at ?? null;
        this.deleted_at = data.deleted_at ?? null;

        this.address = data.address ?? null;
        this.image = (data.image ?? []).map(img => new FileModel(img));
        let images: any[] = this.processImage(data.banner_image);
        this.banner_image = images.map(img => new FileModel(img));
        images = this.processImage(data.overview_image);
        this.overview_image = images.map(img => new FileModel(img));
        this.banner_way_points = data.banner_way_points ?? [];
    }
     processImage(image: any){
        if (image) {
            try {
                return typeof image === 'string' ? JSON.parse(image) : image;
            } catch (err) {
                console.error('Image parse error:', err);
            }
        }
        return [];
    }
}

export interface IShowroomSection {
    project_sections_id: number;
    showroom_id: number;
    section_code: string;
    title: string;
    slug: string;
    description: string | null;
    image: IFileModel[];
    status: string;
    sort_order: number | null;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
    section_images: IFileModel[];
    section_products: SectionProduct[];
}

export class ShowroomSection implements IShowroomSection {
    project_sections_id: number;
    showroom_id: number;
    section_code: string;
    title: string;
    slug: string;
    description: string;
    image: FileModel[];
    section_images: IFileModel[];
    section_products: SectionProduct[];
    status: string;
    sort_order: number | null;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;

    constructor(data: Partial<IShowroomSection> = {}) {
        this.project_sections_id = data.project_sections_id ?? 0;
        this.showroom_id = data.showroom_id ?? 0;
        this.section_code = data.section_code ?? '';
        this.title = data.title ?? '';
        this.slug = data.slug ?? '';
        this.description = data.description ?? "";
        this.status = data.status ?? '';
        this.sort_order = data.sort_order ?? null;
        this.created_at = data.created_at ?? '';
        this.updated_at = data.updated_at ?? null;
        this.deleted_at = data.deleted_at ?? null;
        this.section_images =  [];
        for(let image of data.section_images||[]){
        let img = {
            ...image,
            objectURL: image?.image?.objectURL ?? ''
        }
        this.section_images.push(new FileModel(img as any));
        };
        this.section_products = data.section_products ?? [];
        // Parse images if stringified
        let images: any[] = this.processImage(data.image);
        this.image = images.map(img => new FileModel(img));
    }

    processImage(image: any){
        if (image) {
            try {
                return typeof image === 'string' ? JSON.parse(image) : image;
            } catch (err) {
                console.error('Image parse error:', err);
            }
        }
        return [];
    }
}


export interface ISectionPorduct {
    project_section_products_id:number;
    section_id:number;
    product_id:number;
    price:number;
    name:string;
    description:string;
    status:string;
    image:IFileModel[];
    sort_order:number|null;
    created_at:string;
    updated_at:string|null;
    deleted_at:string|null;
}

/** SectionPorduct class */
export class SectionProduct implements ISectionPorduct {
    project_section_products_id: number;
    section_id: number;
    product_id: number;
    name: string;
    price: number;
    description: string;
    status: string;
    image: IFileModel[];
    sort_order: number | null;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;

    constructor(data: any = {}) {
        this.project_section_products_id = data.project_section_products_id ?? 0;
        this.section_id = data.section_id ?? 0;
        this.product_id = data.product_id ?? 0;
        this.status = data.status?.active ? 'Active' : 'Inactive';
        this.sort_order = data.sort_order ?? 0;
        this.created_at = data.created_at ? new Date(data.created_at).toISOString() : '';
        this.updated_at = data.updated_at ?? null;
        this.deleted_at = data.deleted_at ?? null;
        this.image = Array.isArray(data.product?.image) ? data.product?.image.map((img: any) => new FileModel(img)) : [];
        this.name = data.product?.['`content`']?.name ?? '';
        this.description = data.product?.['`content`']?.content ?? '';
        this.price = data.product?.price ?? 0;
    }
}


// =================================================
export interface ISectionImage {
    project_section_images_id:number;
    section_id:number;
    image_link:string;
    image:IFileModel[];
    // status:string;
    sort_order:number|null;
    created_at:string;
    updated_at:string|null;
    deleted_at:string|null;
}

export class SectionImage implements ISectionImage {
    project_section_images_id: number;
    section_id: number;
    image_link: string;
    image: IFileModel[];
    // status: string;
    sort_order: number | null;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;

    constructor(data: Partial<ISectionImage> = {}) {
        this.project_section_images_id = data.project_section_images_id ?? 0;
        this.section_id = data.section_id ?? 0;
        this.image_link = data.image_link ?? '';
        // this.status = data.status ?? '';
        this.sort_order = data.sort_order ?? null;
        this.created_at = data.created_at ?? '';
        this.updated_at = data.updated_at ?? null;
        this.deleted_at = data.deleted_at ?? null;

        // Ensure image is always array
        let images: any[] = [];
        if (data.image) {
            try {
                images = typeof data.image === 'string' ? JSON.parse(data.image) : data.image;
            } catch (err) {
                console.error('Image parse error:', err);
            }
        }
        this.image = Array.isArray(images) ? images.map(img => new FileModel(img)) : [];
    }
}
