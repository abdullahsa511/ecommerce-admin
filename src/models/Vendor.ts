import { IFileModel } from "./Media.ts";

export interface IVendor {
    admin_id: number;
    vendor_id: number;
    vendor_code: string;
    name: string;
    slug: string;
    image: IFileModel[];
    sort_order: number;
}

export default class Vendor implements IVendor {
    admin_id: number;
    vendor_id: number;
    vendor_code: string;
    name: string;
    slug: string;
    image: IFileModel[];
    sort_order: number;
    
    constructor(data: Partial<IVendor> = {}) {
        this.vendor_id = data.vendor_id ?? 0;
        this.admin_id = data.admin_id ?? 0;
        this.vendor_code = data.vendor_code ?? '';
        this.image = data.image ?? [];
        this.name = data.name ?? '';
        this.slug = data.slug ?? '';
        this.sort_order = data.sort_order ?? 0;
    }

    
}